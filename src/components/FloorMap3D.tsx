import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Html, MapControls } from "@react-three/drei"
import * as THREE from "three"
import { FLOOR_DATA, ROOM_TYPES } from "@/data/floorPlan"
import type { FloorData, FloorRoom, PlanSide, StairDirection } from "@/types"

const SVG_WIDTH = 800
const ROOM_HEIGHT = 14
const SLAB_THICKNESS = 2
const WALL_HEIGHT = ROOM_HEIGHT - SLAB_THICKNESS
const WALL_THICKNESS = 2.5
/** Target depth of one step; the count is derived from the stairwell's length. */
const STEP_TREAD = 9
const WALL_TINT = new THREE.Color("#ffffff")
/** Polar angle used by CameraFit and locked on MapControls (pitch 64° from the floor). */
const CAMERA_POLAR = Math.PI / 2 - THREE.MathUtils.degToRad(64)
const ANIM_DURATION = 1.1
/** The outgoing floor clears out before the incoming one fades up, so the two
 * plates never overlap as semi-transparent ghosts. */
const FADE_OUT_END = 0.45
const FADE_IN_START = 0.55
const LABEL_FADE_IN = "opacity 0.7s ease 0.25s"
const LABEL_FADE_OUT = "opacity 0.5s ease"

type FloorMap3DProps = {
  floor: number
  selectedRoom: string | null
  onSelectRoom: (roomId: string | null) => void
  /** Homepage teaser: auto-orbit, no interaction, no room labels. */
  preview?: boolean
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function roomRect(room: FloorRoom) {
  if (room.points && room.points.length >= 3) {
    const xs = room.points.map((p) => p[0])
    const ys = room.points.map((p) => p[1])
    const minX = Math.min(...xs)
    const maxX = Math.max(...xs)
    const minY = Math.min(...ys)
    const maxY = Math.max(...ys)
    return { x: minX, y: minY, w: maxX - minX, h: maxY - minY }
  }
  return { x: room.x, y: room.y, w: room.w, h: room.h }
}

function roomCenter(room: FloorRoom, viewBoxHeight: number) {
  const rect = roomRect(room)
  return {
    x: rect.x + rect.w / 2 - SVG_WIDTH / 2,
    z: rect.y + rect.h / 2 - viewBoxHeight / 2,
  }
}

/** Local XZ vertices relative to the room's bounding-box centre. */
function roomLocalPolygon(
  room: FloorRoom,
  viewBoxHeight: number
): { x: number; z: number }[] | null {
  if (!room.points || room.points.length < 3) return null
  const { x: cx, z: cz } = roomCenter(room, viewBoxHeight)
  return room.points.map(([px, py]) => ({
    x: px - SVG_WIDTH / 2 - cx,
    z: py - viewBoxHeight / 2 - cz,
  }))
}

function canSelectRoom(room: FloorRoom) {
  return !room.id.startsWith("_") && room.type !== "overig"
}

/** Halls and corridors stay flat; everything else becomes an enclosed room,
 * unless the room opts out explicitly. */
function hasWalls(room: FloorRoom) {
  return room.walls ?? room.type !== "overig"
}

function isStairwell(room: FloorRoom) {
  return room.type === "trap"
}

/** A single flight of steps climbing to the top of the walls. Without an
 * explicit direction the flight runs along the stairwell's long axis and rises
 * away from the doorway. */
function stairSteps(
  width: number,
  depth: number,
  door: PlanSide,
  direction: StairDirection | undefined,
  walled: boolean
): WallSegment[] {
  const inset = walled ? WALL_THICKNESS * 2 : 0
  const innerWidth = width - inset
  const innerDepth = depth - inset
  if (innerWidth < 6 || innerDepth < 6) return []

  const alongX = direction
    ? direction === "east" || direction === "west"
    : innerWidth >= innerDepth
  const run = alongX ? innerWidth : innerDepth
  const tread = alongX ? innerDepth : innerWidth
  const count = Math.min(Math.max(Math.round(run / STEP_TREAD), 6), 24)
  const stepDepth = run / count
  const rise = WALL_HEIGHT / count
  const ascending = direction
    ? direction === "east" || direction === "south"
    : alongX
      ? door !== "east"
      : door !== "south"
  /* The floor heights here are compressed for legibility, so a true rise-to-run
   * ratio would look flat. A gap between treads keeps the steps readable. */
  const nosing = Math.min(stepDepth * 0.14, 0.6)

  const steps: WallSegment[] = []
  for (let i = 0; i < count; i++) {
    const height = rise * (i + 1)
    const along = -run / 2 + stepDepth * (i + 0.5)
    const offset = ascending ? along : -along
    const y = SLAB_THICKNESS + height / 2
    const length = stepDepth - nosing

    steps.push({
      args: alongX ? [length, height, tread] : [tread, height, length],
      position: alongX ? [offset, y, 0] : [0, y, offset],
    })
  }

  return steps
}

/** Walls carry a washed-out version of the room's accent so the plan reads by
 * floor colour rather than by a grid of saturated outlines. */
function wallTone(stroke: string, selected: boolean) {
  const color = new THREE.Color(stroke)
  return selected ? color : color.lerp(WALL_TINT, 0.5)
}

type WallSegment = {
  args: [number, number, number]
  position: [number, number, number]
  rotation?: [number, number, number]
}

/** Rooms open towards the middle of the plan, which is where the corridors run
 * on every floor of this building. */
function doorSide(
  center: { x: number; z: number },
  floorCenterX: number,
  floorCenterZ: number
): PlanSide {
  const dx = center.x - floorCenterX
  const dz = center.z - floorCenterZ
  if (Math.abs(dz) >= Math.abs(dx)) return dz > 0 ? "north" : "south"
  return dx > 0 ? "west" : "east"
}

function doorWidth(edge: number) {
  return Math.min(Math.max(edge * 0.3, 10), 26)
}

function wallSegments(
  width: number,
  depth: number,
  door: PlanSide
): WallSegment[] {
  const segments: WallSegment[] = []
  const t = WALL_THICKNESS
  const y = SLAB_THICKNESS + WALL_HEIGHT / 2

  /** Splits one side into two stubs around the door opening, or keeps it whole
   * when the room is too small to fit a doorway. */
  const addSide = (
    span: number,
    isDoor: boolean,
    build: (length: number, offset: number) => WallSegment
  ) => {
    if (!isDoor) {
      segments.push(build(span, 0))
      return
    }

    const gap = Math.min(doorWidth(span), span * 0.6)
    const stub = (span - gap) / 2
    if (stub < 1) {
      segments.push(build(span, 0))
      return
    }

    segments.push(build(stub, -(span - stub) / 2))
    segments.push(build(stub, (span - stub) / 2))
  }

  const sideSpan = depth - t * 2

  addSide(width, door === "north", (length, offset) => ({
    args: [length, WALL_HEIGHT, t],
    position: [offset, y, -depth / 2 + t / 2],
  }))
  addSide(width, door === "south", (length, offset) => ({
    args: [length, WALL_HEIGHT, t],
    position: [offset, y, depth / 2 - t / 2],
  }))
  addSide(sideSpan, door === "west", (length, offset) => ({
    args: [t, WALL_HEIGHT, length],
    position: [-width / 2 + t / 2, y, offset],
  }))
  addSide(sideSpan, door === "east", (length, offset) => ({
    args: [t, WALL_HEIGHT, length],
    position: [width / 2 - t / 2, y, offset],
  }))

  return segments
}

/** Picks which polygon edge gets the doorway: explicit index, then PlanSide
 * preference, then the edge closest to the floor centre. */
function resolveDoorEdge(
  room: FloorRoom,
  points: { x: number; z: number }[],
  center: { x: number; z: number },
  floorCenterX: number,
  floorCenterZ: number
): number {
  const n = points.length
  if (n === 0) return 0

  if (room.doorEdge != null) {
    return ((room.doorEdge % n) + n) % n
  }

  if (room.door) {
    let best = 0
    let bestScore = -Infinity
    for (let i = 0; i < n; i++) {
      const a = points[i]
      const b = points[(i + 1) % n]
      const mx = (a.x + b.x) / 2
      const mz = (a.z + b.z) / 2
      const score =
        room.door === "north"
          ? -mz
          : room.door === "south"
            ? mz
            : room.door === "east"
              ? mx
              : -mx
      if (score > bestScore) {
        bestScore = score
        best = i
      }
    }
    return best
  }

  let best = 0
  let bestDist = Infinity
  for (let i = 0; i < n; i++) {
    const a = points[i]
    const b = points[(i + 1) % n]
    const mx = center.x + (a.x + b.x) / 2
    const mz = center.z + (a.z + b.z) / 2
    const dist =
      (mx - floorCenterX) * (mx - floorCenterX) +
      (mz - floorCenterZ) * (mz - floorCenterZ)
    if (dist < bestDist) {
      bestDist = dist
      best = i
    }
  }
  return best
}

function polygonWallSegments(
  points: { x: number; z: number }[],
  doorEdge: number
): WallSegment[] {
  const segments: WallSegment[] = []
  const t = WALL_THICKNESS
  const y = SLAB_THICKNESS + WALL_HEIGHT / 2
  const n = points.length

  for (let i = 0; i < n; i++) {
    const a = points[i]
    const b = points[(i + 1) % n]
    const dx = b.x - a.x
    const dz = b.z - a.z
    const len = Math.hypot(dx, dz)
    if (len < 0.5) continue

    const rotY = -Math.atan2(dz, dx)
    const ux = dx / len
    const uz = dz / len

    const pushStub = (length: number, along: number) => {
      segments.push({
        args: [length, WALL_HEIGHT, t],
        position: [a.x + ux * along, y, a.z + uz * along],
        rotation: [0, rotY, 0],
      })
    }

    if (i === doorEdge) {
      const gap = Math.min(doorWidth(len), len * 0.6)
      const stub = (len - gap) / 2
      if (stub >= 1) {
        pushStub(stub, stub / 2)
        pushStub(stub, len - stub / 2)
        continue
      }
    }

    pushStub(len, len / 2)
  }

  return segments
}

function buildPolygonFloorGeometry(points: { x: number; z: number }[]) {
  const shape = new THREE.Shape()
  points.forEach((p, i) => {
    if (i === 0) shape.moveTo(p.x, -p.z)
    else shape.lineTo(p.x, -p.z)
  })
  shape.closePath()
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: SLAB_THICKNESS,
    bevelEnabled: false,
  })
  geometry.rotateX(-Math.PI / 2)
  return geometry
}

/** Scales every material in a floor group, keeping each one's own base opacity
 * (the selection highlight planes are translucent to begin with). */
function setGroupOpacity(group: THREE.Object3D | null, factor: number) {
  if (!group) return

  group.traverse((object) => {
    const mesh = object as THREE.Mesh
    if (!mesh.isMesh) return

    const materials = Array.isArray(mesh.material)
      ? mesh.material
      : [mesh.material]

    for (const material of materials) {
      const base = (material.userData.baseOpacity as number | undefined) ?? 1
      material.transparent = true
      material.opacity = base * factor
      material.depthWrite = factor > 0.99
    }

    mesh.visible = factor > 0.001
    mesh.castShadow = mesh.userData.castsShadow === true && factor > 0.99
  })
}

/** Bounding box of a floor's rooms in scene coordinates, so the camera and the
 * floor plate follow the actual plan instead of the wider SVG viewBox. */
function floorBounds(data: FloorData) {
  const viewBoxHeight = data.viewBoxHeight ?? 395
  const xs = data.kamers.flatMap((r) => {
    const rect = roomRect(r)
    return [rect.x, rect.x + rect.w]
  })
  const ys = data.kamers.flatMap((r) => {
    const rect = roomRect(r)
    return [rect.y, rect.y + rect.h]
  })
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)

  return {
    centerX: (minX + maxX) / 2 - SVG_WIDTH / 2,
    centerZ: (minY + maxY) / 2 - viewBoxHeight / 2,
    width: maxX - minX,
    depth: maxY - minY,
  }
}

function RoomMesh({
  room,
  viewBoxHeight,
  floorCenterX,
  floorCenterZ,
  selected,
  labelsVisible,
  interactive = true,
  onSelect,
}: {
  room: FloorRoom
  viewBoxHeight: number
  floorCenterX: number
  floorCenterZ: number
  selected: boolean
  labelsVisible: boolean
  interactive?: boolean
  onSelect: (roomId: string | null) => void
}) {
  const [hovered, setHovered] = useState(false)
  const { controls } = useThree()
  const cfg = room.colorOverride ?? ROOM_TYPES[room.type]
  const isTrap = room.id.startsWith("_")
  const clickable = interactive && canSelectRoom(room)
  const rect = roomRect(room)
  const center = roomCenter(room, viewBoxHeight)
  const { x, z } = center
  const polygon = roomLocalPolygon(room, viewBoxHeight)
  const showLabel = interactive && rect.w > 45 && rect.h > 35
  const showSubLabel = rect.h > 60 && room.type !== "overig" && !isTrap
  const walled = hasWalls(room)
  const stairwell = isStairwell(room)
  const topY = walled || stairwell ? ROOM_HEIGHT : SLAB_THICKNESS
  const floorColor = selected ? cfg.stroke : cfg.fill
  const wallColor = wallTone(cfg.stroke, selected)
  const stepColor = selected
    ? new THREE.Color(cfg.textColor)
    : new THREE.Color(cfg.fill).lerp(new THREE.Color(cfg.stroke), 0.3)
  const labelColor = selected ? "#ffffff" : cfg.textColor
  const glow = hovered && !selected

  const setControlsEnabled = (enabled: boolean) => {
    const c = controls as { enabled?: boolean } | null
    if (c && typeof c.enabled === "boolean") c.enabled = enabled
  }

  const door = room.door ?? doorSide(center, floorCenterX, floorCenterZ)
  const walls = walled
    ? polygon
      ? polygonWallSegments(
          polygon,
          resolveDoorEdge(
            room,
            polygon,
            center,
            floorCenterX,
            floorCenterZ
          )
        )
      : wallSegments(rect.w, rect.h, door)
    : []
  const steps = stairwell
    ? stairSteps(rect.w, rect.h, door, room.stairDirection, walled)
    : []

  const polygonFloor = useMemo(
    () => (polygon ? buildPolygonFloorGeometry(polygon) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- rebuild when the room outline changes
    [room.id, room.points]
  )

  useEffect(() => {
    return () => {
      polygonFloor?.dispose()
    }
  }, [polygonFloor])

  return (
    <group
      position={[x, 0, z]}
      onClick={
        clickable
          ? (e) => {
              e.stopPropagation()
              onSelect(selected ? null : room.id)
            }
          : undefined
      }
      onPointerOver={
        clickable
          ? (e) => {
              e.stopPropagation()
              setHovered(true)
              setControlsEnabled(false)
              document.body.style.cursor = "pointer"
            }
          : undefined
      }
      onPointerOut={
        clickable
          ? () => {
              setHovered(false)
              setControlsEnabled(true)
              document.body.style.cursor = "auto"
            }
          : undefined
      }
    >
      {polygonFloor ? (
        <mesh geometry={polygonFloor} receiveShadow>
          <meshStandardMaterial
            color={floorColor}
            roughness={0.55}
            metalness={0.05}
            emissive={glow ? cfg.stroke : "#000000"}
            emissiveIntensity={glow ? 0.18 : 0}
          />
        </mesh>
      ) : (
        <mesh position={[0, SLAB_THICKNESS / 2, 0]} receiveShadow>
          <boxGeometry args={[rect.w, SLAB_THICKNESS, rect.h]} />
          <meshStandardMaterial
            color={floorColor}
            roughness={0.55}
            metalness={0.05}
            emissive={glow ? cfg.stroke : "#000000"}
            emissiveIntensity={glow ? 0.18 : 0}
          />
        </mesh>
      )}

      {walls.map((wall, i) => (
        <mesh
          key={`wall-${i}`}
          position={wall.position}
          rotation={wall.rotation ?? [0, 0, 0]}
          castShadow
          receiveShadow
          userData={{ castsShadow: true }}
        >
          <boxGeometry args={wall.args} />
          <meshStandardMaterial
            color={wallColor}
            roughness={0.7}
            metalness={0.02}
            emissive={glow ? cfg.stroke : "#000000"}
            emissiveIntensity={glow ? 0.25 : 0}
          />
        </mesh>
      ))}

      {steps.map((step, i) => (
        <mesh
          key={`step-${i}`}
          position={step.position}
          castShadow
          receiveShadow
          userData={{ castsShadow: true }}
        >
          <boxGeometry args={step.args} />
          <meshStandardMaterial
            color={stepColor}
            roughness={0.8}
            metalness={0.02}
            emissive={glow ? cfg.stroke : "#000000"}
            emissiveIntensity={glow ? 0.2 : 0}
          />
        </mesh>
      ))}

      {clickable && room.beschikbaar !== undefined && (
        <mesh position={[rect.w / 2 - 8, topY + 1.2, -rect.h / 2 + 8]}>
          <sphereGeometry args={[3.2, 12, 12]} />
          <meshStandardMaterial
            color={room.beschikbaar ? "#10B981" : "#EF4444"}
            emissive={room.beschikbaar ? "#10B981" : "#EF4444"}
            emissiveIntensity={0.35}
          />
        </mesh>
      )}

      {showLabel && (
        <Html
          position={[0, topY + 0.5, 0]}
          center
          zIndexRange={[10, 0]}
          style={{
            textAlign: "center",
            fontFamily: "Poppins, system-ui, sans-serif",
            lineHeight: 1.15,
            whiteSpace: "nowrap",
            opacity: labelsVisible ? 1 : 0,
            transition: labelsVisible ? LABEL_FADE_IN : LABEL_FADE_OUT,
            pointerEvents: labelsVisible ? undefined : "none",
          }}
        >
          {isTrap ? (
            <div
              style={{
                color: "#94A3B8",
                fontSize: 9,
                fontWeight: 600,
                pointerEvents: "none",
                transform: rect.h > rect.w ? "rotate(-90deg)" : undefined,
              }}
            >
              TRAP
            </div>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                if (!clickable) return
                onSelect(selected ? null : room.id)
              }}
              style={{
                background: "transparent",
                border: "none",
                padding: 4,
                cursor: clickable ? "pointer" : "default",
                pointerEvents:
                  clickable && labelsVisible ? "auto" : "none",
              }}
            >
              <div
                style={{
                  color: labelColor,
                  fontSize: rect.w > 120 ? 12 : 10,
                  fontWeight: 700,
                }}
              >
                {room.id.length <= 6 ? room.id : room.id.slice(0, 7)}
              </div>
              {showSubLabel && (
                <div
                  style={{
                    color: selected
                      ? "rgba(255,255,255,0.85)"
                      : cfg.stroke,
                    fontSize: 8,
                    marginTop: 1,
                    opacity: 0.9,
                  }}
                >
                  {ROOM_TYPES[room.type].label}
                </div>
              )}
            </button>
          )}
        </Html>
      )}
    </group>
  )
}

function FloorSlab({
  data,
  selectedRoom,
  labelsVisible,
  initialOpacity,
  interactive = true,
  onSelectRoom,
  groupRef,
}: {
  data: FloorData
  selectedRoom: string | null
  labelsVisible: boolean
  initialOpacity: number
  interactive?: boolean
  onSelectRoom: (roomId: string | null) => void
  groupRef?: RefObject<THREE.Group | null>
}) {
  const viewBoxHeight = data.viewBoxHeight ?? 395
  const bounds = floorBounds(data)
  const plateW = bounds.width + 40
  const plateD = bounds.depth + 40
  const localRef = useRef<THREE.Group>(null)

  /* Applied before paint so a floor mounting mid-transition never flashes at
   * full opacity for a frame. */
  useLayoutEffect(() => {
    setGroupOpacity(localRef.current, initialOpacity)
  }, [initialOpacity])

  return (
    <group
      ref={(node) => {
        localRef.current = node
        if (groupRef) groupRef.current = node
      }}
    >
      <mesh
        position={[bounds.centerX, -1.5, bounds.centerZ]}
        receiveShadow
      >
        <boxGeometry args={[plateW, 3, plateD]} />
        <meshStandardMaterial color="#F1F5F9" roughness={0.9} />
      </mesh>
      <mesh
        position={[bounds.centerX, 0.2, bounds.centerZ]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[plateW - 8, plateD - 8]} />
        <meshBasicMaterial color="#F8FAFC" />
      </mesh>

      {data.kamers.map((room) => (
        <RoomMesh
          key={room.id}
          room={room}
          viewBoxHeight={viewBoxHeight}
          floorCenterX={bounds.centerX}
          floorCenterZ={bounds.centerZ}
          selected={selectedRoom === room.id}
          labelsVisible={labelsVisible}
          interactive={interactive}
          onSelect={onSelectRoom}
        />
      ))}

    </group>
  )
}

/** Frames the whole floor plate, so the map fills whatever space the page gives it. */
function CameraFit({ floor }: { floor: number }) {
  const { camera, size, controls } = useThree()
  const data = FLOOR_DATA[floor]

  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera
    if (!cam.isPerspectiveCamera || !size.width || !size.height || !data) return

    const bounds = floorBounds(data)
    const margin = 1.06
    const pitch = Math.PI / 2 - CAMERA_POLAR
    const vFov = (cam.fov * Math.PI) / 180
    const halfW = bounds.width / 2
    const halfD = bounds.depth / 2

    const corners: THREE.Vector3[] = []
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        for (const y of [0, ROOM_HEIGHT]) {
          corners.push(
            new THREE.Vector3(
              bounds.centerX + sx * halfW,
              y,
              bounds.centerZ + sz * halfD
            )
          )
        }
      }
    }

    const place = (distance: number) => {
      cam.position.set(
        bounds.centerX,
        Math.sin(pitch) * distance,
        bounds.centerZ + Math.cos(pitch) * distance
      )
      cam.lookAt(bounds.centerX, 0, bounds.centerZ)
      cam.updateMatrixWorld(true)
      cam.matrixWorldInverse.copy(cam.matrixWorld).invert()
    }

    /* A tilted camera magnifies the near edge of the plan, so solve the framing
     * distance by projecting the plate's corners instead of using the fov alone. */
    cam.aspect = size.width / size.height
    cam.updateProjectionMatrix()

    let distance = Math.max(halfD, halfW) / Math.tan(vFov / 2)
    for (let i = 0; i < 12; i++) {
      place(distance)
      let overshoot = 0
      for (const corner of corners) {
        const ndc = corner.clone().project(cam)
        overshoot = Math.max(overshoot, Math.abs(ndc.x), Math.abs(ndc.y))
      }
      const next = distance * overshoot * margin
      if (Math.abs(next - distance) < 0.5) {
        distance = next
        break
      }
      distance = next
    }
    place(distance)

    const orbit = controls as
      | { target: THREE.Vector3; update: () => void }
      | null
    if (orbit?.target) {
      orbit.target.set(bounds.centerX, 0, bounds.centerZ)
      orbit.update()
    } else {
      cam.lookAt(bounds.centerX, 0, bounds.centerZ)
    }
  }, [camera, controls, size.width, size.height, data])

  return null
}

type TransitionState = {
  to: number
  progress: number
}

function startTransition(
  to: number,
  setIncomingFloor: (n: number) => void,
  animRef: RefObject<TransitionState | null>
) {
  animRef.current = { to, progress: 0 }
  setIncomingFloor(to)
}

function Scene({
  floor,
  selectedRoom,
  onSelectRoom,
  preview = false,
}: FloorMap3DProps) {
  const [baseFloor, setBaseFloor] = useState(floor)
  const [incomingFloor, setIncomingFloor] = useState<number | null>(null)
  const [labelsVisible, setLabelsVisible] = useState(false)

  const outgoingRef = useRef<THREE.Group>(null)
  const incomingRef = useRef<THREE.Group>(null)
  const animRef = useRef<TransitionState | null>(null)
  const pendingFloor = useRef<number | null>(null)
  const labelFadeRef = useRef<number | null>(null)

  /** Labels fade via a CSS transition, so a freshly mounted floor has to be
   * painted at opacity 0 for one frame before it can animate in. */
  const revealLabels = () => {
    labelFadeRef.current = requestAnimationFrame(() => {
      labelFadeRef.current = null
      setLabelsVisible(true)
    })
  }

  const hideLabels = () => {
    if (labelFadeRef.current !== null) {
      cancelAnimationFrame(labelFadeRef.current)
      labelFadeRef.current = null
    }
    setLabelsVisible(false)
  }

  useEffect(() => {
    if (preview) {
      hideLabels()
      return
    }
    revealLabels()
    return () => {
      if (labelFadeRef.current !== null) {
        cancelAnimationFrame(labelFadeRef.current)
      }
    }
  }, [preview])

  useEffect(() => {
    if (floor === baseFloor && !animRef.current) return
    if (animRef.current?.to === floor) return

    if (animRef.current) {
      pendingFloor.current = floor
      return
    }

    if (!preview) hideLabels()
    startTransition(floor, setIncomingFloor, animRef)
  }, [floor, baseFloor, preview])

  useFrame((_, delta) => {
    const anim = animRef.current
    if (!anim) return

    const nextProgress = Math.min(1, anim.progress + delta / ANIM_DURATION)
    anim.progress = nextProgress

    const fadeOut = 1 - Math.min(1, nextProgress / FADE_OUT_END)
    const fadeIn = Math.max(
      0,
      (nextProgress - FADE_IN_START) / (1 - FADE_IN_START)
    )
    setGroupOpacity(outgoingRef.current, easeInOutCubic(fadeOut))
    setGroupOpacity(incomingRef.current, easeInOutCubic(fadeIn))

    if (nextProgress < 1) return

    const finishedTo = anim.to
    animRef.current = null

    const queued = pendingFloor.current
    pendingFloor.current = null

    setBaseFloor(finishedTo)

    if (queued !== null && queued !== finishedTo) {
      startTransition(queued, setIncomingFloor, animRef)
    } else {
      setIncomingFloor(null)
      if (!preview) revealLabels()
    }
  })

  const baseData = FLOOR_DATA[baseFloor]
  const incomingData =
    incomingFloor !== null ? FLOOR_DATA[incomingFloor] : null
  const groundH = (incomingData ?? baseData).viewBoxHeight ?? 395

  return (
    <>
      <color attach="background" args={["#EEF2F7"]} />
      <ambientLight intensity={0.9} />
      <directionalLight
        position={[180, 320, 120]}
        intensity={1.1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <hemisphereLight args={["#ffffff", "#cbd5e1", 0.4]} />

      <FloorSlab
        key={`base-${baseFloor}`}
        data={baseData}
        selectedRoom={incomingFloor !== null || preview ? null : selectedRoom}
        labelsVisible={preview ? false : labelsVisible}
        initialOpacity={1}
        interactive={!preview}
        onSelectRoom={preview ? () => {} : onSelectRoom}
        groupRef={outgoingRef}
      />

      {incomingFloor !== null && incomingData && (
        <FloorSlab
          key={`incoming-${incomingFloor}`}
          data={incomingData}
          selectedRoom={null}
          labelsVisible={false}
          initialOpacity={0}
          interactive={!preview}
          onSelectRoom={preview ? () => {} : onSelectRoom}
          groupRef={incomingRef}
        />
      )}

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -8, 0]}
        receiveShadow
      >
        <planeGeometry args={[SVG_WIDTH * 3, groundH * 3]} />
        <meshStandardMaterial color="#E2E8F0" />
      </mesh>

      <MapControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        enableRotate={false}
        enablePan={!preview}
        enableZoom={!preview}
        autoRotate={preview}
        autoRotateSpeed={0.45}
        /* Keep the CameraFit pitch locked — drag must never tilt. */
        minPolarAngle={CAMERA_POLAR}
        maxPolarAngle={CAMERA_POLAR}
        minDistance={150}
        maxDistance={2800}
        target={[0, 0, 0]}
        /* Pan on the ground plane, not in screen space, so vertical drag
         * slides the floor instead of raising the camera. */
        screenSpacePanning={false}
        mouseButtons={{
          LEFT: THREE.MOUSE.PAN,
          MIDDLE: THREE.MOUSE.DOLLY,
          RIGHT: THREE.MOUSE.PAN,
        }}
        touches={{
          ONE: THREE.TOUCH.PAN,
          TWO: THREE.TOUCH.DOLLY_PAN,
        }}
      />
      <CameraFit floor={incomingFloor ?? baseFloor} />
    </>
  )
}

export default function FloorMap3D({
  floor,
  selectedRoom,
  onSelectRoom,
  preview = false,
}: FloorMap3DProps) {
  return (
    <div
      className={`floor-map-3d h-full w-full overflow-hidden rounded-xl bg-slate-100 ${
        preview ? "pointer-events-none" : ""
      }`}
    >
      <Canvas
        shadows
        camera={{
          position: [0, 620, 380],
          fov: 38,
          near: 1,
          far: 4000,
        }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          preserveDrawingBuffer: true,
        }}
        onCreated={({ gl }) => {
          gl.domElement.style.touchAction = "none"
        }}
      >
        <Scene
          floor={floor}
          selectedRoom={selectedRoom}
          onSelectRoom={onSelectRoom}
          preview={preview}
        />
      </Canvas>
    </div>
  )
}

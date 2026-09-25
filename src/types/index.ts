import { Urls } from "@/data/urls"

export type Page = "home" | "systems" | "locations" | "wiki" | "schedule"

export type RoomType =
  | "collegezaal"
  | "practicum"
  | "zelfstudie"
  | "kantoor"
  | "horeca"
  | "vergader"
  | "trap"
  | "overig"
  | "lokaal"
  | "fablab"
  | "houtwerkplaats"
  | "composietenlab"
  | "material_science"
  | "metaalwerkplaats"
  | "av_uitleen"
  | "av_studio"
  | "han_datalab"
  | "media_lab"
  | "usability_lab"

export interface RoomColor {
  fill: string
  stroke: string
  textColor: string
}

/** Compass direction on the plan: north is the top edge, east the right one. */
export type PlanSide = "north" | "south" | "east" | "west"
export type StairDirection = PlanSide

export interface FloorRoom {
  id: string
  naam: string
  type: RoomType
  x: number
  y: number
  w: number
  h: number
  rx?: number
  beschikbaar?: boolean
  capaciteit?: number
  /** Overrides the shared ROOM_TYPES color for this one room (used for rooms whose
   * plattegrond color doesn't map to a standard legend category). */
  colorOverride?: RoomColor
  /** Optional polygon in SVG plan coordinates (same space as x/y). When set, the
   * room is extruded from these vertices instead of the axis-aligned box.
   * Keep x/y/w/h as the bounding box for labels and framing. */
  points?: [number, number][]
  /** Edge index that gets the doorway when `points` is set (0 = between
   * points[0] and points[1]). Defaults to the edge closest to the floor center. */
  doorEdge?: number
  /** Which wall gets the doorway on rectangular rooms, or which side's edge is
   * preferred on polygons. Defaults to opening towards the floor center. */
  door?: PlanSide
  /** Direction a stairwell's steps climb towards. Defaults to running along the
   * room's long side, rising away from the doorway. */
  stairDirection?: StairDirection
  /** Draws walls with a doorway around this room. Defaults to true for
   * everything except corridors and halls, which stay bare floor plates. */
  walls?: boolean
}

export interface FloorData {
  naam: string
  omschrijving: string
  kamers: FloorRoom[]
  /** SVG viewBox height for this floor's plan; defaults to 395 when omitted. */
  viewBoxHeight?: number
}

export interface NavItem {
  id: Page
  label: string
  /** Unused by the editorial text-only topbar; kept for non-nav surfaces. */
  icon?: React.ReactNode
}

export interface Announcement {
  id: number
  titel: string
  datum: string
  tekst: string
}

export interface HANSystem {
  id: string
  name: string
  category: string
  description: string
  color: string
  bg: string
  icon: React.ReactNode
  url?: string
}

export interface Location {
  id: number
  naam: string
  type: string
  verdieping: string
  capaciteit: number
  beschikbaar: boolean
}

export interface SupportContact {
  id: number
  naam: string
  icon: React.ReactNode
  color: string
  bg: string
  wanneer: string
  email: string
  tel: string
  locatie: string
}

export interface Activity {
  id: number
  naam: string
  icon: React.ReactNode
  color: string
  bg: string
  beschrijving: string
  primaryAction: string
  secondaryAction: string
}

export interface Milestone {
  label: string
  datum: string
  done: boolean
}

export interface Lesson {
  tijd: string
  vak: string
  lokaal: string
  docent: string
}

export interface DaySchedule {
  dag: string
  datum: string
  lessen: Lesson[]
}

export interface RoomTypeConfig {
  label: string
  fill: string
  stroke: string
  textColor: string
}

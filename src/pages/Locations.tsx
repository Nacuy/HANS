import { useState } from "react"
import {
  MapPin,
  Building2,
  Search,
  XCircle,
  ChevronRight,
  Clock,
} from "lucide-react"
import {
  CAMPUS_CITIES,
  DEFAULT_BUILDING_ID,
  DEFAULT_CITY_ID,
  getCampusBuilding,
  getCampusCity,
  type CampusCityId,
} from "../data/campusLocations"
import { FLOOR_DATA, ROOM_TYPES } from "../data/floorPlan"

export function Locations() {
  const [view, setView] = useState<"plan" | "list">("plan")
  const [cityId, setCityId] = useState<CampusCityId>(DEFAULT_CITY_ID)
  const [buildingId, setBuildingId] = useState(DEFAULT_BUILDING_ID)
  const [floor, setFloor] = useState(0)
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [filter, setFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("Alle")

  const city = getCampusCity(cityId)
  const building = getCampusBuilding(cityId, buildingId) ?? city.buildings[0]
  const isLocationAvailable = building.available

  const handleCityChange = (nextCityId: CampusCityId) => {
    setCityId(nextCityId)
    const nextCity = getCampusCity(nextCityId)
    const nextBuilding = nextCity.buildings[0]
    setBuildingId(nextBuilding.id)
    setSelectedRoom(null)
    setFloor(0)
  }

  const handleBuildingChange = (nextBuildingId: string) => {
    setBuildingId(nextBuildingId)
    setSelectedRoom(null)
    setFloor(0)
  }

  const currentFloor = FLOOR_DATA[floor]
  const sel = currentFloor.kamers.find((k) => k.id === selectedRoom) ?? null
  const selCfg = sel ? (sel.colorOverride ?? ROOM_TYPES[sel.type]) : null
  const viewBoxHeight = currentFloor.viewBoxHeight ?? 395
  const floorLegend = Array.from(
    new Set(
      currentFloor.kamers
        .filter((k) => k.type !== "overig" && k.type !== "trap")
        .map((k) => k.type)
    )
  ).map((t) => ROOM_TYPES[t])

  const allListRooms = Object.entries(FLOOR_DATA).flatMap(([fn, fd]) =>
    fd.kamers
      .filter((k) => !k.id.startsWith("_") && k.type !== "overig")
      .map((k) => ({
        ...k,
        verdiepingNaam: fd.naam,
        verdiepingNr: Number(fn),
      }))
  )
  const listTypes = [
    "Alle",
    ...Array.from(new Set(allListRooms.map((r) => ROOM_TYPES[r.type].label))),
  ]
  const filteredList = allListRooms.filter(
    (r) =>
      (typeFilter === "Alle" || ROOM_TYPES[r.type].label === typeFilter) &&
      (r.naam.toLowerCase().includes(filter.toLowerCase()) ||
        r.id.toLowerCase().includes(filter.toLowerCase()))
  )

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="font-poppins font-bold text-2xl text-slate-900">
          Locaties op de campus
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Kies eerst campus en gebouw om lokalen te bekijken.
        </p>
      </div>

      {/* Location selectors */}
      <div className="hans-card p-5 space-y-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-poppins mb-2">
            1. Campus
          </p>
          <div className="flex flex-wrap gap-2">
            {CAMPUS_CITIES.map((campus) => (
              <button
                key={campus.id}
                type="button"
                onClick={() => handleCityChange(campus.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold font-poppins transition-all ${
                  cityId === campus.id
                    ? "bg-[#B70035] text-white shadow-sm"
                    : "bg-slate-50 text-slate-600 border border-slate-200 hover:border-[#B70035]/30 hover:text-[#B70035]"
                }`}
              >
                {campus.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-poppins mb-2">
            2. Gebouw
          </p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {city.buildings.map((campusBuilding) => {
              const isSelected = buildingId === campusBuilding.id
              return (
                <button
                  key={campusBuilding.id}
                  type="button"
                  onClick={() => handleBuildingChange(campusBuilding.id)}
                  className={`rounded-xl border p-3 text-left transition-all ${
                    isSelected
                      ? "border-[#B70035] bg-[#FFF5F7] shadow-sm"
                      : "border-slate-200 bg-white hover:border-[#B70035]/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-poppins text-sm font-semibold text-slate-900">
                        {campusBuilding.label}
                      </p>
                      {campusBuilding.address !== campusBuilding.label && (
                        <p className="mt-0.5 text-xs text-slate-500">
                          {campusBuilding.address}
                        </p>
                      )}
                    </div>
                    {isSelected && (
                      <ChevronRight
                        size={16}
                        className="shrink-0 text-[#B70035]"
                      />
                    )}
                  </div>
                  {!campusBuilding.available && (
                    <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                      <Clock size={10} />
                      Nog niet beschikbaar
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {!isLocationAvailable && (
        <div className="hans-card p-10 flex flex-col items-center justify-center text-center">
          <Building2 size={32} className="text-slate-200 mb-3" />
          <h3 className="font-poppins font-semibold text-slate-700 text-base">
            Deze locatie is nog niet beschikbaar
          </h3>
          <p className="text-sm text-slate-500 mt-2 max-w-md">
            Plattegronden en lokalen zijn momenteel alleen beschikbaar voor{" "}
            <span className="font-semibold text-slate-700">
              Arnhem · Ruitenberglaan 26
            </span>
            .
          </p>
          <button
            type="button"
            onClick={() => {
              handleCityChange("arnhem")
              setBuildingId(DEFAULT_BUILDING_ID)
            }}
            className="mt-5 btn-primary"
          >
            Ga naar Ruitenberglaan 26
          </button>
        </div>
      )}

      {isLocationAvailable && (
        <>
          {/* Search and filter */}
          <div className="flex gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Zoek lokaalnummer..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>
            <div className="flex gap-1 bg-slate-100 rounded-xl p-1 shrink-0">
              {(["plan", "list"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold font-poppins transition-all ${
                    view === v
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {v === "plan" ? "🗺 Plattegrond" : "☰ Lijst"}
                </button>
              ))}
            </div>
          </div>

          {view === "plan" && (
            <>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-semibold text-slate-500 font-poppins">
                  Verdieping:
                </span>
                <div className="flex gap-1.5">
                  {([0, 1, 2, 3] as const).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => {
                        setFloor(f)
                        setSelectedRoom(null)
                      }}
                      className={`h-10 w-10 rounded-xl text-sm font-bold font-poppins transition-all ${
                        floor === f
                          ? "bg-[#B70035] text-white shadow-md"
                          : "bg-white text-slate-600 border border-slate-200 hover:border-[#B70035]/40 hover:text-[#B70035]"
                      }`}
                    >
                      {f === 0 ? "BG" : f}
                    </button>
                  ))}
                </div>
                <span className="text-sm font-medium text-slate-600 font-poppins">
                  {currentFloor.naam}
                </span>
                <span className="text-xs text-slate-400">
                  — {currentFloor.omschrijving}
                </span>
              </div>

              {/* Floor plan + detail panel */}
              <div className="flex gap-4">
                {/* SVG Plan */}
                <div className="hans-card flex-1 p-3 overflow-hidden">
                  <svg
                    viewBox={`0 0 800 ${viewBoxHeight}`}
                    className="w-full"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {/* Building shell */}
                    <rect
                      x={0}
                      y={0}
                      width={800}
                      height={viewBoxHeight}
                      rx={8}
                      fill="#F8FAFC"
                      stroke="#CBD5E1"
                      strokeWidth={1.5}
                    />

                    {/* Compass label */}
                    <text
                      x={12}
                      y={18}
                      fontSize={9}
                      fill="#94A3B8"
                      fontWeight="600"
                    >
                      N ↑
                    </text>

                    {/* Rooms */}
                    {currentFloor.kamers.map((room) => {
                      const cfg = room.colorOverride ?? ROOM_TYPES[room.type]
                      const isSelected = selectedRoom === room.id
                      const isTrap = room.id.startsWith("_")
                      const canClick = !isTrap && room.type !== "overig"
                      const cx = room.x + room.w / 2
                      const cy = room.y + room.h / 2
                      const showLabel = room.w > 45 && room.h > 35
                      const showSubLabel = room.h > 60 && room.type !== "overig"

                      return (
                        <g
                          key={room.id}
                          style={{ cursor: canClick ? "pointer" : "default" }}
                          onClick={() =>
                            canClick &&
                            setSelectedRoom(isSelected ? null : room.id)
                          }
                        >
                          <rect
                            x={room.x}
                            y={room.y}
                            width={room.w}
                            height={room.h}
                            rx={room.rx ?? 4}
                            fill={isSelected ? cfg.stroke : cfg.fill}
                            stroke={isSelected ? cfg.textColor : cfg.stroke}
                            strokeWidth={isSelected ? 2 : 1}
                            opacity={0.95}
                          />
                          {/* Availability dot */}
                          {canClick && room.beschikbaar !== undefined && (
                            <circle
                              cx={room.x + room.w - 7}
                              cy={room.y + 7}
                              r={4}
                              fill={room.beschikbaar ? "#10B981" : "#EF4444"}
                            />
                          )}
                          {showLabel && !isTrap && (
                            <>
                              <text
                                x={cx}
                                y={cy - (room.h > 60 ? 6 : 0)}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize={room.w > 120 ? 10 : 9}
                                fontWeight="700"
                                fill={isSelected ? "white" : cfg.textColor}
                              >
                                {room.id.length <= 6
                                  ? room.id
                                  : room.id.slice(0, 7)}
                              </text>
                              {showSubLabel && (
                                <text
                                  x={cx}
                                  y={cy + 9}
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                  fontSize={8}
                                  fill={
                                    isSelected
                                      ? "rgba(255,255,255,0.85)"
                                      : cfg.stroke
                                  }
                                  opacity={0.85}
                                >
                                  {ROOM_TYPES[room.type].label}
                                </text>
                              )}
                            </>
                          )}
                          {isTrap && showLabel && (
                            <text
                              x={cx}
                              y={cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              fontSize={7}
                              fill="#94A3B8"
                              fontWeight="600"
                              transform={
                                room.h > room.w
                                  ? `rotate(-90,${cx},${cy})`
                                  : undefined
                              }
                            >
                              TRAP
                            </text>
                          )}
                        </g>
                      )
                    })}

                    {/* Floor label badge */}
                    <rect
                      x={5}
                      y={viewBoxHeight - 25}
                      width={70}
                      height={20}
                      rx={4}
                      fill="#1E293B"
                    />
                    <text
                      x={40}
                      y={viewBoxHeight - 12}
                      textAnchor="middle"
                      fontSize={9}
                      fill="white"
                      fontWeight="700"
                    >
                      {floor === 0 ? "BG" : `${floor}e VERD.`}
                    </text>

                    {/* North arrow */}
                    <text
                      x={770}
                      y={18}
                      fontSize={9}
                      fill="#94A3B8"
                      textAnchor="end"
                      fontWeight="600"
                    >
                      ↓ Z
                    </text>
                  </svg>
                </div>

                {/* Detail panel */}
                <div className="w-56 shrink-0 space-y-3">
                  {sel ? (
                    <div className="hans-card p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-poppins font-bold text-slate-900 text-sm leading-tight">
                            {sel.naam}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5 font-poppins">
                            {ROOM_TYPES[sel.type].label}
                          </p>
                        </div>
                        <button
                          onClick={() => setSelectedRoom(null)}
                          className="text-slate-300 hover:text-slate-500 transition-colors shrink-0"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Verdieping</span>
                          <span className="font-semibold text-slate-700 font-poppins">
                            {currentFloor.naam}
                          </span>
                        </div>
                        {sel.capaciteit && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500">Capaciteit</span>
                            <span className="font-semibold text-slate-700 font-poppins">
                              {sel.capaciteit} pers.
                            </span>
                          </div>
                        )}
                        {sel.beschikbaar !== undefined && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500">Status</span>
                            <span
                              className={`font-semibold font-poppins ${
                                sel.beschikbaar
                                  ? "text-emerald-600"
                                  : "text-red-500"
                              }`}
                            >
                              {sel.beschikbaar ? "Beschikbaar" : "Bezet"}
                            </span>
                          </div>
                        )}
                      </div>
                      <div
                        className="w-full h-2 rounded-full"
                        style={{
                          background: selCfg!.fill,
                          border: `1px solid ${selCfg!.stroke}`,
                        }}
                      />
                    </div>
                  ) : (
                    <div className="hans-card p-4 flex flex-col items-center justify-center text-center h-36">
                      <MapPin size={22} className="text-slate-200 mb-2" />
                      <p className="text-xs text-slate-400 font-poppins">
                        Klik op een lokaal voor details
                      </p>
                    </div>
                  )}

                  {/* Legend */}
                  <div className="hans-card p-3 space-y-1.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-poppins mb-2">
                      Legenda
                    </p>
                    {floorLegend.map((cfg) => (
                      <div key={cfg.label} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-sm shrink-0"
                          style={{
                            background: cfg.fill,
                            border: `1.5px solid ${cfg.stroke}`,
                          }}
                        />
                        <span className="text-[11px] text-slate-600">
                          {cfg.label}
                        </span>
                      </div>
                    ))}
                    <div className="flex items-center gap-2 mt-1 pt-1 border-t border-slate-100">
                      <div className="flex gap-1">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                      </div>
                      <span className="text-[11px] text-slate-400">
                        Beschikbaar / Bezet
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {view === "list" && (
            <>
              <div className="flex gap-3 flex-wrap">
                <div className="relative max-w-xs flex-1">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    placeholder="Zoek lokaalnummer..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {listTypes.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTypeFilter(t)}
                      className={`px-3 py-1.5 text-xs font-semibold font-poppins rounded-lg border transition-all ${
                        typeFilter === t
                          ? "bg-[#B70035] text-white border-[#B70035]"
                          : "bg-white text-slate-600 border-slate-200 hover:border-[#B70035]/30 hover:text-[#B70035]"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {filteredList.map((loc) => {
                  const cfg = loc.colorOverride ?? ROOM_TYPES[loc.type]
                  const typeLabel = ROOM_TYPES[loc.type].label
                  return (
                    <div
                      key={`${loc.verdiepingNr}-${loc.id}`}
                      className="hans-card p-4 flex items-center gap-3"
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold font-poppins"
                        style={{
                          background: cfg.fill,
                          color: cfg.textColor,
                          border: `1.5px solid ${cfg.stroke}`,
                        }}
                      >
                        {loc.id.slice(-2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-poppins font-bold text-slate-900 text-sm truncate">
                            {loc.naam}
                          </h4>
                          {loc.beschikbaar !== undefined && (
                            <span
                              className={`text-[10px] font-semibold font-poppins px-2 py-0.5 rounded-full shrink-0 ${
                                loc.beschikbaar
                                  ? "bg-emerald-50 text-emerald-600"
                                  : "bg-red-50 text-red-500"
                              }`}
                            >
                              {loc.beschikbaar ? "Beschikbaar" : "Bezet"}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">
                          {typeLabel} · {loc.verdiepingNaam}
                        </p>
                        {loc.capaciteit && (
                          <p className="text-[11px] text-slate-400">
                            Capaciteit: {loc.capaciteit} pers.
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
                {filteredList.length === 0 && (
                  <div className="col-span-2 hans-card p-10 flex flex-col items-center justify-center text-center">
                    <XCircle size={28} className="text-slate-200 mb-2" />
                    <p className="font-poppins font-semibold text-slate-500 text-sm">
                      Geen locaties gevonden
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

import { lazy, Suspense, useState } from "react"
import { MapPin, Building2, Search, XCircle, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  CAMPUS_CITIES,
  DEFAULT_BUILDING_ID,
  DEFAULT_CITY_ID,
  getCampusBuilding,
  getCampusCity,
  type CampusCityId,
} from "../data/campusLocations"
import { FLOOR_DATA, ROOM_TYPES } from "../data/floorPlan"

const FloorMap3D = lazy(() => import("@/components/FloorMap3D"))

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
    <div className="flex h-full flex-col gap-4 p-6">
      {/* Toolbar: campus, building, view */}
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-poppins text-xl font-bold text-slate-900">
          Locaties
        </h1>

        <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
          {CAMPUS_CITIES.map((campus) => (
            <button
              key={campus.id}
              type="button"
              onClick={() => handleCityChange(campus.id)}
              className={`rounded-lg px-3 py-1.5 font-poppins text-xs font-semibold transition-all ${
                cityId === campus.id
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {campus.label}
            </button>
          ))}
        </div>

        <Select value={buildingId} onValueChange={handleBuildingChange}>
          <SelectTrigger className="h-9 w-56 rounded-xl bg-white font-poppins text-sm">
            <SelectValue placeholder="Kies gebouw" />
          </SelectTrigger>
          <SelectContent>
            {city.buildings.map((campusBuilding) => (
              <SelectItem key={campusBuilding.id} value={campusBuilding.id}>
                <span className="flex items-center gap-2">
                  {campusBuilding.address}
                  {!campusBuilding.available && (
                    <Clock size={11} className="text-slate-400" />
                  )}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {isLocationAvailable && (
          <div className="ml-auto flex gap-1 rounded-xl bg-slate-100 p-1">
            {(["plan", "list"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`rounded-lg px-4 py-1.5 font-poppins text-xs font-semibold transition-all ${
                  view === v
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {v === "plan" ? "🗺 3D Plattegrond" : "☰ Lijst"}
              </button>
            ))}
          </div>
        )}
      </div>

      {!isLocationAvailable && (
        <Card className="flex flex-1 flex-col items-center justify-center p-10 text-center">
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
          <Button
            type="button"
            className="mt-5 font-poppins"
            onClick={() => {
              handleCityChange("arnhem")
              setBuildingId(DEFAULT_BUILDING_ID)
            }}
          >
            Ga naar Ruitenberglaan 26
          </Button>
        </Card>
      )}

      {isLocationAvailable && (
        <>
          {view === "plan" && (
            <>
              {/* Map fills the page; controls and info float on top of it */}
              <div className="flex min-h-0 flex-1">
                <Card className="relative min-h-[420px] flex-1 overflow-hidden p-0">
                  {/* Floor controls float above the map */}
                  <div className="pointer-events-none absolute left-4 top-4 z-10 flex flex-wrap items-center gap-2">
                    <div className="pointer-events-auto flex gap-1 rounded-xl bg-white/90 p-1 shadow-sm backdrop-blur">
                      {([0, 1, 2, 3] as const).map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => {
                            setFloor(f)
                            setSelectedRoom(null)
                          }}
                          className={`h-9 w-9 rounded-lg font-poppins text-sm font-bold transition-all ${
                            floor === f
                              ? "bg-[#B70035] text-white shadow-sm"
                              : "text-slate-600 hover:bg-slate-100 hover:text-[#B70035]"
                          }`}
                        >
                          {f === 0 ? "BG" : f}
                        </button>
                      ))}
                    </div>
                    <span className="rounded-lg bg-white/90 px-3 py-1.5 font-poppins text-xs font-semibold text-slate-600 shadow-sm backdrop-blur">
                      {currentFloor.naam}
                      <span className="ml-1.5 font-normal text-slate-400">
                        {currentFloor.omschrijving}
                      </span>
                    </span>
                  </div>

                  <Suspense
                    fallback={
                      <div className="flex h-full items-center justify-center bg-slate-100 font-poppins text-sm text-slate-400">
                        3D plattegrond laden…
                      </div>
                    }
                  >
                    <FloorMap3D
                      floor={floor}
                      selectedRoom={selectedRoom}
                      onSelectRoom={setSelectedRoom}
                    />
                  </Suspense>
                  {/* Room details float over the map, top-right */}
                  {sel && (
                    <div className="absolute right-4 top-4 z-10 w-56 space-y-3 rounded-xl bg-white/95 p-4 shadow-lg ring-1 ring-slate-900/5 backdrop-blur">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-poppins text-sm font-bold leading-tight text-slate-900">
                            {sel.naam}
                          </p>
                          <p className="mt-0.5 font-poppins text-[11px] text-slate-400">
                            {ROOM_TYPES[sel.type].label}
                          </p>
                        </div>
                        <button
                          onClick={() => setSelectedRoom(null)}
                          className="shrink-0 text-slate-300 transition-colors hover:text-slate-500"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Verdieping</span>
                          <span className="font-poppins font-semibold text-slate-700">
                            {currentFloor.naam}
                          </span>
                        </div>
                        {sel.capaciteit && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500">Capaciteit</span>
                            <span className="font-poppins font-semibold text-slate-700">
                              {sel.capaciteit} pers.
                            </span>
                          </div>
                        )}
                        {sel.beschikbaar !== undefined && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500">Status</span>
                            <span
                              className={`font-poppins font-semibold ${
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
                        className="h-2 w-full rounded-full"
                        style={{
                          background: selCfg!.fill,
                          border: `1px solid ${selCfg!.stroke}`,
                        }}
                      />
                    </div>
                  )}

                  {/* Legend floats over the map, bottom-right */}
                  <div className="pointer-events-none absolute bottom-4 right-4 z-10 w-48 space-y-1.5 rounded-xl bg-white/90 p-3 shadow-sm ring-1 ring-slate-900/5 backdrop-blur">
                    <p className="mb-2 font-poppins text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Legenda
                    </p>
                    {floorLegend.map((cfg) => (
                      <div key={cfg.label} className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 shrink-0 rounded-sm"
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
                    <div className="mt-1 flex items-center gap-2 border-t border-slate-100 pt-1.5">
                      <div className="flex gap-1">
                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                        <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                      </div>
                      <span className="text-[11px] text-slate-400">
                        Beschikbaar / Bezet
                      </span>
                    </div>
                    {!sel && (
                      <div className="mt-1 flex items-center gap-1.5 border-t border-slate-100 pt-1.5">
                        <MapPin size={11} className="shrink-0 text-slate-300" />
                        <span className="font-poppins text-[10px] text-slate-400">
                          Klik op een lokaal voor details
                        </span>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </>
          )}

          {view === "list" && (
            <div className="flex min-h-0 flex-1 flex-col gap-3">
              <div className="flex gap-3 flex-wrap">
                <div className="relative max-w-xs flex-1">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <Input
                    type="text"
                    placeholder="Zoek lokaalnummer..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {listTypes.map((t) => (
                    <Button
                      key={t}
                      size="sm"
                      variant={typeFilter === t ? "default" : "outline"}
                      onClick={() => setTypeFilter(t)}
                      className="font-poppins"
                    >
                      {t}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="grid min-h-0 flex-1 grid-cols-2 content-start gap-3 overflow-y-auto pr-1">
                {filteredList.map((loc) => {
                  const cfg = loc.colorOverride ?? ROOM_TYPES[loc.type]
                  const typeLabel = ROOM_TYPES[loc.type].label
                  return (
                    <Card
                      key={`${loc.verdiepingNr}-${loc.id}`}
                      className="p-4 flex items-center gap-3"
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
                            <Badge
                              variant="outline"
                              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold font-poppins shadow-none shrink-0 ${
                                loc.beschikbaar
                                  ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                                  : "border-red-200 bg-red-50 text-red-500"
                              }`}
                            >
                              {loc.beschikbaar ? "Beschikbaar" : "Bezet"}
                            </Badge>
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
                    </Card>
                  )
                })}
                {filteredList.length === 0 && (
                  <Card className="col-span-2 p-10 flex flex-col items-center justify-center text-center">
                    <XCircle size={28} className="text-slate-200 mb-2" />
                    <p className="font-poppins font-semibold text-slate-500 text-sm">
                      Geen locaties gevonden
                    </p>
                  </Card>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

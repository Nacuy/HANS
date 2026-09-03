import { BookOpen, Calendar, CheckCircle2 } from "lucide-react"
import { StatusBadge, ProgressRing, LinearProgress } from "../components"
import { courses, milestones } from "../data/studycredits"

export function Credits() {
  return (
    <div className="p-6 max-w-[1000px] space-y-5">
      <div>
        <h1 className="font-poppins font-bold text-2xl text-slate-900">
          Studiepunten & Normen
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Inzicht in je EC-voortgang, de BSA-norm en het studiejaar.
        </p>
      </div>

      {/* Big progress */}
      <div className="hans-card p-6 grid grid-cols-3 gap-6 items-center">
        <div className="flex flex-col items-center">
          <ProgressRing value={0} max={60} size={140} />
          <p className="font-poppins font-semibold text-slate-700 text-sm mt-3">
            Totaal jaar 1
          </p>
          <p className="text-xs text-slate-400">0 van 60 EC behaald</p>
        </div>
        <div className="col-span-2 space-y-4">
          <div>
            <h3 className="font-poppins font-bold text-slate-900 text-base mb-2">
              Wat zijn EC's?
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Eén studiepunt (EC) staat voor 28 uur studie. Per periode kun je
              maximaal 15 EC halen. Een volledig jaar bestaat uit 60 EC. Je
              verdient EC's door vakken en projecten succesvol af te ronden.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-red-50 border border-red-100 rounded-xl p-3.5">
              <p className="text-xs font-bold text-red-700 font-poppins mb-1">
                BSA-norm (jaar 1 → jaar 2)
              </p>
              <p className="text-2xl font-bold text-red-600 font-poppins">
                45 EC
              </p>
              <p className="text-xs text-red-500 mt-0.5">
                Peildatum: 1 februari 2026
              </p>
            </div>
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3.5">
              <p className="text-xs font-bold text-indigo-700 font-poppins mb-1">
                Nog nodig voor BSA
              </p>
              <p className="text-2xl font-bold text-indigo-600 font-poppins">
                45 EC
              </p>
              <p className="text-xs text-indigo-500 mt-0.5">
                Introductieweek — nog niets ingeboekt
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Per-course progress */}
      <div className="hans-card p-5">
        <h3 className="font-poppins font-semibold text-slate-800 text-sm mb-4 flex items-center gap-2">
          <BookOpen size={15} className="text-indigo-500" /> Voortgang per vak
          (Periode 1)
        </h3>
        <div className="space-y-3">
          {courses.map((c, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-slate-700">
                    {c.naam}
                  </span>
                  <span className="text-sm font-bold text-indigo-600 font-poppins">
                    {c.ec}/{c.max} EC
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full"
                    style={{
                      width: `${(c.ec / c.max) * 100}%`,
                      background: c.ec === c.max ? "#10B981" : "#B70035",
                    }}
                  />
                </div>
              </div>
              <StatusBadge type={c.ec === c.max ? "ingeleverd" : "bezig"} />
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="hans-card p-5">
        <h3 className="font-poppins font-semibold text-slate-800 text-sm mb-5 flex items-center gap-2">
          <Calendar size={15} className="text-indigo-500" /> Studiejaar
          2026–2027
        </h3>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200" />
          <div className="space-y-5">
            {milestones.map((m, i) => (
              <div key={i} className="flex items-center gap-4 pl-2">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 z-10 ${
                    m.done
                      ? "bg-indigo-500 border-indigo-500"
                      : "bg-white border-slate-300"
                  }`}
                >
                  {m.done && <CheckCircle2 size={12} className="text-white" />}
                </div>
                <div>
                  <p
                    className={`text-sm font-semibold font-poppins ${
                      m.done ? "text-indigo-600" : "text-slate-700"
                    }`}
                  >
                    {m.label}
                  </p>
                  <p className="text-xs text-slate-400">{m.datum}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

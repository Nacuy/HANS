import { Calendar, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { milestones } from "../../data/studycredits";

export function StudiepuntenSection() {
  return (
    <div className="space-y-4 pt-4">
      <div>
        <h3 className="font-poppins font-bold text-slate-900 text-base mb-2">
          Wat zijn EC's?
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          Eén studiepunt (EC) staat voor 28 uur studie. Per periode kun je
          maximaal 15 EC halen. Een volledig jaar bestaat uit 60 EC. Je verdient
          EC's door vakken en projecten succesvol af te ronden.
        </p>
      </div>

      <div className="rounded-xl border border-red-100 bg-red-50 p-3.5 transition-all hover:border-indigo-200 hover:shadow-md">
        <p className="text-xs font-bold text-red-700 font-poppins mb-1">
          BSA-norm (jaar 1 → jaar 2)
        </p>
        <p className="text-2xl font-bold text-red-600 font-poppins">45 EC</p>
        <p className="text-xs text-red-500 mt-0.5">
          Peildatum: 1 februari 2026 — haal je deze norm niet, dan volgt een
          bindend studieadvies.
        </p>
      </div>

      <Card>
        <CardHeader className="p-5 pb-0">
          <CardTitle className="flex items-center gap-2 text-sm font-poppins font-semibold text-slate-800">
            <Calendar size={15} className="text-indigo-500" /> Studiejaar
            2026–2027
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5">
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
        </CardContent>
      </Card>
    </div>
  );
}

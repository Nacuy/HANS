import { ExternalLink } from "lucide-react"
import { hanSystems } from "../data/navigation"

export function Systems() {
  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="font-poppins font-bold text-2xl text-slate-900">
          HAN-systemen
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Alle digitale tools die je als IT en Mediadesign-student gebruikt.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {hanSystems.map((sys) => (
          <div
            key={sys.id}
            className="hans-card hans-card-hover p-5 flex gap-4"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: sys.bg, color: sys.color }}
            >
              {sys.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div>
                  <h3 className="font-poppins font-bold text-slate-900 text-base">
                    {sys.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-poppins font-medium">
                    {sys.category}
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-3">
                {sys.description}
              </p>
              {sys.url && (
                <a
                  href={sys.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-xs flex items-center gap-1.5 w-fit"
                >
                  Open systeem <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

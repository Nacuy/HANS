import { ExternalLink } from "lucide-react";
import { hanSystems } from "../data/navigation";

export function Systems() {
  return (
    <div className="space-y-5 p-4 md:p-6">
      <div>
        <h1 className="font-poppins text-2xl font-bold text-slate-900">
          HAN-systemen
        </h1>
        <p className="mt-0.5 text-sm text-slate-500">
          Alle digitale tools die je als IT en Mediadesign-student gebruikt.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {hanSystems.map((sys) => (
          <a
            key={sys.id}
            href={sys.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex gap-4 rounded-xl border border-slate-200 bg-white p-5 transition-all hover:border-indigo-200 hover:shadow-md"
          >
            <span
              className="flex size-12 shrink-0 items-center justify-center rounded-xl"
              style={{ background: sys.bg, color: sys.color }}
            >
              {sys.icon}
            </span>
            <span className="min-w-0 flex-1">
              <span className="mb-1 flex items-start justify-between gap-2">
                <span>
                  <span className="block font-poppins text-base font-bold text-slate-900 group-hover:text-indigo-600">
                    {sys.name}
                  </span>
                  <span className="block font-poppins text-[11px] font-medium text-slate-400">
                    {sys.category}
                  </span>
                </span>
                <ExternalLink
                  size={14}
                  className="mt-0.5 shrink-0 text-slate-300 group-hover:text-indigo-400"
                />
              </span>
              <span className="block text-sm leading-relaxed text-slate-600">
                {sys.description}
              </span>
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

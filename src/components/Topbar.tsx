import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { announcements } from "../data/announcements";
import { navItems } from "../data/navigation";
import type { Page } from "../types";

interface TopbarProps {
  active: Page;
  onNavigate: (p: Page) => void;
}

export function Topbar({ active, onNavigate }: TopbarProps) {
  const [updatesOpen, setUpdatesOpen] = useState(false);
  const latest = announcements[0];

  return (
    <header className="h-20 bg-indigo-600 border-b border-indigo-700 flex items-center px-5 gap-8 shrink-0 z-10">
      <div className="flex flex-col justify-center shrink-0 leading-none">
        <span className="font-poppins font-extrabold text-[22px] text-white tracking-tight">
          HANS
        </span>
        <span className="font-poppins font-medium uppercase tracking-[0.18em] text-[10px] text-white/70 mt-1.5">
          Studentenassistentie
        </span>
      </div>

      <nav className="flex items-center gap-1 overflow-x-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`nav-item shrink-0 ${active === item.id ? "active" : ""}`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="relative ml-auto shrink-0 hidden md:block">
        <button
          onClick={() => setUpdatesOpen((open) => !open)}
          aria-expanded={updatesOpen}
          className="w-[330px] rounded-[10px] bg-indigo-50 p-2.5 text-left transition-shadow hover:shadow-md"
        >
          <span className="block font-poppins font-semibold uppercase tracking-widest text-[10px] leading-none text-indigo-600">
            Laatste update
          </span>
          <span className="flex items-center gap-1.5 mt-1.5 leading-none">
            <span className="font-poppins font-semibold text-xs text-slate-800 truncate">
              {latest.titel}
            </span>
            <span className="font-poppins font-medium text-xs text-indigo-700 shrink-0">
              · {latest.datum}
            </span>
            <ChevronDown
              size={13}
              className={`ml-auto shrink-0 text-indigo-600 transition-transform duration-200 ${
                updatesOpen ? "rotate-180" : ""
              }`}
            />
          </span>
        </button>

        {updatesOpen && (
          <div className="absolute right-0 top-full mt-2 w-[380px] bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-20">
            <div className="px-4 py-3 border-b border-slate-100">
              <span className="font-poppins font-semibold text-sm text-slate-800">
                Updates van deze site
              </span>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {announcements.map((item) => (
                <div
                  key={item.id}
                  className="px-4 py-3 border-b border-slate-100 last:border-b-0"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-poppins font-semibold text-xs text-slate-800">
                      {item.titel}
                    </p>
                    <p className="text-[11px] text-slate-400 shrink-0">
                      {item.datum}
                    </p>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1">
                    {item.tekst}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

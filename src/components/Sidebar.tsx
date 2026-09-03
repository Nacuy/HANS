import { LinearProgress } from "./LinearProgress";
import { navItems } from "../data/navigation";
import type { Page } from "../types";

interface SidebarProps {
  active: Page;
  onNavigate: (p: Page) => void;
}

export function Sidebar({ active, onNavigate }: SidebarProps) {
  return (
    <aside className="w-56 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto">
      <nav className="flex-1 p-3 pt-4 space-y-0.5">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-3 mb-2 font-poppins">
          Navigatie
        </p>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`nav-item w-full text-left ${
              active === item.id ? "active" : ""
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-100">
        <div className="bg-indigo-50 rounded-xl p-3">
          <p className="text-xs font-semibold text-indigo-700 font-poppins mb-1">
            Jaar 1 — Introductieweek
          </p>
          <p className="text-[11px] text-indigo-500">
            IT en Mediadesign · ITA-1A
          </p>
          <LinearProgress value={0} max={60} />
          <p className="text-[11px] text-indigo-500 mt-1.5">0 van 60 EC</p>
        </div>
      </div>
    </aside>
  );
}

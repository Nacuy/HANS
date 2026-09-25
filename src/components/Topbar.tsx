import { useEffect, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { announcements } from "../data/announcements";
import { navItems } from "../data/navigation";
import type { Page } from "../types";

interface TopbarProps {
  active: Page;
  onNavigate: (p: Page) => void;
}

export function Topbar({ active, onNavigate }: TopbarProps) {
  const [updatesOpen, setUpdatesOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const latest = announcements[0];

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const handleNavigate = (page: Page) => {
    onNavigate(page);
    setMenuOpen(false);
    setUpdatesOpen(false);
  };

  return (
    <header className="relative bg-indigo-600 border-b border-indigo-700 shrink-0 z-20 pt-[env(safe-area-inset-top)]">
      <div className="h-16 md:h-20 flex items-center px-4 md:px-5 gap-4 md:gap-8">
        <button
          type="button"
          onClick={() => handleNavigate("home")}
          aria-label="Naar homepage"
          style={{ cursor: "pointer" }}
          className="flex flex-col justify-center shrink-0 leading-none text-left rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <span className="font-poppins font-extrabold text-[20px] md:text-[22px] text-white tracking-tight">
            HANS
          </span>
          <span className="font-poppins font-medium uppercase tracking-[0.18em] text-[9px] md:text-[10px] text-white/70 mt-1.5">
            Studentenassistentie
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-1 overflow-x-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
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
              <UpdatesList />
            </div>
          )}
        </div>

        <button
          type="button"
          className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-lg text-white md:hidden hover:bg-white/10"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Menu sluiten" : "Menu openen"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <>
          <button
            type="button"
            aria-label="Menu sluiten"
            className="fixed inset-0 z-10 bg-slate-900/20 md:hidden"
            onClick={() => setMenuOpen(false)}
          />
          <div
            id="mobile-nav"
            className="absolute left-0 right-0 top-full z-20 border-b border-indigo-700 bg-indigo-600 shadow-lg md:hidden"
          >
            <nav className="flex flex-col gap-1 px-3 pb-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`rounded-lg px-3 py-3 text-left font-poppins text-sm transition-colors ${
                    active === item.id
                      ? "bg-white/15 font-semibold text-white"
                      : "font-medium text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="mx-3 mb-3 overflow-hidden rounded-[10px] bg-white">
              <div className="border-b border-slate-100 px-4 py-3">
                <span className="font-poppins text-sm font-semibold text-slate-800">
                  Updates van deze site
                </span>
              </div>
              <UpdatesList />
            </div>
          </div>
        </>
      )}
    </header>
  );
}

function UpdatesList() {
  return (
    <div className="max-h-72 overflow-y-auto md:max-h-96">
      {announcements.map((item) => (
        <div
          key={item.id}
          className="border-b border-slate-100 px-4 py-3 last:border-b-0"
        >
          <div className="flex items-baseline justify-between gap-3">
            <p className="font-poppins text-xs font-semibold text-slate-800">
              {item.titel}
            </p>
            <p className="shrink-0 text-[11px] text-slate-400">{item.datum}</p>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            {item.tekst}
          </p>
        </div>
      ))}
    </div>
  );
}

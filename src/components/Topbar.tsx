import { useState } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  GraduationCap,
  UserCircle,
  LogOut,
} from "lucide-react";
import type { Page } from "../types";

interface TopbarProps {
  search: string;
  setSearch: (v: string) => void;
  setPage: (p: Page) => void;
}

export function Topbar({ search, setSearch, setPage }: TopbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false)

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center px-5 gap-4 shrink-0 z-10">
      <div className="flex items-center gap-2.5 mr-2">
        <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
          <GraduationCap size={16} className="text-white" />
        </div>
        <span className="font-poppins font-bold text-lg text-slate-800 tracking-tight">
          HANS
        </span>
        <span className="text-[11px] font-medium text-slate-400 font-poppins ml-0.5 hidden sm:block">
          Studentenassistentie
        </span>
        <div className="hidden md:flex items-center gap-1 ml-2">
          <span
            className="text-[10px] font-bold font-poppins px-1.5 py-0.5 rounded"
            style={{ background: "#B70035", color: "white" }}
          >
            ARN
          </span>
          <span
            className="text-[10px] font-bold font-poppins px-1.5 py-0.5 rounded"
            style={{ background: "#003082", color: "white" }}
          >
            NMG
          </span>
        </div>
      </div>
      <div className="flex-1 max-w-md relative">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Zoek in de wiki..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
        />
      </div>
      <div className="ml-auto flex items-center gap-3">
        <div className="relative">
  <button
    onClick={() => {
      setNotifOpen((open) => !open);
      setMenuOpen(false);
    }}
    className="relative p-2 hover:bg-slate-100 rounded-xl transition-colors"
  >
    <Bell size={18} className="text-slate-500" />
    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full" />
  </button>

  {notifOpen && (
    <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-20">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <span className="font-poppins font-semibold text-sm text-slate-800">Aankondigingen</span>
        <span className="text-[11px] text-indigo-500 font-poppins font-medium">2 nieuw</span>
      </div>
      <div className="max-h-80 overflow-y-auto">
        <div className="px-4 py-3 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer">
          <p className="text-xs font-semibold text-amber-700 font-poppins mb-0.5">Roosterwijziging</p>
          <p className="text-xs text-slate-500 leading-relaxed">Netwerken op donderdag 11 sep verplaatst naar lokaal G.3.14.</p>
          <p className="text-[11px] text-slate-400 mt-1">Vandaag, 08:15</p>
        </div>
        <div className="px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer">
          <p className="text-xs font-semibold text-slate-700 font-poppins mb-0.5">Introductieweek evaluatie</p>
          <p className="text-xs text-slate-500 leading-relaxed">Vul de korte enquête in over je eerste indruk van de opleiding.</p>
          <p className="text-[11px] text-slate-400 mt-1">Gisteren, 14:30</p>
        </div>
      </div>
      <button className="w-full text-center py-2.5 text-xs text-indigo-500 font-semibold font-poppins hover:bg-slate-50 transition-colors border-t border-slate-100">
        Alle aankondigingen bekijken
      </button>
    </div>
  )}
</div>

        <div className="relative">
          <div
            onClick={() => {
              setMenuOpen((open) => !open);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 rounded-xl px-2 py-1.5 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-xs font-bold text-indigo-600 font-poppins">
                LB
              </span>
            </div>
            <span className="text-sm font-medium text-slate-700 font-poppins hidden md:block">
              Lena
            </span>
            <ChevronDown size={13} className="text-slate-400 hidden md:block" />
          </div>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-20">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setPage("dashboard");
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left"
              >
                <UserCircle size={16} />
                Profiel
              </button>
              <button
                onClick={() => setMenuOpen(false)}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left border-t border-slate-100"
              >
                <LogOut size={16} />
                Uitloggen
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

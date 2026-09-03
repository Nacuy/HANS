import {
  Clock,
  MapPin,
  Users,
  BookOpen,
  TrendingUp,
  ArrowRight,
  ChevronRight,
  Zap,
  ExternalLink,
} from "lucide-react"
import { StatusBadge, ProgressRing, LinearProgress } from "../components"
import { overviewCards } from "../data/dashboard"
import { hanSystems } from "../data/navigation"
import type { Page } from "../types"

export function Dashboard({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <div className="p-6 max-w-[1200px] space-y-6">
      {/* Welcome + Hero row */}
      <div>
        <h1 className="font-poppins font-bold text-2xl text-slate-900">
          Goedemorgen, Lena 👋
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Welkom bij HAN Student Assistant
        </p>
      </div>

      {/* Top section: Hero lesson + Progress + Announcements */}
      <div className="grid grid-cols-3 gap-4">
        {/* Hero Card: Next lesson */}
        <div className="col-span-2 hans-card p-5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#B70035] to-[#8F002A] rounded-[13px]" />
          <div className="absolute right-0 bottom-0 w-48 h-48 opacity-10">
            <BookOpen size={192} className="text-white" />
          </div>
          <div className="relative text-white">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-white/20 rounded-lg px-2.5 py-1 text-xs font-semibold font-poppins flex items-center gap-1.5">
                <Clock size={12} />
                Eerstvolgende les
              </div>
              <div className="bg-white/30 rounded-lg px-2.5 py-1 text-xs font-bold font-poppins text-white/90">
                over 32 minuten
              </div>
            </div>
            <h2 className="font-poppins font-bold text-xl mb-1">ICTJOU01-OW</h2>
            <p className="text-white/80 text-sm mb-1">
              Introductiecollege — uren 1–4
            </p>
            <div className="flex items-center gap-4 mt-3 text-white/80 text-sm">
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                09:00 – 12:15
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin size={14} />
                R26/B2.80
              </span>
              <span className="flex items-center gap-1.5">
                <Users size={14} />
                JNRB +
              </span>
            </div>
            <button
              onClick={() => setPage("schedule")}
              className="mt-4 bg-white text-indigo-600 font-poppins font-semibold text-sm rounded-xl px-4 py-2 flex items-center gap-1.5 hover:bg-indigo-50 transition-colors w-fit"
            >
              Bekijk volledig rooster
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Study Progress */}
        <div className="hans-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-indigo-500" />
            <h3 className="font-poppins font-semibold text-slate-800 text-sm">
              Studievoortgang
            </h3>
          </div>
          <div className="flex items-center gap-5">
            <ProgressRing value={0} max={60} size={110} />
            <div className="flex-1">
              <div className="space-y-2.5">
                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span className="font-medium">Behaald</span>
                    <span className="font-bold text-indigo-600">0 EC</span>
                  </div>
                  <LinearProgress value={0} max={60} />
                </div>
                <div className="bg-red-50 rounded-lg p-2.5 border border-red-100">
                  <p className="text-[11px] text-red-600 font-semibold font-poppins">
                    BSA-norm jaar 2
                  </p>
                  <p className="text-[11px] text-red-500 mt-0.5">
                    Min. 45 EC nodig • nog 45 EC te gaan
                  </p>
                </div>
                <button
                  onClick={() => setPage("credits")}
                  className="text-xs text-indigo-500 font-semibold font-poppins flex items-center gap-1 hover:text-indigo-700 transition-colors"
                >
                  Meer info BSA <ChevronRight size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System shortcuts */}
      <div className="hans-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={16} className="text-indigo-500" />
          <h3 className="font-poppins font-semibold text-slate-800 text-sm">
            Snelkoppelingen HAN-systemen
          </h3>
        </div>
        <div className="flex gap-3 flex-wrap">
          {hanSystems.map((sys) =>
            sys.url ? (
              <a
                key={sys.id}
                href={sys.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50 transition-all group hans-card-hover"
              >
                <div style={{ color: sys.color }}>{sys.icon}</div>
                <span className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600 font-poppins transition-colors">
                  {sys.name}
                </span>
                <ExternalLink
                  size={12}
                  className="text-slate-300 group-hover:text-indigo-400 transition-colors"
                />
              </a>
            ) : (
              <button
                key={sys.id}
                onClick={() => setPage("systems")}
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50 transition-all group hans-card-hover"
              >
                <div style={{ color: sys.color }}>{sys.icon}</div>
                <span className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600 font-poppins transition-colors">
                  {sys.name}
                </span>
                <ExternalLink
                  size={12}
                  className="text-slate-300 group-hover:text-indigo-400 transition-colors"
                />
              </button>
            )
          )}
        </div>
      </div>

      {/* Overview cards grid */}
      <div>
        <h3 className="font-poppins font-semibold text-slate-700 text-sm mb-3">
          Onderwerpen
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {overviewCards.map((card) => (
            <button
              key={card.id}
              onClick={() => setPage(card.id as Page)}
              className="hans-card hans-card-hover p-4 text-left group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-100 transition-colors">
                  {card.icon}
                </div>
                <StatusBadge type={card.badge} />
              </div>
              <h4 className="font-poppins font-semibold text-slate-800 text-sm mb-1">
                {card.title}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                {card.desc}
              </p>
              <div className="flex items-center gap-1 mt-3 text-indigo-500 text-xs font-semibold font-poppins group-hover:gap-2 transition-all">
                Bekijk meer <ArrowRight size={12} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

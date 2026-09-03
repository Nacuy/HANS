import type { BadgeType, BadgeConfig } from "../types";

const BADGE_CONFIG: Record<BadgeType, BadgeConfig> = {
  verplicht: {
    label: "Verplicht",
    className: "bg-red-50 text-red-600 border border-red-200",
  },
  verwacht: {
    label: "Verwacht",
    className: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  optioneel: {
    label: "Optioneel",
    className: "bg-slate-100 text-slate-500 border border-slate-200",
  },
  bezig: {
    label: "Bezig",
    className: "bg-blue-50 text-blue-600 border border-blue-200",
  },
  bijna_verlopen: {
    label: "Bijna verlopen",
    className: "bg-orange-50 text-orange-600 border border-orange-200",
  },
  ingeleverd: {
    label: "Ingeleverd",
    className: "bg-emerald-50 text-emerald-600 border border-emerald-200",
  },
};

export function StatusBadge({ type }: { type: BadgeType }) {
  const { label, className } = BADGE_CONFIG[type];
  return (
    <span
      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full font-poppins ${className}`}
    >
      {label}
    </span>
  );
}

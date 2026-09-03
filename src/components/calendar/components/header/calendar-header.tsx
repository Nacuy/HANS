import { Columns, Grid3x3, List, Grid2x2, CalendarRange } from "lucide-react";

import { useCalendar } from "@/calendar/contexts/calendar-context";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import { UserSelect } from "@/calendar/components/header/user-select";
import { TodayButton } from "@/calendar/components/header/today-button";
import { DateNavigator } from "@/calendar/components/header/date-navigator";

import type { IEvent } from "@/calendar/interfaces";
import type { TCalendarView } from "@/calendar/types";

interface IProps {
  view: TCalendarView;
  events: IEvent[];
}

const VIEW_OPTIONS: { view: TCalendarView; label: string; icon: typeof List }[] = [
  { view: "day", label: "View by day", icon: List },
  { view: "week", label: "View by week", icon: Columns },
  { view: "month", label: "View by month", icon: Grid2x2 },
  { view: "year", label: "View by year", icon: Grid3x3 },
  { view: "agenda", label: "View by agenda", icon: CalendarRange },
];

export function CalendarHeader({ view, events }: IProps) {
  const { setView } = useCalendar();

  return (
    <div className="flex flex-col gap-4 border-b border-border p-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-3">
        <TodayButton />
        <DateNavigator view={view} events={events} />
      </div>

      <div className="flex items-center gap-1.5">
        <div className="inline-flex overflow-hidden rounded-md border border-border bg-background">
          {VIEW_OPTIONS.map(({ view: optionView, label, icon: Icon }, index) => (
            <Button
              key={optionView}
              type="button"
              aria-label={label}
              size="icon"
              variant={view === optionView ? "default" : "ghost"}
              className={cn(
                "rounded-none shadow-none [&_svg]:size-5",
                index > 0 && "border-l border-border",
              )}
              onClick={() => setView(optionView)}
            >
              <Icon strokeWidth={1.8} />
            </Button>
          ))}
        </div>

        <UserSelect />
      </div>
    </div>
  );
}

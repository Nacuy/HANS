import { Calendar, Clock, User } from "lucide-react";
import { parseISO, areIntervalsOverlapping, format } from "date-fns";

import { useCalendar } from "@/calendar/contexts/calendar-context";

import { ScrollArea } from "@/components/ui/scroll-area";
import { SingleCalendar } from "@/components/ui/single-calendar";

import { EventBlock } from "@/calendar/components/week-and-day-view/event-block";
import { CalendarTimeline } from "@/calendar/components/week-and-day-view/calendar-time-line";
import { DayViewMultiDayEventsRow } from "@/calendar/components/week-and-day-view/day-view-multi-day-events-row";

import { cn } from "@/lib/utils";
import { groupEvents, getEventBlockStyle, isWorkingHour, getCurrentEvents, getVisibleHours } from "@/calendar/helpers";

import type { IEvent } from "@/calendar/interfaces";

interface IProps {
  singleDayEvents: IEvent[];
  multiDayEvents: IEvent[];
}

export function CalendarDayView({ singleDayEvents, multiDayEvents }: IProps) {
  const { selectedDate, setSelectedDate, users, visibleHours, workingHours } = useCalendar();

  const { hours, earliestEventHour, latestEventHour } = getVisibleHours(visibleHours, singleDayEvents);

  const currentEvents = getCurrentEvents(singleDayEvents);

  const dayEvents = singleDayEvents.filter(event => {
    const eventDate = parseISO(event.startDate);
    return (
      eventDate.getDate() === selectedDate.getDate() &&
      eventDate.getMonth() === selectedDate.getMonth() &&
      eventDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  const groupedEvents = groupEvents(dayEvents);

  return (
    <div className="flex">
      <div className="flex flex-1 flex-col">
        <div>
          <DayViewMultiDayEventsRow selectedDate={selectedDate} multiDayEvents={multiDayEvents} />

          {/* Day header */}
          <div className="relative z-20 flex border-b border-border">
            <div className="w-18"></div>
            <span className="flex-1 border-l border-border py-2 text-center text-xs font-medium text-muted-foreground">
              {format(selectedDate, "EE")} <span className="font-semibold text-foreground">{format(selectedDate, "d")}</span>
            </span>
          </div>
        </div>

        <ScrollArea className="h-[800px]" type="always">
          <div className="flex">
            {/* Hours column */}
            <div className="relative w-18">
              {hours.map((hour, index) => (
                <div key={hour} className="relative" style={{ height: "96px" }}>
                  <div className="absolute -top-3 right-2 flex h-6 items-center">
                    {index !== 0 && <span className="text-xs text-muted-foreground">{format(new Date().setHours(hour, 0, 0, 0), "hh a")}</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Day grid */}
            <div className="relative flex-1 border-l border-border">
              <div className="relative">
                {hours.map((hour, index) => {
                  const isDisabled = !isWorkingHour(selectedDate, hour, workingHours);

                  return (
                    <div key={hour} className={cn("relative", isDisabled && "bg-calendar-disabled-hour")} style={{ height: "96px" }}>
                      {index !== 0 && <div className="pointer-events-none absolute inset-x-0 top-0 border-b border-border/70"></div>}
                      <div className="pointer-events-none absolute inset-x-0 top-1/2 border-b border-dashed border-border/50"></div>
                    </div>
                  );
                })}

                {groupedEvents.map((group, groupIndex) =>
                  group.map(event => {
                    let style = getEventBlockStyle(event, selectedDate, groupIndex, groupedEvents.length, { from: earliestEventHour, to: latestEventHour });
                    const hasOverlap = groupedEvents.some(
                      (otherGroup, otherIndex) =>
                        otherIndex !== groupIndex &&
                        otherGroup.some(otherEvent =>
                          areIntervalsOverlapping(
                            { start: parseISO(event.startDate), end: parseISO(event.endDate) },
                            { start: parseISO(otherEvent.startDate), end: parseISO(otherEvent.endDate) }
                          )
                        )
                    );

                    if (!hasOverlap) style = { ...style, width: "100%", left: "0%" };

                    return (
                      <div key={event.id} className="absolute p-1" style={style}>
                        <EventBlock event={event} />
                      </div>
                    );
                  })
                )}
              </div>

              <CalendarTimeline firstVisibleHour={earliestEventHour} lastVisibleHour={latestEventHour} />
            </div>
          </div>
        </ScrollArea>
      </div>

      <aside className="hidden w-[280px] shrink-0 flex-col border-l border-border bg-muted/20 md:flex">
        <div className="border-b border-border p-4">
          <SingleCalendar
            className="schedule-mini-calendar mx-auto p-0"
            mode="single"
            selected={selectedDate}
            onSelect={(date) => setSelectedDate(date)}
          />
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          {currentEvents.length > 0 ? (
            <div className="flex items-start gap-2 border-b border-border px-4 py-3">
              <span className="relative mt-[5px] flex size-2.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex size-2.5 rounded-full bg-green-600"></span>
              </span>

              <p className="text-sm font-semibold text-foreground">Nu bezig</p>
            </div>
          ) : (
            <p className="border-b border-border px-4 py-6 text-center text-sm italic text-muted-foreground">
              Geen lopende activiteiten
            </p>
          )}

          {currentEvents.length > 0 && (
            <ScrollArea className="min-h-0 flex-1 px-4 py-3" type="always">
              <div className="space-y-5 pb-4">
                {currentEvents.map(event => {
                  const user = users.find(user => user.id === event.user.id);

                  return (
                    <div key={event.id} className="space-y-1.5 rounded-lg border border-border bg-background p-3">
                      <p className="line-clamp-2 text-sm font-semibold">{event.title}</p>

                      {user && (
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <User className="size-3.5" />
                          <span className="text-sm">{user.name}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Calendar className="size-3.5" />
                        <span className="text-sm">{format(selectedDate, "MMM d, yyyy")}</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="size-3.5" />
                        <span className="text-sm">
                          {format(parseISO(event.startDate), "h:mm a")} - {format(parseISO(event.endDate), "h:mm a")}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </div>
      </aside>
    </div>
  );
}

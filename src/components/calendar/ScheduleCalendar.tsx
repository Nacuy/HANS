import { CalendarProvider } from "@/calendar/contexts/calendar-context";
import { ClientContainer } from "@/calendar/components/client-container";

import type { IEvent, IUser } from "@/calendar/interfaces";
import type { TCalendarView } from "@/calendar/types";

interface ScheduleCalendarProps {
  users: IUser[];
  events: IEvent[];
  initialView?: TCalendarView;
}

export function ScheduleCalendar({ users, events, initialView = "week" }: ScheduleCalendarProps) {
  return (
    <CalendarProvider users={users} events={events} initialView={initialView}>
      <ClientContainer />
    </CalendarProvider>
  );
}

import { ScheduleCalendar } from "../components/calendar/ScheduleCalendar"
import { scheduleEvents, scheduleUsers } from "../data/scheduleEvents"

export function Schedule() {
  return (
    <div className="flex h-full flex-col p-6">
      <div className="mb-5">
        <h1 className="font-poppins text-2xl font-bold text-slate-900">
          Rooster (MyX)
        </h1>
        <p className="mt-0.5 text-sm text-slate-500">
          Je wekelijkse rooster voor lessen en activiteiten.
        </p>
      </div>

      <div className="min-h-0 flex-1">
        <ScheduleCalendar
          users={scheduleUsers}
          events={scheduleEvents}
          initialView="week"
        />
      </div>
    </div>
  )
}

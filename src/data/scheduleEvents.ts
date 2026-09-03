import type { IEvent, IUser } from "@/calendar/interfaces"
import type { TEventColor } from "@/calendar/types"
import { weekSchedule } from "./schedule"

const SCHEDULE_USER: IUser = {
  id: "student",
  name: "Mijn rooster",
  picturePath: null,
}

const DAY_DATES: Record<string, string> = {
  Maandag: "2026-08-31",
  Dinsdag: "2026-09-01",
  Woensdag: "2026-09-02",
  Donderdag: "2026-09-03",
  Vrijdag: "2026-09-04",
}

const COLORS: TEventColor[] = ["blue", "green", "purple", "orange", "red", "yellow"]

function parseTimeRange(date: string, timeRange: string) {
  const [start, end] = timeRange.split("–")
  const [startHour, startMinute] = start.trim().split(":").map(Number)
  const [endHour, endMinute] = end.trim().split(":").map(Number)

  const startDate = new Date(`${date}T00:00:00`)
  startDate.setHours(startHour, startMinute, 0, 0)

  const endDate = new Date(`${date}T00:00:00`)
  endDate.setHours(endHour, endMinute, 0, 0)

  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  }
}

export const scheduleUsers: IUser[] = [SCHEDULE_USER]

export const scheduleEvents: IEvent[] = weekSchedule.flatMap((day, dayIndex) =>
  day.lessen.map((lesson, lessonIndex) => {
    const date = DAY_DATES[day.dag] ?? DAY_DATES.Maandag
    const { startDate, endDate } = parseTimeRange(date, lesson.tijd)

    return {
      id: dayIndex * 100 + lessonIndex + 1,
      startDate,
      endDate,
      title: lesson.vak,
      color: COLORS[lessonIndex % COLORS.length],
      description: `${lesson.lokaal} · ${lesson.docent}`,
      user: SCHEDULE_USER,
    }
  }),
)

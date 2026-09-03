import { Urls } from "@/data/urls"

export type Page =
  | "dashboard"
  | "systems"
  | "credits"
  | "locations"
  | "support"
  | "extracurricular"
  | "wiki"
  | "schedule"

export type BadgeType =
  | "verplicht"
  | "verwacht"
  | "optioneel"
  | "bezig"
  | "bijna_verlopen"
  | "ingeleverd"

export type RoomType =
  | "collegezaal"
  | "practicum"
  | "zelfstudie"
  | "kantoor"
  | "horeca"
  | "vergader"
  | "trap"
  | "overig"
  | "lokaal"
  | "fablab"
  | "houtwerkplaats"
  | "composietenlab"
  | "material_science"
  | "metaalwerkplaats"
  | "av_uitleen"
  | "av_studio"
  | "han_datalab"
  | "media_lab"
  | "usability_lab"

export interface RoomColor {
  fill: string
  stroke: string
  textColor: string
}

export interface FloorRoom {
  id: string
  naam: string
  type: RoomType
  x: number
  y: number
  w: number
  h: number
  rx?: number
  beschikbaar?: boolean
  capaciteit?: number
  /** Overrides the shared ROOM_TYPES color for this one room (used for rooms whose
   * plattegrond color doesn't map to a standard legend category). */
  colorOverride?: RoomColor
}

export interface FloorData {
  naam: string
  omschrijving: string
  kamers: FloorRoom[]
  /** SVG viewBox height for this floor's plan; defaults to 395 when omitted. */
  viewBoxHeight?: number
}

export interface NavItem {
  id: Page
  label: string
  icon: React.ReactNode
}

export interface HANSystem {
  id: string
  name: string
  category: string
  description: string
  color: string
  bg: string
  icon: React.ReactNode
  url?: string
}

export interface Deadline {
  id: number
  vak: string
  taak: string
  deadline: string
  status: BadgeType
}

export interface OverviewCard {
  id: string
  icon: React.ReactNode
  title: string
  desc: string
  badge: BadgeType
}

export interface Location {
  id: number
  naam: string
  type: string
  verdieping: string
  capaciteit: number
  beschikbaar: boolean
}

export interface SupportContact {
  id: number
  naam: string
  icon: React.ReactNode
  color: string
  bg: string
  wanneer: string
  email: string
  tel: string
  locatie: string
}

export interface Course {
  naam: string
  ec: number
  max: number
  periode: string
  status: string
}

export interface Activity {
  id: number
  naam: string
  icon: React.ReactNode
  color: string
  bg: string
  beschrijving: string
  primaryAction: string
  secondaryAction: string
}

export interface Milestone {
  label: string
  datum: string
  done: boolean
}

export interface Lesson {
  tijd: string
  vak: string
  lokaal: string
  docent: string
}

export interface DaySchedule {
  dag: string
  datum: string
  lessen: Lesson[]
}

export interface RoomTypeConfig {
  label: string
  fill: string
  stroke: string
  textColor: string
}

export interface BadgeConfig {
  label: string
  className: string
}

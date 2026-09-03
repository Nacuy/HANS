import type { Course, Milestone } from "../types"

export const courses: Course[] = [
  {
    naam: "ICTJOU01-OW (Oriëntatie op de opleiding)",
    ec: 0,
    max: 5,
    periode: "P1",
    status: "bezig",
  },
  {
    naam: "Aftrap Propedeuse",
    ec: 0,
    max: 3,
    periode: "P1",
    status: "bezig",
  },
  {
    naam: "Begeleid werken / SLB",
    ec: 0,
    max: 2,
    periode: "P1",
    status: "bezig",
  },
  {
    naam: "Overige vakken semester 1",
    ec: 0,
    max: 20,
    periode: "P1–P2",
    status: "bezig",
  },
]

export const milestones: Milestone[] = [
  { label: "Introductieweek", datum: "aug 2026", done: true },
  { label: "Einde Periode 1", datum: "okt 2026", done: false },
  { label: "Einde Periode 2", datum: "jan 2027", done: false },
  { label: "BSA-peildatum", datum: "feb 2027", done: false },
  { label: "Einde Periode 3", datum: "apr 2027", done: false },
  { label: "Einde studiejaar", datum: "jul 2027", done: false },
]

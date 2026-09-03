import {
  Monitor,
  TrendingUp,
  MapPin,
  LifeBuoy,
  Star,
  BookOpen,
} from "lucide-react";
import type { Deadline, OverviewCard } from "../types";

export const deadlines: Deadline[] = [
  {
    id: 1,
    vak: "ICTJOU01-OW",
    taak: "Reflectieverslag introductieweek",
    deadline: "5 sep 2026",
    status: "bijna_verlopen",
  },
  {
    id: 2,
    vak: "Aftrap Propedeuse",
    taak: "Kennismakingsopdracht groep",
    deadline: "8 sep 2026",
    status: "bezig",
  },
  {
    id: 3,
    vak: "Begeleid werken",
    taak: "Voortgangsgesprek SLB",
    deadline: "12 sep 2026",
    status: "bezig",
  },
  {
    id: 4,
    vak: "Aftrap Propedeuse",
    taak: "Aanwezigheidsregistratie week 1",
    deadline: "31 aug 2026",
    status: "ingeleverd",
  },
  {
    id: 5,
    vak: "ICTJOU01-OW",
    taak: "Portfolio startpagina opzetten",
    deadline: "19 sep 2026",
    status: "verwacht",
  },
];

export const overviewCards: OverviewCard[] = [
  {
    id: "systems",
    icon: <Monitor size={20} />,
    title: "HAN-systemen",
    desc: "Alle tools uitgelegd: BrightSpace, Osiris, Teams en meer.",
    badge: "verplicht",
  },
  {
    id: "credits",
    icon: <TrendingUp size={20} />,
    title: "Studiepunten",
    desc: "Hoe EC's werken, de BSA-norm en je voortgang.",
    badge: "verplicht",
  },
  {
    id: "locations",
    icon: <MapPin size={20} />,
    title: "Locaties",
    desc: "Lokalen, zelfstudieplekken en de kantine op de campus.",
    badge: "verwacht",
  },
  {
    id: "support",
    icon: <LifeBuoy size={20} />,
    title: "Hulplijnen",
    desc: "Studentbegeleiding, decanen en de studentpsycholoog.",
    badge: "verwacht",
  },
  {
    id: "extracurricular",
    icon: <Star size={20} />,
    title: "Extra-curriculair",
    desc: "Studievereniging en activiteiten buiten de les.",
    badge: "optioneel",
  },
  {
    id: "wiki",
    icon: <BookOpen size={20} />,
    title: "Wiki",
    desc: "Praktische informatie en tips voor het studentenleven.",
    badge: "optioneel",
  },
];

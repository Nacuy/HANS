import {
  LayoutDashboard,
  Monitor,
  TrendingUp,
  MapPin,
  LifeBuoy,
  Star,
  Calendar,
  BookOpen,
  GraduationCap,
  Video,
  Mail,
  FileText,
  CheckCircle2,
} from "lucide-react"
import { Urls } from "../data/urls"
import type { NavItem, HANSystem } from "../types"

export const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={17} /> },
  { id: "systems", label: "HAN-systemen", icon: <Monitor size={17} /> },
  { id: "schedule", label: "Rooster (MyX)", icon: <Calendar size={17} /> },
  {
    id: "credits",
    label: "Studiepunten & Normen",
    icon: <TrendingUp size={17} />,
  },
  { id: "locations", label: "Locaties", icon: <MapPin size={17} /> },
  { id: "support", label: "Hulplijnen", icon: <LifeBuoy size={17} /> },
  {
    id: "extracurricular",
    label: "Buiten de lessen",
    icon: <Star size={17} />,
  },
  { id: "wiki", label: "Wiki", icon: <BookOpen size={17} /> },
]

export const hanSystems: HANSystem[] = [
  {
    id: "brightspace",
    name: "BrightSpace",
    category: "Leeromgeving",
    description:
      "Je digitale leeromgeving voor cursusmateriaal, opdrachten inleveren en cijfers inzien.",
    color: "#E8470C",
    bg: "#FFF3EF",
    icon: <BookOpen size={22} />,
    url: Urls.brightspace,
  },
  {
    id: "osiris",
    name: "Osiris",
    category: "Studentportaal",
    description:
      "Bekijk je officiële studieresultaten, inschrijvingen en persoonsgegevens.",
    color: "#1565C0",
    bg: "#E3F0FF",
    icon: <GraduationCap size={22} />,
    url: Urls.osiris,
  },
  {
    id: "myx",
    name: "MyX (Rooster)",
    category: "Roosterbeheer",
    description:
      "Bekijk je persoonlijk rooster, lokaalindelingen en wijzigingen in je lessen.",
    color: "#C62828",
    bg: "#FEECEC",
    icon: <Calendar size={22} />,
    url: Urls.myx,
  },
  {
    id: "teams",
    name: "Microsoft Teams",
    category: "Communicatie",
    description:
      "Overleg met je team, volg online lessen en ontvang berichten van docenten.",
    color: "#5264B2",
    bg: "#EEF0FB",
    icon: <Video size={22} />,
    url: Urls.teams,
  },
  {
    id: "outlook",
    name: "Outlook",
    category: "E-mail",
    description:
      "Je HAN-e-mailaccount voor officiële communicatie met docenten en de administratie.",
    color: "#0078D4",
    bg: "#E5F2FB",
    icon: <Mail size={22} />,
    url: Urls.outlook,
  },
  {
    id: "isas",
    name: "iSAS",
    category: "Stage & Afstuderen",
    description:
      "Stagevoortgang bijhouden, stageplaatsen zoeken en documenten uploaden.",
    color: "#2E7D32",
    bg: "#E8F5E9",
    icon: <FileText size={22} />,
    url: Urls.isas,
  },
  {
    id: "ans",
    name: "ANS",
    category: "Toetsen",
    description:
      "Online toetsen afleggen en je toetsresultaten en feedback inzien.",
    color: "#6A1B9A",
    bg: "#F3E5F5",
    icon: <CheckCircle2 size={22} />,
    url: Urls.ans,
  },
  {
    id: "studentenverenigingICT",
    name: "Studentenvereniging ICT",
    category: "Studentenactiviteiten",
    description:
      "Bekijk de activiteiten en evenementen van de Studentenvereniging ICT.",
    color: "#FF6F00",
    bg: "#FFF3E0",
    icon: <Star size={22} />,
    url: Urls.studentenverenigingICT,
  },
  {
    id: "studycredit",
    name: "Studiepunten & Reglementen",
    category: "Studentenadministratie",
    description:
      "Bekijk je studiepunten, de reglementen en je voortgang in het studieplan.",
    color: "#388E3C",
    bg: "#E8F5E9",
    icon: <FileText size={22} />,
    url: Urls.studiepuntenRegelementen,
  },
]

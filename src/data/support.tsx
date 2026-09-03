import { FileText, Users, MessageSquare, GraduationCap } from "lucide-react"
import type { SupportContact } from "../types"

export const supportContacts: SupportContact[] = [
  // {
  //   id: 1,
  //   naam: "Studentenadministratie",
  //   icon: <FileText size={22} />,
  //   color: "#003082",
  //   bg: "#E6EEF8",
  //   wanneer:
  //     "Voor inschrijving, wijzigingen in je opleiding, formulieren en officiële verzoeken.",
  //   email: "", // Geen publiek e-mailadres gevonden voor ASK HAN — alleen telefoon/WhatsApp/contactformulier op han.nl/contact
  //   tel: "024-353 0500",
  //   locatie: "ASK HAN — bereikbaar ma–vr 08:00–17:00 (telefonisch, WhatsApp of contactformulier)",
  // },
  // {
  //   id: 2,
  //   naam: "Studentbegeleider (SLB)",
  //   icon: <Users size={22} />,
  //   color: "#2E7D32",
  //   bg: "#E8F5E9",
  //   wanneer:
  //     "Als je moeite hebt met studeren, plannen of je studievoortgang en BSA-norm niet haalt. Je SLB-er is je vaste aanspreekpunt.",
  //   email: "", // Geen centraal e-mailadres: je SLB'er wordt per opleiding aan je toegewezen, contact vind je via BrightSpace/Insite
  //   tel: "024-353 0500",
  //   locatie: "Je SLB'er is opleidingsgebonden — algemene ingang via ASK HAN, die verwijst je door",
  // },
  // {
  //   id: 3,
  //   naam: "Studentpsycholoog",
  //   icon: <MessageSquare size={22} />,
  //   color: "#6A1B9A",
  //   bg: "#F3E5F5",
  //   wanneer:
  //     "Bij stress, faalangst, motivatieproblemen of andere persoonlijke uitdagingen. Gratis en vertrouwelijk.",
  //   email: "", // Geen publiek e-mailadres gevonden; toegang loopt via het HAN Student Support Center, na doorverwijzing
  //   tel: "024-353 0500",
  //   locatie: "Toegang via het HAN Student Support Center — vraag je SLB'er om doorverwijzing, of check Insite",
  // },
  {
    id: 4,
    naam: "Bijzondere omstandigheden",
    icon: <GraduationCap size={22} />,
    color: "#B70035",
    bg: "#FFDADA",
    wanneer:
      "Bij bijzondere omstandigheden (ziekte, familiesituatie) die invloed hebben op je studie. De decaan kan je studie tijdelijk aanpassen.",
    email: "bijzondereomstandigheden@han.nl",
    tel: "024-353 0500",
    locatie:
      "Meld bijzondere omstandigheden per e-mail, of vraag je SLB'er om doorverwijzing naar een decaan",
  },
]

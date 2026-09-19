import type { Announcement } from "../types"

/** Site-nieuws over HANS zelf — geen persoonlijke meldingen. Nieuwste eerst. */
export const announcements: Announcement[] = [
  {
    id: 1,
    titel: "Plattegrond Arnhem R26 bijgewerkt",
    datum: "18 sep 2026",
    tekst:
      "De plattegrond van gebouw R26 bevat nu alle practicumlokalen en werkplaatsen op verdieping 2.",
  },
  {
    id: 2,
    titel: "Wiki samengevoegd",
    datum: "17 sep 2026",
    tekst:
      "Studiepunten, hulplijnen en activiteiten buiten de lessen staan nu samen in de Wiki.",
  },
  {
    id: 3,
    titel: "HAN-systemen uitgebreid",
    datum: "12 sep 2026",
    tekst:
      "ANS en iSAS zijn toegevoegd aan het overzicht van HAN-systemen, inclusief directe links.",
  },
  {
    id: 4,
    titel: "Rooster tijdelijk niet beschikbaar",
    datum: "5 sep 2026",
    tekst:
      "De roosterweergave is tijdelijk uit het menu gehaald terwijl de koppeling met MyX wordt vernieuwd.",
  },
]

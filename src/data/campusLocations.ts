export type CampusCityId = "arnhem" | "nijmegen"

export interface CampusBuilding {
  id: string
  label: string
  address: string
  available: boolean
  description?: string
  floorSummaries?: string[]
}

export interface CampusCity {
  id: CampusCityId
  label: string
  buildings: CampusBuilding[]
}

export const CAMPUS_CITIES: CampusCity[] = [
  {
    id: "arnhem",
    label: "Arnhem",
    buildings: [
      {
        id: "ruitenberglaan-26",
        label: "Ruitenberglaan 26",
        address: "Ruitenberglaan 26",
        available: true,
        description: "Fablab, werkplaatsen, labs en collegezalen",
        floorSummaries: [
          "BG: Balie, Mensa, R26/B0.xx",
          "1e verd.: Mediatheek, R26/B1.xx",
          "2e verd.: PC-zalen, R26/B2.xx",
          "3e verd.: Collegezalen, R26/B3.xx",
        ],
      },
      {
        id: "ruitenberglaan-27",
        label: "Ruitenberglaan 27",
        address: "Ruitenberglaan 27",
        available: false,
      },
      {
        id: "ruitenberglaan-29",
        label: "Ruitenberglaan 29",
        address: "Ruitenberglaan 29",
        available: false,
      },
      {
        id: "ruitenberglaan-31",
        label: "Ruitenberglaan 31",
        address: "Ruitenberglaan 31",
        available: false,
      },
    ],
  },
  {
    id: "nijmegen",
    label: "Nijmegen",
    buildings: [
      {
        id: "kapittelweg",
        label: "Kapittelweg",
        address: "Kapittelweg 35",
        available: false,
      },
      {
        id: "heyendaalseweg",
        label: "Heyendaalseweg",
        address: "Heyendaalseweg 135",
        available: false,
      },
      {
        id: "takenhofplein",
        label: "Takenhofplein",
        address: "Takenhofplein 7",
        available: false,
      },
    ],
  },
]

export const DEFAULT_CITY_ID: CampusCityId = "arnhem"
export const DEFAULT_BUILDING_ID = "ruitenberglaan-26"

export function getCampusCity(cityId: CampusCityId) {
  return CAMPUS_CITIES.find((city) => city.id === cityId)!
}

export function getCampusBuilding(cityId: CampusCityId, buildingId: string) {
  return getCampusCity(cityId).buildings.find(
    (building) => building.id === buildingId
  )
}

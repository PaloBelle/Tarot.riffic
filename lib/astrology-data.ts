export interface BirthChartData {
  name: string
  birthDate: string
  birthTime: string
  birthPlace: string
  latitude: string
  longitude: string
}

export interface ZodiacSign {
  name: string
  element: "fire" | "earth" | "air" | "water"
  quality: "cardinal" | "fixed" | "mutable"
  rulingPlanet: string
  dateRange: string
}

export const zodiacSigns: Record<string, ZodiacSign> = {
  aries: {
    name: "Aries",
    element: "fire",
    quality: "cardinal",
    rulingPlanet: "Mars",
    dateRange: "March 21 - April 19",
  },
  taurus: {
    name: "Taurus",
    element: "earth",
    quality: "fixed",
    rulingPlanet: "Venus",
    dateRange: "April 20 - May 20",
  },
  gemini: {
    name: "Gemini",
    element: "air",
    quality: "mutable",
    rulingPlanet: "Mercury",
    dateRange: "May 21 - June 20",
  },
  cancer: {
    name: "Cancer",
    element: "water",
    quality: "cardinal",
    rulingPlanet: "Moon",
    dateRange: "June 21 - July 22",
  },
  leo: {
    name: "Leo",
    element: "fire",
    quality: "fixed",
    rulingPlanet: "Sun",
    dateRange: "July 23 - August 22",
  },
  virgo: {
    name: "Virgo",
    element: "earth",
    quality: "mutable",
    rulingPlanet: "Mercury",
    dateRange: "August 23 - September 22",
  },
  libra: {
    name: "Libra",
    element: "air",
    quality: "cardinal",
    rulingPlanet: "Venus",
    dateRange: "September 23 - October 22",
  },
  scorpio: {
    name: "Scorpio",
    element: "water",
    quality: "fixed",
    rulingPlanet: "Pluto",
    dateRange: "October 23 - November 21",
  },
  sagittarius: {
    name: "Sagittarius",
    element: "fire",
    quality: "mutable",
    rulingPlanet: "Jupiter",
    dateRange: "November 22 - December 21",
  },
  capricorn: {
    name: "Capricorn",
    element: "earth",
    quality: "cardinal",
    rulingPlanet: "Saturn",
    dateRange: "December 22 - January 19",
  },
  aquarius: {
    name: "Aquarius",
    element: "air",
    quality: "fixed",
    rulingPlanet: "Uranus",
    dateRange: "January 20 - February 18",
  },
  pisces: {
    name: "Pisces",
    element: "water",
    quality: "mutable",
    rulingPlanet: "Neptune",
    dateRange: "February 19 - March 20",
  },
}

export function getSunSign(birthDate: string): ZodiacSign | null {
  const date = new Date(birthDate)
  const month = date.getMonth() + 1
  const day = date.getDate()

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return zodiacSigns.aries
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return zodiacSigns.taurus
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return zodiacSigns.gemini
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return zodiacSigns.cancer
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return zodiacSigns.leo
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return zodiacSigns.virgo
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return zodiacSigns.libra
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return zodiacSigns.scorpio
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return zodiacSigns.sagittarius
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return zodiacSigns.capricorn
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return zodiacSigns.aquarius
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return zodiacSigns.pisces

  return null
}

export interface PlanetaryTransit {
  planet: string
  sign: string
  house: number
  aspect: string
  influence: string
}

export function getCurrentTransits(birthChartData: BirthChartData): PlanetaryTransit[] {
  const sunSign = getSunSign(birthChartData.birthDate)
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1

  // Simplified transit calculation based on current date
  // In production, use a proper ephemeris library
  const transits: PlanetaryTransit[] = [
    {
      planet: "Sun",
      sign: sunSign?.name || "Unknown",
      house: 1,
      aspect: "Conjunction",
      influence:
        "Your core identity and life purpose are illuminated. This is a time of self-discovery and personal power.",
    },
    {
      planet: "Moon",
      sign: getCurrentMoonSign(currentMonth),
      house: 4,
      aspect: "Trine",
      influence:
        "Emotional harmony flows through your home and family life. Trust your intuition and nurture your inner world.",
    },
    {
      planet: "Mercury",
      sign: sunSign?.name || "Unknown",
      house: 3,
      aspect: "Sextile",
      influence:
        "Communication channels are open and clear. Express your ideas with confidence and engage in meaningful conversations.",
    },
    {
      planet: "Venus",
      sign: getVenusSign(currentMonth),
      house: 7,
      aspect: "Trine",
      influence:
        "Love, beauty, and partnerships are harmoniously aligned. Relationships flourish under this beneficial influence.",
    },
    {
      planet: "Mars",
      sign: getMarsSign(currentMonth),
      house: 10,
      aspect: "Square",
      influence:
        "Career ambitions face dynamic challenges. Channel this intense energy into productive action and overcome obstacles.",
    },
    {
      planet: "Jupiter",
      sign: "Taurus",
      house: 2,
      aspect: "Conjunction",
      influence:
        "Expansion and abundance in material resources. Opportunities for financial growth and stability are present.",
    },
  ]

  return transits
}

function getCurrentMoonSign(month: number): string {
  const moonSigns = [
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
    "Aries",
    "Taurus",
    "Gemini",
  ]
  return moonSigns[month % 12]
}

function getVenusSign(month: number): string {
  const venusSigns = [
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
  ]
  return venusSigns[month % 12]
}

function getMarsSign(month: number): string {
  const marsSigns = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
  ]
  return marsSigns[month % 12]
}

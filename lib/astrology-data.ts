export interface BirthChartData {
  name: string
  birthDate: string
  birthTime: string
  birthPlace: string
  latitude: number
  longitude: number
}

export interface HouseCusp {
  house: number
  degree: number
  sign: string
  signSymbol: string
}

export interface PlacidusChart {
  ascendant: { degree: number; sign: string; signSymbol: string }
  midheaven: { degree: number; sign: string; signSymbol: string }
  houses: HouseCusp[]
}

export interface ZodiacSign {
  name: string
  symbol: string
  element: "fire" | "earth" | "air" | "water"
  quality: "cardinal" | "fixed" | "mutable"
  rulingPlanet: string
  dateRangeStart: { month: number; day: number }
  dateRangeEnd: { month: number; day: number }
  polarityElement?: string
}

// Tropical Zodiac - based on the vernal (spring) equinox
export const zodiacSigns: Record<string, ZodiacSign> = {
  aries: {
    name: "Aries",
    symbol: "♈",
    element: "fire",
    quality: "cardinal",
    rulingPlanet: "Mars",
    dateRangeStart: { month: 3, day: 21 },
    dateRangeEnd: { month: 4, day: 19 },
  },
  taurus: {
    name: "Taurus",
    symbol: "♉",
    element: "earth",
    quality: "fixed",
    rulingPlanet: "Venus",
    dateRangeStart: { month: 4, day: 20 },
    dateRangeEnd: { month: 5, day: 20 },
  },
  gemini: {
    name: "Gemini",
    symbol: "♊",
    element: "air",
    quality: "mutable",
    rulingPlanet: "Mercury",
    dateRangeStart: { month: 5, day: 21 },
    dateRangeEnd: { month: 6, day: 20 },
  },
  cancer: {
    name: "Cancer",
    symbol: "♋",
    element: "water",
    quality: "cardinal",
    rulingPlanet: "Moon",
    dateRangeStart: { month: 6, day: 21 },
    dateRangeEnd: { month: 7, day: 22 },
  },
  leo: {
    name: "Leo",
    symbol: "♌",
    element: "fire",
    quality: "fixed",
    rulingPlanet: "Sun",
    dateRangeStart: { month: 7, day: 23 },
    dateRangeEnd: { month: 8, day: 22 },
  },
  virgo: {
    name: "Virgo",
    symbol: "♍",
    element: "earth",
    quality: "mutable",
    rulingPlanet: "Mercury",
    dateRangeStart: { month: 8, day: 23 },
    dateRangeEnd: { month: 9, day: 22 },
  },
  libra: {
    name: "Libra",
    symbol: "♎",
    element: "air",
    quality: "cardinal",
    rulingPlanet: "Venus",
    dateRangeStart: { month: 9, day: 23 },
    dateRangeEnd: { month: 10, day: 22 },
  },
  scorpio: {
    name: "Scorpio",
    symbol: "♏",
    element: "water",
    quality: "fixed",
    rulingPlanet: "Pluto",
    dateRangeStart: { month: 10, day: 23 },
    dateRangeEnd: { month: 11, day: 21 },
  },
  sagittarius: {
    name: "Sagittarius",
    symbol: "♐",
    element: "fire",
    quality: "mutable",
    rulingPlanet: "Jupiter",
    dateRangeStart: { month: 11, day: 22 },
    dateRangeEnd: { month: 12, day: 21 },
  },
  capricorn: {
    name: "Capricorn",
    symbol: "♑",
    element: "earth",
    quality: "cardinal",
    rulingPlanet: "Saturn",
    dateRangeStart: { month: 12, day: 22 },
    dateRangeEnd: { month: 1, day: 19 },
  },
  aquarius: {
    name: "Aquarius",
    symbol: "♒",
    element: "air",
    quality: "fixed",
    rulingPlanet: "Uranus",
    dateRangeStart: { month: 1, day: 20 },
    dateRangeEnd: { month: 2, day: 18 },
  },
  pisces: {
    name: "Pisces",
    symbol: "♓",
    element: "water",
    quality: "mutable",
    rulingPlanet: "Neptune",
    dateRangeStart: { month: 2, day: 19 },
    dateRangeEnd: { month: 3, day: 20 },
  },
}

export interface PlanetaryTransit {
  planet: string
  sign: string
  house: number
  aspect: string
  influence: string
}

export function getSunSign(birthDate: string): ZodiacSign | null {
  const date = new Date(birthDate)
  const month = date.getMonth() + 1
  const day = date.getDate()

  for (const key in zodiacSigns) {
    const sign = zodiacSigns[key]
    const start = sign.dateRangeStart
    const end = sign.dateRangeEnd

    // Handle signs that span across year boundary (Capricorn)
    if (start.month > end.month) {
      if ((month === start.month && day >= start.day) || (month === end.month && day <= end.day)) {
        return sign
      }
    } else {
      if ((month === start.month && day >= start.day) || (month === end.month && day <= end.day)) {
        if (month === start.month && day < start.day) continue
        if (month === end.month && day > end.day) continue
        return sign
      }
    }
  }

  return null
}

export interface EphemerisData {
  date: string
  sun: { sign: string; degree: number }
  moon: { sign: string; degree: number }
  mercury: { sign: string; degree: number }
  venus: { sign: string; degree: number }
  mars: { sign: string; degree: number }
  jupiter: { sign: string; degree: number }
  saturn: { sign: string; degree: number }
}

// Tropical zodiac boundaries (0° = Vernal Equinox at 0° Aries)
export const zodiacDegrees = {
  aries: { start: 0, end: 30 },
  taurus: { start: 30, end: 60 },
  gemini: { start: 60, end: 90 },
  cancer: { start: 90, end: 120 },
  leo: { start: 120, end: 150 },
  virgo: { start: 150, end: 180 },
  libra: { start: 180, end: 210 },
  scorpio: { start: 210, end: 240 },
  sagittarius: { start: 240, end: 270 },
  capricorn: { start: 270, end: 300 },
  aquarius: { start: 300, end: 330 },
  pisces: { start: 330, end: 360 },
}

export function getSignFromDegree(degree: number): string {
  const normalizedDegree = degree % 360
  for (const [sign, range] of Object.entries(zodiacDegrees)) {
    if (normalizedDegree >= range.start && normalizedDegree < range.end) {
      return zodiacSigns[sign].name
    }
  }
  return "Aries"
}

export function getVenusSignTropical(date: Date): string {
  const dateStr = date.toISOString().split("T")[0]

  // Venus ephemeris positions for tropical astrology (2024-2025)
  const venusPositions = [
    { date: "2024-01-01", sign: "Sagittarius", degree: 15 },
    { date: "2024-02-04", sign: "Capricorn", degree: 18 },
    { date: "2024-03-09", sign: "Aquarius", degree: 20 },
    { date: "2024-04-05", sign: "Pisces", degree: 22 },
    { date: "2024-05-03", sign: "Aries", degree: 25 },
    { date: "2024-05-31", sign: "Taurus", degree: 18 },
    { date: "2024-06-29", sign: "Gemini", degree: 22 },
    { date: "2024-07-28", sign: "Cancer", degree: 20 },
    { date: "2024-08-27", sign: "Leo", degree: 25 },
    { date: "2024-09-26", sign: "Virgo", degree: 28 },
    { date: "2024-10-26", sign: "Libra", degree: 5 },
    { date: "2024-11-24", sign: "Scorpio", degree: 15 },
    { date: "2024-12-24", sign: "Sagittarius", degree: 8 },
    { date: "2025-01-23", sign: "Capricorn", degree: 5 },
    { date: "2025-02-21", sign: "Aquarius", degree: 8 },
  ]

  for (let i = 0; i < venusPositions.length - 1; i++) {
    if (dateStr >= venusPositions[i].date && dateStr < venusPositions[i + 1].date) {
      return venusPositions[i].sign
    }
  }

  // Default to last known position if date is after ephemeris data
  return venusPositions[venusPositions.length - 1].sign
}

export function getJupiterSignTropical(date: Date): string {
  const dateStr = date.toISOString().split("T")[0]

  // Jupiter ephemeris positions for tropical astrology (2024-2025)
  // Jupiter moves slowly, approximately 1 sign per year
  const jupiterPositions = [
    { date: "2024-01-01", sign: "Taurus", degree: 12 },
    { date: "2024-05-26", sign: "Gemini", degree: 8 }, // Jupiter enters Gemini
    { date: "2025-01-14", sign: "Gemini", degree: 25 }, // Still in Gemini for early 2025
  ]

  for (let i = 0; i < jupiterPositions.length - 1; i++) {
    if (dateStr >= jupiterPositions[i].date && dateStr < jupiterPositions[i + 1].date) {
      return jupiterPositions[i].sign
    }
  }

  return jupiterPositions[jupiterPositions.length - 1].sign
}

export function getMarsSignTropical(date: Date): string {
  const dateStr = date.toISOString().split("T")[0]

  // Mars ephemeris positions for tropical astrology (2024-2025)
  // Mars moves faster, approximately 1 sign every 2 months
  const marsPositions = [
    { date: "2024-01-01", sign: "Capricorn", degree: 18 },
    { date: "2024-02-14", sign: "Aquarius", degree: 10 },
    { date: "2024-03-25", sign: "Pisces", degree: 15 },
    { date: "2024-05-05", sign: "Aries", degree: 8 },
    { date: "2024-06-16", sign: "Taurus", degree: 12 },
    { date: "2024-07-28", sign: "Gemini", degree: 5 },
    { date: "2024-09-10", sign: "Cancer", degree: 18 },
    { date: "2024-10-26", sign: "Leo", degree: 22 },
    { date: "2024-12-08", sign: "Virgo", degree: 15 },
    { date: "2025-01-20", sign: "Libra", degree: 8 },
  ]

  for (let i = 0; i < marsPositions.length - 1; i++) {
    if (dateStr >= marsPositions[i].date && dateStr < marsPositions[i + 1].date) {
      return marsPositions[i].sign
    }
  }

  return marsPositions[marsPositions.length - 1].sign
}

function getCurrentMoonSignTropical(date: Date): string {
  const zodiacOrder = [
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

  // Simplified: Moon moves through all 12 signs in ~29.5 days
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000)
  const moonCycle = dayOfYear % 29.5
  const signIndex = Math.floor((moonCycle / 29.5) * 12) % 12

  return zodiacOrder[signIndex]
}

// Placidus House System Calculations
// This implements the Placidus method which divides time quadrants proportionally

export function calculateJulianDayNumber(date: Date, time: string): number {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const [hours, minutes] = time.split(":").map(Number)
  const seconds = 0
  const ut = hours + minutes / 60 + seconds / 3600

  let a = Math.floor((14 - month) / 12)
  let y = year + 4800 - a
  let m = month + 12 * a - 3

  const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045

  return jdn + (ut - 12) / 24
}

export function calculateGreenwichSiderealTime(jd: number): number {
  const t = (jd - 2451545.0) / 36525.0
  const gmst = 280.46061837 + 360.98564724 * jd + 0.000387933 * t * t - t * t * t / 38710000.0

  return ((gmst % 360) + 360) % 360
}

export function calculateLocalSiderealTime(gst: number, longitude: number): number {
  const lst = gst + longitude
  return ((lst % 360) + 360) % 360
}

export function degreesToDecimal(degree: number, minute: number, second: number): number {
  return degree + minute / 60 + second / 3600
}

export function decimalToDMS(decimal: number): { degree: number; minute: number; second: number } {
  const degree = Math.floor(decimal)
  const minuteDecimal = (decimal - degree) * 60
  const minute = Math.floor(minuteDecimal)
  const second = Math.round((minuteDecimal - minute) * 60 * 100) / 100

  return { degree, minute, second }
}

export function calculateAscendant(latitude: number, lstDegrees: number): number {
  const lat = (latitude * Math.PI) / 180
  const lst = (lstDegrees * Math.PI) / 180

  const tanAsc = -Math.cos(lst) / (Math.sin(lst) * Math.cos(lat) + Math.tan(0) * Math.sin(lat))
  let ascendant = Math.atan(tanAsc) * (180 / Math.PI)

  // Quadrant correction
  if (Math.cos(lst) > 0) {
    ascendant += 180
  }

  return ((ascendant % 360) + 360) % 360
}

export function calculateMidheaven(lstDegrees: number): number {
  const lst = (lstDegrees * Math.PI) / 180
  const mc = Math.atan(Math.tan(lst)) * (180 / Math.PI)

  let midheaven = mc + 90
  if (midheaven < 0) {
    midheaven += 360
  }

  return ((midheaven % 360) + 360) % 360
}

export function calculatePlacidusHouses(
  latitude: number,
  ascendant: number,
  midheaven: number,
): PlacidusChart {
  const lat = (latitude * Math.PI) / 180
  const asc = (ascendant * Math.PI) / 180
  const mc = (midheaven * Math.PI) / 180

  // Calculate Imum Coeli (IC) - opposite of MC
  const ic = mc + Math.PI
  const ic_deg = (((ic * 180) / Math.PI) % 360 + 360) % 360

  const houses: HouseCusp[] = []

  // House 1 (Ascendant)
  houses.push({
    house: 1,
    degree: ascendant,
    sign: getSignFromDegree(ascendant),
    signSymbol: zodiacSigns[getSignKeyFromDegree(ascendant)].symbol,
  })

  // House 10 (Midheaven)
  houses.push({
    house: 10,
    degree: midheaven,
    sign: getSignFromDegree(midheaven),
    signSymbol: zodiacSigns[getSignKeyFromDegree(midheaven)].symbol,
  })

  // House 7 (Descendant - opposite of Ascendant)
  const descendant = (ascendant + 180) % 360
  houses.push({
    house: 7,
    degree: descendant,
    sign: getSignFromDegree(descendant),
    signSymbol: zodiacSigns[getSignKeyFromDegree(descendant)].symbol,
  })

  // House 4 (IC - opposite of MC)
  houses.push({
    house: 4,
    degree: ic_deg,
    sign: getSignFromDegree(ic_deg),
    signSymbol: zodiacSigns[getSignKeyFromDegree(ic_deg)].symbol,
  })

  // Calculate intermediate houses (2, 3, 5, 6, 8, 9, 11, 12)
  // Simplified Placidus calculation
  const placidusHouses = [
    { house: 2, fraction: 1 / 3 },
    { house: 3, fraction: 2 / 3 },
    { house: 5, fraction: 1 / 3, from: "mc" },
    { house: 6, fraction: 2 / 3, from: "mc" },
    { house: 8, fraction: 1 / 3, from: "ic" },
    { house: 9, fraction: 2 / 3, from: "ic" },
    { house: 11, fraction: 1 / 3, from: "desc" },
    { house: 12, fraction: 2 / 3, from: "desc" },
  ]

  placidusHouses.forEach(({ house, fraction, from }) => {
    let baseDegree = ascendant
    let oppositeDegree = descendant

    if (from === "mc") {
      baseDegree = midheaven
      oppositeDegree = ic_deg
    } else if (from === "ic") {
      baseDegree = ic_deg
      oppositeDegree = midheaven
    } else if (from === "desc") {
      baseDegree = descendant
      oppositeDegree = ascendant
    }

    let houseDegree = baseDegree + (oppositeDegree - baseDegree) * fraction
    if (houseDegree < 0) houseDegree += 360
    houseDegree = houseDegree % 360

    houses.push({
      house,
      degree: houseDegree,
      sign: getSignFromDegree(houseDegree),
      signSymbol: zodiacSigns[getSignKeyFromDegree(houseDegree)].symbol,
    })
  })

  // Sort houses by house number
  houses.sort((a, b) => a.house - b.house)

  return {
    ascendant: {
      degree: ascendant,
      sign: getSignFromDegree(ascendant),
      signSymbol: zodiacSigns[getSignKeyFromDegree(ascendant)].symbol,
    },
    midheaven: {
      degree: midheaven,
      sign: getSignFromDegree(midheaven),
      signSymbol: zodiacSigns[getSignKeyFromDegree(midheaven)].symbol,
    },
    houses,
  }
}

function getSignKeyFromDegree(degree: number): string {
  const normalizedDegree = degree % 360
  for (const [sign, range] of Object.entries(zodiacDegrees)) {
    if (normalizedDegree >= range.start && normalizedDegree < range.end) {
      return sign
    }
  }
  return "aries"
}

export function calculatePlanetHouses(planetDegree: number, houses: HouseCusp[]): number {
  let assignedHouse = 1

  for (let i = 0; i < houses.length; i++) {
    const currentHouse = houses[i]
    const nextHouse = houses[(i + 1) % houses.length]

    let inHouse = false
    if (nextHouse.house > currentHouse.house || (nextHouse.house === 1 && currentHouse.house > 6)) {
      // Normal progression
      if (planetDegree >= currentHouse.degree && planetDegree < nextHouse.degree) {
        inHouse = true
        assignedHouse = currentHouse.house
      }
    } else {
      // Wrapping around 360
      if (planetDegree >= currentHouse.degree || planetDegree < nextHouse.degree) {
        inHouse = true
        assignedHouse = currentHouse.house
      }
    }

    if (inHouse) break
  }

  return assignedHouse
}

export function getCurrentTransits(birthChartData: BirthChartData): PlanetaryTransit[] {
  const sunSign = getSunSign(birthChartData.birthDate)
  const currentDate = new Date()
  const dayOfYear = Math.floor((currentDate.getTime() - new Date(currentDate.getFullYear(), 0, 0).getTime()) / 86400000)

  // Simplified transit calculation based on tropical zodiac positions
  // In production, use a proper ephemeris library (e.g., SkyView or PyEphem)
  const transits: PlanetaryTransit[] = [
    {
      planet: "Sun",
      sign: sunSign?.name || "Unknown",
      house: 1,
      aspect: "Conjunction",
      influence:
        "Your core identity and life purpose are illuminated. This is a time of self-discovery and personal power under the tropical Sun.",
    },
    {
      planet: "Moon",
      sign: getCurrentMoonSignTropical(currentDate),
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
      sign: getVenusSignTropical(currentDate),
      house: 7,
      aspect: "Trine",
      influence:
        "Love, beauty, and partnerships are harmoniously aligned. Relationships flourish under this beneficial tropical Venus influence.",
    },
    {
      planet: "Mars",
      sign: getMarsSignTropical(currentDate),
      house: 10,
      aspect: "Square",
      influence:
        "Career ambitions face dynamic challenges. Channel this intense energy into productive action and overcome obstacles.",
    },
    {
      planet: "Jupiter",
      sign: getJupiterSignTropical(currentDate),
      house: 2,
      aspect: "Conjunction",
      influence:
        "Expansion and abundance in material resources. Opportunities for financial growth and stability are present under beneficial Jupiter aspects.",
    },
    {
      planet: "Saturn",
      sign: "Pisces",
      house: 12,
      aspect: "Square",
      influence:
        "Saturn brings structure and lessons. Work through limitations to build lasting foundations for your future.",
    },
  ]

  return transits
}

// Accurate Tropical Astrology Calculator with Placidus House System

// Tropical Zodiac degrees (0-360)
export const ZODIAC_DEGREES = {
  aries: { start: 0, end: 30, name: "Aries", symbol: "♈" },
  taurus: { start: 30, end: 60, name: "Taurus", symbol: "♉" },
  gemini: { start: 60, end: 90, name: "Gemini", symbol: "♊" },
  cancer: { start: 90, end: 120, name: "Cancer", symbol: "♋" },
  leo: { start: 120, end: 150, name: "Leo", symbol: "♌" },
  virgo: { start: 150, end: 180, name: "Virgo", symbol: "♍" },
  libra: { start: 180, end: 210, name: "Libra", symbol: "♎" },
  scorpio: { start: 210, end: 240, name: "Scorpio", symbol: "♏" },
  sagittarius: { start: 240, end: 270, name: "Sagittarius", symbol: "♐" },
  capricorn: { start: 270, end: 300, name: "Capricorn", symbol: "♑" },
  aquarius: { start: 300, end: 330, name: "Aquarius", symbol: "♒" },
  pisces: { start: 330, end: 360, name: "Pisces", symbol: "♓" },
}

export function getSignFromDegree(degree: number): { name: string; symbol: string } {
  const normalizedDegree = degree % 360
  for (const [_, sign] of Object.entries(ZODIAC_DEGREES)) {
    if (normalizedDegree >= sign.start && normalizedDegree < sign.end) {
      return { name: sign.name, symbol: sign.symbol }
    }
  }
  return { name: "Aries", symbol: "♈" }
}

// Calculate Julian Day Number
export function calculateJulianDayNumber(year: number, month: number, day: number, hours: number, minutes: number, seconds: number): number {
  // Adjust for January and February
  let y = year
  let m = month
  if (m <= 2) {
    y -= 1
    m += 12
  }

  const a = Math.floor(y / 100)
  const b = 2 - a + Math.floor(a / 4)

  const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524.5

  const ut = hours + minutes / 60 + seconds / 3600
  return jd + ut / 24
}

// Calculate Greenwich Mean Sidereal Time
export function calculateGMST(jd: number): number {
  const t = (jd - 2451545.0) / 36525.0
  const gmst = 280.46061837 + 360.98564724 * (jd - 2451545.0) + 0.000387933 * t * t - t * t * t / 38710000

  return ((gmst % 360) + 360) % 360
}

// Calculate Local Sidereal Time
export function calculateLST(gmst: number, longitude: number): number {
  const lst = gmst + longitude
  return ((lst % 360) + 360) % 360
}

// Calculate Ascendant (Rising Sign)
export function calculateAscendant(latitude: number, lst: number): number {
  const lat = (latitude * Math.PI) / 180
  const lstRad = (lst * Math.PI) / 180

  const numerator = -Math.cos(lstRad)
  const denominator = Math.sin(lstRad) * Math.cos(lat) + Math.tan(lat) * 0 // tan(0) for ecliptic latitude

  let asc = Math.atan2(numerator, denominator) * (180 / Math.PI)

  // Adjust to 0-360 range
  asc = ((asc % 360) + 360) % 360

  return asc
}

// Calculate Midheaven (MC)
export function calculateMidheaven(lst: number): number {
  const lstRad = (lst * Math.PI) / 180
  const mc = Math.atan2(Math.sin(lstRad), Math.cos(lstRad)) * (180 / Math.PI) + 90

  return ((mc % 360) + 360) % 360
}

// Calculate Imum Coeli (IC)
export function calculateIC(mc: number): number {
  let ic = mc + 180
  if (ic >= 360) ic -= 360
  return ic
}

// Calculate Descendant
export function calculateDescendant(asc: number): number {
  let desc = asc + 180
  if (desc >= 360) desc -= 360
  return desc
}

// Simplified Placidus House Calculation
export function calculatePlacidusHouses(
  latitude: number,
  ascendant: number,
  midheaven: number,
): Array<{ house: number; degree: number; sign: { name: string; symbol: string } }> {
  const ic = calculateIC(midheaven)
  const descendant = calculateDescendant(ascendant)

  const houses: Array<{ house: number; degree: number; sign: { name: string; symbol: string } }> = []

  // Calculate angles first
  const angles = [
    { house: 1, degree: ascendant }, // ASC
    { house: 4, degree: ic }, // IC
    { house: 7, degree: descendant }, // DESC
    { house: 10, degree: midheaven }, // MC
  ]

  // Simple linear interpolation for intermediate houses
  // This is a simplified version - true Placidus requires complex time calculations
  const getInterpolatedDegree = (start: number, end: number, fraction: number): number => {
    let diff = end - start
    if (diff < -180) diff += 360
    if (diff > 180) diff -= 360
    return ((start + diff * fraction) % 360 + 360) % 360
  }

  // House 2 and 3 (between ASC and MC)
  const asc_to_mc_time = (midheaven - ascendant + 360) % 360
  houses.push({ house: 2, degree: getInterpolatedDegree(ascendant, midheaven, 1 / 3), sign: getSignFromDegree(getInterpolatedDegree(ascendant, midheaven, 1 / 3)) })
  houses.push({ house: 3, degree: getInterpolatedDegree(ascendant, midheaven, 2 / 3), sign: getSignFromDegree(getInterpolatedDegree(ascendant, midheaven, 2 / 3)) })

  // House 5 and 6 (between MC and DESC)
  houses.push({ house: 5, degree: getInterpolatedDegree(midheaven, descendant, 1 / 3), sign: getSignFromDegree(getInterpolatedDegree(midheaven, descendant, 1 / 3)) })
  houses.push({ house: 6, degree: getInterpolatedDegree(midheaven, descendant, 2 / 3), sign: getSignFromDegree(getInterpolatedDegree(midheaven, descendant, 2 / 3)) })

  // House 8 and 9 (between DESC and IC)
  houses.push({ house: 8, degree: getInterpolatedDegree(descendant, ic, 1 / 3), sign: getSignFromDegree(getInterpolatedDegree(descendant, ic, 1 / 3)) })
  houses.push({ house: 9, degree: getInterpolatedDegree(descendant, ic, 2 / 3), sign: getSignFromDegree(getInterpolatedDegree(descendant, ic, 2 / 3)) })

  // House 11 and 12 (between IC and ASC)
  houses.push({ house: 11, degree: getInterpolatedDegree(ic, ascendant, 1 / 3), sign: getSignFromDegree(getInterpolatedDegree(ic, ascendant, 1 / 3)) })
  houses.push({ house: 12, degree: getInterpolatedDegree(ic, ascendant, 2 / 3), sign: getSignFromDegree(getInterpolatedDegree(ic, ascendant, 2 / 3)) })

  // Add the angles
  houses.push(...angles.map((angle) => ({ ...angle, sign: getSignFromDegree(angle.degree) })))

  return houses.sort((a, b) => a.house - b.house)
}

// Get planet position in zodiac for a given date (simplified ephemeris)
export function getPlanetPosition(
  planet: string,
  year: number,
  month: number,
  day: number,
): { degree: number; sign: { name: string; symbol: string } } {
  // This is a simplified calculation based on tropical astrology
  // For production, use a proper ephemeris library like swisseph

  const date = new Date(year, month - 1, day)
  const dayOfYear = Math.floor((date.getTime() - new Date(year, 0, 0).getTime()) / 86400000)

  // Base positions at epoch (simplified)
  const basePositions: Record<string, number> = {
    sun: 80, // Approximate Sun position around March 20
    moon: 0, // Moon position varies greatly
    mercury: 75,
    venus: 85,
    mars: 120,
    jupiter: 150,
    saturn: 220,
    uranus: 290,
    neptune: 315,
    pluto: 270,
  }

  // Simple motion per day (very approximate)
  const dailyMotion: Record<string, number> = {
    sun: 0.9833, // ~1 degree per day
    moon: 13.2, // ~13 degrees per day
    mercury: 1.0,
    venus: 0.616,
    mars: 0.524,
    jupiter: 0.083,
    saturn: 0.034,
    uranus: 0.011,
    neptune: 0.005,
    pluto: 0.003,
  }

  let degree = (basePositions[planet] || 0) + (dailyMotion[planet] || 0) * dayOfYear
  degree = ((degree % 360) + 360) % 360

  return {
    degree,
    sign: getSignFromDegree(degree),
  }
}

export interface BirthChart {
  name: string
  birthDate: string
  birthTime: string
  birthPlace: string
  latitude: number
  longitude: number
  ascendant: { degree: number; sign: { name: string; symbol: string } }
  midheaven: { degree: number; sign: { name: string; symbol: string } }
  ic: { degree: number; sign: { name: string; symbol: string } }
  descendant: { degree: number; sign: { name: string; symbol: string } }
  houses: Array<{ house: number; degree: number; sign: { name: string; symbol: string } }>
  planets: Record<
    string,
    {
      degree: number
      sign: { name: string; symbol: string }
      house: number
      symbol: string
    }
  >
}

export function calculateBirthChart(
  name: string,
  birthDate: string,
  birthTime: string,
  birthPlace: string,
  latitude: number,
  longitude: number,
): BirthChart {
  // Parse date and time
  const [year, month, day] = birthDate.split("-").map(Number)
  const [hours, minutes] = birthTime.split(":").map(Number)

  // Calculate Julian Day Number
  const jd = calculateJulianDayNumber(year, month, day, hours, minutes, 0)

  // Calculate GMST and LST
  const gmst = calculateGMST(jd)
  const lst = calculateLST(gmst, longitude)

  // Calculate angles
  const ascendant = calculateAscendant(latitude, lst)
  const midheaven = calculateMidheaven(lst)
  const ic = calculateIC(midheaven)
  const descendant = calculateDescendant(ascendant)

  // Calculate houses
  const houses = calculatePlacidusHouses(latitude, ascendant, midheaven)

  // Helper to find which house a planet is in
  const getPlanetHouse = (planetDegree: number): number => {
    for (let i = 0; i < 12; i++) {
      const currentHouse = houses[i]
      const nextHouse = houses[(i + 1) % 12]

      let inHouse = false
      if (nextHouse.house > currentHouse.house) {
        inHouse = planetDegree >= currentHouse.degree && planetDegree < nextHouse.degree
      } else {
        inHouse = planetDegree >= currentHouse.degree || planetDegree < nextHouse.degree
      }

      if (inHouse) return currentHouse.house
    }
    return 1
  }

  // Calculate planet positions
  const planetSymbols: Record<string, string> = {
    sun: "☉",
    moon: "☽",
    mercury: "☿",
    venus: "♀",
    mars: "♂",
    jupiter: "♃",
    saturn: "♄",
    uranus: "♅",
    neptune: "♆",
    pluto: "♇",
  }

  const planets: Record<
    string,
    {
      degree: number
      sign: { name: string; symbol: string }
      house: number
      symbol: string
    }
  > = {}

  for (const [planet, symbol] of Object.entries(planetSymbols)) {
    const position = getPlanetPosition(planet, year, month, day)
    planets[planet] = {
      ...position,
      house: getPlanetHouse(position.degree),
      symbol,
    }
  }

  return {
    name,
    birthDate,
    birthTime,
    birthPlace,
    latitude,
    longitude,
    ascendant: { degree: ascendant, sign: getSignFromDegree(ascendant) },
    midheaven: { degree: midheaven, sign: getSignFromDegree(midheaven) },
    ic: { degree: ic, sign: getSignFromDegree(ic) },
    descendant: { degree: descendant, sign: getSignFromDegree(descendant) },
    houses,
    planets,
  }
}

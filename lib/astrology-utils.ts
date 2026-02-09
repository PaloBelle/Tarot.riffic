export interface BirthChart {
  date: string
  time: string
  location: string
  latitude?: number
  longitude?: number
  placidusChart?: {
    ascendant: { degree: number; sign: string; signSymbol: string }
    midheaven: { degree: number; sign: string; signSymbol: string }
    houses: Array<{
      house: number
      degree: number
      sign: string
      signSymbol: string
    }>
  }
}

export interface PlanetPosition {
  planet: string
  sign: string
  degree: number
  house?: number
}

export interface Transit {
  planet: string
  currentSign: string
  aspect: string
  natalPlanet: string
  interpretation: string
  intensity: "low" | "medium" | "high"
}

// Simplified zodiac sign calculator based on date
export function getZodiacSign(date: Date): string {
  const month = date.getMonth() + 1
  const day = date.getDate()

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries"
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus"
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini"
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer"
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo"
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo"
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra"
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio"
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius"
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn"
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius"
  return "Pisces"
}

// Simulate current planetary transits (in a real app, this would use an ephemeris API)
export function getCurrentTransits(): PlanetPosition[] {
  const now = new Date()
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000)

  // Simplified simulation of planetary positions
  return [
    { planet: "Sun", sign: getZodiacSign(now), degree: dayOfYear % 30 },
    {
      planet: "Moon",
      sign: getZodiacSign(new Date(now.getTime() + dayOfYear * 2.5 * 86400000)),
      degree: (dayOfYear * 13) % 30,
    },
    {
      planet: "Mercury",
      sign: getZodiacSign(new Date(now.getTime() + dayOfYear * 0.3 * 86400000)),
      degree: (dayOfYear * 4) % 30,
    },
    {
      planet: "Venus",
      sign: getZodiacSign(new Date(now.getTime() + dayOfYear * 0.6 * 86400000)),
      degree: (dayOfYear * 1.6) % 30,
    },
    {
      planet: "Mars",
      sign: getZodiacSign(new Date(now.getTime() + dayOfYear * 1.8 * 86400000)),
      degree: (dayOfYear * 0.5) % 30,
    },
    { planet: "Jupiter", sign: "Gemini", degree: 15 },
    { planet: "Saturn", sign: "Pisces", degree: 12 },
    { planet: "Uranus", sign: "Taurus", degree: 23 },
    { planet: "Neptune", sign: "Pisces", degree: 27 },
    { planet: "Pluto", sign: "Aquarius", degree: 2 },
  ]
}

// Calculate aspects between transiting planets and natal chart
export function calculateTransits(birthChart: BirthChart): Transit[] {
  const currentTransits = getCurrentTransits()
  const birthDate = new Date(birthChart.date)
  const sunSign = getZodiacSign(birthDate)

  // Simplified transit interpretations
  const transits: Transit[] = []

  currentTransits.forEach((transit) => {
    if (transit.planet === "Jupiter") {
      transits.push({
        planet: "Jupiter",
        currentSign: transit.sign,
        aspect: "trine",
        natalPlanet: "Sun",
        interpretation:
          "Jupiter brings expansion and opportunities. This is a time of growth and optimism in areas related to your identity and life path.",
        intensity: "high",
      })
    }

    if (transit.planet === "Saturn") {
      transits.push({
        planet: "Saturn",
        currentSign: transit.sign,
        aspect: "square",
        natalPlanet: "Moon",
        interpretation:
          "Saturn challenges you to build emotional maturity and establish boundaries. This transit asks for patience and discipline.",
        intensity: "medium",
      })
    }

    if (transit.planet === "Uranus") {
      transits.push({
        planet: "Uranus",
        currentSign: transit.sign,
        aspect: "sextile",
        natalPlanet: "Mercury",
        interpretation:
          "Uranus stimulates innovative thinking and unexpected insights. Your communication style may become more original and progressive.",
        intensity: "medium",
      })
    }
  })

  return transits
}

// Correlate tarot card with astrological transits
export function correlateTarotWithTransits(cardCorrespondence: string, transits: Transit[]): string {
  const relevantTransits = transits.filter(
    (t) =>
      t.planet.toLowerCase() === cardCorrespondence.toLowerCase() ||
      t.currentSign.toLowerCase() === cardCorrespondence.toLowerCase(),
  )

  if (relevantTransits.length > 0) {
    const transit = relevantTransits[0]
    return `This card's ${cardCorrespondence} energy is amplified by current ${transit.planet} transits in ${transit.currentSign}. ${transit.interpretation}`
  }

  return `The ${cardCorrespondence} energy of this card resonates with your current cosmic weather, suggesting this theme is particularly relevant now.`
}

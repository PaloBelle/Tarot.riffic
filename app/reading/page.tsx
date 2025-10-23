"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Moon, Star, Sparkles, Orbit } from "lucide-react"
import Link from "next/link"
import type { BirthChartData, PlanetaryTransit } from "@/lib/astrology-data"
import { getCurrentTransits, getSunSign } from "@/lib/astrology-data"
import type { TarotCard } from "@/lib/tarot-data"
import { getRandomCards } from "@/lib/tarot-data"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ReadingSummary } from "@/components/reading-summary"

interface IntegratedReading {
  position: "past" | "present" | "future"
  card: TarotCard
  relevantTransits: PlanetaryTransit[]
  interpretation: string
}

export default function ReadingPage() {
  const [birthChartData, setBirthChartData] = useState<BirthChartData | null>(null)
  const [cards, setCards] = useState<TarotCard[]>([])
  const [readings, setReadings] = useState<IntegratedReading[]>([])

  useEffect(() => {
    const stored = localStorage.getItem("birthChartData")
    if (stored) {
      const data = JSON.parse(stored) as BirthChartData
      setBirthChartData(data)
    }

    // Get cards from localStorage or generate new ones
    const storedCards = localStorage.getItem("currentCards")
    const tarotCards = storedCards ? JSON.parse(storedCards) : getRandomCards(3)
    setCards(tarotCards)

    if (stored) {
      const data = JSON.parse(stored) as BirthChartData
      const transits = getCurrentTransits(data)
      generateIntegratedReadings(tarotCards, transits)
    }
  }, [])

  const generateIntegratedReadings = (tarotCards: TarotCard[], transits: PlanetaryTransit[]) => {
    const positions: Array<"past" | "present" | "future"> = ["past", "present", "future"]

    const integratedReadings: IntegratedReading[] = tarotCards.map((card, index) => {
      // Match transits to card based on astrological correspondence
      const relevantTransits = transits.filter((transit) => {
        return (
          transit.planet === card.astrologicalCorrespondence ||
          transit.sign === card.astrologicalCorrespondence ||
          (card.element && transit.sign.toLowerCase().includes(card.element))
        )
      })

      // If no direct match, include first 2 transits
      const selectedTransits = relevantTransits.length > 0 ? relevantTransits.slice(0, 2) : transits.slice(0, 2)

      const interpretation = generateInterpretation(card, selectedTransits[0], positions[index])

      return {
        position: positions[index],
        card,
        relevantTransits: selectedTransits,
        interpretation,
      }
    })

    setReadings(integratedReadings)
  }

  const generateInterpretation = (
    card: TarotCard,
    transit: PlanetaryTransit,
    position: "past" | "present" | "future",
  ): string => {
    const timeContext = {
      past: "In your recent past",
      present: "Currently in your life",
      future: "In your near future",
    }

    return `${timeContext[position]}, ${card.name} appears under the influence of ${transit.planet} in ${transit.sign}. ${card.uprightMeaning}. The planetary energy suggests: ${transit.influence.toLowerCase()} This combination indicates a powerful alignment between your personal journey and cosmic forces, guiding you toward ${card.keywords.slice(0, 2).join(" and ")}.`
  }

  const sunSign = birthChartData ? getSunSign(birthChartData.birthDate) : null

  return (
    <div className="min-h-screen cosmic-bg">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <header className="text-center mb-12 space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold text-balance">Your Cosmic Reading</h1>
            <Star className="w-8 h-8 text-accent" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            {"Tarot wisdom illuminated by your personal astrological transits"}
          </p>
        </header>

        {/* Content */}
        <div className="max-w-5xl mx-auto space-y-8">
          {birthChartData && readings.length > 0 ? (
            <>
              {/* Personal Info Summary */}
              <Card className="bg-card/50 backdrop-blur-sm border-2 border-primary/20">
                <CardContent className="py-6">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-center md:text-left">
                      <p className="text-sm text-muted-foreground">Reading for</p>
                      <p className="text-2xl font-bold text-foreground">{birthChartData.name}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Sun Sign</p>
                        <div className="flex items-center gap-2">
                          <p className="text-lg font-semibold text-foreground">{sunSign?.name || "Unknown"}</p>
                          {sunSign && (
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                              {sunSign.element}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Separator orientation="vertical" className="h-12" />
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Reading Date</p>
                        <p className="text-lg font-semibold text-foreground">
                          {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <ReadingSummary cards={cards} />

              {/* Integrated Readings */}
              <div className="space-y-8">
                {readings.map((reading, index) => (
                  <Card
                    key={index}
                    className="bg-card/50 backdrop-blur-sm border-2 border-primary/20 hover:border-primary/30 transition-colors"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between flex-wrap gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-accent/20 text-accent border-accent/30 uppercase text-xs">
                              {reading.position}
                            </Badge>
                            <CardTitle className="text-2xl text-foreground">{reading.card.name}</CardTitle>
                          </div>
                          <CardDescription className="flex items-center gap-2">
                            <Orbit className="w-4 h-4" />
                            {reading.card.astrologicalCorrespondence}
                            {reading.card.element && ` • ${reading.card.element}`}
                          </CardDescription>
                        </div>
                        <Badge
                          variant="outline"
                          className="bg-secondary/20 text-secondary-foreground border-secondary/30"
                        >
                          {reading.card.arcana === "major" ? "Major Arcana" : "Minor Arcana"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Card Interpretation */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          Integrated Interpretation
                        </h4>
                        <p className="text-foreground leading-relaxed">{reading.interpretation}</p>
                      </div>

                      <Separator className="bg-border/50" />

                      {/* Keywords */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                          Key Themes
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {reading.card.keywords.map((keyword, i) => (
                            <Badge key={i} variant="secondary" className="bg-muted/50 text-foreground">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Relevant Transits */}
                      {reading.relevantTransits.length > 0 && (
                        <>
                          <Separator className="bg-border/50" />
                          <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                              <Moon className="w-4 h-4" />
                              Planetary Influences
                            </h4>
                            <div className="space-y-2">
                              {reading.relevantTransits.map((transit, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                                  <Badge className="bg-primary/20 text-primary border-primary/30 shrink-0">
                                    {transit.planet}
                                  </Badge>
                                  <div className="space-y-1">
                                    <p className="text-sm font-medium text-foreground">
                                      {transit.planet} in {transit.sign} • {transit.aspect}
                                    </p>
                                    <p className="text-sm text-muted-foreground">{transit.influence}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/transits">
                  <Button size="lg" variant="outline" className="bg-transparent">
                    <Orbit className="w-4 h-4 mr-2" />
                    View All Transits
                  </Button>
                </Link>
                <Link href="/">
                  <Button size="lg" className="bg-primary text-primary-foreground">
                    <Sparkles className="w-4 h-4 mr-2" />
                    New Reading
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <Card className="bg-card/50 backdrop-blur-sm border-2 border-primary/20">
              <CardContent className="py-12 text-center space-y-6">
                <Sparkles className="w-16 h-16 mx-auto text-muted-foreground" />
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">No Reading Available</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    {"Draw your tarot cards and enter your birth information to receive your cosmic reading"}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/">
                    <Button size="lg" className="bg-primary text-primary-foreground">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Draw Cards
                    </Button>
                  </Link>
                  <Link href="/birth-chart">
                    <Button size="lg" variant="outline" className="bg-transparent">
                      <Moon className="w-4 h-4 mr-2" />
                      Enter Birth Chart
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

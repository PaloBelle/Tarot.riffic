"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Moon } from "lucide-react"
import type { BirthChart } from "@/lib/astrology-calculator"

export default function ChartPage() {
  const [birthChart, setBirthChart] = useState<BirthChart | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem("birthChart")
    if (stored) {
      try {
        setBirthChart(JSON.parse(stored))
      } catch (err) {
        console.error("[v0] Error loading birth chart:", err)
      }
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen cosmic-bg flex items-center justify-center">
        <div className="text-center">
          <Moon className="w-12 h-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your birth chart...</p>
        </div>
      </div>
    )
  }

  if (!birthChart) {
    return (
      <div className="min-h-screen cosmic-bg flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-foreground mb-4">No Birth Chart Found</h2>
          <p className="text-muted-foreground mb-6">Create your birth chart to see your complete astrological profile.</p>
          <Link href="/birth-chart">
            <Button className="bg-primary">Create Birth Chart</Button>
          </Link>
        </div>
      </div>
    )
  }

  const planetsList = [
    { key: "sun", name: "Sun ☉", meaning: "Core Identity & Life Purpose" },
    { key: "moon", name: "Moon ☽", meaning: "Emotions & Inner Self" },
    { key: "mercury", name: "Mercury ☿", meaning: "Communication & Thinking" },
    { key: "venus", name: "Venus ♀", meaning: "Love & Values" },
    { key: "mars", name: "Mars ♂", meaning: "Action & Desire" },
    { key: "jupiter", name: "Jupiter ♃", meaning: "Expansion & Luck" },
    { key: "saturn", name: "Saturn ♄", meaning: "Discipline & Karma" },
    { key: "uranus", name: "Uranus ♅", meaning: "Innovation & Rebellion" },
    { key: "neptune", name: "Neptune ♆", meaning: "Dreams & Spirituality" },
    { key: "pluto", name: "Pluto ♇", meaning: "Transformation & Power" },
  ]

  return (
    <div className="min-h-screen cosmic-bg">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <header className="text-center mb-8 space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-balance">Your Birth Chart</h1>
          <p className="text-lg text-muted-foreground">
            Tropical Astrology • Placidus House System
          </p>
          <p className="text-muted-foreground">
            {birthChart.name} • {new Date(birthChart.birthDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} at {birthChart.birthTime}
          </p>
          <p className="text-sm text-muted-foreground">{birthChart.birthPlace}</p>
        </header>

        {/* Key Angles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card/50 backdrop-blur border-primary/20">
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold text-primary">{birthChart.ascendant.sign.symbol}</p>
              <p className="text-sm text-foreground font-semibold">Ascendant</p>
              <p className="text-xs text-muted-foreground">{birthChart.ascendant.sign.name}</p>
              <p className="text-xs text-muted-foreground">{birthChart.ascendant.degree.toFixed(1)}°</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-accent/20">
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold text-accent">{birthChart.midheaven.sign.symbol}</p>
              <p className="text-sm text-foreground font-semibold">Midheaven</p>
              <p className="text-xs text-muted-foreground">{birthChart.midheaven.sign.name}</p>
              <p className="text-xs text-muted-foreground">{birthChart.midheaven.degree.toFixed(1)}°</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-primary/20">
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold text-foreground">{birthChart.descendant.sign.symbol}</p>
              <p className="text-sm text-foreground font-semibold">Descendant</p>
              <p className="text-xs text-muted-foreground">{birthChart.descendant.sign.name}</p>
              <p className="text-xs text-muted-foreground">{birthChart.descendant.degree.toFixed(1)}°</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-accent/20">
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold text-foreground">{birthChart.ic.sign.symbol}</p>
              <p className="text-sm text-foreground font-semibold">Imum Coeli</p>
              <p className="text-xs text-muted-foreground">{birthChart.ic.sign.name}</p>
              <p className="text-xs text-muted-foreground">{birthChart.ic.degree.toFixed(1)}°</p>
            </CardContent>
          </Card>
        </div>

        {/* All 12 Houses */}
        <Card className="bg-card/50 backdrop-blur border-2 border-primary/20 mb-8">
          <CardHeader>
            <CardTitle>12 Houses (Placidus System)</CardTitle>
            <CardDescription>Your life areas and experiences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {birthChart.houses.map((house) => (
                <div key={house.house} className="p-3 rounded-lg bg-card border border-primary/10">
                  <p className="text-xs text-muted-foreground font-semibold">House {house.house}</p>
                  <p className="text-lg font-bold text-foreground">{house.sign.symbol}</p>
                  <p className="text-sm text-foreground">{house.sign.name}</p>
                  <p className="text-xs text-muted-foreground">{house.degree.toFixed(1)}°</p>
                </div>
              ))}
            </div>

            {/* House Meanings */}
            <div className="mt-6 pt-6 border-t border-primary/20 space-y-2 text-sm text-muted-foreground">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <p><span className="font-semibold">1:</span> Self, Appearance, First Impressions</p>
                <p><span className="font-semibold">2:</span> Finances, Values, Possessions</p>
                <p><span className="font-semibold">3:</span> Communication, Siblings, Short Trips</p>
                <p><span className="font-semibold">4:</span> Home, Family, Foundation, Roots</p>
                <p><span className="font-semibold">5:</span> Creativity, Romance, Self-Expression</p>
                <p><span className="font-semibold">6:</span> Work, Health, Daily Routines</p>
                <p><span className="font-semibold">7:</span> Relationships, Partnerships, Marriage</p>
                <p><span className="font-semibold">8:</span> Transformation, Intimacy, Shared Resources</p>
                <p><span className="font-semibold">9:</span> Higher Learning, Travel, Philosophy</p>
                <p><span className="font-semibold">10:</span> Career, Public Image, Legacy</p>
                <p><span className="font-semibold">11:</span> Friendships, Groups, Future Goals</p>
                <p><span className="font-semibold">12:</span> Spirituality, Subconscious, Hidden Matters</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Planets */}
        <Card className="bg-card/50 backdrop-blur border-2 border-primary/20 mb-8">
          <CardHeader>
            <CardTitle>Planetary Positions (Tropical Astrology)</CardTitle>
            <CardDescription>Your planetary placements in signs and houses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {planetsList.map(({ key, name, meaning }) => {
                const planet = birthChart.planets[key]
                if (!planet) return null

                return (
                  <div key={key} className="p-4 rounded-lg bg-card border border-primary/10 hover:border-primary/30 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="text-2xl">{planet.symbol}</div>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{name}</p>
                          <p className="text-sm text-muted-foreground">{meaning}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <p className="text-lg font-bold text-foreground">{planet.sign.symbol}</p>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{planet.sign.name}</p>
                            <p className="text-xs text-muted-foreground">{planet.degree.toFixed(1)}°</p>
                            <p className="text-xs text-accent font-semibold">House {planet.house}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex gap-4 justify-center mb-8">
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Reading
            </Button>
          </Link>
          <Link href="/birth-chart">
            <Button className="bg-primary">
              Update Birth Chart
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

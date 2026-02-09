"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Moon, Star, ArrowLeft, Orbit } from "lucide-react"
import Link from "next/link"
import type { BirthChartData, PlanetaryTransit } from "@/lib/astrology-data"
import { getCurrentTransits, getSunSign } from "@/lib/astrology-data"
import { Badge } from "@/components/ui/badge"

export default function TransitsPage() {
  const [birthChartData, setBirthChartData] = useState<BirthChartData | null>(null)
  const [transits, setTransits] = useState<PlanetaryTransit[]>([])

  useEffect(() => {
    const stored = localStorage.getItem("birthChartData")
    if (stored) {
      const data = JSON.parse(stored) as BirthChartData
      setBirthChartData(data)
      setTransits(getCurrentTransits(data))
    }
  }, [])

  const sunSign = birthChartData ? getSunSign(birthChartData.birthDate) : null

  return (
    <div className="min-h-screen cosmic-bg">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <header className="text-center mb-12 space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Orbit className="w-8 h-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold text-balance">Current Transits</h1>
            <Star className="w-8 h-8 text-accent" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            {"Explore the current planetary movements and their influence on your birth chart"}
          </p>
        </header>

        {/* Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          {birthChartData ? (
            <>
              {/* Birth Chart Summary */}
              <Card className="bg-card/50 backdrop-blur-sm border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Moon className="w-5 h-5 text-primary" />
                    Your Birth Chart
                  </CardTitle>
                  <CardDescription>Personal astrological information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="text-lg font-semibold text-foreground">{birthChartData.name}</p>
                    </div>
                    <div>
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
                    <div>
                      <p className="text-sm text-muted-foreground">Birth Date</p>
                      <p className="text-lg font-semibold text-foreground">
                        {new Date(birthChartData.birthDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Birth Time</p>
                      <p className="text-lg font-semibold text-foreground">{birthChartData.birthTime}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground">Birth Place</p>
                      <p className="text-lg font-semibold text-foreground">{birthChartData.birthPlace}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Planetary Transits */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <Orbit className="w-6 h-6 text-accent" />
                  Active Planetary Transits
                </h2>
                <div className="grid gap-4">
                  {transits.map((transit, index) => (
                    <Card
                      key={index}
                      className="bg-card/50 backdrop-blur-sm border border-primary/20 hover:border-primary/40 transition-colors"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <CardTitle className="text-xl text-foreground">
                              {transit.planet} in {transit.sign}
                            </CardTitle>
                            <CardDescription>
                              House {transit.house} • {transit.aspect}
                            </CardDescription>
                          </div>
                          <Badge className="bg-accent/20 text-accent border-accent/30">{transit.planet}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed">{transit.influence}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/reading">
                  <Button size="lg" className="bg-primary text-primary-foreground">
                    <Star className="w-4 h-4 mr-2" />
                    View Integrated Reading
                  </Button>
                </Link>
                <Link href="/">
                  <Button size="lg" variant="outline" className="bg-transparent">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Cards
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <Card className="bg-card/50 backdrop-blur-sm border-2 border-primary/20">
              <CardContent className="py-12 text-center space-y-6">
                <Moon className="w-16 h-16 mx-auto text-muted-foreground" />
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">No Birth Chart Data</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    {"Please enter your birth information to view your current astrological transits"}
                  </p>
                </div>
                <Link href="/birth-chart">
                  <Button size="lg" className="bg-primary text-primary-foreground">
                    <Star className="w-4 h-4 mr-2" />
                    Enter Birth Chart
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

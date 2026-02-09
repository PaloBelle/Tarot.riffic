"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Moon, Star, ArrowLeft, MapPin, Loader } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

function convertToDecimal(degrees: number, minutes = 0, seconds = 0, isWest = false): number {
  const decimal = degrees + minutes / 60 + seconds / 3600
  return isWest ? -decimal : decimal
}

function convertDecimalToDMS(decimal: number): {
  degrees: number
  minutes: number
  seconds: number
  direction: string
} {
  const isNegative = decimal < 0
  const abs = Math.abs(decimal)
  const degrees = Math.floor(abs)
  const minutesDecimal = (abs - degrees) * 60
  const minutes = Math.floor(minutesDecimal)
  const seconds = Math.round((minutesDecimal - minutes) * 60 * 100) / 100

  return {
    degrees,
    minutes,
    seconds,
    direction: isNegative ? (decimal < 0 ? "S" : "W") : "N",
  }
}

export default function BirthChartPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    birthTime: "",
    birthPlace: "",
  })

  const [coordinates, setCoordinates] = useState<{
    latitude: { degrees: number; minutes: number; seconds: number; direction: string }
    longitude: { degrees: number; minutes: number; seconds: number; direction: string }
    decimalLat: number
    decimalLon: number
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const fetchCoordinates = async () => {
    if (!formData.birthPlace.trim()) {
      setError("Please enter a birth place")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(formData.birthPlace)}&format=json&limit=1`,
      )

      if (!response.ok) {
        throw new Error("Failed to fetch coordinates")
      }

      const data = await response.json()

      if (data.length === 0) {
        setError("Location not found. Please check the spelling and try again.")
        setCoordinates(null)
        return
      }

      const result = data[0]
      const decimalLat = Number.parseFloat(result.lat)
      const decimalLon = Number.parseFloat(result.lon)

      const latitude = convertDecimalToDMS(decimalLat)
      const longitude = convertDecimalToDMS(decimalLon)

      // Adjust direction for longitude
      longitude.direction = decimalLon < 0 ? "W" : "E"

      setCoordinates({
        latitude,
        longitude,
        decimalLat,
        decimalLon,
      })
      setError("")
    } catch (err) {
      setError("Unable to fetch coordinates. Please check your internet connection.")
      console.error("[v0] Geocoding error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!coordinates) {
      setError("Please fetch coordinates for your birth place")
      return
    }

    // Store birth chart data with automatic coordinates (decimal format for calculations)
    localStorage.setItem(
      "birthChartData",
      JSON.stringify({
        ...formData,
        latitude: coordinates.decimalLat,
        longitude: coordinates.decimalLon,
      }),
    )
    router.push("/")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
    if (e.target.name === "birthPlace") {
      setCoordinates(null)
      setError("")
    }
  }

  return (
    <div className="min-h-screen cosmic-bg">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <header className="text-center mb-12 space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Moon className="w-8 h-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold text-balance">Birth Chart Information</h1>
            <Star className="w-8 h-8 text-accent" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            {
              "Enter your birth details to align your tarot reading with your personal astrological transits (Tropical Astrology)"
            }
          </p>
        </header>

        {/* Form */}
        <div className="max-w-2xl mx-auto">
          <Card className="bg-card/50 backdrop-blur-sm border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">Your Cosmic Blueprint</CardTitle>
              <CardDescription>
                {"Provide accurate birth information for the most precise astrological insights"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="bg-background/50 border-border"
                  />
                </div>

                {/* Birth Date */}
                <div className="space-y-2">
                  <Label htmlFor="birthDate" className="text-foreground">
                    Birth Date
                  </Label>
                  <Input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={handleChange}
                    required
                    className="bg-background/50 border-border"
                  />
                </div>

                {/* Birth Time */}
                <div className="space-y-2">
                  <Label htmlFor="birthTime" className="text-foreground">
                    Birth Time
                  </Label>
                  <Input
                    id="birthTime"
                    name="birthTime"
                    type="time"
                    value={formData.birthTime}
                    onChange={handleChange}
                    required
                    className="bg-background/50 border-border"
                  />
                  <p className="text-xs text-muted-foreground">
                    {"Accurate birth time is essential for calculating your rising sign and house placements"}
                  </p>
                </div>

                {/* Birth Place */}
                <div className="space-y-3">
                  <Label htmlFor="birthPlace" className="text-foreground">
                    Birth Place
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="birthPlace"
                      name="birthPlace"
                      type="text"
                      placeholder="City, Country (e.g., New York, USA)"
                      value={formData.birthPlace}
                      onChange={handleChange}
                      required
                      className="bg-background/50 border-border flex-1"
                    />
                    <Button
                      type="button"
                      onClick={fetchCoordinates}
                      disabled={loading}
                      className="bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      {loading ? <Loader className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
                    </Button>
                  </div>

                  {coordinates && (
                    <div className="p-3 rounded-lg bg-accent/10 border border-accent/20 space-y-2">
                      <p className="text-sm text-foreground font-semibold flex items-center gap-2">
                        <Star className="w-4 h-4 text-accent" />
                        Coordinates Located (Tropical Astrology)
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Latitude:{" "}
                        <span className="text-foreground">
                          {coordinates.latitude.degrees}° {coordinates.latitude.minutes}
                          {`'`} {coordinates.latitude.seconds}
                          {`"`} {coordinates.latitude.direction}
                        </span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Longitude:{" "}
                        <span className="text-foreground">
                          {coordinates.longitude.degrees}° {coordinates.longitude.minutes}
                          {`'`} {coordinates.longitude.seconds}
                          {`"`} {coordinates.longitude.direction}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground italic">
                        Decimal: {coordinates.decimalLat.toFixed(6)}°, {coordinates.decimalLon.toFixed(6)}°
                      </p>
                    </div>
                  )}

                  {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                      <p className="text-sm text-red-400">{error}</p>
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button type="submit" size="lg" className="flex-1 bg-primary text-primary-foreground">
                    <Star className="w-4 h-4 mr-2" />
                    Save Birth Chart
                  </Button>
                  <Link href="/" className="flex-1">
                    <Button type="button" size="lg" variant="outline" className="w-full bg-transparent">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Reading
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

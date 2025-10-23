"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Moon, Star, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function BirthChartPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    birthTime: "",
    birthPlace: "",
    latitude: "",
    longitude: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Store birth chart data in localStorage for now
    localStorage.setItem("birthChartData", JSON.stringify(formData))
    router.push("/")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
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
            {"Enter your birth details to align your tarot reading with your personal astrological transits"}
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
                <div className="space-y-2">
                  <Label htmlFor="birthPlace" className="text-foreground">
                    Birth Place
                  </Label>
                  <Input
                    id="birthPlace"
                    name="birthPlace"
                    type="text"
                    placeholder="City, Country"
                    value={formData.birthPlace}
                    onChange={handleChange}
                    required
                    className="bg-background/50 border-border"
                  />
                </div>

                {/* Coordinates */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude" className="text-foreground">
                      Latitude
                    </Label>
                    <Input
                      id="latitude"
                      name="latitude"
                      type="number"
                      step="0.0001"
                      placeholder="40.7128"
                      value={formData.latitude}
                      onChange={handleChange}
                      required
                      className="bg-background/50 border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude" className="text-foreground">
                      Longitude
                    </Label>
                    <Input
                      id="longitude"
                      name="longitude"
                      type="number"
                      step="0.0001"
                      placeholder="-74.0060"
                      value={formData.longitude}
                      onChange={handleChange}
                      required
                      className="bg-background/50 border-border"
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {"You can find coordinates by searching your birth city on Google Maps"}
                </p>

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

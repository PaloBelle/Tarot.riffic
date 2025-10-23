"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, TrendingUp, TrendingDown, Minus } from "lucide-react"
import type { TarotCard } from "@/lib/tarot-data"

interface ReadingSummaryProps {
  cards: TarotCard[]
}

export function ReadingSummary({ cards }: ReadingSummaryProps) {
  // Analyze overall energy of the reading
  const getOverallEnergy = () => {
    const positiveKeywords = [
      "success",
      "love",
      "hope",
      "strength",
      "abundance",
      "joy",
      "harmony",
      "renewal",
      "manifestation",
    ]
    const challengingKeywords = ["chaos", "fear", "bondage", "upheaval", "illusion", "endings"]

    let positiveCount = 0
    let challengingCount = 0

    cards.forEach((card) => {
      card.keywords.forEach((keyword) => {
        if (positiveKeywords.some((pk) => keyword.toLowerCase().includes(pk))) positiveCount++
        if (challengingKeywords.some((ck) => keyword.toLowerCase().includes(ck))) challengingCount++
      })
    })

    if (positiveCount > challengingCount) return "positive"
    if (challengingCount > positiveCount) return "challenging"
    return "balanced"
  }

  const energy = getOverallEnergy()

  const energyConfig = {
    positive: {
      icon: TrendingUp,
      label: "Positive Energy",
      description: "Your reading shows favorable cosmic alignments and opportunities for growth",
      color: "text-green-400",
      bgColor: "bg-green-400/10",
      borderColor: "border-green-400/30",
    },
    challenging: {
      icon: TrendingDown,
      label: "Transformative Energy",
      description: "Your reading indicates challenges that will lead to important personal transformation",
      color: "text-orange-400",
      bgColor: "bg-orange-400/10",
      borderColor: "border-orange-400/30",
    },
    balanced: {
      icon: Minus,
      label: "Balanced Energy",
      description: "Your reading shows a harmonious mix of opportunities and lessons to learn",
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
      borderColor: "border-blue-400/30",
    },
  }

  const config = energyConfig[energy]
  const Icon = config.icon

  // Get dominant elements
  const elements = cards.map((card) => card.element).filter(Boolean)
  const elementCounts = elements.reduce(
    (acc, el) => {
      if (el) acc[el] = (acc[el] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )
  const dominantElement = Object.entries(elementCounts).sort((a, b) => b[1] - a[1])[0]?.[0]

  const elementMeanings: Record<string, string> = {
    fire: "Passion, action, and creative energy dominate your reading",
    water: "Emotions, intuition, and spiritual depth guide your path",
    air: "Intellect, communication, and mental clarity are emphasized",
    earth: "Practicality, stability, and material concerns are highlighted",
  }

  return (
    <Card className={`bg-card/50 backdrop-blur-sm border-2 ${config.borderColor}`}>
      <CardContent className="py-6 space-y-6">
        {/* Overall Energy */}
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-lg ${config.bgColor}`}>
            <Icon className={`w-6 h-6 ${config.color}`} />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-foreground">{config.label}</h3>
              <Badge variant="outline" className={`${config.bgColor} ${config.color} border-current`}>
                Overall Theme
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{config.description}</p>
          </div>
        </div>

        {/* Dominant Element */}
        {dominantElement && (
          <div className="flex items-start gap-4 pt-4 border-t border-border/50">
            <div className="p-3 rounded-lg bg-primary/10">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-foreground capitalize">{dominantElement} Element</h3>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                  Dominant
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{elementMeanings[dominantElement]}</p>
            </div>
          </div>
        )}

        {/* Card Count by Arcana */}
        <div className="flex items-center justify-around pt-4 border-t border-border/50">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{cards.filter((c) => c.arcana === "major").length}</p>
            <p className="text-xs text-muted-foreground">Major Arcana</p>
          </div>
          <div className="h-12 w-px bg-border" />
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{cards.length}</p>
            <p className="text-xs text-muted-foreground">Total Cards</p>
          </div>
          <div className="h-12 w-px bg-border" />
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{new Set(elements).size}</p>
            <p className="text-xs text-muted-foreground">Elements</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

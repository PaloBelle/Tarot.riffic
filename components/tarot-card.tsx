"use client"

import type { TarotCard as TarotCardType } from "@/lib/tarot-data"
import { Card } from "@/components/ui/card"
import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface TarotCardProps {
  card?: TarotCardType
  isRevealed?: boolean
  onClick?: () => void
  className?: string
}

export function TarotCard({ card, isRevealed = false, onClick, className }: TarotCardProps) {
  return (
    <Card
      className={cn(
        "relative w-full aspect-[2/3] cursor-pointer transition-all duration-500 hover:scale-105",
        "bg-card border-2 border-primary/20 hover:border-primary/50",
        "shadow-lg hover:shadow-primary/20",
        isRevealed ? "animate-flip-in" : "",
        className,
      )}
      onClick={onClick}
    >
      {!isRevealed ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-secondary via-secondary/80 to-accent/30 rounded-lg">
          <div className="text-center space-y-4">
            <Sparkles className="w-12 h-12 mx-auto text-primary animate-pulse" />
            <p className="text-sm text-muted-foreground font-medium">Tap to Reveal</p>
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        </div>
      ) : card ? (
        <div className="absolute inset-0 p-6 flex flex-col items-center justify-between bg-gradient-to-br from-card via-card to-secondary/20 rounded-lg">
          <div className="text-center space-y-2">
            <div className="text-xs text-primary font-semibold tracking-wider uppercase">
              {card.arcana === "major" ? "Major Arcana" : "Minor Arcana"}
            </div>
            <h3 className="text-xl font-bold text-foreground">{card.name}</h3>
            {card.number !== undefined && <div className="text-sm text-muted-foreground">{card.number}</div>}
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border-2 border-primary/30">
              <Sparkles className="w-12 h-12 text-primary" />
            </div>
          </div>

          <div className="text-center space-y-1">
            <div className="text-xs text-accent font-medium">{card.astrologicalCorrespondence}</div>
            {card.element && <div className="text-xs text-muted-foreground">Element: {card.element}</div>}
          </div>
        </div>
      ) : null}
    </Card>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TarotCard } from "@/components/tarot-card"
import { getRandomCards } from "@/lib/tarot-data"
import { Sparkles, Moon, Star } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [cards, setCards] = useState(getRandomCards(3))
  const [revealedCards, setRevealedCards] = useState<boolean[]>([false, false, false])
  const [hasStarted, setHasStarted] = useState(false)

  const handleCardClick = (index: number) => {
    if (!hasStarted) return
    setRevealedCards((prev) => {
      const newRevealed = [...prev]
      newRevealed[index] = true
      return newRevealed
    })
  }

  const handleStartReading = () => {
    setHasStarted(true)
    const newCards = getRandomCards(3)
    setCards(newCards)
    setRevealedCards([false, false, false])
    localStorage.setItem("currentCards", JSON.stringify(newCards))
  }

  const handleClearAll = () => {
    localStorage.clear()
    console.log("[v0] All birth chart data cleared from localStorage")
    setHasStarted(false)
    setCards(getRandomCards(3))
    setRevealedCards([false, false, false])
  }

  const allRevealed = revealedCards.every((r) => r)

  return (
    <div className="min-h-screen cosmic-bg">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <header className="text-center mb-16 space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Moon className="w-8 h-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold text-balance">Cosmic Tarot Reading</h1>
            <Star className="w-8 h-8 text-accent" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            {"Discover the wisdom of the cards aligned with the celestial energies of your birth chart"}
          </p>
        </header>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto space-y-12">
          {!hasStarted ? (
            <div className="text-center space-y-8">
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-12 space-y-6">
                <Sparkles className="w-16 h-16 mx-auto text-primary animate-pulse" />
                <h2 className="text-2xl font-semibold">Begin Your Journey</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {
                    "Draw three cards to receive guidance from the cosmos. Each card will be interpreted in the context of your personal astrological transits."
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button
                    size="lg"
                    onClick={handleStartReading}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Draw Cards
                  </Button>
                  <Link href="/chart">
                    <Button size="lg" variant="outline">
                      <Moon className="w-4 h-4 mr-2" />
                      View Birth Chart
                    </Button>
                  </Link>
                  <Link href="/birth-chart">
                    <Button size="lg" variant="outline">
                      <Star className="w-4 h-4 mr-2" />
                      Create Birth Chart
                    </Button>
                  </Link>
                  <Button size="lg" variant="destructive" onClick={handleClearAll}>
                    Clear All Data
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Three Card Spread */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {cards.map((card, index) => (
                  <div key={card.id} className="space-y-4">
                    <div className="text-center">
                      <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">
                        {index === 0 ? "Past" : index === 1 ? "Present" : "Future"}
                      </h3>
                    </div>
                    <TarotCard card={card} isRevealed={revealedCards[index]} onClick={() => handleCardClick(index)} />
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {allRevealed ? (
                  <>
                    <Link href="/reading">
                      <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                        <Star className="w-4 h-4 mr-2" />
                        View Full Reading
                      </Button>
                    </Link>
                    <Button size="lg" variant="outline" onClick={handleStartReading}>
                      Draw New Cards
                    </Button>
                  </>
                ) : (
                  <p className="text-center text-muted-foreground">{"Tap each card to reveal your reading..."}</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

import type { GameScore } from "@/app/page"

// Mock Firebase implementation for demo
// In a real app, you would use actual Firebase SDK

const STORAGE_KEY = "speedRacerScores"

// Simulate Firebase delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function saveScore(score: GameScore): Promise<void> {
  await delay(500) // Simulate network delay

  try {
    const existingScores = getStoredScores()
    const newScore = {
      ...score,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    }

    const updatedScores = [...existingScores, newScore]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedScores))
  } catch (error) {
    throw new Error("Failed to save score")
  }
}

export async function getTopScores(limit = 10): Promise<GameScore[]> {
  await delay(300) // Simulate network delay

  try {
    const scores = getStoredScores()
    return scores
      .sort((a, b) => {
        // Sort by level first, then by score
        if (a.level !== b.level) {
          return b.level - a.level
        }
        return b.score - a.score
      })
      .slice(0, limit)
  } catch (error) {
    throw new Error("Failed to load scores")
  }
}

function getStoredScores(): GameScore[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

// Initialize with some demo scores
if (typeof window !== "undefined" && !localStorage.getItem(STORAGE_KEY)) {
  const demoScores: GameScore[] = [
    {
      id: "1",
      playerName: "Speed Master",
      score: 15000,
      timeSurvived: 180,
      level: 15,
      timestamp: Date.now() - 86400000,
    },
    {
      id: "2",
      playerName: "Road Warrior",
      score: 12500,
      timeSurvived: 150,
      level: 14,
      timestamp: Date.now() - 172800000,
    },
    {
      id: "3",
      playerName: "Speed Demon",
      score: 8500,
      timeSurvived: 120,
      level: 12,
      timestamp: Date.now() - 259200000,
    },
    {
      id: "4",
      playerName: "Turbo Racer",
      score: 5200,
      timeSurvived: 85,
      level: 9,
      timestamp: Date.now() - 345600000,
    },
    {
      id: "5",
      playerName: "Highway Hero",
      score: 2800,
      timeSurvived: 65,
      level: 6,
      timestamp: Date.now() - 432000000,
    },
  ]

  localStorage.setItem(STORAGE_KEY, JSON.stringify(demoScores))
}

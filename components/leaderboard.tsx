"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import type { GameScore } from "@/app/page"
import { getTopScores } from "@/lib/firebase"
import { ArrowLeft, Trophy, Clock, Target } from "lucide-react"

interface LeaderboardProps {
  onGoBack: () => void
}

export default function Leaderboard({ onGoBack }: LeaderboardProps) {
  const [scores, setScores] = useState<GameScore[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<"score" | "time">("score")

  useEffect(() => {
    loadScores()
  }, [])

  const loadScores = async () => {
    setLoading(true)
    try {
      const topScores = await getTopScores(10)
      setScores(topScores)
    } catch (error) {
      console.error("Failed to load scores:", error)
    } finally {
      setLoading(false)
    }
  }

  const sortedScores = [...scores].sort((a, b) => {
    if (sortBy === "score") {
      return b.score - a.score
    } else {
      return b.timeSurvived - a.timeSurvived
    }
  })

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString()
  }

  return (
    <div className="p-6 min-h-[500px]">
      <div className="flex items-center justify-between mb-6">
        <Button
          onClick={onGoBack}
          variant="outline"
          className="border-gray-500 text-gray-400 hover:bg-gray-500/10 bg-transparent"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Trophy className="w-6 h-6 mr-2 text-yellow-400" />
          Leaderboard
        </h2>
        <div className="w-20" /> {/* Spacer */}
      </div>

      <div className="flex justify-center mb-4 gap-2">
        <Button
          onClick={() => setSortBy("score")}
          variant={sortBy === "score" ? "default" : "outline"}
          size="sm"
          className={sortBy === "score" ? "bg-yellow-600" : "border-gray-500 text-gray-400"}
        >
          <Target className="w-4 h-4 mr-1" />
          By Score
        </Button>
        <Button
          onClick={() => setSortBy("time")}
          variant={sortBy === "time" ? "default" : "outline"}
          size="sm"
          className={sortBy === "time" ? "bg-blue-600" : "border-gray-500 text-gray-400"}
        >
          <Clock className="w-4 h-4 mr-1" />
          By Time
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="text-white">Loading scores...</div>
        </div>
      ) : scores.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🏁</div>
          <p className="text-gray-400">No scores yet!</p>
          <p className="text-gray-500 text-sm mt-2">Be the first to set a record!</p>
        </div>
      ) : (
        <div className="space-y-2 max-w-2xl mx-auto">
          {sortedScores.map((score, index) => (
            <div
              key={score.id || index}
              className={`flex items-center justify-between p-4 rounded-lg border ${
                index === 0
                  ? "bg-yellow-600/20 border-yellow-500/30"
                  : index === 1
                    ? "bg-gray-400/20 border-gray-400/30"
                    : index === 2
                      ? "bg-orange-600/20 border-orange-500/30"
                      : "bg-black/20 border-white/10"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold text-white min-w-[2rem]">
                  {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                </div>
                <div>
                  <div className="font-semibold text-white">{score.playerName}</div>
                  <div className="text-sm text-gray-400">{formatDate(score.timestamp)}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-bold text-yellow-400">{score.score.toLocaleString()} pts</div>
                <div className="text-sm text-blue-400">{score.timeSurvived}s survived</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && scores.length > 0 && (
        <div className="text-center mt-6 text-gray-400 text-sm">Showing top {scores.length} scores</div>
      )}
    </div>
  )
}

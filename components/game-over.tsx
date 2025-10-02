"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { GameScore, LevelData } from "@/app/page"
import { saveScore } from "@/lib/firebase"
import { Play, Home, Trophy } from "lucide-react"

interface GameOverProps {
  score: GameScore
  levelData: LevelData
  onPlayAgain: () => void
  onGoToMenu: () => void
  onShowLeaderboard: () => void
}

export default function GameOver({ score, levelData, onPlayAgain, onGoToMenu, onShowLeaderboard }: GameOverProps) {
  const [playerName, setPlayerName] = useState("")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSaveScore = async () => {
    if (!playerName.trim()) return

    setSaving(true)
    try {
      await saveScore({
        ...score,
        playerName: playerName.trim(),
      })
      setSaved(true)
    } catch (error) {
      console.error("Failed to save score:", error)
    } finally {
      setSaving(false)
    }
  }

  const isLevelFailed = score.score < levelData.targetScore || score.overtakes < levelData.targetOvertakes

  return (
    <div className="p-4 sm:p-8 text-center min-h-[500px] flex flex-col justify-center">
      <div className="mb-6">
        <div className="text-4xl sm:text-6xl mb-4">{isLevelFailed ? "💥" : "🏁"}</div>
        <h2 className="text-2xl sm:text-3xl font-bold text-red-400 mb-2">
          {isLevelFailed ? "Level Failed!" : "Game Over!"}
        </h2>
        <p className="text-sm sm:text-base text-gray-300">
          {isLevelFailed
            ? `You needed ${levelData.targetScore.toLocaleString()} points and ${levelData.targetOvertakes} overtakes to pass Level ${levelData.level}`
            : "You crashed into traffic!"}
        </p>
        <p className="text-sm sm:text-lg text-yellow-400 font-semibold mt-2">
          Level {levelData.level}: {levelData.name}
        </p>
      </div>

      <div className="bg-black/30 rounded-lg p-4 sm:p-6 mb-6 max-w-sm mx-auto">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Final Score</h3>
        <div className="space-y-2 text-left text-sm sm:text-base">
          <div className="flex justify-between">
            <span className="text-gray-300">Score:</span>
            <span className="text-yellow-400 font-bold">{score.score.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Target:</span>
            <span className={`font-bold ${score.score >= levelData.targetScore ? "text-green-400" : "text-red-400"}`}>
              {levelData.targetScore.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Coins:</span>
            <span className="text-blue-400 font-bold">{score.coins}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Overtakes:</span>
            <span
              className={`font-bold ${score.overtakes >= levelData.targetOvertakes ? "text-green-400" : "text-red-400"}`}
            >
              {score.overtakes}/{levelData.targetOvertakes}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Time Survived:</span>
            <span className="text-cyan-400 font-bold">{score.timeSurvived}s</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Level:</span>
            <span className="text-purple-400 font-bold">{score.level}</span>
          </div>
        </div>

        {/* Progress bars */}
        <div className="mt-4 space-y-2">
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Score Progress</span>
              <span>{Math.min(100, Math.floor((score.score / levelData.targetScore) * 100))}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  score.score >= levelData.targetScore ? "bg-green-500" : "bg-yellow-500"
                }`}
                style={{ width: `${Math.min(100, (score.score / levelData.targetScore) * 100)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Overtake Progress</span>
              <span>{Math.min(100, Math.floor((score.overtakes / levelData.targetOvertakes) * 100))}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  score.overtakes >= levelData.targetOvertakes ? "bg-green-500" : "bg-blue-500"
                }`}
                style={{ width: `${Math.min(100, (score.overtakes / levelData.targetOvertakes) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {!saved && (
        <div className="mb-6 max-w-sm mx-auto">
          <h4 className="text-lg font-semibold text-white mb-3">Save Your Score</h4>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="bg-black/20 border-white/20 text-white placeholder-gray-400 text-sm"
              maxLength={20}
            />
            <Button
              onClick={handleSaveScore}
              disabled={!playerName.trim() || saving}
              className="bg-blue-600 hover:bg-blue-700 text-sm"
            >
              {saving ? "..." : "Save"}
            </Button>
          </div>
        </div>
      )}

      {saved && (
        <div className="mb-6 p-4 bg-green-600/20 border border-green-500/30 rounded-lg max-w-sm mx-auto">
          <p className="text-green-400 font-semibold">✅ Score saved successfully!</p>
        </div>
      )}

      <div className="space-y-3 max-w-xs mx-auto">
        <Button onClick={onPlayAgain} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold" size="lg">
          <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          Try Again
        </Button>

        <Button
          onClick={onShowLeaderboard}
          variant="outline"
          className="w-full border-yellow-500 text-yellow-400 hover:bg-yellow-500/10 bg-transparent"
        >
          <Trophy className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          View Leaderboard
        </Button>

        <Button
          onClick={onGoToMenu}
          variant="outline"
          className="w-full border-gray-500 text-gray-400 hover:bg-gray-500/10 bg-transparent"
        >
          <Home className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          Main Menu
        </Button>
      </div>

      {isLevelFailed && (
        <div className="mt-6 text-center text-gray-400 text-xs sm:text-sm">
          <p>💡 Tip: Focus on overtaking cars safely and use nitro boost wisely!</p>
        </div>
      )}
    </div>
  )
}

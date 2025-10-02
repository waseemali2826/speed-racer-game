"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { GameScore, LevelData } from "@/app/page"
import { saveScore } from "@/lib/firebase"
import { Play, Home, Car } from "lucide-react"

interface LevelCompleteProps {
  score: GameScore
  levelData: LevelData
  nextLevelData: LevelData | null
  onNextLevel: () => void
  onGoToMenu: () => void
  unlockedCars: number
}

export default function LevelComplete({
  score,
  levelData,
  nextLevelData,
  onNextLevel,
  onGoToMenu,
  unlockedCars,
}: LevelCompleteProps) {
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

  const newCarUnlocked = Math.floor((levelData.level + 2) / 3) + 1 <= unlockedCars && levelData.level % 3 === 0

  return (
    <div className="p-4 sm:p-8 text-center min-h-[600px] flex flex-col justify-center">
      <div className="mb-6">
        <div className="text-6xl sm:text-8xl mb-4">🏆</div>
        <h2 className="text-2xl sm:text-4xl font-bold text-green-400 mb-2">Level Complete!</h2>
        <p className="text-lg sm:text-xl text-gray-300">You conquered Level {levelData.level}!</p>
        <p className="text-sm sm:text-lg text-yellow-400 font-semibold">{levelData.name}</p>
      </div>

      {newCarUnlocked && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg border border-blue-500/30 max-w-md mx-auto">
          <div className="text-4xl mb-2">🚗</div>
          <h3 className="text-lg font-bold text-blue-400 mb-2">New Car Unlocked!</h3>
          <p className="text-sm text-gray-300">You can now select a new car in the garage!</p>
        </div>
      )}

      <div className="bg-black/30 rounded-lg p-4 sm:p-6 mb-6 max-w-md mx-auto">
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Level Results</h3>
        <div className="space-y-2 sm:space-y-3 text-left text-sm sm:text-base">
          <div className="flex justify-between">
            <span className="text-gray-300">Final Score:</span>
            <span className="text-yellow-400 font-bold">{score.score.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Target Score:</span>
            <span className="text-green-400 font-bold">{levelData.targetScore.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Coins Earned:</span>
            <span className="text-blue-400 font-bold">{score.coins}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Overtakes:</span>
            <span className="text-purple-400 font-bold">
              {score.overtakes}/{levelData.targetOvertakes}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Time Survived:</span>
            <span className="text-cyan-400 font-bold">{score.timeSurvived}s</span>
          </div>
        </div>

        {/* Performance Rating */}
        <div className="mt-4 p-3 bg-green-600/20 border border-green-500/30 rounded-lg">
          <div className="text-green-400 font-bold text-lg">
            {score.score >= levelData.targetScore * 1.5 && score.overtakes >= levelData.targetOvertakes * 1.2
              ? "🌟 PERFECT!"
              : score.score >= levelData.targetScore * 1.2 && score.overtakes >= levelData.targetOvertakes
                ? "⭐ EXCELLENT!"
                : "✅ COMPLETED!"}
          </div>
        </div>
      </div>

      {nextLevelData && (
        <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4 mb-6 max-w-md mx-auto">
          <h4 className="text-lg font-bold text-white mb-2">Next Challenge</h4>
          <p className="text-blue-400 font-semibold">
            Level {nextLevelData.level}: {nextLevelData.name}
          </p>
          <div className="text-xs sm:text-sm text-gray-300 mt-2">
            <div>🎯 Target: {nextLevelData.targetScore.toLocaleString()} points</div>
            <div>🚗 Overtakes: {nextLevelData.targetOvertakes} needed</div>
            <div>⚡ Nitro: {nextLevelData.nitroCount}x available</div>
            <div>🌍 Theme: {nextLevelData.theme.charAt(0).toUpperCase() + nextLevelData.theme.slice(1)}</div>
          </div>
        </div>
      )}

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
        {nextLevelData ? (
          <Button
            onClick={onNextLevel}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold"
            size="lg"
          >
            <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Next Level
          </Button>
        ) : (
          <div className="p-4 bg-yellow-600/20 border border-yellow-500/30 rounded-lg">
            <p className="text-yellow-400 font-bold">🎉 All Levels Complete!</p>
            <p className="text-gray-300 text-sm">You are now a Speed Master!</p>
          </div>
        )}

        {newCarUnlocked && (
          <Button
            onClick={onGoToMenu}
            variant="outline"
            className="w-full border-blue-500 text-blue-400 hover:bg-blue-500/10 bg-transparent"
          >
            <Car className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Check New Car
          </Button>
        )}

        <Button
          onClick={onGoToMenu}
          variant="outline"
          className="w-full border-gray-500 text-gray-400 hover:bg-gray-500/10 bg-transparent"
        >
          <Home className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          Main Menu
        </Button>
      </div>
    </div>
  )
}

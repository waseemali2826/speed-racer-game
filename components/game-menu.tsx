"use client"

import { Button } from "@/components/ui/button"
import { Play, Trophy, Car, Lock } from "lucide-react"
import type { LevelData } from "@/app/page"

interface GameMenuProps {
  onStartGame: () => void
  onShowLeaderboard: () => void
  onShowCarSelector: () => void
  currentLevel: number
  unlockedLevels: number
  levels: LevelData[]
  onSelectLevel: (level: number) => void
}

export default function GameMenu({
  onStartGame,
  onShowLeaderboard,
  onShowCarSelector,
  currentLevel,
  unlockedLevels,
  levels,
  onSelectLevel,
}: GameMenuProps) {
  return (
    <div className="p-8 text-center min-h-[600px] flex flex-col justify-center">
      <div className="mb-8">
        <div className="text-6xl mb-4">🏁</div>
        <h2 className="text-3xl font-bold text-white mb-2">Ready to Race?</h2>
        <p className="text-gray-300">Complete all 15 levels to become the Speed Master!</p>
      </div>

      {/* Level Selection Grid */}
      <div className="mb-8 max-w-4xl mx-auto">
        <h3 className="text-xl font-bold text-white mb-4">Select Level</h3>
        <div className="grid grid-cols-5 gap-3">
          {levels.map((level) => (
            <button
              key={level.level}
              onClick={() => onSelectLevel(level.level)}
              disabled={level.level > unlockedLevels}
              className={`p-3 rounded-lg border-2 transition-all ${
                level.level === currentLevel
                  ? "border-yellow-400 bg-yellow-400/20 text-yellow-400"
                  : level.level <= unlockedLevels
                    ? "border-green-500/50 bg-green-500/10 text-white hover:bg-green-500/20"
                    : "border-gray-600 bg-gray-800/50 text-gray-500 cursor-not-allowed"
              }`}
            >
              <div className="text-lg font-bold">
                {level.level <= unlockedLevels ? level.level : <Lock className="w-4 h-4 mx-auto" />}
              </div>
              <div className="text-xs mt-1">{level.level <= unlockedLevels ? level.name.split(" ")[0] : "Locked"}</div>
            </button>
          ))}
        </div>

        {unlockedLevels > 15 && (
          <div className="mt-4 p-4 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-lg border border-yellow-400/30">
            <div className="text-2xl mb-2">🏆</div>
            <p className="text-yellow-400 font-bold">CHAMPION STATUS ACHIEVED!</p>
            <p className="text-gray-300 text-sm">You've conquered all levels!</p>
          </div>
        )}
      </div>

      {/* Current Level Info */}
      <div className="mb-6 p-4 bg-black/30 rounded-lg max-w-md mx-auto">
        <h4 className="text-lg font-bold text-white mb-2">
          Level {currentLevel}: {levels[currentLevel - 1].name}
        </h4>
        <div className="text-sm text-gray-300 space-y-1">
          <div>🎯 Target Score: {levels[currentLevel - 1].targetScore.toLocaleString()}</div>
          <div>⚡ Nitro Available: {levels[currentLevel - 1].nitroCount}x</div>
          <div>
            🌍 Theme: {levels[currentLevel - 1].theme.charAt(0).toUpperCase() + levels[currentLevel - 1].theme.slice(1)}
          </div>
        </div>
      </div>

      <div className="space-y-4 max-w-xs mx-auto">
        <Button
          onClick={onStartGame}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 text-lg"
          size="lg"
        >
          <Play className="w-5 h-5 mr-2" />
          Start Level {currentLevel}
        </Button>

        <Button
          onClick={onShowCarSelector}
          variant="outline"
          className="w-full border-blue-500 text-blue-400 hover:bg-blue-500/10 bg-transparent"
        >
          <Car className="w-5 h-5 mr-2" />
          Choose Car
        </Button>

        <Button
          onClick={onShowLeaderboard}
          variant="outline"
          className="w-full border-yellow-500 text-yellow-400 hover:bg-yellow-500/10 bg-transparent"
        >
          <Trophy className="w-5 h-5 mr-2" />
          Leaderboard
        </Button>
      </div>

      <div className="mt-8 text-sm text-gray-400">
        <p>🎯 Complete each level by reaching the target score</p>
        <p>🚀 Each level gets faster and more challenging!</p>
      </div>
    </div>
  )
}

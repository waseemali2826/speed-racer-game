"use client"

import { Button } from "@/components/ui/button"
import { Home, Trophy } from "lucide-react"

interface WinnerScreenProps {
  onGoToMenu: () => void
  onShowLeaderboard: () => void
}

export default function WinnerScreen({ onGoToMenu, onShowLeaderboard }: WinnerScreenProps) {
  return (
    <div className="p-8 text-center min-h-[600px] flex flex-col justify-center relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 text-4xl animate-bounce">🎉</div>
        <div className="absolute top-20 right-20 text-3xl animate-pulse">⭐</div>
        <div className="absolute bottom-20 left-20 text-4xl animate-bounce delay-300">🏆</div>
        <div className="absolute bottom-10 right-10 text-3xl animate-pulse delay-500">🎊</div>
        <div className="absolute top-1/2 left-5 text-2xl animate-bounce delay-700">✨</div>
        <div className="absolute top-1/3 right-5 text-2xl animate-pulse delay-1000">🌟</div>
      </div>

      <div className="relative z-10">
        <div className="mb-8">
          <div className="text-9xl mb-6 animate-bounce">🏆</div>
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 mb-4 animate-pulse">
            CHAMPION!
          </h1>
          <h2 className="text-3xl font-bold text-white mb-4">Speed Master Achieved!</h2>
          <p className="text-xl text-gray-300 mb-2">You have conquered all 15 levels!</p>
          <p className="text-lg text-yellow-400">The ultimate racing legend!</p>
        </div>

        <div className="bg-gradient-to-r from-yellow-400/20 via-orange-500/20 to-red-500/20 rounded-2xl p-8 mb-8 max-w-2xl mx-auto border-2 border-yellow-400/50">
          <h3 className="text-2xl font-bold text-white mb-6">🎖️ Hall of Fame 🎖️</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-black/30 rounded-lg p-4">
              <div className="text-3xl mb-2">🚗</div>
              <h4 className="text-lg font-bold text-yellow-400">Master Driver</h4>
              <p className="text-sm text-gray-300">Completed all racing challenges</p>
            </div>

            <div className="bg-black/30 rounded-lg p-4">
              <div className="text-3xl mb-2">⚡</div>
              <h4 className="text-lg font-bold text-blue-400">Speed Demon</h4>
              <p className="text-sm text-gray-300">Mastered nitro boost techniques</p>
            </div>

            <div className="bg-black/30 rounded-lg p-4">
              <div className="text-3xl mb-2">🎯</div>
              <h4 className="text-lg font-bold text-green-400">Precision Expert</h4>
              <p className="text-sm text-gray-300">Perfect traffic navigation</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-black/40 rounded-lg">
            <h4 className="text-xl font-bold text-white mb-3">🏅 Achievement Unlocked</h4>
            <div className="text-6xl mb-3">👑</div>
            <p className="text-lg font-bold text-yellow-400">SPEED RACER CHAMPION</p>
            <p className="text-sm text-gray-300 mt-2">
              You've proven yourself as the ultimate speed racer by completing all 15 challenging levels!
            </p>
          </div>
        </div>

        <div className="space-y-4 max-w-xs mx-auto">
          <Button
            onClick={onShowLeaderboard}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold"
            size="lg"
          >
            <Trophy className="w-5 h-5 mr-2" />
            View Hall of Fame
          </Button>

          <Button
            onClick={onGoToMenu}
            variant="outline"
            className="w-full border-yellow-500 text-yellow-400 hover:bg-yellow-500/10 bg-transparent"
          >
            <Home className="w-5 h-5 mr-2" />
            Return to Menu
          </Button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm mb-2">🎮 Thanks for playing Speed Racer!</p>
          <p className="text-gray-500 text-xs">Challenge yourself again or try to beat your best times!</p>
        </div>
      </div>
    </div>
  )
}

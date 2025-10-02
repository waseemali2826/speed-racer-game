"use client"

import { useState, useEffect } from "react"
import GameCanvas from "@/components/game-canvas"
import GameMenu from "@/components/game-menu"
import GameOver from "@/components/game-over"
import Leaderboard from "@/components/leaderboard"
import CarSelector from "@/components/car-selector"
import WinnerScreen from "@/components/winner-screen"
import LevelComplete from "@/components/level-complete"
import Settings from "@/components/settings"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, SettingsIcon } from "lucide-react"

export type GameState =
  | "menu"
  | "playing"
  | "paused"
  | "gameOver"
  | "leaderboard"
  | "carSelector"
  | "levelComplete"
  | "winner"
  | "settings"

export interface GameScore {
  id?: string
  playerName: string
  score: number
  coins: number
  overtakes: number
  timeSurvived: number
  level: number
  timestamp: number
}

export interface LevelData {
  level: number
  name: string
  targetScore: number
  targetOvertakes: number
  obstacleFrequency: number
  maxObstacles: number
  nitroCount: number
  theme: string
  duration: number // in seconds
}

const LEVELS: LevelData[] = [
  {
    level: 1,
    name: "Rookie Driver",
    targetScore: 1000,
    targetOvertakes: 10,
    obstacleFrequency: 1500,
    maxObstacles: 1,
    nitroCount: 5,
    theme: "city",
    duration: 60,
  },
  {
    level: 2,
    name: "City Streets",
    targetScore: 1500,
    targetOvertakes: 15,
    obstacleFrequency: 1400,
    maxObstacles: 2,
    nitroCount: 4,
    theme: "city",
    duration: 70,
  },
  {
    level: 3,
    name: "Suburban Rush",
    targetScore: 2000,
    targetOvertakes: 20,
    obstacleFrequency: 1300,
    maxObstacles: 2,
    nitroCount: 4,
    theme: "city",
    duration: 80,
  },
  {
    level: 4,
    name: "Highway Entry",
    targetScore: 2500,
    targetOvertakes: 25,
    obstacleFrequency: 1200,
    maxObstacles: 2,
    nitroCount: 4,
    theme: "highway",
    duration: 90,
  },
  {
    level: 5,
    name: "Speed Zone",
    targetScore: 3000,
    targetOvertakes: 30,
    obstacleFrequency: 1100,
    maxObstacles: 3,
    nitroCount: 3,
    theme: "highway",
    duration: 100,
  },
  {
    level: 6,
    name: "Traffic Jam",
    targetScore: 3500,
    targetOvertakes: 35,
    obstacleFrequency: 1000,
    maxObstacles: 3,
    nitroCount: 3,
    theme: "highway",
    duration: 110,
  },
  {
    level: 7,
    name: "Rush Hour",
    targetScore: 4000,
    targetOvertakes: 40,
    obstacleFrequency: 950,
    maxObstacles: 3,
    nitroCount: 3,
    theme: "highway",
    duration: 120,
  },
  {
    level: 8,
    name: "Night Drive",
    targetScore: 4500,
    targetOvertakes: 45,
    obstacleFrequency: 900,
    maxObstacles: 4,
    nitroCount: 3,
    theme: "night",
    duration: 130,
  },
  {
    level: 9,
    name: "Midnight Rush",
    targetScore: 5000,
    targetOvertakes: 50,
    obstacleFrequency: 850,
    maxObstacles: 4,
    nitroCount: 2,
    theme: "night",
    duration: 140,
  },
  {
    level: 10,
    name: "Storm Highway",
    targetScore: 5500,
    targetOvertakes: 55,
    obstacleFrequency: 800,
    maxObstacles: 4,
    nitroCount: 2,
    theme: "storm",
    duration: 150,
  },
  {
    level: 11,
    name: "Thunder Road",
    targetScore: 6000,
    targetOvertakes: 60,
    obstacleFrequency: 750,
    maxObstacles: 5,
    nitroCount: 2,
    theme: "storm",
    duration: 160,
  },
  {
    level: 12,
    name: "Speed Demon",
    targetScore: 6500,
    targetOvertakes: 65,
    obstacleFrequency: 700,
    maxObstacles: 5,
    nitroCount: 2,
    theme: "desert",
    duration: 170,
  },
  {
    level: 13,
    name: "Road Warrior",
    targetScore: 7000,
    targetOvertakes: 70,
    obstacleFrequency: 650,
    maxObstacles: 5,
    nitroCount: 1,
    theme: "desert",
    duration: 180,
  },
  {
    level: 14,
    name: "Ultimate Test",
    targetScore: 7500,
    targetOvertakes: 75,
    obstacleFrequency: 600,
    maxObstacles: 6,
    nitroCount: 1,
    theme: "mountain",
    duration: 190,
  },
  {
    level: 15,
    name: "Speed Master",
    targetScore: 8000,
    targetOvertakes: 80,
    obstacleFrequency: 550,
    maxObstacles: 6,
    nitroCount: 1,
    theme: "mountain",
    duration: 200,
  },
]

export default function SpeedRacerGame() {
  const [gameState, setGameState] = useState<GameState>("menu")
  const [currentScore, setCurrentScore] = useState<GameScore | null>(null)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [selectedCar, setSelectedCar] = useState(0)
  const [currentLevel, setCurrentLevel] = useState(1)
  const [unlockedLevels, setUnlockedLevels] = useState(1)
  const [unlockedCars, setUnlockedCars] = useState(1)

  useEffect(() => {
    // Load saved preferences
    const savedSound = localStorage.getItem("soundEnabled")
    const savedCar = localStorage.getItem("selectedCar")
    const savedLevel = localStorage.getItem("currentLevel")
    const savedUnlocked = localStorage.getItem("unlockedLevels")
    const savedUnlockedCars = localStorage.getItem("unlockedCars")

    if (savedSound !== null) {
      setSoundEnabled(JSON.parse(savedSound))
    }
    if (savedCar !== null) {
      setSelectedCar(Number.parseInt(savedCar))
    }
    if (savedLevel !== null) {
      setCurrentLevel(Number.parseInt(savedLevel))
    }
    if (savedUnlocked !== null) {
      setUnlockedLevels(Number.parseInt(savedUnlocked))
    }
    if (savedUnlockedCars !== null) {
      setUnlockedCars(Number.parseInt(savedUnlockedCars))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("soundEnabled", JSON.stringify(soundEnabled))
  }, [soundEnabled])

  useEffect(() => {
    localStorage.setItem("selectedCar", selectedCar.toString())
  }, [selectedCar])

  useEffect(() => {
    localStorage.setItem("currentLevel", currentLevel.toString())
  }, [currentLevel])

  useEffect(() => {
    localStorage.setItem("unlockedLevels", unlockedLevels.toString())
  }, [unlockedLevels])

  useEffect(() => {
    localStorage.setItem("unlockedCars", unlockedCars.toString())
  }, [unlockedCars])

  const startGame = () => {
    setGameState("playing")
    setCurrentScore(null)
  }

  const endGame = (score: GameScore) => {
    const levelData = LEVELS[currentLevel - 1]
    const scoreWithLevel = { ...score, level: currentLevel }

    if (score.score >= levelData.targetScore && score.overtakes >= levelData.targetOvertakes) {
      // Level completed
      setCurrentScore(scoreWithLevel)
      if (currentLevel === 15) {
        // All levels completed - show winner screen
        setGameState("winner")
        if (unlockedLevels < 16) {
          setUnlockedLevels(16) // Mark as completed
        }
        if (unlockedCars < 6) {
          setUnlockedCars(6) // Unlock all cars
        }
      } else {
        // Level completed, unlock next level and possibly new car
        setGameState("levelComplete")
        if (unlockedLevels <= currentLevel) {
          setUnlockedLevels(currentLevel + 1)
        }
        // Unlock new car every 3 levels
        const newCarUnlock = Math.min(6, Math.floor((currentLevel + 2) / 3) + 1)
        if (newCarUnlock > unlockedCars) {
          setUnlockedCars(newCarUnlock)
        }
      }
    } else {
      // Level failed
      setCurrentScore(scoreWithLevel)
      setGameState("gameOver")
    }
  }

  const goToMenu = () => {
    setGameState("menu")
  }

  const showLeaderboard = () => {
    setGameState("leaderboard")
  }

  const showCarSelector = () => {
    setGameState("carSelector")
  }

  const showSettings = () => {
    setGameState("settings")
  }

  const nextLevel = () => {
    if (currentLevel < 15) {
      setCurrentLevel(currentLevel + 1)
    }
    setGameState("playing")
  }

  const selectLevel = (level: number) => {
    if (level <= unlockedLevels) {
      setCurrentLevel(level)
    }
  }

  const restartLevel = () => {
    setGameState("playing")
  }

  const selectCar = (carIndex: number) => {
    if (carIndex < unlockedCars) {
      setSelectedCar(carIndex)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex flex-col items-center justify-center p-2 sm:p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-2 h-2 bg-white/20 rounded-full animate-pulse" />
        <div className="absolute top-32 right-20 w-1 h-1 bg-yellow-400/30 rounded-full animate-ping" />
        <div className="absolute bottom-20 left-32 w-3 h-3 bg-blue-400/20 rounded-full animate-bounce" />
        <div className="absolute top-1/2 right-10 w-2 h-2 bg-purple-400/30 rounded-full animate-pulse" />
      </div>

      <div className="w-full max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-8">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 mb-2 sm:mb-4 tracking-wider animate-pulse">
            🚗 SPEED RACER
          </h1>
          <p className="text-lg sm:text-2xl text-blue-300 font-semibold tracking-wide">Avoid the Traffic!</p>
          <div className="mt-2 flex justify-center gap-2">
            <span className="text-yellow-400">⚡</span>
            <span className="text-red-400">🔥</span>
            <span className="text-blue-400">💨</span>
          </div>
        </div>

        {/* Level Progress Bar */}
        {gameState !== "menu" && gameState !== "settings" && (
          <div className="mb-4 sm:mb-6 bg-black/30 rounded-xl p-3 sm:p-4 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm sm:text-base text-white font-bold">
                Level {currentLevel}: {LEVELS[currentLevel - 1].name}
              </span>
              <span className="text-xs sm:text-sm text-yellow-400 font-bold">
                {unlockedLevels > 15 ? "🏆 CHAMPION" : `${unlockedLevels}/15 Unlocked`}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 sm:h-3">
              <div
                className="bg-gradient-to-r from-green-400 to-blue-500 h-2 sm:h-3 rounded-full transition-all duration-500"
                style={{ width: `${(unlockedLevels / 15) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Target: {LEVELS[currentLevel - 1].targetScore.toLocaleString()} pts</span>
              <span>Overtakes: {LEVELS[currentLevel - 1].targetOvertakes}</span>
            </div>
          </div>
        )}

        {/* Settings Bar */}
        <div className="flex justify-between items-center mb-4 sm:mb-6 px-2 sm:px-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="bg-black/30 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm text-xs sm:text-sm"
          >
            {soundEnabled ? (
              <Volume2 className="w-3 h-3 sm:w-4 sm:h-4" />
            ) : (
              <VolumeX className="w-3 h-3 sm:w-4 sm:h-4" />
            )}
            <span className="ml-1 sm:ml-2 hidden sm:inline">Sound</span>
          </Button>

          <div className="text-center">
            <div className="text-white/70 text-xs sm:text-sm">Current Car</div>
            <div className="text-yellow-400 font-bold text-xs sm:text-sm">
              {
                ["Red Racer", "Green Machine", "Blue Bullet", "Yellow Thunder", "Pink Power", "Cyan Cruiser"][
                  selectedCar
                ]
              }
            </div>
            <div className="text-xs text-gray-400">{unlockedCars}/6 Cars Unlocked</div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={showSettings}
            className="bg-black/30 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm text-xs sm:text-sm"
          >
            <SettingsIcon className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="ml-1 sm:ml-2 hidden sm:inline">Settings</span>
          </Button>
        </div>

        {/* Game Container */}
        <div className="bg-black/40 rounded-2xl border border-white/20 overflow-hidden backdrop-blur-sm shadow-2xl">
          {gameState === "menu" && (
            <GameMenu
              onStartGame={startGame}
              onShowLeaderboard={showLeaderboard}
              onShowCarSelector={showCarSelector}
              currentLevel={currentLevel}
              unlockedLevels={unlockedLevels}
              levels={LEVELS}
              onSelectLevel={selectLevel}
            />
          )}

          {gameState === "playing" && (
            <GameCanvas
              onGameEnd={endGame}
              soundEnabled={soundEnabled}
              selectedCar={selectedCar}
              levelData={LEVELS[currentLevel - 1]}
            />
          )}

          {gameState === "gameOver" && currentScore && (
            <GameOver
              score={currentScore}
              levelData={LEVELS[currentLevel - 1]}
              onPlayAgain={restartLevel}
              onGoToMenu={goToMenu}
              onShowLeaderboard={showLeaderboard}
            />
          )}

          {gameState === "levelComplete" && currentScore && (
            <LevelComplete
              score={currentScore}
              levelData={LEVELS[currentLevel - 1]}
              nextLevelData={currentLevel < 15 ? LEVELS[currentLevel] : null}
              onNextLevel={nextLevel}
              onGoToMenu={goToMenu}
              unlockedCars={unlockedCars}
            />
          )}

          {gameState === "winner" && <WinnerScreen onGoToMenu={goToMenu} onShowLeaderboard={showLeaderboard} />}

          {gameState === "leaderboard" && <Leaderboard onGoBack={goToMenu} />}

          {gameState === "carSelector" && (
            <CarSelector
              selectedCar={selectedCar}
              onSelectCar={selectCar}
              onGoBack={goToMenu}
              unlockedCars={unlockedCars}
            />
          )}

          {gameState === "settings" && (
            <Settings soundEnabled={soundEnabled} setSoundEnabled={setSoundEnabled} onClose={goToMenu} />
          )}
        </div>

        {/* Instructions */}
        <div className="text-center mt-4 sm:mt-8 text-white/80 bg-black/20 rounded-xl p-3 sm:p-4 backdrop-blur-sm">
          <p className="text-sm sm:text-lg font-semibold mb-2">🎮 How to Play</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
            <div>
              <span className="text-blue-400">🎯 Controls:</span> Buttons or ← → keys
            </div>
            <div>
              <span className="text-yellow-400">⚡ Boost:</span> Nitro button or SPACE
            </div>
            <div>
              <span className="text-green-400">🏆 Goal:</span> Overtake cars & reach targets!
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

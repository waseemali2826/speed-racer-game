"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Check, Lock } from "lucide-react"

interface CarSelectorProps {
  selectedCar: number
  onSelectCar: (carIndex: number) => void
  onGoBack: () => void
  unlockedCars: number
}

const CAR_COLORS = [
  { body: "#ff4444", accent: "#cc2222", name: "Red Racer", unlockLevel: 1 },
  { body: "#44ff44", accent: "#22cc22", name: "Green Machine", unlockLevel: 3 },
  { body: "#4444ff", accent: "#2222cc", name: "Blue Bullet", unlockLevel: 6 },
  { body: "#ffff44", accent: "#cccc22", name: "Yellow Thunder", unlockLevel: 9 },
  { body: "#ff44ff", accent: "#cc22cc", name: "Pink Power", unlockLevel: 12 },
  { body: "#44ffff", accent: "#22cccc", name: "Cyan Cruiser", unlockLevel: 15 },
]

export default function CarSelector({ selectedCar, onSelectCar, onGoBack, unlockedCars }: CarSelectorProps) {
  const drawCarPreview = (colors: { body: string; accent: string }) => {
    return (
      <div className="relative w-12 h-16 sm:w-16 sm:h-20 mx-auto mb-3">
        <svg width="100%" height="100%" viewBox="0 0 40 70">
          {/* Car body */}
          <rect x="0" y="0" width="40" height="70" rx="8" fill={colors.body} />

          {/* Car roof */}
          <rect x="4" y="8" width="32" height="28" rx="6" fill={colors.accent} />

          {/* Windshield */}
          <rect x="6" y="10" width="28" height="18" rx="4" fill="#87CEEB" />

          {/* Rear window */}
          <rect x="6" y="45" width="28" height="14" rx="4" fill="#87CEEB" />

          {/* Wheels */}
          <rect x="-2" y="8" width="8" height="12" fill="#333" />
          <rect x="34" y="8" width="8" height="12" fill="#333" />
          <rect x="-2" y="50" width="8" height="12" fill="#333" />
          <rect x="34" y="50" width="8" height="12" fill="#333" />

          {/* Wheel rims */}
          <rect x="0" y="10" width="4" height="8" fill="#666" />
          <rect x="36" y="10" width="4" height="8" fill="#666" />
          <rect x="0" y="52" width="4" height="8" fill="#666" />
          <rect x="36" y="52" width="4" height="8" fill="#666" />

          {/* Headlights */}
          <ellipse cx="12" cy="2" rx="4" ry="2" fill="#FFFF99" />
          <ellipse cx="28" cy="2" rx="4" ry="2" fill="#FFFF99" />
        </svg>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 min-h-[500px] bg-gradient-to-b from-gray-900/50 to-transparent">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <Button
          onClick={onGoBack}
          variant="outline"
          className="border-gray-500 text-gray-400 hover:bg-gray-500/10 bg-transparent text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h2 className="text-xl sm:text-3xl font-bold text-white flex items-center">🚗 Choose Your Car</h2>
        <div className="w-16 sm:w-20" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 max-w-4xl mx-auto">
        {CAR_COLORS.map((car, index) => {
          const isUnlocked = index < unlockedCars
          const isSelected = selectedCar === index

          return (
            <div
              key={index}
              className={`relative p-3 sm:p-6 rounded-xl border-2 cursor-pointer transition-all transform hover:scale-105 ${
                isSelected && isUnlocked
                  ? "border-yellow-400 bg-yellow-400/10 shadow-lg shadow-yellow-400/20"
                  : isUnlocked
                    ? "border-white/20 hover:border-white/40 hover:bg-white/5"
                    : "border-gray-600 bg-gray-800/50 cursor-not-allowed opacity-60"
              }`}
              onClick={() => isUnlocked && onSelectCar(index)}
            >
              {isSelected && isUnlocked && (
                <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-black" />
                </div>
              )}

              {!isUnlocked && (
                <div className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1">
                  <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
              )}

              <div className="text-center">
                {isUnlocked ? (
                  drawCarPreview(car)
                ) : (
                  <div className="relative w-12 h-16 sm:w-16 sm:h-20 mx-auto mb-3 flex items-center justify-center">
                    <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500" />
                  </div>
                )}

                <h3 className="font-bold text-white text-sm sm:text-lg mb-2">{car.name}</h3>

                {isUnlocked ? (
                  <>
                    <div className="flex justify-center gap-2 mb-3">
                      <div
                        className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-white/30"
                        style={{ backgroundColor: car.body }}
                      />
                      <div
                        className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-white/30"
                        style={{ backgroundColor: car.accent }}
                      />
                    </div>

                    <div className="text-xs text-gray-400">
                      Car #{index + 1}
                      {isSelected && <div className="text-yellow-400 font-semibold mt-1">✓ Selected</div>}
                    </div>
                  </>
                ) : (
                  <div className="text-xs text-red-400">
                    <div className="font-semibold">🔒 Locked</div>
                    <div className="mt-1">Unlock at Level {car.unlockLevel}</div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="text-center mt-6 sm:mt-8 p-3 sm:p-4 bg-black/20 rounded-lg max-w-md mx-auto">
        <p className="text-gray-300 text-sm mb-2">
          Currently Selected: <span className="text-white font-bold">{CAR_COLORS[selectedCar].name}</span>
        </p>
        <p className="text-gray-400 text-xs">{unlockedCars}/6 Cars Unlocked • Complete levels to unlock new cars!</p>
      </div>
    </div>
  )
}

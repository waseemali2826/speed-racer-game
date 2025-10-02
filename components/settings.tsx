"use client"

import { Button } from "@/components/ui/button"
import { Volume2, VolumeX } from "lucide-react"

interface SettingsProps {
  soundEnabled: boolean
  setSoundEnabled: (enabled: boolean) => void
  onClose: () => void
}

export default function Settings({ soundEnabled, setSoundEnabled, onClose }: SettingsProps) {
  return (
    <div className="p-4 sm:p-8 min-h-[600px] flex flex-col justify-center relative">
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">⚙️ Settings</h2>
        <p className="text-gray-400 text-sm">Customize your racing experience</p>
      </div>

      <div className="space-y-6 max-w-md mx-auto w-full">
        {/* Sound Settings */}
        <div className="bg-black/30 rounded-lg p-4 sm:p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            <Volume2 className="w-5 h-5 mr-2" />
            Audio Settings
          </h3>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-semibold">Sound Effects</p>
              <p className="text-gray-400 text-sm">Engine sounds, crashes, and effects</p>
            </div>
            <Button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`w-16 h-8 rounded-full transition-all relative ${
                soundEnabled ? "bg-green-600 hover:bg-green-700" : "bg-gray-600 hover:bg-gray-700"
              }`}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full transition-transform absolute flex items-center justify-center ${
                  soundEnabled ? "translate-x-4" : "-translate-x-4"
                }`}
              >
                {soundEnabled ? (
                  <Volume2 className="w-3 h-3 text-green-600" />
                ) : (
                  <VolumeX className="w-3 h-3 text-gray-600" />
                )}
              </div>
            </Button>
          </div>

          {/* Sound Preview */}
          <div className="mt-4 p-3 bg-blue-600/20 border border-blue-500/30 rounded-lg">
            <p className="text-blue-400 text-xs">
              🔊 <strong>Sound Effects Include:</strong> Engine roar, crash sounds, overtake chimes, nitro boost, brake
              squeals, and coin collection sounds!
            </p>
          </div>
        </div>

        {/* Game Info */}
        <div className="bg-black/30 rounded-lg p-4 sm:p-6">
          <h3 className="text-lg font-bold text-white mb-3">🎮 Game Info</h3>
          <div className="text-sm text-gray-300 space-y-2">
            <div className="flex justify-between">
              <span>Version:</span>
              <span className="text-yellow-400">2.1.0</span>
            </div>
            <div className="flex justify-between">
              <span>Total Levels:</span>
              <span className="text-blue-400">15</span>
            </div>
            <div className="flex justify-between">
              <span>Total Cars:</span>
              <span className="text-green-400">6</span>
            </div>
            <div className="flex justify-between">
              <span>Sound:</span>
              <span className={soundEnabled ? "text-green-400" : "text-red-400"}>
                {soundEnabled ? "🔊 ON" : "🔇 OFF"}
              </span>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-purple-600/20 border border-purple-500/30 rounded-lg p-4">
          <h4 className="text-purple-400 font-bold mb-2">💡 Pro Tips</h4>
          <ul className="text-xs text-gray-300 space-y-1">
            <li>• Sound effects help you time your moves perfectly</li>
            <li>• Each car unlocks at different levels</li>
          </ul>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8">
          Save & Close
        </Button>
      </div>
    </div>
  )
}

"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import type { GameScore, LevelData } from "@/app/page"
import { ArrowLeft, ArrowRight, Zap, Square } from "lucide-react"

interface GameCanvasProps {
  onGameEnd: (score: GameScore) => void
  soundEnabled: boolean
  selectedCar: number
  levelData: LevelData
}

interface Car {
  x: number
  y: number
  width: number
  height: number
  speed: number
}

interface Obstacle {
  x: number
  y: number
  width: number
  height: number
  speed: number
  type: number
  overtaken: boolean
}

const CAR_COLORS = [
  { body: "#ff4444", accent: "#cc2222" }, // Red
  { body: "#44ff44", accent: "#22cc22" }, // Green
  { body: "#4444ff", accent: "#2222cc" }, // Blue
  { body: "#ffff44", accent: "#cccc22" }, // Yellow
  { body: "#ff44ff", accent: "#cc22cc" }, // Pink
  { body: "#44ffff", accent: "#22cccc" }, // Cyan
]

const OBSTACLE_COLORS = [
  { body: "#888888", accent: "#666666" },
  { body: "#666666", accent: "#444444" },
  { body: "#999999", accent: "#777777" },
  { body: "#777777", accent: "#555555" },
]

export default function GameCanvas({ onGameEnd, soundEnabled, selectedCar, levelData }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameLoopRef = useRef<number>()
  const [score, setScore] = useState(0)
  const [coins, setCoins] = useState(0)
  const [overtakes, setOvertakes] = useState(0)
  const [gameStartTime] = useState(Date.now())
  const [nitroActive, setNitroActive] = useState(false)
  const [nitroCount, setNitroCount] = useState(levelData.nitroCount)
  const [currentSpeed, setCurrentSpeed] = useState(60)
  const [timeRemaining, setTimeRemaining] = useState(levelData.duration)

  // Mobile controls state
  const [mobileControls, setMobileControls] = useState({
    left: false,
    right: false,
    nitro: false,
    brake: false,
  })

  // Game state
  const gameStateRef = useRef({
    player: { x: 0, y: 0, width: 40, height: 70, speed: 6 } as Car,
    obstacles: [] as Obstacle[],
    roadOffset: 0,
    sideOffset: 0,
    gameSpeed: 4, // Fixed speed for all levels
    baseSpeed: 60, // Base speedometer reading
    lastObstacleTime: 0,
    keys: { left: false, right: false, space: false, brake: false },
  })

  // Enhanced sound system with realistic car sounds
  const playSound = useCallback(
    (type: "engine" | "crash" | "overtake" | "nitro" | "brake" | "coin" | "levelup" | "horn") => {
      if (!soundEnabled) return

      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        let frequency: number
        let duration: number
        let oscType: OscillatorType = "square"

        switch (type) {
          case "engine":
            frequency = 80 + currentSpeed * 1.5 // Engine sound varies with speed
            duration = 0.15
            oscType = "sawtooth"
            break
          case "crash":
            // Multi-layered crash sound
            frequency = 120
            duration = 2.0
            oscType = "sawtooth"
            // Add secondary crash sound
            setTimeout(() => {
              const osc2 = audioContext.createOscillator()
              const gain2 = audioContext.createGain()
              osc2.connect(gain2)
              gain2.connect(audioContext.destination)
              osc2.frequency.value = 200
              osc2.type = "square"
              gain2.gain.setValueAtTime(0.08, audioContext.currentTime)
              gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5)
              osc2.start()
              osc2.stop(audioContext.currentTime + 1.5)
            }, 100)
            break
          case "overtake":
            // Pleasant overtake chime
            frequency = 880
            duration = 0.4
            oscType = "sine"
            // Add harmony
            setTimeout(() => {
              const osc2 = audioContext.createOscillator()
              const gain2 = audioContext.createGain()
              osc2.connect(gain2)
              gain2.connect(audioContext.destination)
              osc2.frequency.value = 1100
              osc2.type = "sine"
              gain2.gain.setValueAtTime(0.05, audioContext.currentTime)
              gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
              osc2.start()
              osc2.stop(audioContext.currentTime + 0.3)
            }, 50)
            break
          case "nitro":
            // Powerful nitro boost sound
            frequency = 300
            duration = 0.8
            oscType = "sawtooth"
            // Add whoosh effect
            setTimeout(() => {
              const osc2 = audioContext.createOscillator()
              const gain2 = audioContext.createGain()
              osc2.connect(gain2)
              gain2.connect(audioContext.destination)
              osc2.frequency.value = 600
              osc2.type = "triangle"
              gain2.gain.setValueAtTime(0.06, audioContext.currentTime)
              gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6)
              osc2.start()
              osc2.stop(audioContext.currentTime + 0.6)
            }, 100)
            break
          case "brake":
            // Brake squeal sound
            frequency = 250
            duration = 0.3
            oscType = "square"
            break
          case "coin":
            // Coin collection sound
            frequency = 1200
            duration = 0.25
            oscType = "sine"
            break
          case "levelup":
            // Victory fanfare
            frequency = 523 // C note
            duration = 1.2
            oscType = "sine"
            // Add chord progression
            setTimeout(() => {
              ;[659, 784, 1047].forEach((freq, i) => {
                setTimeout(() => {
                  const osc = audioContext.createOscillator()
                  const gain = audioContext.createGain()
                  osc.connect(gain)
                  gain.connect(audioContext.destination)
                  osc.frequency.value = freq
                  osc.type = "sine"
                  gain.gain.setValueAtTime(0.05, audioContext.currentTime)
                  gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8)
                  osc.start()
                  osc.stop(audioContext.currentTime + 0.8)
                }, i * 200)
              })
            }, 200)
            break
          case "horn":
            // Car horn sound
            frequency = 440
            duration = 0.5
            oscType = "square"
            break
          default:
            frequency = 440
            duration = 0.3
        }

        oscillator.frequency.value = frequency
        oscillator.type = oscType

        gainNode.gain.setValueAtTime(0.08, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)

        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + duration)
      } catch (error) {
        console.log("Audio not supported")
      }
    },
    [soundEnabled, currentSpeed],
  )

  // Get theme colors based on level
  const getThemeColors = (theme: string) => {
    switch (theme) {
      case "city":
        return {
          sky: ["#0f0f23", "#1a1a2e", "#16213e"],
          road: ["#2a2a2a", "#333333", "#2a2a2a"],
        }
      case "highway":
        return {
          sky: ["#1a1a3a", "#2a2a4e", "#1e2a4e"],
          road: ["#2a2a2a", "#333333", "#2a2a2a"],
        }
      case "night":
        return {
          sky: ["#0a0a1a", "#1a1a2a", "#0e1a2e"],
          road: ["#1a1a1a", "#222222", "#1a1a1a"],
        }
      case "storm":
        return {
          sky: ["#2a2a3a", "#3a3a4a", "#2e2e3e"],
          road: ["#2a2a2a", "#333333", "#2a2a2a"],
        }
      case "desert":
        return {
          sky: ["#4a3a2a", "#5a4a3a", "#4e3e2e"],
          road: ["#3a3a2a", "#444433", "#3a3a2a"],
        }
      case "mountain":
        return {
          sky: ["#2a3a4a", "#3a4a5a", "#2e3e4e"],
          road: ["#2a2a2a", "#333333", "#2a2a2a"],
        }
      default:
        return {
          sky: ["#0f0f23", "#1a1a2e", "#16213e"],
          road: ["#2a2a2a", "#333333", "#2a2a2a"],
        }
    }
  }

  // Draw a realistic car shape
  const drawCar = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    colors: { body: string; accent: string },
    isPlayer = false,
  ) => {
    // Car body (main rectangle with rounded corners)
    ctx.fillStyle = colors.body
    ctx.beginPath()
    ctx.roundRect(x, y, width, height, 8)
    ctx.fill()

    // Car roof
    ctx.fillStyle = colors.accent
    ctx.beginPath()
    ctx.roundRect(x + 4, y + 8, width - 8, height * 0.4, 6)
    ctx.fill()

    // Windshield
    ctx.fillStyle = "#87CEEB"
    ctx.beginPath()
    ctx.roundRect(x + 6, y + 10, width - 12, height * 0.25, 4)
    ctx.fill()

    // Rear window
    ctx.fillStyle = "#87CEEB"
    ctx.beginPath()
    ctx.roundRect(x + 6, y + height * 0.65, width - 12, height * 0.2, 4)
    ctx.fill()

    // Wheels
    ctx.fillStyle = "#333"
    const wheelWidth = 8
    const wheelHeight = 12
    // Front wheels
    ctx.fillRect(x - 2, y + 8, wheelWidth, wheelHeight)
    ctx.fillRect(x + width - 6, y + 8, wheelWidth, wheelHeight)
    // Rear wheels
    ctx.fillRect(x - 2, y + height - 20, wheelWidth, wheelHeight)
    ctx.fillRect(x + width - 6, y + height - 20, wheelWidth, wheelHeight)

    // Wheel rims
    ctx.fillStyle = "#666"
    ctx.fillRect(x, y + 10, 4, 8)
    ctx.fillRect(x + width - 4, y + 10, 4, 8)
    ctx.fillRect(x, y + height - 18, 4, 8)
    ctx.fillRect(x + width - 4, y + height - 18, 4, 8)

    // Headlights (for player car)
    if (isPlayer) {
      ctx.fillStyle = "#FFFF99"
      ctx.beginPath()
      ctx.ellipse(x + 8, y + 2, 4, 2, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(x + width - 8, y + 2, 4, 2, 0, 0, Math.PI * 2)
      ctx.fill()
    }

    // Taillights (for obstacle cars)
    if (!isPlayer) {
      ctx.fillStyle = "#FF4444"
      ctx.beginPath()
      ctx.ellipse(x + 8, y + height - 2, 3, 2, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(x + width - 8, y + height - 2, 3, 2, 0, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // Draw speedometer
  const drawSpeedometer = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const centerX = canvas.width - 80
    const centerY = canvas.height - 80
    const radius = 35

    // Speedometer background
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)"
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius + 5, 0, Math.PI * 2)
    ctx.fill()

    // Speedometer border
    ctx.strokeStyle = "#ffffff"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.stroke()

    // Speed marks
    ctx.strokeStyle = "#ffffff"
    ctx.lineWidth = 1
    for (let i = 0; i <= 12; i++) {
      const angle = (i * Math.PI) / 6 - Math.PI / 2
      const x1 = centerX + Math.cos(angle) * (radius - 5)
      const y1 = centerY + Math.sin(angle) * (radius - 5)
      const x2 = centerX + Math.cos(angle) * (radius - 10)
      const y2 = centerY + Math.sin(angle) * (radius - 10)
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
    }

    // Speed needle
    const speedAngle = (currentSpeed / 120) * Math.PI - Math.PI / 2
    ctx.strokeStyle = "#ff4444"
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(centerX + Math.cos(speedAngle) * (radius - 15), centerY + Math.sin(speedAngle) * (radius - 15))
    ctx.stroke()

    // Center dot
    ctx.fillStyle = "#ffffff"
    ctx.beginPath()
    ctx.arc(centerX, centerY, 3, 0, Math.PI * 2)
    ctx.fill()

    // Speed text
    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 12px Arial"
    ctx.textAlign = "center"
    ctx.fillText(`${Math.floor(currentSpeed)}`, centerX, centerY + 25)
    ctx.font = "8px Arial"
    ctx.fillText("KM/H", centerX, centerY + 35)
  }

  // Initialize game
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeCanvas = () => {
      const container = canvas.parentElement
      if (container) {
        const isMobile = window.innerWidth < 768
        canvas.width = Math.min(isMobile ? 350 : 450, container.clientWidth - 32)
        canvas.height = isMobile ? 500 : 650

        // Reset player position
        gameStateRef.current.player.x = canvas.width / 2 - 20
        gameStateRef.current.player.y = canvas.height - 100
      }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    return () => window.removeEventListener("resize", resizeCanvas)
  }, [])

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case "ArrowLeft":
          e.preventDefault()
          gameStateRef.current.keys.left = true
          break
        case "ArrowRight":
          e.preventDefault()
          gameStateRef.current.keys.right = true
          break
        case "Space":
          e.preventDefault()
          if (nitroCount > 0 && !nitroActive) {
            setNitroActive(true)
            setNitroCount((prev) => prev - 1)
            playSound("nitro")
            setTimeout(() => setNitroActive(false), 2000)
          }
          break
        case "ArrowDown":
          e.preventDefault()
          gameStateRef.current.keys.brake = true
          playSound("brake")
          break
        case "KeyH":
          e.preventDefault()
          playSound("horn")
          break
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case "ArrowLeft":
          gameStateRef.current.keys.left = false
          break
        case "ArrowRight":
          gameStateRef.current.keys.right = false
          break
        case "ArrowDown":
          gameStateRef.current.keys.brake = false
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [nitroCount, nitroActive, playSound])

  // Mobile control handlers
  const handleMobileControl = (control: string, active: boolean) => {
    setMobileControls((prev) => ({ ...prev, [control]: active }))

    switch (control) {
      case "left":
        gameStateRef.current.keys.left = active
        break
      case "right":
        gameStateRef.current.keys.right = active
        break
      case "brake":
        gameStateRef.current.keys.brake = active
        if (active) playSound("brake")
        break
      case "nitro":
        if (active && nitroCount > 0 && !nitroActive) {
          setNitroActive(true)
          setNitroCount((prev) => prev - 1)
          playSound("nitro")
          setTimeout(() => setNitroActive(false), 2000)
        }
        break
    }
  }

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    const gameLoop = () => {
      const currentTime = Date.now()
      const gameState = gameStateRef.current
      const elapsedTime = Math.floor((currentTime - gameStartTime) / 1000)
      const remaining = Math.max(0, levelData.duration - elapsedTime)
      setTimeRemaining(remaining)

      // Check if time is up
      if (remaining <= 0) {
        const finalScore: GameScore = {
          playerName: "",
          score: score,
          coins: coins,
          overtakes: overtakes,
          timeSurvived: elapsedTime,
          level: levelData.level,
          timestamp: currentTime,
        }
        onGameEnd(finalScore)
        return
      }

      // Clear canvas with theme-based gradient background
      const themeColors = getThemeColors(levelData.theme)
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, themeColors.sky[0])
      gradient.addColorStop(0.5, themeColors.sky[1])
      gradient.addColorStop(1, themeColors.sky[2])
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw road with theme colors
      const roadGradient = ctx.createLinearGradient(canvas.width * 0.1, 0, canvas.width * 0.9, 0)
      roadGradient.addColorStop(0, themeColors.road[0])
      roadGradient.addColorStop(0.5, themeColors.road[1])
      roadGradient.addColorStop(1, themeColors.road[2])
      ctx.fillStyle = roadGradient
      ctx.fillRect(canvas.width * 0.1, 0, canvas.width * 0.8, canvas.height)

      // Road borders
      ctx.fillStyle = "#ffff00"
      ctx.fillRect(canvas.width * 0.1 - 2, 0, 4, canvas.height)
      ctx.fillRect(canvas.width * 0.9 - 2, 0, 4, canvas.height)

      // Calculate current speed based on controls
      let speedMultiplier = 1
      if (nitroActive) speedMultiplier = 2.5
      else if (gameState.keys.brake) speedMultiplier = 0.3

      const displaySpeed = gameState.baseSpeed * speedMultiplier
      setCurrentSpeed(displaySpeed)

      // Draw road lines with animation
      ctx.fillStyle = "#ffffff"
      const lineHeight = 50
      const lineWidth = 6
      gameState.roadOffset += gameState.gameSpeed * speedMultiplier
      gameState.sideOffset += gameState.gameSpeed * speedMultiplier

      // Center line
      for (let y = -lineHeight + (gameState.roadOffset % (lineHeight * 2)); y < canvas.height; y += lineHeight * 2) {
        ctx.fillRect(canvas.width / 2 - lineWidth / 2, y, lineWidth, lineHeight)
      }

      // Lane dividers
      const laneWidth = (canvas.width * 0.8) / 3
      for (let lane = 1; lane < 3; lane++) {
        const x = canvas.width * 0.1 + lane * laneWidth - 2
        for (let y = -30 + (gameState.roadOffset % 60); y < canvas.height; y += 60) {
          ctx.fillRect(x, y, 4, 25)
        }
      }

      // Update player
      const player = gameState.player
      if (gameState.keys.left && player.x > canvas.width * 0.1 + 5) {
        player.x -= player.speed * (nitroActive ? 1.8 : 1)
      }
      if (gameState.keys.right && player.x < canvas.width * 0.9 - player.width - 5) {
        player.x += player.speed * (nitroActive ? 1.8 : 1)
      }

      // Draw player car
      drawCar(ctx, player.x, player.y, player.width, player.height, CAR_COLORS[selectedCar], true)

      // Nitro effect
      if (nitroActive) {
        // Flame effect
        ctx.fillStyle = "#ff6600"
        ctx.beginPath()
        ctx.ellipse(player.x + player.width / 2, player.y + player.height + 5, 8, 15, 0, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = "#ff9900"
        ctx.beginPath()
        ctx.ellipse(player.x + player.width / 2, player.y + player.height + 8, 5, 10, 0, 0, Math.PI * 2)
        ctx.fill()
      }

      // Spawn obstacles
      if (currentTime - gameState.lastObstacleTime > levelData.obstacleFrequency) {
        const laneWidth = (canvas.width * 0.8) / 3
        const numObstacles = Math.min(levelData.maxObstacles, Math.floor(Math.random() * levelData.maxObstacles) + 1)

        for (let i = 0; i < numObstacles; i++) {
          const lane = Math.floor(Math.random() * 3)
          const obstacleX = canvas.width * 0.1 + lane * laneWidth + laneWidth / 2 - 20

          // Check if lane is already occupied
          const laneOccupied = gameState.obstacles.some(
            (obs) => Math.abs(obs.x - obstacleX) < 50 && obs.y > -100 && obs.y < 100,
          )

          if (!laneOccupied) {
            gameState.obstacles.push({
              x: obstacleX,
              y: -80 - i * 100,
              width: 40,
              height: 70,
              speed: gameState.gameSpeed + Math.random() * 1,
              type: Math.floor(Math.random() * OBSTACLE_COLORS.length),
              overtaken: false,
            })
          }
        }

        gameState.lastObstacleTime = currentTime
      }

      // Update and draw obstacles
      gameState.obstacles = gameState.obstacles.filter((obstacle) => {
        obstacle.y += obstacle.speed * (gameState.keys.brake ? 1.5 : speedMultiplier * 0.8)

        // Draw obstacle
        drawCar(ctx, obstacle.x, obstacle.y, obstacle.width, obstacle.height, OBSTACLE_COLORS[obstacle.type])

        // Check for overtaking
        if (!obstacle.overtaken && obstacle.y > player.y + player.height) {
          obstacle.overtaken = true
          setOvertakes((prev) => prev + 1)
          setScore((prev) => prev + 100)
          setCoins((prev) => prev + 10)
          playSound("overtake")
        }

        // Check collision
        const playerCenterX = player.x + player.width / 2
        const playerCenterY = player.y + player.height / 2
        const obstacleCenterX = obstacle.x + obstacle.width / 2
        const obstacleCenterY = obstacle.y + obstacle.height / 2

        const distance = Math.sqrt(
          Math.pow(playerCenterX - obstacleCenterX, 2) + Math.pow(playerCenterY - obstacleCenterY, 2),
        )

        if (distance < 35) {
          // Crash effect
          ctx.fillStyle = "#ff0000"
          ctx.globalAlpha = 0.7
          for (let i = 0; i < 10; i++) {
            ctx.beginPath()
            ctx.ellipse(
              playerCenterX + Math.random() * 40 - 20,
              playerCenterY + Math.random() * 40 - 20,
              Math.random() * 10 + 5,
              Math.random() * 10 + 5,
              0,
              0,
              Math.PI * 2,
            )
            ctx.fill()
          }
          ctx.globalAlpha = 1

          // Game over
          playSound("crash")

          const finalScore: GameScore = {
            playerName: "",
            score: score,
            coins: coins,
            overtakes: overtakes,
            timeSurvived: elapsedTime,
            level: levelData.level,
            timestamp: currentTime,
          }

          onGameEnd(finalScore)
          return false
        }

        return obstacle.y < canvas.height + 80
      })

      // Update score continuously
      setScore((prev) => prev + 1)

      // Draw UI
      const uiGradient = ctx.createLinearGradient(0, 0, 0, 120)
      uiGradient.addColorStop(0, "rgba(0,0,0,0.9)")
      uiGradient.addColorStop(1, "rgba(0,0,0,0.3)")
      ctx.fillStyle = uiGradient
      ctx.fillRect(0, 0, canvas.width, 120)

      // Level info
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 14px Arial"
      ctx.textAlign = "left"
      ctx.fillText(`Level ${levelData.level}`, 15, 20)
      ctx.font = "10px Arial"
      ctx.fillStyle = "#ffff00"
      ctx.fillText(levelData.name, 15, 35)

      // Score and stats
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 16px Arial"
      ctx.fillText(`Score: ${score.toLocaleString()}`, 15, 55)
      ctx.fillText(`Coins: ${coins}`, 15, 75)
      ctx.fillText(`Overtakes: ${overtakes}/${levelData.targetOvertakes}`, 15, 95)

      // Time remaining
      ctx.fillStyle = remaining < 30 ? "#ff4444" : "#00ff00"
      ctx.font = "bold 18px Arial"
      ctx.textAlign = "center"
      ctx.fillText(
        `Time: ${Math.floor(remaining / 60)}:${(remaining % 60).toString().padStart(2, "0")}`,
        canvas.width / 2,
        25,
      )

      // Target progress
      ctx.fillStyle = "#ffffff"
      ctx.font = "12px Arial"
      ctx.fillText(`Target: ${levelData.targetScore.toLocaleString()}`, canvas.width / 2, 45)

      // Progress bars
      const progressWidth = 100
      const scoreProgress = Math.min(score / levelData.targetScore, 1)
      const overtakeProgress = Math.min(overtakes / levelData.targetOvertakes, 1)

      // Score progress
      ctx.fillStyle = "#333"
      ctx.fillRect(canvas.width / 2 - 50, 50, progressWidth, 6)
      ctx.fillStyle = scoreProgress >= 1 ? "#00ff00" : "#ffff00"
      ctx.fillRect(canvas.width / 2 - 50, 50, progressWidth * scoreProgress, 6)

      // Overtake progress
      ctx.fillStyle = "#333"
      ctx.fillRect(canvas.width / 2 - 50, 60, progressWidth, 6)
      ctx.fillStyle = overtakeProgress >= 1 ? "#00ff00" : "#00aaff"
      ctx.fillRect(canvas.width / 2 - 50, 60, progressWidth * overtakeProgress, 6)

      // Nitro display
      if (nitroCount > 0) {
        ctx.fillStyle = "#ff6600"
        ctx.font = "bold 14px Arial"
        ctx.textAlign = "right"
        ctx.fillText(`⚡ ${nitroCount}`, canvas.width - 15, 25)
      }

      if (nitroActive) {
        ctx.fillStyle = "#ff6600"
        ctx.font = "bold 16px Arial"
        ctx.textAlign = "center"
        ctx.fillText("🔥 NITRO! 🔥", canvas.width / 2, 100)
      }

      // Draw speedometer
      drawSpeedometer(ctx, canvas)

      // Continuous engine sound (very subtle)
      if (Math.random() < 0.01) {
        // 1% chance per frame for subtle engine sound
        playSound("engine")
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [
    onGameEnd,
    score,
    coins,
    overtakes,
    gameStartTime,
    nitroActive,
    nitroCount,
    playSound,
    selectedCar,
    levelData,
    currentSpeed,
    timeRemaining,
  ])

  return (
    <div className="flex flex-col items-center p-2 sm:p-4">
      <canvas
        ref={canvasRef}
        className="border-2 border-yellow-400 rounded-lg bg-gray-900 shadow-2xl shadow-yellow-400/20 mb-4"
        style={{ touchAction: "none" }}
      />

      {/* Mobile Controls */}
      <div className="flex justify-center gap-2 sm:gap-4 w-full max-w-md">
        <div className="flex gap-2">
          <Button
            className={`w-12 h-12 sm:w-16 sm:h-16 ${mobileControls.left ? "bg-blue-600" : "bg-gray-700"} hover:bg-blue-500`}
            onTouchStart={() => handleMobileControl("left", true)}
            onTouchEnd={() => handleMobileControl("left", false)}
            onMouseDown={() => handleMobileControl("left", true)}
            onMouseUp={() => handleMobileControl("left", false)}
            onMouseLeave={() => handleMobileControl("left", false)}
          >
            <ArrowLeft className="w-4 h-4 sm:w-6 sm:h-6" />
          </Button>

          <Button
            className={`w-12 h-12 sm:w-16 sm:h-16 ${mobileControls.right ? "bg-blue-600" : "bg-gray-700"} hover:bg-blue-500`}
            onTouchStart={() => handleMobileControl("right", true)}
            onTouchEnd={() => handleMobileControl("right", false)}
            onMouseDown={() => handleMobileControl("right", true)}
            onMouseUp={() => handleMobileControl("right", false)}
            onMouseLeave={() => handleMobileControl("right", false)}
          >
            <ArrowRight className="w-4 h-4 sm:w-6 sm:h-6" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            className={`w-12 h-12 sm:w-16 sm:h-16 ${mobileControls.brake ? "bg-red-600" : "bg-gray-700"} hover:bg-red-500`}
            onTouchStart={() => handleMobileControl("brake", true)}
            onTouchEnd={() => handleMobileControl("brake", false)}
            onMouseDown={() => handleMobileControl("brake", true)}
            onMouseUp={() => handleMobileControl("brake", false)}
            onMouseLeave={() => handleMobileControl("brake", false)}
          >
            <Square className="w-4 h-4 sm:w-6 sm:h-6" />
          </Button>

          <Button
            className={`w-12 h-12 sm:w-16 sm:h-16 ${nitroActive ? "bg-orange-600" : nitroCount > 0 ? "bg-yellow-600" : "bg-gray-500"} hover:bg-yellow-500`}
            onTouchStart={() => handleMobileControl("nitro", true)}
            onTouchEnd={() => handleMobileControl("nitro", false)}
            onMouseDown={() => handleMobileControl("nitro", true)}
            onMouseUp={() => handleMobileControl("nitro", false)}
            onMouseLeave={() => handleMobileControl("nitro", false)}
            disabled={nitroCount === 0 || nitroActive}
          >
            <Zap className="w-4 h-4 sm:w-6 sm:h-6" />
          </Button>
        </div>
      </div>

      <div className="mt-2 text-center text-white/90 text-xs sm:text-sm">
        <div className="flex justify-center gap-4 sm:gap-8">
          <span className="text-yellow-400">Score: {score.toLocaleString()}</span>
          <span className="text-blue-400">Coins: {coins}</span>
          <span className="text-green-400">Overtakes: {overtakes}</span>
        </div>
        <div className="mt-1">
          <span className="text-red-400">
            Time: {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  )
}

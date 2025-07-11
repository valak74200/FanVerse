"use client"

import { Button } from "@/components/ui/button"

interface EmotionPanelProps {
  onEmotionClick: (emotion: string) => void
}

export function EmotionPanel({ onEmotionClick }: EmotionPanelProps) {
  const emotions = [
    {
      id: "hype",
      emoji: "🔥",
      label: "HYPE",
      gradient: "from-red-500 to-orange-500",
      hoverGradient: "from-red-600 to-orange-600",
    },
    {
      id: "love",
      emoji: "💙",
      label: "LOVE",
      gradient: "from-blue-500 to-cyan-500",
      hoverGradient: "from-blue-600 to-cyan-600",
    },
    {
      id: "shock",
      emoji: "😱",
      label: "SHOCK",
      gradient: "from-yellow-500 to-amber-500",
      hoverGradient: "from-yellow-600 to-amber-600",
    },
    {
      id: "rage",
      emoji: "😤",
      label: "RAGE",
      gradient: "from-red-700 to-red-900",
      hoverGradient: "from-red-800 to-red-950",
    },
  ]

  return (
    <div className="grid grid-cols-4 gap-4">
      {emotions.map((emotion) => (
        <Button
          key={emotion.id}
          onClick={() => onEmotionClick(emotion.id)}
          className={`
            h-16 flex flex-col items-center justify-center space-y-1
            bg-gradient-to-br ${emotion.gradient}
            hover:bg-gradient-to-br hover:${emotion.hoverGradient}
            transform hover:scale-105 transition-all duration-200
            border-0 shadow-lg hover:shadow-xl
            clip-path-hexagon
          `}
          style={{
            clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
          }}
        >
          <span className="text-2xl">{emotion.emoji}</span>
          <span className="text-xs font-bold text-white">{emotion.label}</span>
        </Button>
      ))}
    </div>
  )
}

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

interface EmotionButtonProps {
  type: string
  label: string
  emoji: string
  icon: React.ElementType
  color: string
  hoverColor: string
  count: number
  intensity: number
  isActive: boolean
  isSelected: boolean
  disabled: boolean
  onClick: () => void
}

export function EmotionButton({
  type,
  label,
  emoji,
  icon: Icon,
  color,
  hoverColor,
  count,
  intensity,
  isActive,
  isSelected,
  disabled,
  onClick
}: EmotionButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
    >
      <Button
        onClick={onClick}
        disabled={disabled}
        className={`
          relative h-24 w-full flex flex-col items-center justify-center space-y-2
          bg-gradient-to-br ${color}
          hover:bg-gradient-to-br hover:${hoverColor}
          border-0 shadow-lg hover:shadow-xl
          transition-all duration-300
          ${isSelected ? 'ring-4 ring-white ring-opacity-50' : ''}
          ${isActive ? 'ring-2 ring-yellow-400' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        aria-label={`${label} emotion`}
      >
        {/* Emotion Icon */}
        <div className="flex items-center space-x-2">
          <Icon className="w-6 h-6 text-white" />
          <span className="text-2xl">{emoji}</span>
        </div>
        
        {/* Emotion Label */}
        <span className="text-sm font-bold text-white">{label}</span>
        
        {/* Count Badge */}
        {count > 0 && (
          <div className="absolute top-2 right-2 bg-black/50 rounded-full px-2 py-1">
            <span className="text-xs text-white font-medium">
              {count}
            </span>
          </div>
        )}

        {/* Intensity Indicator */}
        {intensity > 0 && (
          <div className="absolute bottom-1 left-1 right-1">
            <div className="h-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white/60 rounded-full"
                style={{ width: `${intensity * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Active User Indicator */}
        {isActive && (
          <div className="absolute top-2 left-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
          </div>
        )}
      </Button>
    </motion.div>
  )
}
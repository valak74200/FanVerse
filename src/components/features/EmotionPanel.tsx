import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { EmotionButton } from "@/components/shared/EmotionButton"
import { 
  Users,
  Heart, 
  Zap, 
  Flame, 
  Frown, 
  Meh,
  AlertTriangle,
  TrendingUp
} from 'lucide-react'

type EmotionType = 'hype' | 'joy' | 'anger' | 'sadness' | 'surprise' | 'fear'

interface EmotionPanelProps {
  onEmotionSelect?: (emotion: EmotionType) => void
  emotionData?: Record<EmotionType, { count: number; intensity: number; userTriggered: boolean }>
  userProfile?: {
    id: string
    stats: {
      totalReactions: number
      favoriteEmotion: string | null
    }
  } | null
  cooldownTime?: number
}

export function EmotionPanel({
  onEmotionSelect,
  emotionData = {
    hype: { count: 0, intensity: 0, userTriggered: false },
    joy: { count: 0, intensity: 0, userTriggered: false },
    anger: { count: 0, intensity: 0, userTriggered: false },
    sadness: { count: 0, intensity: 0, userTriggered: false },
    surprise: { count: 0, intensity: 0, userTriggered: false },
    fear: { count: 0, intensity: 0, userTriggered: false }
  },
  userProfile = null,
  cooldownTime = 0
}: EmotionPanelProps) {
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType | null>(null)

  const emotions = [
    {
      type: 'hype' as EmotionType,
      label: 'HYPE',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-600',
      hoverColor: 'from-green-400 to-emerald-500',
      emoji: '🔥',
      description: 'Get hyped for exciting moments'
    },
    {
      type: 'joy' as EmotionType,
      label: 'JOY',
      icon: Heart,
      color: 'from-pink-500 to-red-500',
      hoverColor: 'from-pink-400 to-red-400',
      emoji: '😍',
      description: 'Share the joy for great plays'
    },
    {
      type: 'anger' as EmotionType,
      label: 'ANGER',
      icon: Flame,
      color: 'from-red-600 to-red-800',
      hoverColor: 'from-red-500 to-red-700',
      emoji: '😡',
      description: 'Express your anger and frustration'
    },
    {
      type: 'sadness' as EmotionType,
      label: 'SADNESS',
      icon: Frown,
      color: 'from-blue-600 to-indigo-700',
      hoverColor: 'from-blue-500 to-indigo-600',
      emoji: '😢',
      description: 'Show disappointment'
    },
    {
      type: 'surprise' as EmotionType,
      label: 'SURPRISE',
      icon: Zap,
      color: 'from-yellow-500 to-orange-600',
      hoverColor: 'from-yellow-400 to-orange-500',
      emoji: '😱',
      description: 'Show your surprise and amazement'
    },
    {
      type: 'fear' as EmotionType,
      label: 'FEAR',
      icon: Meh,
      color: 'from-gray-500 to-gray-700',
      hoverColor: 'from-gray-400 to-gray-600',
      emoji: '😰',
      description: 'Express fear and anxiety'
    }
  ]

  const handleEmotionClick = (emotionType: EmotionType) => {
    if (cooldownTime > 0) return

    setSelectedEmotion(emotionType)
    onEmotionSelect?.(emotionType)
    
    // Reset selection after animation
    setTimeout(() => setSelectedEmotion(null), 1000)
  }

  const getTotalEmotionCount = () => {
    return Object.values(emotionData).reduce((sum, emotion) => sum + emotion.count, 0)
  }

  const getEmotionPercentage = (emotion: EmotionType) => {
    const total = getTotalEmotionCount()
    return total > 0 ? (emotionData[emotion].count / total) * 100 : 0
  }

  const getMostPopularEmotion = () => {
    return Object.entries(emotionData).reduce((max, [emotion, data]) => 
      data.count > max.count ? { emotion: emotion as EmotionType, count: data.count } : max,
      { emotion: 'hype' as EmotionType, count: 0 }
    )
  }

  const mostPopular = getMostPopularEmotion()

  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <Card className="bg-gradient-to-r from-gray-900/95 via-black/90 to-gray-800/95 border-purple-500/30 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Crowd Emotions</h3>
              <p className="text-sm text-gray-400">Express yourself with the crowd</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-400">{getTotalEmotionCount()}</div>
            <div className="text-xs text-gray-400">Total Reactions</div>
          </div>
        </div>

        {/* Most Popular Emotion */}
        {mostPopular.count > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Crowd Feeling:</span>
            <div className="flex items-center space-x-2">
              <span className="text-white font-medium capitalize">{mostPopular.emotion}</span>
              <span className="text-lg">
                {emotions.find(e => e.type === mostPopular.emotion)?.emoji}
              </span>
            </div>
          </div>
        )}
      </Card>

      {/* Emotion Buttons Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {emotions.map((emotion) => {
          const emotionStats = emotionData[emotion.type]
          const percentage = getEmotionPercentage(emotion.type)
          const isSelected = selectedEmotion === emotion.type
          const isActive = emotionStats.userTriggered
          
          return (
            <EmotionButton
              key={emotion.type}
              type={emotion.type}
              label={emotion.label}
              emoji={emotion.emoji}
              icon={emotion.icon}
              color={emotion.color}
              hoverColor={emotion.hoverColor}
              count={emotionStats.count}
              intensity={emotionStats.intensity}
              isActive={isActive}
              isSelected={isSelected}
              disabled={cooldownTime > 0}
              onClick={() => handleEmotionClick(emotion.type)}
            />
          )
        })}
      </div>

      {/* Cooldown Indicator */}
      <AnimatePresence>
        {cooldownTime > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <Card className="bg-yellow-500/20 border-yellow-500/30 p-3">
              <div className="flex items-center justify-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 text-sm">
                  Cooldown: {Math.ceil(cooldownTime / 1000)}s
                </span>
              </div>
              <Progress 
                value={(2000 - cooldownTime) / 20} 
                className="mt-2 h-1"
              />
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emotion Statistics */}
      <Card className="bg-gray-900/95 border-gray-800 p-4">
        <h4 className="font-semibold text-white mb-3">Live Emotion Stats</h4>
        <div className="space-y-3">
          {emotions.map((emotion) => {
            const percentage = getEmotionPercentage(emotion.type)
            const count = emotionData[emotion.type].count
            
            if (count === 0) return null
            
            return (
              <div key={emotion.type} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{emotion.emoji}</span>
                    <span className="text-gray-300 capitalize">{emotion.type}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium">{count}</span>
                    <span className="text-gray-400">({percentage.toFixed(1)}%)</span>
                  </div>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            )
          })}
        </div>
      </Card>

      {/* User Stats */}
      {userProfile && (
        <Card className="bg-gray-900/95 border-gray-800 p-4">
          <h4 className="font-semibold text-white mb-3">Your Stats</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Total Reactions:</span>
              <div className="text-white font-medium">{userProfile.stats.totalReactions}</div>
            </div>
            <div>
              <span className="text-gray-400">Favorite Emotion:</span>
              <div className="text-white font-medium capitalize">
                {userProfile.stats.favoriteEmotion || 'None'}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
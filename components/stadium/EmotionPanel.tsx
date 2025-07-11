"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useAppSelector, useAppDispatch } from '@/store'
import { triggerEmotion, EmotionType } from '@/store/slices/emotionSlice'
import { incrementReactionCount, updateFavoriteEmotion } from '@/store/slices/userSlice'
import { useWebSocket } from '@/hooks/useWebSocket'
import { 
  Flame, 
  Zap, 
  Heart, 
  Frown, 
  Meh, 
  AlertTriangle,
  Users,
  TrendingUp
} from 'lucide-react'

const emotions = [
  {
    type: 'rage' as EmotionType,
    label: 'RAGE',
    icon: Flame,
    color: 'from-red-600 to-red-800',
    hoverColor: 'from-red-500 to-red-700',
    emoji: '😡',
    description: 'Express your anger and frustration'
  },
  {
    type: 'shock' as EmotionType,
    label: 'SHOCK',
    icon: Zap,
    color: 'from-yellow-500 to-orange-600',
    hoverColor: 'from-yellow-400 to-orange-500',
    emoji: '😱',
    description: 'Show your surprise and amazement'
  },
  {
    type: 'love' as EmotionType,
    label: 'LOVE',
    icon: Heart,
    color: 'from-pink-500 to-red-500',
    hoverColor: 'from-pink-400 to-red-400',
    emoji: '😍',
    description: 'Share the love for great plays'
  },
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
    type: 'boring' as EmotionType,
    label: 'BORING',
    icon: Meh,
    color: 'from-gray-500 to-gray-700',
    hoverColor: 'from-gray-400 to-gray-600',
    emoji: '😴',
    description: 'Express when the game is dull'
  },
  {
    type: 'sad' as EmotionType,
    label: 'SAD',
    icon: Frown,
    color: 'from-blue-600 to-indigo-700',
    hoverColor: 'from-blue-500 to-indigo-600',
    emoji: '😢',
    description: 'Show disappointment'
  }
]

export function EmotionPanel() {
  const dispatch = useAppDispatch()
  const { emitEmotion } = useWebSocket()
  const [cooldownTime, setCooldownTime] = useState(0)
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType | null>(null)

  const { 
    emotions: emotionData, 
    totalReactions, 
    userCooldown,
    isAnimating 
  } = useAppSelector(state => state.emotion)
  
  const { profile } = useAppSelector(state => state.user)

  // Cooldown timer
  useEffect(() => {
    if (userCooldown > 0) {
      const now = Date.now()
      const remaining = Math.max(0, 2000 - (now - userCooldown))
      setCooldownTime(remaining)

      if (remaining > 0) {
        const timer = setInterval(() => {
          const newRemaining = Math.max(0, 2000 - (Date.now() - userCooldown))
          setCooldownTime(newRemaining)
          
          if (newRemaining === 0) {
            clearInterval(timer)
          }
        }, 100)

        return () => clearInterval(timer)
      }
    }
  }, [userCooldown])

  const handleEmotionClick = (emotionType: EmotionType) => {
    if (cooldownTime > 0 || !profile) return

    // Dispatch to local store
    dispatch(triggerEmotion({ 
      emotion: emotionType, 
      userId: profile.id 
    }))

    // Update user stats
    dispatch(incrementReactionCount())
    dispatch(updateFavoriteEmotion(emotionType))

    // Emit to WebSocket
    emitEmotion(emotionType)

    // Visual feedback
    setSelectedEmotion(emotionType)
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
      <Card className="bg-gradient-to-r from-[#1a1a1a] to-[#2a1a2a] border-purple-500/30 p-4">
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
            <motion.div
              key={emotion.type}
              whileHover={{ scale: cooldownTime > 0 ? 1 : 1.05 }}
              whileTap={{ scale: cooldownTime > 0 ? 1 : 0.95 }}
            >
              <Button
                onClick={() => handleEmotionClick(emotion.type)}
                disabled={cooldownTime > 0}
                className={`
                  relative h-24 w-full flex flex-col items-center justify-center space-y-2
                  bg-gradient-to-br ${emotion.color}
                  hover:bg-gradient-to-br hover:${emotion.hoverColor}
                  border-0 shadow-lg hover:shadow-xl
                  transition-all duration-300
                  ${isSelected ? 'ring-4 ring-white ring-opacity-50' : ''}
                  ${isActive ? 'ring-2 ring-yellow-400' : ''}
                  ${cooldownTime > 0 ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                aria-label={`${emotion.label} emotion - ${emotion.description}`}
              >
                {/* Emotion Icon */}
                <div className="flex items-center space-x-2">
                  <emotion.icon className="w-6 h-6 text-white" />
                  <span className="text-2xl">{emotion.emoji}</span>
                </div>
                
                {/* Emotion Label */}
                <span className="text-sm font-bold text-white">{emotion.label}</span>
                
                {/* Count Badge */}
                {emotionStats.count > 0 && (
                  <div className="absolute top-2 right-2 bg-black/50 rounded-full px-2 py-1">
                    <span className="text-xs text-white font-medium">
                      {emotionStats.count}
                    </span>
                  </div>
                )}

                {/* Intensity Indicator */}
                {emotionStats.intensity > 0 && (
                  <div className="absolute bottom-1 left-1 right-1">
                    <Progress 
                      value={emotionStats.intensity * 100} 
                      className="h-1"
                    />
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
      <Card className="bg-[#1a1a1a] border-gray-800 p-4">
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
      {profile && (
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <h4 className="font-semibold text-white mb-3">Your Stats</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Total Reactions:</span>
              <div className="text-white font-medium">{profile.stats.totalReactions}</div>
            </div>
            <div>
              <span className="text-gray-400">Favorite Emotion:</span>
              <div className="text-white font-medium capitalize">
                {profile.stats.favoriteEmotion || 'None'}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
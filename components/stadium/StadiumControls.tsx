"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { useAppSelector, useAppDispatch } from '@/store'
import { 
  setViewMode, 
  setWeather, 
  setTimeOfDay, 
  setCrowdDensity, 
  setSoundLevel,
  toggleFullscreen,
  setPerformance
} from '@/store/slices/stadiumSlice'
import {
  Camera,
  Cloud,
  Sun,
  Moon,
  Users,
  Volume2,
  Maximize,
  Minimize,
  Settings,
  Zap,
  Eye,
  CloudRain,
  CloudSnow,
  Sunset
} from 'lucide-react'

export function StadiumControls() {
  const dispatch = useAppDispatch()
  const [showAdvanced, setShowAdvanced] = useState(false)
  
  const {
    viewMode,
    weather,
    timeOfDay,
    crowdDensity,
    soundLevel,
    isFullscreen,
    performance,
    spectatorCount
  } = useAppSelector(state => state.stadium)

  const viewModes = [
    { id: 'overview', label: 'Overview', icon: Eye, description: 'Full stadium view' },
    { id: 'field', label: 'Field', icon: Camera, description: 'Close to the action' },
    { id: 'stands', label: 'Stands', icon: Users, description: 'Crowd perspective' },
    { id: 'vip', label: 'VIP', icon: Zap, description: 'Premium seating' },
    { id: 'aerial', label: 'Aerial', icon: Camera, description: 'Bird\'s eye view' },
  ]

  const weatherOptions = [
    { id: 'clear', label: 'Clear', icon: Sun, color: 'text-yellow-400' },
    { id: 'rain', label: 'Rain', icon: CloudRain, color: 'text-blue-400' },
    { id: 'snow', label: 'Snow', icon: CloudSnow, color: 'text-gray-300' },
    { id: 'fog', label: 'Fog', icon: Cloud, color: 'text-gray-400' },
  ]

  const timeOptions = [
    { id: 'day', label: 'Day', icon: Sun, color: 'text-yellow-400' },
    { id: 'sunset', label: 'Sunset', icon: Sunset, color: 'text-orange-400' },
    { id: 'night', label: 'Night', icon: Moon, color: 'text-blue-300' },
  ]

  const performanceOptions = [
    { id: 'low', label: 'Low', description: 'Better performance' },
    { id: 'medium', label: 'Medium', description: 'Balanced' },
    { id: 'high', label: 'High', description: 'Best quality' },
  ]

  return (
    <div className="space-y-4">
      {/* Main Controls */}
      <Card className="bg-gradient-to-r from-[#1a1a1a] to-[#2a1a2a] border-purple-500/30 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white flex items-center">
            <Settings className="w-4 h-4 mr-2 text-purple-400" />
            Stadium Controls
          </h3>
          
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              {spectatorCount.toLocaleString()} fans
            </Badge>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => dispatch(toggleFullscreen())}
              className="border-gray-700 text-gray-400 hover:text-white"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Camera Views */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-300">Camera View</span>
            <Badge className="bg-purple-500/20 text-purple-400 capitalize">
              {viewMode}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {viewModes.map((mode) => (
              <Button
                key={mode.id}
                variant={viewMode === mode.id ? "default" : "outline"}
                size="sm"
                onClick={() => dispatch(setViewMode(mode.id as any))}
                className={`flex flex-col h-16 p-2 ${
                  viewMode === mode.id
                    ? "bg-gradient-to-r from-purple-500 to-pink-500"
                    : "border-gray-700 bg-transparent hover:border-purple-500/50"
                }`}
                title={mode.description}
              >
                <mode.icon className="w-4 h-4 mb-1" />
                <span className="text-xs">{mode.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Environment Controls */}
      <Card className="bg-[#1a1a1a] border-gray-800 p-4">
        <h4 className="font-semibold text-white mb-3">Environment</h4>
        
        <div className="space-y-4">
          {/* Weather */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300">Weather</span>
              <Badge className="bg-blue-500/20 text-blue-400 capitalize">
                {weather}
              </Badge>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {weatherOptions.map((option) => (
                <Button
                  key={option.id}
                  variant={weather === option.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => dispatch(setWeather(option.id as any))}
                  className={`flex flex-col h-12 p-2 ${
                    weather === option.id
                      ? "bg-blue-600"
                      : "border-gray-700 bg-transparent"
                  }`}
                >
                  <option.icon className={`w-4 h-4 ${option.color}`} />
                  <span className="text-xs mt-1">{option.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Time of Day */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300">Time of Day</span>
              <Badge className="bg-orange-500/20 text-orange-400 capitalize">
                {timeOfDay}
              </Badge>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {timeOptions.map((option) => (
                <Button
                  key={option.id}
                  variant={timeOfDay === option.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => dispatch(setTimeOfDay(option.id as any))}
                  className={`flex flex-col h-12 p-2 ${
                    timeOfDay === option.id
                      ? "bg-orange-600"
                      : "border-gray-700 bg-transparent"
                  }`}
                >
                  <option.icon className={`w-4 h-4 ${option.color}`} />
                  <span className="text-xs mt-1">{option.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Audio & Crowd Controls */}
      <Card className="bg-[#1a1a1a] border-gray-800 p-4">
        <h4 className="font-semibold text-white mb-3">Atmosphere</h4>
        
        <div className="space-y-4">
          {/* Crowd Density */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300 flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Crowd Density
              </span>
              <span className="text-sm text-white">{Math.round(crowdDensity * 100)}%</span>
            </div>
            <Slider
              value={[crowdDensity]}
              onValueChange={([value]) => dispatch(setCrowdDensity(value))}
              max={1}
              min={0.1}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Sound Level */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300 flex items-center">
                <Volume2 className="w-4 h-4 mr-2" />
                Sound Level
              </span>
              <span className="text-sm text-white">{Math.round(soundLevel * 100)}%</span>
            </div>
            <Slider
              value={[soundLevel]}
              onValueChange={([value]) => dispatch(setSoundLevel(value))}
              max={1}
              min={0}
              step={0.1}
              className="w-full"
            />
          </div>
        </div>
      </Card>

      {/* Advanced Settings */}
      <Card className="bg-[#1a1a1a] border-gray-800 p-4">
        <Button
          variant="ghost"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full justify-between text-gray-400 hover:text-white p-0"
        >
          <span className="flex items-center">
            <Zap className="w-4 h-4 mr-2" />
            Advanced Settings
          </span>
          <motion.div
            animate={{ rotate: showAdvanced ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Settings className="w-4 h-4" />
          </motion.div>
        </Button>

        <motion.div
          initial={false}
          animate={{ height: showAdvanced ? "auto" : 0, opacity: showAdvanced ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="pt-4 space-y-4">
            {/* Performance Settings */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">Performance</span>
                <Badge className="bg-green-500/20 text-green-400 capitalize">
                  {performance}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {performanceOptions.map((option) => (
                  <Button
                    key={option.id}
                    variant={performance === option.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => dispatch(setPerformance(option.id as any))}
                    className={`flex flex-col h-16 p-2 text-xs ${
                      performance === option.id
                        ? "bg-green-600"
                        : "border-gray-700 bg-transparent"
                    }`}
                    title={option.description}
                  >
                    <span className="font-medium">{option.label}</span>
                    <span className="text-xs opacity-70 mt-1">{option.description}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Performance Info */}
            <div className="text-xs text-gray-500 space-y-1">
              <p>• <strong>Low:</strong> Fewer spectators, basic lighting, better performance</p>
              <p>• <strong>Medium:</strong> Balanced quality and performance</p>
              <p>• <strong>High:</strong> Maximum spectators, advanced effects, best quality</p>
            </div>
          </div>
        </motion.div>
      </Card>
    </div>
  )
}
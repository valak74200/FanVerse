"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import dynamic from "next/dynamic"
import { ChilizWallet } from "@/components/chiliz-wallet"
import { NavigationMenu } from "@/components/navigation-menu"
import { GroupManagement } from "@/components/group-management"
import { AdvancedChat } from "@/components/advanced-chat"
import { BettingCards } from "@/components/betting-cards"
import { EmotionPanel } from "@/components/stadium/EmotionPanel"
import { Users, Clock, Wallet, Camera, Volume2, Sun, Cloud, Zap, Menu, X, Maximize, Minimize } from "lucide-react"
import { NFTMoments } from "@/components/nft-moments"
import { NFTMarketplace } from "@/components/nft-marketplace"
import { NFTCollection } from "@/components/nft-collection"

// Charger VirtualStadium uniquement côté client
const VirtualStadium = dynamic(() => import('@/components/stadium/VirtualStadium').then(mod => ({ default: mod.VirtualStadium })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-black">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p>Chargement du stade virtuel...</p>
      </div>
    </div>
  )
})

export default function TribuneDashboard() {
  const [activeSection, setActiveSection] = useState("stadium")
  const [matchTime, setMatchTime] = useState({ minutes: 67, seconds: 23 })
  const [cameraView, setCameraView] = useState("drone")
  const [weather, setWeather] = useState("clear")
  const [crowdVolume, setCrowdVolume] = useState(75)
  const [collectiveEmotion, setCollectiveEmotion] = useState(65)
  const [showCollectiveMoment, setShowCollectiveMoment] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState("psg-ultras")
  const [notifications, setNotifications] = useState(5)
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [chilizBalance, setChilizBalance] = useState(0)

  const matchData = {
    score: { home: 2, away: 1 },
    time: matchTime,
    events: [
      { type: "goal", player: "Mbappé", time: "23'" },
      { type: "goal", player: "Lewandowski", time: "45'" },
      { type: "goal", player: "Dembélé", time: "67'" },
    ],
  }

  // Timer du match
  useEffect(() => {
    const interval = setInterval(() => {
      setMatchTime((prev) => {
        const newSeconds = prev.seconds + 1
        if (newSeconds >= 60) {
          return { minutes: prev.minutes + 1, seconds: 0 }
        }
        return { ...prev, seconds: newSeconds }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleEmotionClick = (emotion: string) => {
    setCollectiveEmotion((prev) => Math.min(100, prev + 10))
    if (collectiveEmotion > 80) {
      setShowCollectiveMoment(true)
      setTimeout(() => setShowCollectiveMoment(false), 3000)
    }
  }

  const renderMainContent = () => {
    switch (activeSection) {
      case "stadium":
        return (
          <div className="flex-1 flex flex-col">
            {/* Contrôles du stade */}
            <Card className="bg-gradient-to-r from-[#1a1a1a] to-[#2a1a2a] border-purple-500/30 p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Camera className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-medium text-white">Caméra:</span>
                    <div className="flex space-x-1">
                      {["drone", "ground", "tactical", "corner", "cinematic"].map((view) => (
                        <Button
                          key={view}
                          size="sm"
                          variant={cameraView === view ? "default" : "outline"}
                          onClick={() => setCameraView(view)}
                          className={`capitalize ${
                            cameraView === view
                              ? "bg-gradient-to-r from-purple-500 to-pink-500"
                              : "border-gray-700 text-gray-300"
                          }`}
                        >
                          {view}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-white">Météo:</span>
                    <Button
                      size="sm"
                      variant={weather === "clear" ? "default" : "outline"}
                      onClick={() => setWeather("clear")}
                      className={weather === "clear" ? "bg-yellow-500" : "border-gray-700"}
                    >
                      <Sun className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={weather === "rain" ? "default" : "outline"}
                      onClick={() => setWeather("rain")}
                      className={weather === "rain" ? "bg-blue-500" : "border-gray-700"}
                    >
                      <Cloud className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Volume2 className="w-4 h-4 text-purple-400" />
                    <div className="w-20">
                      <Progress value={crowdVolume} className="h-2" />
                    </div>
                    <span className="text-xs text-gray-400">{crowdVolume}%</span>
                  </div>

                  <Button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Stade 3D */}
            <div className={`flex-1 relative ${isFullscreen ? "fixed inset-0 z-50 bg-black" : ""}`}>
              <VirtualStadium />

              {/* Popup moment collectif */}
              {showCollectiveMoment && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-lg text-2xl font-bold animate-pulse">
                    <Zap className="w-8 h-8 inline mr-2" />
                    MOMENT COLLECTIF!
                  </div>
                </div>
              )}

              {/* Bouton de sortie plein écran */}
              {isFullscreen && (
                <Button
                  onClick={() => setIsFullscreen(false)}
                  className="absolute top-4 right-4 bg-black/50 hover:bg-black/70"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Panel d'émotions */}
            {!isFullscreen && (
              <Card className="bg-[#1a1a1a] border-gray-800 p-4 mt-4">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">Énergie Collective</span>
                    <span className="text-sm text-gray-400">{collectiveEmotion}%</span>
                  </div>
                  <Progress value={collectiveEmotion} className="h-3" />
                </div>
                <EmotionPanel />
              </Card>
            )}
          </div>
        )

      case "groups":
        return <GroupManagement onGroupSelect={setSelectedGroup} selectedGroup={selectedGroup} />

      case "chat":
        return (
          <AdvancedChat
            chatType={selectedGroup ? "group" : "general"}
            groupId={selectedGroup || undefined}
            onVoiceChatToggle={(enabled) => console.log("Voice chat:", enabled)}
          />
        )

      case "betting":
        return (
          <div className="space-y-4">
            <BettingCards />
          </div>
        )
      case "nft-moments":
        return (
          <NFTMoments
            onMomentCapture={(moment) => console.log("Moment captured:", moment)}
            matchEvents={matchData.events}
          />
        )

      case "nft-marketplace":
        return <NFTMarketplace />

      case "nft-collection":
        return <NFTCollection />
      default:
        return (
          <div className="flex-1 flex items-center justify-center">
            <Card className="bg-[#1a1a1a] border-gray-800 p-8 text-center">
              <h3 className="text-xl font-bold text-white mb-2">Section en développement</h3>
              <p className="text-gray-400">Cette fonctionnalité arrive bientôt!</p>
            </Card>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a0a1a] to-[#0a0a0a] text-white">
      {/* Header futuriste */}
      <header className="bg-gradient-to-r from-[#1a1a1a]/90 to-[#2a1a2a]/90 backdrop-blur-xl border-b border-purple-500/30 px-6 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          {/* Logo et menu toggle */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuCollapsed(!isMenuCollapsed)}
              className="text-purple-400 hover:text-white lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                FanVerse
              </h1>
            </div>
          </div>

          {/* Info du match */}
          <div className="flex items-center space-x-4 text-center">
            <Card className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border-red-500/30 px-4 py-2">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <div>
                  <div className="text-sm text-gray-300">LIVE</div>
                  <div className="font-bold text-white">
                    PSG {matchData.score.home} - {matchData.score.away} Barcelona
                  </div>
                  <div className="text-sm text-gray-400 flex items-center justify-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {matchTime.minutes}:{matchTime.seconds.toString().padStart(2, "0")}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Profil utilisateur */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Avatar className="w-10 h-10 border-2 border-purple-500">
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500">AX</AvatarFallback>
              </Avatar>
              <div className="text-sm hidden md:block">
                <div className="font-medium text-white">Alex Rodriguez</div>
                <div className="text-gray-400 flex items-center">
                  <Users className="w-3 h-3 mr-1" />
                  12 amis en ligne
                </div>
              </div>
            </div>

            <Separator orientation="vertical" className="h-8 bg-gray-700" />

            <div className="flex items-center space-x-2">
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <Wallet className="w-3 h-3 mr-1" />
                {chilizBalance.toFixed(1)} CHZ
              </Badge>
              {notifications > 0 && <Badge className="bg-red-500 text-white animate-pulse">{notifications}</Badge>}
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Menu de navigation */}
        <div className={`${isMenuCollapsed ? "w-16" : "w-80"} transition-all duration-300 hidden lg:block`}>
          <NavigationMenu
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            notifications={notifications}
          />
        </div>

        {/* Contenu principal */}
        <div className="flex-1 p-4 overflow-hidden">{renderMainContent()}</div>

        {/* Sidebar droite */}
        <div className="w-80 p-4 space-y-4 overflow-y-auto hidden xl:block">
          <ChilizWallet onBalanceChange={setChilizBalance} />

          {activeSection === "stadium" && (
            <AdvancedChat chatType="general" onVoiceChatToggle={(enabled) => console.log("Voice chat:", enabled)} />
          )}
        </div>
      </div>

      {/* Menu mobile */}
      {!isMenuCollapsed && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
          <div className="w-80 h-full bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] border-r border-purple-500/30">
            <div className="p-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuCollapsed(true)}
                className="text-purple-400 hover:text-white mb-4"
              >
                <X className="w-5 h-5" />
              </Button>
              <NavigationMenu
                activeSection={activeSection}
                onSectionChange={(section) => {
                  setActiveSection(section)
                  setIsMenuCollapsed(true)
                }}
                notifications={notifications}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

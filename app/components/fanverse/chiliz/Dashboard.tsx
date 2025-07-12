"use client"
import { useState, useEffect, useRef, type FormEvent, type MouseEvent } from "react"
import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import {
  Send,
  Waves,
  Megaphone,
  Clapperboard,
  Heart,
  ThumbsDown,
  Zap,
  Rocket,
  Meh,
  Frown,
  Bot,
  Clock,
  BarChart2,
  Vote,
  Wallet,
  LogOut,
  CheckCircle,
} from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import AnimatedCounter from "./AnimatedCounter"
import ChilizIcon from "./ChilizIcon"

// --- TYPES ---
type Emotion = { name: string; icon: React.ReactNode; color: string; sentiment: number }
type CollectiveAction = { name: string; icon: React.ReactNode; progress: number; description: string }
type ChatMessage = { id: number; user: string; avatar: string; message: string; isYou?: boolean }
type MintableHighlight = {
  id: string
  title: string
  timestamp: string
  peakEmotion: { name: string; icon: React.ReactNode; color: string }
  image: string
  price: number
  mints: number
}
type Poll = {
  id: string
  question: string
  options: { id: string; text: string }[]
  votes: Record<string, number>
}
type UserData = {
  avatar: string
  balance: number
  rank: number
}
type EventData = {
  teamA: { name: string; logo: string; score: number }
  teamB: { name: string; logo: string; score: number }
  time: number // in seconds
}
type EmotionHistoryPoint = {
  love: number
  hype: number
  shock: number
  rage: number
}

// --- INITIAL DATA ---
const initialEmotions: Emotion[] = [
  { name: "Rage", icon: <ThumbsDown size={16} />, color: "text-red-500", sentiment: 12 },
  { name: "Shock", icon: <Zap size={16} />, color: "text-yellow-400", sentiment: 34 },
  { name: "Love", icon: <Heart size={16} />, color: "text-red-400", sentiment: 88 },
  { name: "Hype", icon: <Rocket size={16} />, color: "text-green-500", sentiment: 76 },
  { name: "Boring", icon: <Meh size={16} />, color: "text-gray-500", sentiment: 5 },
  { name: "Sad", icon: <Frown size={16} />, color: "text-blue-500", sentiment: 8 },
]

const initialActions: CollectiveAction[] = [
  { name: "Ola", icon: <Waves />, progress: 65, description: "Start a stadium wave" },
  { name: "Chant", icon: <Megaphone />, progress: 80, description: "Join the fan chant" },
  { name: "Applause", icon: <Clapperboard />, progress: 45, description: "Give a round of applause" },
]

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    user: "0xAlice.eth",
    avatar: "/placeholder.svg?height=40&width=40",
    message: "Let's gooo! This is our game!",
  },
  {
    id: 2,
    user: "0xBob.eth",
    avatar: "/placeholder.svg?height=40&width=40",
    message: "What a play! Unbelievable skill.",
  },
]

const initialHighlights: MintableHighlight[] = [
  {
    id: "highlight-1",
    title: "Victory Goal (92')",
    timestamp: "01:32:15",
    peakEmotion: { name: "Hype", icon: <Rocket className="h-3 w-3" />, color: "text-green-500" },
    image: "/placeholder.svg?height=64&width=64",
    price: 50,
    mints: 125,
  },
  {
    id: "highlight-2",
    title: "Decisive Save",
    timestamp: "00:48:33",
    peakEmotion: { name: "Shock", icon: <Zap className="h-3 w-3" />, color: "text-yellow-400" },
    image: "/placeholder.svg?height=64&width=64",
    price: 20,
    mints: 342,
  },
  {
    id: "highlight-3",
    title: "Red Card Drama",
    timestamp: "00:23:12",
    peakEmotion: { name: "Rage", icon: <ThumbsDown className="h-3 w-3" />, color: "text-red-500" },
    image: "/placeholder.svg?height=64&width=64",
    price: 35,
    mints: 89,
  },
]

const initialPolls: Poll[] = [
  {
    id: "poll-1",
    question: "Qui sera le MVP du match ?",
    options: [
      { id: "opt-1", text: "Joueur A" },
      { id: "opt-2", text: "Joueur B" },
      { id: "opt-3", text: "Gardien" },
    ],
    votes: { "opt-1": 58, "opt-2": 42, "opt-3": 23 },
  },
]

const initialUserData: UserData = {
  avatar: "/placeholder.svg?height=40&width=40",
  balance: 1337,
  rank: 42,
}

const initialEventData: EventData = {
  teamA: { name: "Red Dragons", logo: "/placeholder.svg?height=40&width=40", score: 2 },
  teamB: { name: "Blue Knights", logo: "/placeholder.svg?height=40&width=40", score: 1 },
  time: 4085, // 68:05
}

const emotionColors: Record<keyof EmotionHistoryPoint, string> = {
  love: "hsl(var(--primary))",
  hype: "#22c55e",
  shock: "#eab308",
  rage: "#ef4444",
}

// --- FRAMER MOTION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
}

// --- HELPER COMPONENTS ---

const EventStatus = ({ event }: { event: EventData }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  }

  return (
    <motion.div variants={itemVariants} className="mb-6">
      <Card className="hud-panel bg-black/60 backdrop-blur-md">
        <CardContent className="p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Image
              src={event.teamA.logo || "/placeholder.svg"}
              alt={event.teamA.name}
              width={40}
              height={40}
              className={cn(
                "rounded-full transition-all",
                event.teamA.score > event.teamB.score && "pulse-glow-primary",
              )}
            />
            <span className="font-bold text-lg hidden sm:inline">{event.teamA.name}</span>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold tracking-wider text-glow-primary">
              <AnimatedCounter value={event.teamA.score} /> - <AnimatedCounter value={event.teamB.score} />
            </div>
            <div className="text-sm text-primary flex items-center justify-center gap-2">
              <Clock size={14} />
              <span>{formatTime(event.time)}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-bold text-lg hidden sm:inline">{event.teamB.name}</span>
            <Image
              src={event.teamB.logo || "/placeholder.svg"}
              alt={event.teamB.name}
              width={40}
              height={40}
              className={cn(
                "rounded-full transition-all",
                event.teamB.score > event.teamA.score && "pulse-glow-primary",
              )}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

const EmotionGraph = ({ history }: { history: EmotionHistoryPoint[] }) => {
  const width = 300
  const height = 100
  const maxPoints = 30

  if (!history.length) return null

  return (
    <div className="relative h-[100px] w-full bg-black/20 rounded-md mt-4">
      <svg viewBox={`0 0 ${width} ${height}`} className="absolute inset-0">
        <defs>
          {Object.entries(emotionColors).map(([key, color]) => (
            <linearGradient key={key} id={`gradient-${key}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.4} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        {Object.keys(emotionColors).map((key) => {
          const emotionKey = key as keyof EmotionHistoryPoint
          const points = history
            .map((p, i) => {
              const x = (i / (maxPoints - 1)) * width
              const y = height - (p[emotionKey] / 100) * height
              return `${x},${y}`
            })
            .join(" ")

          const areaPoints = `${points} ${width},${height} 0,${height}`

          return (
            <g key={emotionKey}>
              <motion.polyline
                points={points}
                fill="none"
                stroke={emotionColors[emotionKey]}
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />
              <motion.polyline
                points={areaPoints}
                fill={`url(#gradient-${emotionKey})`}
                stroke="none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// --- MAIN DASHBOARD COMPONENT ---
export default function Dashboard() {
  const { toast } = useToast()
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>("Love")
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const [mintingStates, setMintingStates] = useState<Record<string, boolean>>({})
  const [eventData, setEventData] = useState(initialEventData)
  const [polls, setPolls] = useState(initialPolls)
  const [selectedPollOption, setSelectedPollOption] = useState<Record<string, string>>({})
  const [emotionHistory, setEmotionHistory] = useState<EmotionHistoryPoint[]>([])
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Wallet State
  const [account, setAccount] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  // --- EFFECTS ---
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  // Simulate live event time
  useEffect(() => {
    const timer = setInterval(() => {
      setEventData((prev) => ({ ...prev, time: prev.time + 1 }))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Simulate live emotion graph data
  useEffect(() => {
    const historyTimer = setInterval(() => {
      const newPoint: EmotionHistoryPoint = {
        love: Math.min(100, Math.max(0, (emotionHistory.at(-1)?.love || 70) + (Math.random() - 0.5) * 10)),
        hype: Math.min(100, Math.max(0, (emotionHistory.at(-1)?.hype || 60) + (Math.random() - 0.5) * 10)),
        shock: Math.min(100, Math.max(0, (emotionHistory.at(-1)?.shock || 20) + (Math.random() - 0.4) * 15)),
        rage: Math.min(100, Math.max(0, (emotionHistory.at(-1)?.rage || 10) + (Math.random() - 0.6) * 10)),
      }
      setEmotionHistory((prev) => [...prev.slice(-29), newPoint])
    }, 2000)
    return () => clearInterval(historyTimer)
  }, [emotionHistory])

  // Simulate bot messages
  useEffect(() => {
    const interval = setInterval(() => {
      const botMessages = [
        "New highlight available for minting!",
        "The collective chant is getting louder!",
        "Massive spike in HYPE detected!",
        "Don't forget to vote on the current poll!",
      ]
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          user: "FanBot",
          avatar: "/placeholder.svg?height=40&width=40",
          message: botMessages[Math.floor(Math.random() * botMessages.length)],
        },
      ])
    }, 20000)
    return () => clearInterval(interval)
  }, [])

  // --- HANDLERS ---
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const handleConnectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      toast({
        title: "MetaMask non détecté",
        description: "Veuillez installer MetaMask pour vous connecter.",
        variant: "destructive",
      })
      return
    }

    setIsConnecting(true)
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      if (accounts && Array.isArray(accounts)) {
        setAccount(accounts[0])
        toast({ title: "Portefeuille connecté", description: `Connecté avec ${accounts[0].substring(0, 6)}...` })
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      toast({
        title: "Échec de la connexion",
        description: "La demande de connexion au portefeuille a été rejetée.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    setAccount(null)
    toast({ title: "Portefeuille déconnecté" })
  }

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() === "") return
    setMessages([
      ...messages,
      {
        id: Date.now(),
        user: account ? `${account.substring(0, 6)}...` : "You",
        avatar: initialUserData.avatar,
        message: newMessage,
        isYou: true,
      },
    ])
    setNewMessage("")
  }

  const handleMint = async (highlight: MintableHighlight) => {
    if (!account) {
      toast({
        title: "Portefeuille non connecté",
        description: "Veuillez connecter votre portefeuille pour minter un highlight.",
        variant: "destructive",
      })
      return
    }
    setMintingStates((prev) => ({ ...prev, [highlight.id]: true }))
    toast({
      title: "Minting en cours...",
      description: `Soumission de la transaction pour "${highlight.title}".`,
    })

    await new Promise((resolve) => setTimeout(resolve, 2000))

    const isSuccess = Math.random() > 0.2
    if (isSuccess) {
      toast({
        title: "Minting réussi !",
        description: `Vous avez minter avec succès "${highlight.title}".`,
      })
    } else {
      toast({
        title: "Échec du Minting",
        description: "Impossible de finaliser la transaction. Veuillez réessayer.",
        variant: "destructive",
      })
    }
    setMintingStates((prev) => ({ ...prev, [highlight.id]: false }))
  }

  const handleVote = (pollId: string, optionId: string) => {
    setSelectedPollOption((prev) => ({ ...prev, [pollId]: optionId }))
    setPolls((prevPolls) =>
      prevPolls.map((p) => {
        if (p.id === pollId) {
          const newVotes = { ...p.votes }
          newVotes[optionId] = (newVotes[optionId] || 0) + 1
          return { ...p, votes: newVotes }
        }
        return p
      }),
    )
    toast({ title: "Vote enregistré !", description: "Votre vote a été comptabilisé." })
  }

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-black/40 backdrop-blur-sm">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit={{ opacity: 0 }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-10"
      >
        <EventStatus event={eventData} />

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Column 1: Fan Interactions */}
          <div className="xl:col-span-1 space-y-6">
            <motion.div variants={itemVariants}>
              <Card
                className="hud-panel relative overflow-hidden bg-black/60 backdrop-blur-md"
                onMouseMove={handleMouseMove}
                style={
                  {
                    "--mouse-x": `${mousePosition.x}px`,
                    "--mouse-y": `${mousePosition.y}px`,
                  } as React.CSSProperties
                }
              >
                <motion.div
                  className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(300px at var(--mouse-x) var(--mouse-y), hsla(var(--primary), 0.15), transparent 80%)`,
                  }}
                />
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart2 size={18} /> Fan Pulse
                  </CardTitle>
                  <CardDescription>Montrez votre réaction en temps réel.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    {initialEmotions.map((e) => (
                      <motion.div key={e.name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant={selectedEmotion === e.name ? "default" : "secondary"}
                          onClick={() => setSelectedEmotion(e.name)}
                          className={cn(
                            "h-20 flex-col space-y-1 w-full transition-all duration-300",
                            selectedEmotion === e.name && "bg-primary/80 shadow-lg shadow-primary/20",
                          )}
                        >
                          <span className={e.color}>{e.icon}</span>
                          <span className="text-xs">{e.name}</span>
                          <Progress value={e.sentiment} className="h-1 w-full bg-black/20" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                  <EmotionGraph history={emotionHistory} />
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Card className="hud-panel bg-black/60 backdrop-blur-md">
                <CardHeader>
                  <CardTitle>Actions Collectives</CardTitle>
                  <CardDescription>Rejoignez d'autres fans pour créer des moments massifs.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <TooltipProvider>
                    {initialActions.map((action) => (
                      <Tooltip key={action.name}>
                        <TooltipTrigger asChild>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                              <div className="flex items-center gap-2">
                                {action.icon}
                                <span>{action.name}</span>
                              </div>
                              <span>{action.progress}%</span>
                            </div>
                            <Progress value={action.progress} className="h-2" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{action.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </TooltipProvider>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Column 2: Event Chat */}
          <motion.div variants={itemVariants} className="xl:col-span-1">
            <Card className="hud-panel h-full flex flex-col max-h-[80vh] bg-black/60 backdrop-blur-md">
              <CardHeader>
                <CardTitle>Chat de l'événement</CardTitle>
              </CardHeader>
              <CardContent ref={chatContainerRef} className="flex-grow space-y-4 text-sm overflow-y-auto pr-2">
                <AnimatePresence>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className={cn("flex items-start gap-3", msg.isYou && "justify-end")}
                    >
                      {!msg.isYou && (
                        <Avatar className="h-8 w-8 border-2 border-accent-comp/30">
                          <AvatarImage src={msg.avatar || "/placeholder.svg"} alt={msg.user} />
                          <AvatarFallback>{msg.user.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={cn(
                          "max-w-xs rounded-lg px-3 py-2",
                          msg.isYou
                            ? "bg-primary text-primary-foreground"
                            : msg.user === "FanBot"
                              ? "bg-muted text-muted-foreground italic"
                              : "bg-secondary",
                        )}
                      >
                        {!msg.isYou && (
                          <p className="text-xs font-bold text-primary/80 mb-1">
                            {msg.user === "FanBot" ? (
                              <span className="flex items-center gap-1">
                                <Bot size={12} /> {msg.user}
                              </span>
                            ) : (
                              msg.user
                            )}
                          </p>
                        )}
                        <p>{msg.message}</p>
                      </div>
                      {msg.isYou && (
                        <Avatar className="h-8 w-8 border-2 border-white/30">
                          <AvatarImage src={msg.avatar || "/placeholder.svg"} alt={msg.user} />
                          <AvatarFallback>You</AvatarFallback>
                        </Avatar>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </CardContent>
              <div className="p-4 border-t border-border/50">
                <form onSubmit={handleSendMessage} className="flex w-full space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Envoyer un message..."
                    className="bg-input"
                  />
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </Card>
          </motion.div>

          {/* Column 3: Wallet & Poll */}
          <div className="xl:col-span-1 space-y-6">
            <motion.div variants={itemVariants}>
              <Card className="hud-panel bg-black/60 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet size={18} /> Mon Portefeuille
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {account ? (
                    <>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border-2 border-primary/50">
                          <AvatarImage src={initialUserData.avatar || "/placeholder.svg"} />
                          <AvatarFallback>YOU</AvatarFallback>
                        </Avatar>
                        <div className="truncate">
                          <p className="font-bold">
                            {account.substring(0, 6)}...{account.substring(account.length - 4)}
                          </p>
                          <p className="text-xs text-green-400 flex items-center gap-1">
                            <CheckCircle size={12} /> Connecté
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center bg-black/20 p-3 rounded-md">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <ChilizIcon className="w-4 h-4" /> Solde CHZ
                        </span>
                        <span className="font-bold">
                          <AnimatedCounter value={initialUserData.balance} />
                        </span>
                      </div>
                      <Button onClick={handleDisconnect} variant="outline" className="w-full bg-transparent">
                        <LogOut className="mr-2 h-4 w-4" />
                        Déconnecter
                      </Button>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground mb-4">Connectez-vous pour interagir avec la plateforme.</p>
                      <Button onClick={handleConnectWallet} disabled={isConnecting} className="w-full">
                        <Wallet className="mr-2 h-4 w-4" />
                        {isConnecting ? "Connexion..." : "Connecter MetaMask"}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Card className="hud-panel bg-black/60 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Vote size={18} /> Sondage en direct
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {polls.map((poll) => {
                    const totalVotes = Object.values(poll.votes).reduce((a, b) => a + b, 0)
                    const hasVoted = !!selectedPollOption[poll.id]
                    return (
                      <div key={poll.id}>
                        <p className="font-semibold mb-4 text-center">{poll.question}</p>
                        <div className="space-y-3">
                          {poll.options.map((option) => {
                            const voteCount = poll.votes[option.id] || 0
                            const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0
                            const isSelected = selectedPollOption[poll.id] === option.id
                            return (
                              <motion.div
                                key={option.id}
                                whileHover={!hasVoted ? { scale: 1.02 } : {}}
                                className="relative"
                              >
                                <Button
                                  variant="outline"
                                  onClick={() => !hasVoted && handleVote(poll.id, option.id)}
                                  disabled={hasVoted}
                                  className={cn(
                                    "w-full justify-between h-12 p-0 overflow-hidden bg-transparent border-border/50",
                                    isSelected && "border-primary bg-primary/10",
                                    !hasVoted && "hover:border-primary/50",
                                  )}
                                >
                                  <div className="relative w-full flex items-center justify-between px-4 z-10">
                                    <span className="flex items-center gap-2">
                                      {isSelected && <CheckCircle size={16} className="text-primary" />}
                                      {option.text}
                                    </span>
                                    <span className="font-bold">{percentage.toFixed(0)}%</span>
                                  </div>
                                  <motion.div
                                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary/30 to-primary/10 z-0"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                  />
                                </Button>
                              </motion.div>
                            )
                          })}
                        </div>
                        {hasVoted && (
                          <p className="text-xs text-muted-foreground text-center mt-3">
                            Total des votes: {totalVotes}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Column 4: Highlights */}
          <motion.div variants={itemVariants} className="xl:col-span-1">
            <Card className="hud-panel bg-black/60 backdrop-blur-md">
              <CardHeader>
                <CardTitle>Highlights à Minter</CardTitle>
                <CardDescription>Possédez les plus grands moments de l'événement.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[70vh] overflow-y-auto">
                <AnimatePresence>
                  {initialHighlights.map((h) => (
                    <motion.div
                      key={h.id}
                      layout
                      whileHover={{ scale: 1.02 }}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="group p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-all duration-300 border border-border/30"
                    >
                      <div className="flex items-start space-x-3 mb-3">
                        <motion.div whileHover={{ scale: 1.1 }} className="shimmer-effect">
                          <Image
                            src={h.image || "/placeholder.svg"}
                            alt={h.title}
                            width={80}
                            height={80}
                            className="rounded-md border-2 border-border"
                          />
                        </motion.div>
                        <div className="flex-grow">
                          <h4 className="font-semibold text-sm mb-1">{h.title}</h4>
                          <p className="text-xs text-muted-foreground mb-1">{h.timestamp}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            Émotion Pic:
                            <span className={cn("flex items-center gap-1", h.peakEmotion.color)}>
                              {h.peakEmotion.icon} {h.peakEmotion.name}
                            </span>
                          </p>
                          <p className="text-xs text-muted-foreground">Mints: {h.mints}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleMint(h)}
                        disabled={mintingStates[h.id]}
                        className="w-full bg-primary/80 hover:bg-primary text-white flex items-center justify-center gap-2"
                      >
                        {mintingStates[h.id] ? (
                          "Minting..."
                        ) : (
                          <>
                            <ChilizIcon className="w-4 h-4" />
                            Minter pour {h.price} CHZ
                          </>
                        )}
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

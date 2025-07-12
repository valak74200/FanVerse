"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, Mic, MicOff, Volume2, Smile, ImageIcon, Crown, MessageCircle, Settings } from "lucide-react"

interface ChatMessage {
  id: number | string
  user: string
  message: string
  timestamp: string
  avatar: string
  type: "text" | "voice" | "emoji" | "gif" | "system"
  isVip?: boolean
  reactions?: Array<{ emoji: string; count: number; users: string[] }>
  fanTokens?: number
}

interface AdvancedChatProps {
  chatType: "general" | "group"
  groupId?: string
  onVoiceChatToggle?: (enabled: boolean) => void
}

export function AdvancedChat({ chatType, groupId, onVoiceChatToggle }: AdvancedChatProps) {
  const [messages, setMessages] = useState([
    {
      id: "1",
      user: "Mike_PSG",
      message: "MBAPPÉ IS ON FIRE! 🔥🔥🔥",
      timestamp: "67:15",
      avatar: "M",
      type: "text",
      isVip: true,
      reactions: [
        { emoji: "🔥", count: 12, users: ["Alex", "Sophie", "Thomas"] },
        { emoji: "⚽", count: 8, users: ["Maria", "Lucas"] },
      ],
      fanTokens: 50,
    },
    {
      id: "2",
      user: "Sarah_Barca",
      message: "That was close! Great save by Ter Stegen 🧤",
      timestamp: "67:18",
      avatar: "S",
      type: "text",
      reactions: [{ emoji: "👏", count: 5, users: ["Alex", "Mike"] }],
    },
    {
      id: "3",
      user: "System",
      message: "Alex a rejoint le chat vocal",
      timestamp: "67:19",
      avatar: "🤖",
      type: "system",
    },
    {
      id: "4",
      user: "Alex_Ultra",
      message: "🎵 Audio message (0:15)",
      timestamp: "67:20",
      avatar: "A",
      type: "voice",
      isVip: true,
      fanTokens: 25,
    },
  ])

  const [newMessage, setNewMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isVoiceChatActive, setIsVoiceChatActive] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [voiceParticipants, setVoiceParticipants] = useState([
    { name: "Alex", avatar: "A", isSpeaking: true, isMuted: false },
    { name: "Mike", avatar: "M", isSpeaking: false, isMuted: false },
    { name: "Sarah", avatar: "S", isSpeaking: false, isMuted: true },
    { name: "Thomas", avatar: "T", isSpeaking: true, isMuted: false },
  ])

  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

  const quickEmojis = ["🔥", "⚽", "🏆", "💙", "❤️", "😱", "👏", "🎉", "💪", "⭐"]
  const fanTokenRewards = {
    message: 1,
    voice: 5,
    reaction: 2,
    gif: 3,
  }

  useEffect(() => {
    // Simulation de nouveaux messages
    const interval = setInterval(
      () => {
        const mockMessages = [
          "Incroyable cette action! 🤩",
          "Le stade est en feu! 🔥",
          "Quelle ambiance! 🎵",
          "VAR... suspense total 😬",
          "GOOOOOAL! ⚽🎯",
          "La défense tient bon 🛡️",
          "Changement tactique intéressant 🧠",
          "L'arbitre... discutable 🤔",
        ]

        const mockUsers = ["CryptoFan23", "UltraSupporter", "FootballKing", "StadiumVibes", "GoalHunter"]
        const randomMessage = mockMessages[Math.floor(Math.random() * mockMessages.length)]
        const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)]
        const currentTime = new Date()
        const timestamp = `${currentTime.getMinutes()}:${currentTime.getSeconds().toString().padStart(2, "0")}`

        setMessages((prev) =>
          [
            ...prev.slice(-49),
            {
              id: Date.now(),
              user: randomUser,
              message: randomMessage,
              timestamp,
              avatar: randomUser[0],
              type: "text",
              isVip: Math.random() > 0.7,
              fanTokens: Math.floor(Math.random() * 20) + 5,
            },
          ],
        ) // Garder seulement les 50 derniers messages
      },
      4000 + Math.random() * 6000,
    )

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const currentTime = new Date()
      const timestamp = `${currentTime.getMinutes()}:${currentTime.getSeconds().toString().padStart(2, "0")}`

      setMessages((prev) => [
        ...prev,
        {  
          id: Date.now(),
          user: "Alex",
          message: newMessage,
          timestamp,
          avatar: "A",
          type: "text",
          isVip: true,
          fanTokens: fanTokenRewards.message,
        },
      ])
      setNewMessage("")
    }
  }

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simuler l'enregistrement
      setTimeout(() => {
        setIsRecording(false);
        const currentTime = new Date();
        const timestamp = `${currentTime.getMinutes()}:${currentTime.getSeconds().toString().padStart(2, "0")}`;

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            user: "Alex",
            message: `🎵 Message vocal (0:${Math.floor(Math.random() * 30 + 5)})`,
            timestamp,
            avatar: "A",
            type: "voice",
            isVip: true,
            fanTokens: fanTokenRewards.voice,
          },
        ])
      }, 2000);
    }
  }

  const handleEmojiReaction = (messageId: number, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const existingReaction = msg.reactions?.find((r) => r.emoji === emoji);
          if (existingReaction) {
            return {
              ...msg,
              reactions: msg.reactions?.map((r) =>
                r.emoji === emoji ? { ...r, count: r.count + 1, users: [...r.users, "Alex"] } : r,
              ),
            }
          } else {  
            return {
              ...msg,
              reactions: [...(msg.reactions || []), { emoji, count: 1, users: ["Alex"] }],
            }
          }
        }
        return msg
      }),
    )
  }

  const toggleVoiceChat = () => {
    setIsVoiceChatActive(!isVoiceChatActive)
    onVoiceChatToggle?.(!isVoiceChatActive)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Participants du chat vocal */}
      {isVoiceChatActive && (
        <Card className="bg-gradient-to-r from-[#00D4AA]/20 to-[#00D4AA]/10 border-[#00D4AA]/30 p-3 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-[#00D4AA] flex items-center">
              <Volume2 className="w-4 h-4 mr-2 text-[#00D4AA]" />
              Chat Vocal ({voiceParticipants.length})
            </h4>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMuted(!isMuted)}
                className={`border-[#00D4AA]/30 ${isMuted ? "bg-red-500/20 text-red-400" : "text-[#00D4AA]"}`}
              >
                {isMuted ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {voiceParticipants.map((participant, index) => (
              <div
                key={index}
                className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${
                  participant.isSpeaking ? "border-[#00D4AA] bg-[#00D4AA]/20" : "border-gray-600 bg-gray-800/50"
                }`}
              >
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="text-xs">{participant.avatar}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-white">{participant.name}</span>
                {participant.isMuted && <MicOff className="w-3 h-3 text-red-400" />}
                {participant.isSpeaking && <div className="w-2 h-2 bg-[#00D4AA] rounded-full animate-pulse" />}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Messages */}
      <Card className="flex-1 bg-[#1A1A2E] border-[#FF6B35]/20 p-4 overflow-hidden">
        <div className="h-full overflow-y-auto space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className="group">
              {msg.type === "system" ? (
                <div className="text-center">
                  <span className="text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded-full">{msg.message}</span>
                </div>
              ) : (
                <div className="flex items-start space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={`/placeholder.svg?height=32&width=32&text=${msg.avatar}`} />
                    <AvatarFallback className="text-xs">{msg.avatar}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`font-medium text-sm ${msg.isVip ? "text-purple-400" : "text-blue-400"}`}>
                        {msg.user}
                      </span>  
                      {msg.isVip && <Crown className="w-3 h-3 text-yellow-400" />}
                      <span className="text-xs text-gray-500">{msg.timestamp}</span>
                      {msg.fanTokens && (
                        <Badge className="bg-[#FF6B35]/20 text-[#FF6B35] text-xs">+{msg.fanTokens} CHZ</Badge>
                      )}
                    </div>

                    <div
                      className={`p-3 rounded-lg max-w-md ${
                        msg.type === "voice" ? "bg-[#00D4AA]/20 border border-[#00D4AA]/30" : "bg-[#16213E]/50"
                      }`}
                    >
                      {msg.type === "voice" ? (
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" className="text-[#00D4AA] hover:bg-[#00D4AA]/20">
                            <Volume2 className="w-4 h-4" />
                          </Button>
                          <span className="text-[#00D4AA]">{msg.message}</span>
                        </div>
                      ) : (
                        <p className="text-gray-300 break-words">{msg.message}</p>
                      )}
                    </div>

                    {/* Réactions */}
                    {msg.reactions && msg.reactions.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {msg.reactions.map((reaction, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleEmojiReaction(msg.id as number, reaction.emoji)}
                            className="h-6 px-2 border-gray-700 hover:border-[#FF6B35] bg-[#16213E]/30 text-xs"
                          >
                            {reaction.emoji} {reaction.count}
                          </Button>
                        ))}
                      </div>
                    )}

                    {/* Réactions rapides (apparaissent au hover) */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-2">
                      <div className="flex space-x-1">
                        {quickEmojis.slice(0, 5).map((emoji) => (
                          <Button
                            key={emoji}
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEmojiReaction(msg.id as number, emoji)}
                            className="h-6 w-6 p-0 text-xs hover:bg-[#16213E]"
                          >
                            {emoji}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </Card>

      {/* Zone de saisie */}
      <Card className="bg-[#1A1A2E] border-[#FF6B35]/20 p-4 mt-4">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Tapez votre message..."
              className="bg-[#16213E] border-[#FF6B35]/30 text-white pr-20 focus:border-[#FF6B35]"
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />

            {/* Boutons dans l'input */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="h-6 w-6 p-0 text-gray-400 hover:text-[#FFD23F]"
              >
                <Smile className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="h-6 w-6 p-0 text-gray-400 hover:text-[#00D4AA]"
              >
                <ImageIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Bouton vocal */}
          <Button
            variant="outline"
            size="sm"
            onMouseDown={handleVoiceRecord}
            onMouseUp={() => setIsRecording(false)}  
            className={`border-[#16213E] ${
              isRecording ? "bg-red-500/20 text-red-400 border-red-500/30" : "text-gray-400 hover:text-[#00D4AA]"
            }`}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>

          {/* Bouton d'envoi */}
          <Button
            onClick={handleSendMessage}
            className="bg-gradient-to-r from-[#FF6B35] to-[#FFD23F] hover:shadow-[0_0_15px_rgba(255,107,53,0.4)] transition-all duration-300"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Picker d'emojis */}
        {showEmojiPicker && (
          <div className="mt-3 p-3 bg-[#16213E] rounded-lg border border-[#FF6B35]/30">
            <div className="grid grid-cols-10 gap-2">
              {quickEmojis.map((emoji) => (
                <Button
                  key={emoji}
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setNewMessage((prev) => prev + emoji)
                    setShowEmojiPicker(false)
                  }}  
                  className="h-8 w-8 p-0 text-lg hover:bg-[#FF6B35]/20"
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input file caché */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => {
            // Gérer l'upload de fichiers
            console.log("File selected:", e.target.files?.[0])
          }}
        />
      </Card>
    </div>
  )
}
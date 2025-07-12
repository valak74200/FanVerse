"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send } from "lucide-react"

interface ChatMessage {
  id: number
  user: string
  message: string
  timestamp: string
  avatar: string
}
export function LiveChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: "Mike_PSG",
      message: "MBAPPÉ IS ON FIRE! 🔥",
      timestamp: "67:15",
      avatar: "M",
    },
    {
      id: 2,
      user: "Sarah_Barca",
      message: "That was close! Great save by Ter Stegen",
      timestamp: "67:18",
      avatar: "S",
    },
    {
      id: 3,
      user: "Alex_Ultra",
      message: "This atmosphere is INSANE! 🏟️",
      timestamp: "67:20",
      avatar: "A",
    },
    {
      id: 4,
      user: "Tom_Fan",
      message: "Anyone else betting on next goal?",
      timestamp: "67:22",
      avatar: "T",
    },
  ])

  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef(null)

  const mockMessages = [
    "GOOOOOAL! What a strike! ⚽",
    "The crowd is going wild! 🎉",
    "Incredible pass from midfield",
    "VAR check... this could be offside",
    "The energy in here is electric! ⚡",
    "Best match of the season so far",
    "That tackle was perfectly timed",
    "Corner kick incoming... 👀",
    "The keeper had no chance on that one",
    "Formation change paying off",
  ]

  const mockUsers = ["CryptoFan23", "UltraSupporter", "FootballKing", "StadiumVibes", "GoalHunter", "MatchWatcher"]

  useEffect(() => {
    const interval = setInterval(
      () => {
        const randomMessage = mockMessages[Math.floor(Math.random() * mockMessages.length)]
        const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)]
        const currentTime = new Date()
        const timestamp = `${currentTime.getMinutes()}:${currentTime.getSeconds().toString().padStart(2, "0")}`

        setMessages((prev) =>
          [
            ...prev,
            {
              id: Date.now(),
              user: randomUser,
              message: randomMessage,
              timestamp,
              avatar: randomUser[0],
            },
          ].slice(-20),
        ) // Keep only last 20 messages
      },
      3000 + Math.random() * 5000,
    ) // Random interval between 3-8 seconds

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
        },
      ])
      setNewMessage("")
    }
  }

  return (
    <Card className="bg-[#1a1a1a] border-gray-800 p-4 h-80 flex flex-col">
      <h3 className="font-semibold mb-3 flex items-center">
        Live Chat
        <span className="ml-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
      </h3>

      <div className="flex-1 overflow-y-auto space-y-2 mb-3">
        {messages.map((msg) => (
          <div key={msg.id} className="flex items-start space-x-2 text-sm">
            <Avatar className="w-6 h-6">
              <AvatarImage src={`/placeholder.svg?height=24&width=24&text=${msg.avatar}`} />
              <AvatarFallback className="text-xs">{msg.avatar}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-blue-400 truncate">{msg.user}</span>
                <span className="text-xs text-gray-500">{msg.timestamp}</span>
              </div>
              <p className="text-gray-300 break-words">{msg.message}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex space-x-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="bg-[#0a0a0a] border-gray-700 text-white placeholder-gray-400"
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <Button size="sm" onClick={handleSendMessage}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  )
}

"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Users, Plus, Search, Shield, Mic, MicOff, Volume2, UserPlus, MessageCircle } from "lucide-react"

interface Group {
  id: string
  name: string
  description: string
  members: number
  maxMembers: number
  isPrivate: boolean
  level: "Bronze" | "Silver" | "Gold" | "Diamond"
  avatar: string
  owner: string
  isJoined: boolean
  hasVoiceChat: boolean
  activeVoiceUsers: number
}

interface GroupManagementProps {
  onGroupSelect: (groupId: string) => void
  selectedGroup: string | null
}

export function GroupManagement({ onGroupSelect, selectedGroup }: GroupManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isVoiceChatEnabled, setIsVoiceChatEnabled] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  const [groups, setGroups] = useState<Group[]>([
    {
      id: "psg-ultras",
      name: "PSG Ultras",
      description: "Les vrais supporters parisiens",
      members: 47,
      maxMembers: 100,
      isPrivate: false,
      level: "Diamond",
      avatar: "🔵",
      owner: "Alex",
      isJoined: true,
      hasVoiceChat: true,
      activeVoiceUsers: 12,
    },
    {
      id: "barca-fans",
      name: "Barça Legends",
      description: "Més que un club",
      members: 38,
      maxMembers: 75,
      isPrivate: false,
      level: "Gold",
      avatar: "🔴",
      owner: "Maria",
      isJoined: false,
      hasVoiceChat: true,
      activeVoiceUsers: 8,
    },
    {
      id: "vip-bettors",
      name: "VIP Bettors",
      description: "Paris exclusifs et analyses",
      members: 15,
      maxMembers: 25,
      isPrivate: true,
      level: "Diamond",
      avatar: "💎",
      owner: "Thomas",
      isJoined: true,
      hasVoiceChat: true,
      activeVoiceUsers: 5,
    },
    {
      id: "casual-fans",
      name: "Fans Casual",
      description: "Pour tous les amateurs de foot",
      members: 156,
      maxMembers: 200,
      isPrivate: false,
      level: "Silver",
      avatar: "⚽",
      owner: "Sophie",
      isJoined: false,
      hasVoiceChat: false,
      activeVoiceUsers: 0,
    },
  ])

  const filteredGroups = groups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const joinGroup = (groupId: string) => {
    setGroups(
      groups.map((group) => (group.id === groupId ? { ...group, isJoined: true, members: group.members + 1 } : group)),
    )
  }

  const leaveGroup = (groupId: string) => {
    setGroups(
      groups.map((group) => (group.id === groupId ? { ...group, isJoined: false, members: group.members - 1 } : group)),
    )
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Diamond":
        return "from-cyan-400 to-blue-500"
      case "Gold":
        return "from-yellow-400 to-orange-500"
      case "Silver":
        return "from-gray-300 to-gray-500"
      default:
        return "from-amber-600 to-amber-800"
    }
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "Diamond":
        return "💎"
      case "Gold":
        return "🏆"
      case "Silver":
        return "🥈"
      default:
        return "🥉"
    }
  }

  if (showCreateForm) {
    return (
      <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#2a1a2a] border-purple-500/30 p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Créer un Groupe</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCreateForm(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Nom du groupe</label>
              <Input placeholder="Ex: PSG Supporters" className="bg-gray-800 border-gray-700 text-white" />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Description</label>
              <Input placeholder="Décrivez votre groupe..." className="bg-gray-800 border-gray-700 text-white" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Membres max</label>
                <Input type="number" placeholder="100" className="bg-gray-800 border-gray-700 text-white" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Type</label>
                <select className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white">
                  <option>Public</option>
                  <option>Privé</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={() => setShowCreateForm(false)}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                Créer le Groupe
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCreateForm(false)}
                className="border-gray-700 text-gray-300 hover:text-white"
              >
                Annuler
              </Button>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="bg-gradient-to-r from-[#1a1a1a] to-[#2a1a2a] border-purple-500/30 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Users className="w-5 h-5 mr-2 text-purple-400" />
            Mes Groupes
          </h2>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Créer
          </Button>
        </div>

        {/* Recherche */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Rechercher des groupes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white"
          />
        </div>
      </Card>

      {/* Chat vocal actif */}
      {selectedGroup && groups.find((g) => g.id === selectedGroup)?.hasVoiceChat && (
        <Card className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <Volume2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-white">Chat Vocal Actif</h3>
                <p className="text-sm text-green-400">
                  {groups.find((g) => g.id === selectedGroup)?.activeVoiceUsers} participants
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMuted(!isMuted)}
                className={`border-green-500/30 ${isMuted ? "bg-red-500/20 text-red-400" : "text-green-400"}`}
              >
                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsVoiceChatEnabled(!isVoiceChatEnabled)}
                className="border-green-500/30 text-green-400"
              >
                Quitter
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Liste des groupes */}
      <div className="space-y-3">
        {filteredGroups.map((group) => (
          <Card
            key={group.id}
            className={`p-4 cursor-pointer transition-all duration-200 ${
              selectedGroup === group.id
                ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/50"
                : "bg-[#1a1a1a] border-gray-800 hover:border-purple-500/30"
            }`}
            onClick={() => onGroupSelect(group.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-xl">
                  {group.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-white">{group.name}</h3>
                    {group.isPrivate && <Shield className="w-4 h-4 text-yellow-400" />}
                    <Badge className={`bg-gradient-to-r ${getLevelColor(group.level)} text-white text-xs`}>
                      {getLevelIcon(group.level)} {group.level}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{group.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span>
                      {group.members}/{group.maxMembers} membres
                    </span>
                    <span>Par {group.owner}</span>
                    {group.hasVoiceChat && (
                      <span className="flex items-center text-green-400">
                        <Volume2 className="w-3 h-3 mr-1" />
                        {group.activeVoiceUsers} en vocal
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {group.hasVoiceChat && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-green-500/30 text-green-400 hover:bg-green-500/10 bg-transparent"
                  >
                    <Volume2 className="w-4 h-4" />
                  </Button>
                )}

                {group.isJoined ? (
                  <div className="flex space-x-1">
                    <Button variant="outline" size="sm" className="border-purple-500/30 text-purple-400 bg-transparent">
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        leaveGroup(group.id)
                      }}
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                    >
                      Quitter
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      joinGroup(group.id)
                    }}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <UserPlus className="w-4 h-4 mr-1" />
                    Rejoindre
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

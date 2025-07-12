"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Web3Card, { StatsCard, NetworkCard, SecurityCard } from "./Web3Card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Activity, 
  Zap, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Network, 
  Shield, 
  Cpu,
  Database,
  Globe,
  Wallet,
  ArrowRight,
  BarChart3,
  Hexagon
} from "lucide-react"
import { useSoundEffects } from "./SoundEffects"
import { useHapticFeedback } from "./MobileGestures"

export default function Web3Dashboard() {
  const [selectedMetric, setSelectedMetric] = useState('overview')
  const [liveData, setLiveData] = useState({
    totalUsers: 12847,
    activeNodes: 156,
    transactions: 98234,
    volume: 2.4,
    gasPrice: 21,
    blockHeight: 847392
  })
  const { playClick, playHover, playSuccess } = useSoundEffects()
  const { lightVibration } = useHapticFeedback()

  // Simuler des données en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prev => ({
        ...prev,
        totalUsers: prev.totalUsers + Math.floor(Math.random() * 10),
        transactions: prev.transactions + Math.floor(Math.random() * 50),
        volume: prev.volume + (Math.random() - 0.5) * 0.1,
        gasPrice: Math.max(15, prev.gasPrice + (Math.random() - 0.5) * 2),
        blockHeight: prev.blockHeight + (Math.random() < 0.1 ? 1 : 0)
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const metrics = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'network', label: 'Réseau', icon: <Network className="w-4 h-4" /> },
    { id: 'security', label: 'Sécurité', icon: <Shield className="w-4 h-4" /> },
    { id: 'performance', label: 'Performance', icon: <Cpu className="w-4 h-4" /> },
  ]

  return (
    <div className="min-h-screen bg-black/40 backdrop-blur-sm p-6">
      {/* Header du dashboard */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              <span className="bg-gradient-to-r from-primary via-accent-comp to-primary bg-clip-text text-transparent">
                FanVerse Web3 Console
              </span>
            </h1>
            <p className="text-gray-400">Tableau de bord blockchain en temps réel</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
              Réseau Actif
            </Badge>
            <Badge className="bg-primary/20 text-primary border-primary/30 font-mono">
              Block #{liveData.blockHeight}
            </Badge>
          </div>
        </div>

        {/* Navigation des métriques */}
        <div className="flex gap-2 mt-6">
          {metrics.map((metric) => (
            <Button
              key={metric.id}
              variant={selectedMetric === metric.id ? "default" : "outline"}
              className={`
                transition-all duration-300
                ${selectedMetric === metric.id 
                  ? 'bg-primary/80 text-white shadow-lg shadow-primary/25' 
                  : 'bg-transparent border-gray-600 text-gray-400 hover:border-primary/50 hover:text-primary'
                }
              `}
              onClick={() => {
                setSelectedMetric(metric.id)
                playClick()
                lightVibration()
              }}
              onMouseEnter={() => playHover()}
            >
              {metric.icon}
              <span className="ml-2">{metric.label}</span>
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Grille de cartes principales */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedMetric}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          {selectedMetric === 'overview' && (
            <>
              <StatsCard
                title="Utilisateurs Actifs"
                value={liveData.totalUsers.toLocaleString()}
                change={+12.5}
                icon={<Users className="w-5 h-5 text-primary" />}
              />
              <StatsCard
                title="Volume 24h"
                value={`${liveData.volume.toFixed(2)}M CHZ`}
                change={+8.3}
                icon={<DollarSign className="w-5 h-5 text-green-400" />}
              />
              <StatsCard
                title="Transactions"
                value={liveData.transactions.toLocaleString()}
                change={+15.7}
                icon={<Activity className="w-5 h-5 text-blue-400" />}
              />
              <StatsCard
                title="Prix du Gas"
                value={`${liveData.gasPrice.toFixed(0)} gwei`}
                change={-5.2}
                icon={<Zap className="w-5 h-5 text-yellow-400" />}
              />
            </>
          )}

          {selectedMetric === 'network' && (
            <>
              <NetworkCard
                title="Nœuds Validateurs"
                status="active"
                description={`${liveData.activeNodes} nœuds en ligne`}
              />
              <NetworkCard
                title="Consensus"
                status="active"
                description="Proof of Stake actif"
              />
              <NetworkCard
                title="Finalité"
                status="active"
                description="12 secondes moyenne"
              />
              <NetworkCard
                title="TPS"
                status="active"
                description="10,000 transactions/sec"
              />
            </>
          )}

          {selectedMetric === 'security' && (
            <>
              <SecurityCard
                title="Chiffrement"
                isSecure={true}
                description="AES-256 + RSA-4096"
              />
              <SecurityCard
                title="Signatures"
                isSecure={true}
                description="ECDSA + Multi-sig"
              />
              <SecurityCard
                title="Audit Smart Contracts"
                isSecure={true}
                description="100% vérifié"
              />
              <SecurityCard
                title="Sécurité Réseau"
                isSecure={true}
                description="Zero vulnerabilités"
              />
            </>
          )}

          {selectedMetric === 'performance' && (
            <>
              <Web3Card
                title="Latence Réseau"
                description="Temps de réponse moyen"
                value="12ms"
                status="success"
                icon={<Globe className="w-5 h-5 text-green-400" />}
                type="accent"
              />
              <Web3Card
                title="Utilisation CPU"
                description="Charge des validateurs"
                value="34%"
                status="active"
                icon={<Cpu className="w-5 h-5 text-blue-400" />}
                type="primary"
              />
              <Web3Card
                title="Stockage"
                description="Base de données blockchain"
                value="2.4TB"
                status="active"
                icon={<Database className="w-5 h-5 text-purple-400" />}
                type="neon"
              />
              <Web3Card
                title="Débit"
                description="Bande passante utilisée"
                value="156 Mbps"
                status="success"
                icon={<TrendingUp className="w-5 h-5 text-primary" />}
                type="primary"
              />
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Section des highlights avec effets 3D */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <Hexagon className="w-6 h-6 text-primary" />
          Highlights Blockchain
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Web3Card
            title="Smart Contract Deploy"
            description="Nouveau contrat FanVerse"
            status="success"
            type="primary"
            glitch={true}
            icon={<Zap className="w-5 h-5 text-primary" />}
          >
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Adresse:</span>
                <span className="text-primary font-mono">0x1a2b...ef89</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Gas utilisé:</span>
                <span className="text-green-400">2,100,000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Status:</span>
                <span className="text-green-400">✓ Déployé</span>
              </div>
            </div>
          </Web3Card>

          <Web3Card
            title="Pool de Liquidité"
            description="CHZ/ETH Trading Pool"
            status="active"
            type="accent"
            icon={<Wallet className="w-5 h-5 text-accent-comp" />}
          >
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">TVL:</span>
                <span className="text-accent-comp font-bold">$2.4M</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">APY:</span>
                <span className="text-green-400">24.5%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Volume 24h:</span>
                <span className="text-white">$156K</span>
              </div>
            </div>
          </Web3Card>
        </div>
      </motion.div>

      {/* Footer avec informations blockchain */}
      <motion.div
        className="border-t border-gray-800 pt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-400">
          <div>
            <h3 className="text-white font-semibold mb-2">Réseau</h3>
            <p>Chiliz Chain Mainnet</p>
            <p>Chain ID: 88</p>
            <p>RPC: https://rpc.chiliz.com</p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Consensus</h3>
            <p>Algorithme: Proof of Stake</p>
            <p>Validateurs: {liveData.activeNodes}</p>
            <p>Temps de bloc: 3s</p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Métriques</h3>
            <p>Uptime: 99.98%</p>
            <p>Dernière mise à jour: il y a 2s</p>
            <p>Version: v2.1.0</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 
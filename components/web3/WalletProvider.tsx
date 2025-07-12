'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface WalletContextType {
  isConnected: boolean
  address: string | null
  balance: number
  connect: () => Promise<void>
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

interface WalletProviderProps {
  children: ReactNode
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState(0)

  const connect = async () => {
    try {
      // Simuler la connexion au wallet
      setIsConnected(true)
      setAddress('0x1234...5678')
      setBalance(1250)
    } catch (error) {
      console.error('Erreur de connexion au wallet:', error)
    }
  }

  const disconnect = () => {
    setIsConnected(false)
    setAddress(null)
    setBalance(0)
  }

  useEffect(() => {
    // Vérifier si un wallet est déjà connecté au chargement
    const savedConnection = localStorage.getItem('wallet-connected')
    if (savedConnection === 'true') {
      connect()
    }
  }, [])

  useEffect(() => {
    // Sauvegarder l'état de connexion
    localStorage.setItem('wallet-connected', isConnected.toString())
  }, [isConnected])

  const value = {
    isConnected,
    address,
    balance,
    connect,
    disconnect
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}
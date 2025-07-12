"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { mainnet, polygon, optimism, arbitrum } from 'wagmi/chains'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { publicProvider } from 'wagmi/providers/public'

// Configure chains & providers
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum],
  [publicProvider()]
)

// Set up wagmi config
const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'FanVerse',
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: '3a8170812b534d0ff9d794f19a901d64', // Public demo project ID
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
})

// Create wallet context
type WalletContextType = {
  isConnected: boolean
  address: string | undefined
  connect: () => void
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType>({
  isConnected: false,
  address: undefined,
  connect: () => {},
  disconnect: () => {},
})

export const useWallet = () => useContext(WalletContext)

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | undefined>(undefined)

  // Mock functions for now - will be replaced with actual wagmi hooks in components
  const connect = () => {
    console.log('Connecting wallet...')
  }

  const disconnect = () => {
    console.log('Disconnecting wallet...')
  }

  return (
    <WagmiConfig config={config}>
      <WalletContext.Provider value={{ isConnected, address, connect, disconnect }}>
        {children}
      </WalletContext.Provider>
    </WagmiConfig>
  )
}
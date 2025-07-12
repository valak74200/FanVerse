'use client'

import { ReactNode } from 'react'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { mainnet, polygon, arbitrum } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WalletProvider } from '@/components/web3/WalletProvider'

// Create a query client
const queryClient = new QueryClient()

// Create wagmi config
const config = createConfig({
  chains: [mainnet, polygon, arbitrum],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
  },
})

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <WalletProvider>
          {children}
        </WalletProvider>
      </WagmiProvider>
    </QueryClientProvider>
  )
}
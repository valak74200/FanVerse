'use client'

import { ReactNode } from 'react'
import { WalletProvider } from '@/components/web3/WalletProvider'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <WalletProvider>
      {children}
    </WalletProvider>
  )
}
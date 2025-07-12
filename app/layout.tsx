import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { WalletProvider } from "@/components/web3/WalletProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ChilizDApp - Web3 Sports Platform",
  description: "The ultimate decentralized sports platform powered by Chiliz",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  )
}

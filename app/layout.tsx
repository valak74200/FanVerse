import "./globals.css"
import "./components/fanverse/chiliz/Iridescence.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react"
import IridescenceBackground from "./components/fanverse/chiliz/IridescenceBackground"
import GridOverlay from "./components/fanverse/chiliz/GridOverlay"
import Web3Background from "./components/fanverse/chiliz/Web3Background"
import SoundEffects from "./components/fanverse/chiliz/SoundEffects"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FanVerse | The Fan Engagement Protocol",
  description: "The universal fan engagement layer for sports communities.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="dark">
      <body className={`${inter.className} bg-black text-gray-200`}>
        <IridescenceBackground
          color={[0.98, 0.34, 0.2]} // Fiery Red-Orange
          speed={0.5}
          amplitude={0.15}
        />
        <Web3Background />
        <SoundEffects />
        {children}
        <Toaster />
      </body>
    </html>
  )
}

import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react"
import Web3Background from "./components/fanverse/chiliz/Web3Background"
import SoundEffects from "./components/fanverse/chiliz/SoundEffects"
import IridescenceBackground from "./components/fanverse/chiliz/IridescenceBackground"
import { Toaster } from "react-hot-toast"


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
          intensity={0.8}
          speed={1.2}
          interactive={true}
          particleCount={30}
        />
        <Web3Background />
        <SoundEffects />
        <div className="relative z-10">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  )
}

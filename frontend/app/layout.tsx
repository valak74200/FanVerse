import "./globals.css"
import "./components/fanverse/chiliz/Iridescence.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react"
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
      <body className={`${inter.className} text-gray-200`}>
        <SoundEffects />
        {children}
        <Toaster />
      </body>
    </html>
  )
}

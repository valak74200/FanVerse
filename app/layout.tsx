import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { WalletProvider } from "@/components/web3/WalletProvider"
import { Providers } from "@/components/providers"

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
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Providers>
          <WalletProvider>
            {children}
          </WalletProvider>
        </Providers>
      </body>
    </html>
  )
}

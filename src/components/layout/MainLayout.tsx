import { ReactNode } from "react"
import { Header } from "./Header"
import { Navigation } from "./Navigation"
import { Footer } from "./Footer"
import { useState } from "react"

interface MainLayoutProps {
  children: ReactNode
  activeView: string
  isConnected: boolean
  userTokens: number
  emotionLevel: number
  liveStats: {
    totalFans: number
    activeUsers: number
    totalBets: number
    totalVolume: number
  }
  onConnectWallet: () => void
  onViewChange: (view: string) => void
}

export function MainLayout({
  children,
  activeView,
  isConnected,
  userTokens,
  emotionLevel,
  liveStats,
  onConnectWallet,
  onViewChange
}: MainLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col">
      <Header
        isConnected={isConnected}
        onConnectWallet={onConnectWallet}
        userTokens={userTokens}
        emotionLevel={emotionLevel}
        liveStats={liveStats}
        onMenuToggle={() => setMenuOpen(!menuOpen)}
      />
      
      <Navigation
        activeView={activeView}
        onViewChange={onViewChange}
      />
      
      <main className="flex-1">
        {children}
      </main>
      
      <Footer />
      
      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 md:hidden"
          onClick={() => setMenuOpen(false)}
        >
          <div 
            className="w-64 h-full bg-gradient-to-b from-gray-900 to-black p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Menu Content */}
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-warning rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-warning bg-clip-text text-transparent">
                    FanVerse
                  </h3>
                  <p className="text-xs text-gray-400">L'expérience ultime des fans</p>
                </div>
              </div>
              
              <button 
                className={`flex items-center space-x-3 p-3 rounded-lg ${activeView === 'home' ? 'bg-primary/20' : 'hover:bg-white/5'}`}
                onClick={() => {
                  onViewChange('home')
                  setMenuOpen(false)
                }}
              >
                <Home className="w-5 h-5 text-primary" />
                <span>Accueil</span>
              </button>
              
              <button 
                className={`flex items-center space-x-3 p-3 rounded-lg ${activeView === 'stadium' ? 'bg-primary/20' : 'hover:bg-white/5'}`}
                onClick={() => {
                  onViewChange('stadium')
                  setMenuOpen(false)
                }}
              >
                <Trophy className="w-5 h-5 text-primary" />
                <span>MetaTribune</span>
              </button>
              
              <button 
                className={`flex items-center space-x-3 p-3 rounded-lg ${activeView === 'social' ? 'bg-primary/20' : 'hover:bg-white/5'}`}
                onClick={() => {
                  onViewChange('social')
                  setMenuOpen(false)
                }}
              >
                <Users className="w-5 h-5 text-primary" />
                <span>CrewMates</span>
              </button>
              
              <button 
                className={`flex items-center space-x-3 p-3 rounded-lg ${activeView === 'betting' ? 'bg-primary/20' : 'hover:bg-white/5'}`}
                onClick={() => {
                  onViewChange('betting')
                  setMenuOpen(false)
                }}
              >
                <Zap className="w-5 h-5 text-primary" />
                <span>FanPulse</span>
              </button>
              
              <button 
                className={`flex items-center space-x-3 p-3 rounded-lg ${activeView === 'nft' ? 'bg-primary/20' : 'hover:bg-white/5'}`}
                onClick={() => {
                  onViewChange('nft')
                  setMenuOpen(false)
                }}
              >
                <Star className="w-5 h-5 text-primary" />
                <span>MoodNFT</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Twitter, MessageSquare, Youtube } from "lucide-react"

const navItems = ["Discover", "Developers", "Ecosystem", "Community"]

export default function Header({ onLaunch }: { onLaunch: () => void }) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-8"
        >
          <div className="flex items-center space-x-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
              <path d="M2 7L12 12L22 7" stroke="white" strokeWidth="2" strokeLinejoin="round" />
              <path d="M12 22V12" stroke="white" strokeWidth="2" strokeLinejoin="round" />
            </svg>
            <span className="font-semibold text-lg text-white">FanVerse</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6 text-sm">
            {navItems.map((item) => (
              <div
                key={item}
                className="relative"
                onMouseEnter={() => setHoveredItem(item)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  {item}
                </a>
                {hoveredItem === item && (
                  <motion.div
                    className="absolute bottom-[-4px] left-0 right-0 h-[2px] bg-primary"
                    layoutId="underline"
                  />
                )}
              </div>
            ))}
          </nav>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center space-x-4"
        >
          <Twitter size={16} className="text-gray-400 hover:text-white cursor-pointer" />
          <MessageSquare size={16} className="text-gray-400 hover:text-white cursor-pointer" />
          <Youtube size={18} className="text-gray-400 hover:text-white cursor-pointer" />
          <div className="w-px h-5 bg-gray-700" />
          <Button
            onClick={onLaunch}
            className="bg-white text-black hover:bg-gray-200 rounded-full text-xs px-4 py-2 font-semibold relative"
          >
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            Launch FanVerse
          </Button>
        </motion.div>
      </div>
    </header>
  )
}

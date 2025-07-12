import React from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Import Silk dynamically to avoid SSR issues
const Silk = dynamic(() => import('@/components/ui/Silk'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-black/90" />
});

interface FuturisticBackgroundProps {
  children: React.ReactNode;
  color?: string;
  showParticles?: boolean;
  showGrid?: boolean;
  showGlow?: boolean;
}

export function FuturisticBackground({
  children,
  color = "#FF6B35",
  showParticles = true,
  showGrid = true,
  showGlow = true
}: FuturisticBackgroundProps) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Silk background */}
      <div className="absolute inset-0 z-0 opacity-30">
        <Silk 
          color={color} 
          speed={2} 
          scale={1.5} 
          noiseIntensity={1.2} 
          rotation={0.2} 
        />
      </div>
      
      {/* Grid overlay */}
      {showGrid && (
        <div 
          className="absolute inset-0 z-10 pointer-events-none" 
          style={{
            backgroundImage: `
              linear-gradient(to right, ${color}10 1px, transparent 1px),
              linear-gradient(to bottom, ${color}10 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0) 100%)'
          }}
        />
      )}
      
      {/* Floating particles */}
      {showParticles && (
        <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: color,
                boxShadow: `0 0 10px ${color}80`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [
                  Math.random() * 100 - 50,
                  Math.random() * 100 - 50,
                  Math.random() * 100 - 50
                ],
                y: [
                  Math.random() * 100 - 50,
                  Math.random() * 100 - 50,
                  Math.random() * 100 - 50
                ],
                opacity: [0.2, 0.8, 0.2]
              }}
              transition={{
                duration: 10 + Math.random() * 20,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>
      )}
      
      {/* Glow effects */}
      {showGlow && (
        <>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 pointer-events-none z-10"
            style={{
              background: `radial-gradient(circle, ${color}80 0%, transparent 70%)`,
            }}
          />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-20 pointer-events-none z-10"
            style={{
              background: `radial-gradient(circle, ${color}80 0%, transparent 70%)`,
            }}
          />
        </>
      )}
      
      {/* Content */}
      <div className="relative z-30">
        {children}
      </div>
    </div>
  );
}
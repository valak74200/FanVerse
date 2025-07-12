import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning';
  hoverEffect?: boolean;
  glowEffect?: boolean;
  borderEffect?: boolean;
}

export function GlassCard({
  children,
  className,
  variant = 'default',
  hoverEffect = true,
  glowEffect = true,
  borderEffect = true,
  ...props
}: GlassCardProps) {
  const variantStyles = {
    default: {
      bg: 'from-gray-900/95 via-black/90 to-gray-800/95',
      border: 'border-gray-800/50',
      glow: 'shadow-[0_0_15px_rgba(255,255,255,0.1)]',
      hoverBorder: 'hover:border-gray-700/80',
    },
    primary: {
      bg: 'from-gray-900/95 via-black/90 to-gray-800/95',
      border: 'border-[#FF6B35]/20',
      glow: 'shadow-[0_0_15px_rgba(255,107,53,0.15)]',
      hoverBorder: 'hover:border-[#FF6B35]/50',
    },
    secondary: {
      bg: 'from-gray-900/95 via-black/90 to-gray-800/95',
      border: 'border-[#FFD23F]/20',
      glow: 'shadow-[0_0_15px_rgba(255,210,63,0.15)]',
      hoverBorder: 'hover:border-[#FFD23F]/50',
    },
    success: {
      bg: 'from-gray-900/95 via-black/90 to-gray-800/95',
      border: 'border-[#00D4AA]/20',
      glow: 'shadow-[0_0_15px_rgba(0,212,170,0.15)]',
      hoverBorder: 'hover:border-[#00D4AA]/50',
    },
    warning: {
      bg: 'from-gray-900/95 via-black/90 to-gray-800/95',
      border: 'border-red-500/20',
      glow: 'shadow-[0_0_15px_rgba(239,68,68,0.15)]',
      hoverBorder: 'hover:border-red-500/50',
    },
  };

  const styles = variantStyles[variant];

  return (
    <motion.div
      className={cn(
        'relative rounded-xl overflow-hidden backdrop-blur-md border',
        styles.border,
        styles.bg,
        glowEffect && styles.glow,
        hoverEffect && `transition-all duration-300 hover:-translate-y-1 ${styles.hoverBorder}`,
        className
      )}
      {...props}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br opacity-30" />
      
      {/* Border effect */}
      {borderEffect && (
        <div className="absolute inset-0 rounded-xl border-2 border-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'linear-gradient(45deg, transparent 20%, rgba(255,255,255,0.1) 40%, transparent 60%) border-box',
          }}
        />
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FuturisticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  glowEffect?: boolean;
  hoverScale?: boolean;
  loading?: boolean;
}

export function FuturisticButton({
  children,
  className,
  variant = 'default',
  size = 'md',
  glowEffect = true,
  hoverScale = true,
  loading = false,
  disabled,
  ...props
}: FuturisticButtonProps) {
  const variantStyles = {
    default: 'bg-gray-800 hover:bg-gray-700 text-white',
    primary: 'bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] hover:from-[#FF8C5A] hover:to-[#FFAA80] text-white',
    secondary: 'bg-gradient-to-r from-[#FFD23F] to-[#FFE066] hover:from-[#FFE066] hover:to-[#FFEB99] text-black',
    success: 'bg-gradient-to-r from-[#00D4AA] to-[#00F7C3] hover:from-[#00F7C3] hover:to-[#33FFDA] text-black',
    outline: 'bg-transparent border border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35]/10',
    ghost: 'bg-transparent hover:bg-white/10 text-white',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const glowStyles = {
    default: 'shadow-none hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]',
    primary: 'shadow-none hover:shadow-[0_0_20px_rgba(255,107,53,0.4)]',
    secondary: 'shadow-none hover:shadow-[0_0_20px_rgba(255,210,63,0.4)]',
    success: 'shadow-none hover:shadow-[0_0_20px_rgba(0,212,170,0.4)]',
    outline: 'shadow-none hover:shadow-[0_0_15px_rgba(255,107,53,0.2)]',
    ghost: 'shadow-none',
  };

  return (
    <motion.button
      whileHover={hoverScale && !disabled ? { scale: 1.05 } : {}}
      whileTap={hoverScale && !disabled ? { scale: 0.95 } : {}}
      className={cn(
        'relative overflow-hidden rounded-lg font-medium transition-all duration-300',
        variantStyles[variant],
        sizeStyles[size],
        glowEffect && !disabled ? glowStyles[variant] : '',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {/* Shine effect */}
      {!disabled && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: '200%' }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear", repeatDelay: 1 }}
        />
      )}
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center">
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            <span>Loading...</span>
          </>
        ) : (
          children
        )}
      </div>
    </motion.button>
  );
}
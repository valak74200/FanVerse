/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Chiliz Design System
        primary: '#FF6B35',      // Chiliz Orange
        secondary: '#1A1A2E',    // Dark Blue
        accent: '#16213E',       // Navy
        success: '#00D4AA',      // Mint Green
        warning: '#FFD23F',      // Gold
        'bg-primary': '#0F0F23', // Deep Dark
        'bg-secondary': '#16213E', // Card Background
        'text-primary': '#FFFFFF',
        'text-secondary': '#A0A0A0',
        
        // Team Colors
        psg: {
          blue: '#001F5C',
          red: '#E30613',
          gold: '#FFD700',
        },
        barcelona: {
          blue: '#004D98',
          red: '#A50044',
          gold: '#FFED02',
        },
        
        // Emotion Colors
        emotion: {
          hype: '#FF6B35',
          joy: '#00D4AA',
          anger: '#FF4757',
          surprise: '#FFD23F',
          sadness: '#5352ED',
          fear: '#747D8C',
        },
      },
      
      backgroundImage: {
        'gradient-main': 'linear-gradient(135deg, #FF6B35 0%, #FFD23F 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
        'gradient-chiliz': 'linear-gradient(-45deg, #FF6B35, #FFD23F, #00D4AA, #16213E)',
        'hex-pattern': `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FF6B35' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      },
      
      boxShadow: {
        'chiliz': '0 4px 20px rgba(255, 107, 53, 0.3)',
        'chiliz-lg': '0 8px 40px rgba(255, 107, 53, 0.4)',
        'dark': '0 4px 20px rgba(0, 0, 0, 0.5)',
        'glow': '0 0 20px rgba(255, 107, 53, 0.6)',
      },
      
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-chiliz': 'pulse-chiliz 2s infinite',
        'gradient-shift': 'gradient-shift 15s ease infinite',
        'hex-float': 'hex-float 8s ease-in-out infinite',
        'skeleton-loading': 'skeleton-loading 1.5s ease-in-out infinite',
      },
      
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '25%': { transform: 'translateY(-10px) rotate(2deg)' },
          '50%': { transform: 'translateY(-5px) rotate(-1deg)' },
          '75%': { transform: 'translateY(-15px) rotate(1deg)' },
        },
        'pulse-chiliz': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255, 107, 53, 0.7)' },
          '50%': { boxShadow: '0 0 0 10px rgba(255, 107, 53, 0)' },
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'hex-float': {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-20px) scale(1.05)' },
        },
        'skeleton-loading': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      
      fontFamily: {
        'chiliz': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Orbitron', 'monospace'],
      },
      
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
        '7xl': '4.5rem',
        '8xl': '6rem',
        '9xl': '8rem',
      },
      
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        '3xl': '32px',
      },
      
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
} 
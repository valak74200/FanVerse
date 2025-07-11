import type { Config } from "tailwindcss"
import defaultConfig from "shadcn/ui/tailwind.config"

const config: Config = {
  ...defaultConfig,
  content: [
    ...defaultConfig.content,
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    ...defaultConfig.theme,
    extend: {
      ...defaultConfig.theme.extend,
      colors: {
        ...defaultConfig.theme.extend.colors,
        // Chiliz Brand Colors
        chiliz: {
          red: "#FF0000",
          "red-dark": "#DC2626",
          "red-light": "#FEE2E2",
          orange: "#F59E0B",
          yellow: "#EAB308",
          black: "#000000",
          "gray-dark": "#1a1a1a",
          "gray-medium": "#2a2a2a",
          "gray-light": "#3a3a3a",
        },
        // Custom gradients
        gradient: {
          "chiliz-primary": "linear-gradient(135deg, #FF0000 0%, #DC2626 100%)",
          "chiliz-secondary": "linear-gradient(135deg, #F59E0B 0%, #EAB308 100%)",
          "chiliz-dark": "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-slow": "bounce 3s infinite",
        "spin-slow": "spin 8s linear infinite",
        gradient: "gradient 3s ease infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(255, 0, 0, 0.5)" },
          "100%": { boxShadow: "0 0 40px rgba(255, 0, 0, 0.8)" },
        },
        gradient: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "chiliz-gradient": "linear-gradient(135deg, #FF0000 0%, #DC2626 50%, #F59E0B 100%)",
        "chiliz-dark-gradient": "linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2a2a2a 100%)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [...defaultConfig.plugins, require("tailwindcss-animate")],
}

export default config

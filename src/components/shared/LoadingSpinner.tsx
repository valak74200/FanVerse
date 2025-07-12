import { motion } from "framer-motion"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  color?: string
  text?: string
}

export function LoadingSpinner({ 
  size = "md", 
  color = "#FF6B35", 
  text 
}: LoadingSpinnerProps) {
  const sizeMap = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  }

  const spinnerSize = sizeMap[size]

  return (
    <div className="flex flex-col items-center justify-center">
      <motion.div
        className={`${spinnerSize} rounded-full border-2 border-t-transparent`}
        style={{ borderColor: `${color}40`, borderTopColor: color }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      {text && (
        <p className="mt-2 text-sm text-gray-400">{text}</p>
      )}
    </div>
  )
}
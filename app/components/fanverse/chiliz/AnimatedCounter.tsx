"use client"
import { useEffect } from "react"
import { motion, useMotionValue, useTransform, animate } from "framer-motion"

export default function AnimatedCounter({
  value,
  prefix = "",
  postfix = "",
}: {
  value: number
  prefix?: string
  postfix?: string
}) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest))

  useEffect(() => {
    const controls = animate(count, value, { duration: 1, ease: "easeOut" })
    return controls.stop
  }, [value, count])

  return (
    <>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {postfix}
    </>
  )
}

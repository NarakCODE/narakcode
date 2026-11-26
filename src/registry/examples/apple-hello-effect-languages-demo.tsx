"use client"

import { useState } from "react"
import { AnimatePresence } from "motion/react"

import { AppleHelloEffectEnglish } from "@/registry/components/apple-hello-effect/apple-hello-effect-english"
import { AppleHelloEffectHindi } from "@/registry/components/apple-hello-effect/apple-hello-effect-hindi"
import { AppleHelloEffectKhmer } from "@/registry/components/apple-hello-effect/apple-hello-effect-khmer"
import { AppleHelloEffectSpanish } from "@/registry/components/apple-hello-effect/apple-hello-effect-spanish"

export default function AppleHelloEffectLanguagesDemo() {
  const [index, setIndex] = useState(0)

  const handleAnimationEnd = () => {
    setIndex((prevIndex) => (prevIndex + 1) % 4)
  }

  const demos = [
    <AppleHelloEffectEnglish
      key="english"
      onAnimationComplete={handleAnimationEnd}
    />,
    <AppleHelloEffectHindi
      key="hindi"
      onAnimationComplete={handleAnimationEnd}
    />,
    <AppleHelloEffectSpanish
      key="spanish"
      durationScale={0.8}
      onAnimationComplete={handleAnimationEnd}
    />,
    <AppleHelloEffectKhmer key="khmer" durationScale={0.8} />,
  ]

  return <AnimatePresence mode="wait">{demos[index]}</AnimatePresence>
}

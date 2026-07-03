"use client"

import React, { useEffect, useRef, useState } from "react"
import { Cloud, KeyRound, NotepadText } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/lib/utils"

type NavState = {
  opacity: number
  left: number
  width: number
}

const MorphingPill = () => {
  const [hoverState, setHoverState] = useState<NavState>({
    opacity: 0,
    left: 0,
    width: 0,
  })
  const [activeState, setActiveState] = useState<NavState>({
    opacity: 1,
    left: 0,
    width: 0,
  })
  const [active, setActive] = useState<number>(0)
  const [isHovering, setIsHovering] = useState(false)
  const [isClicked, setIsClicked] = useState(false)

  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])

  const items = [
    {
      name: "Connect",
      icon: KeyRound,
      text: "Info",
      description: "248k active users",
      color: "#008FFF",
      bg: "#001526",
    },
    {
      name: "Contracts",
      icon: NotepadText,
      text: "Details",
      description: "7 active contracts",
      color: "#00CB48",
      bg: "#001E0B",
    },
    {
      name: "Engine",
      icon: Cloud,
      text: "Check",
      description: "Optimal engine health",
      color: "#FF58AE",
      bg: "#260D1A",
    },
  ]

  useEffect(() => {
    if (itemRefs.current[active]) {
      const { offsetLeft, offsetWidth } = itemRefs.current[active]
      setActiveState({
        opacity: 1,
        left: offsetLeft,
        width: offsetWidth,
      })
    }
  }, [active])

  const handleMouseEnter = (index: number) => {
    if (!itemRefs.current[index]) return

    const { offsetLeft, offsetWidth } = itemRefs.current[index]
    setHoverState({
      opacity: 1,
      left: offsetLeft,
      width: offsetWidth,
    })
    setIsHovering(true)
  }

  const handleMouseLeave = () => {
    setHoverState((prev) => ({
      ...prev,
      opacity: 0,
    }))
    setIsHovering(false)
  }

  const Icon = items[active].icon

  return (
    <div className="flex h-full w-full items-center justify-center rounded-xl">
      <div className="flex h-full w-full flex-col items-center justify-center gap-y-10 overflow-hidden">
        <motion.div
          layout
          className="flex h-10 cursor-pointer items-center justify-between gap-x-2 overflow-hidden rounded-full border-[1px] px-2 pl-2.5"
          transition={{
            duration: 0.2,
            type: "spring",
            stiffness: 300,
            damping: 25,
          }}
          animate={{ width: "auto" }}
        >
          <div className="flex w-auto items-center justify-between gap-2 overflow-hidden">
            <div
              className="flex items-center justify-center gap-2"
              style={{
                willChange: "auto",
                height: 40,
              }}
            >
              <div className="center size-5">
                <Icon
                  size={20}
                  style={{
                    color: items[active].color,
                  }}
                />
              </div>
              <motion.span className="font-openrunde w-auto translate-x-0 translate-y-0 text-base font-medium select-none">
                {items[active].name}
              </motion.span>
            </div>
            {isClicked && (
              <AnimatePresence>
                <motion.div
                  className="flex w-auto items-center justify-center gap-x-2 overflow-hidden"
                  style={{
                    opacity: 1,
                    willChange: "auto",
                    filter: "none",
                  }}
                >
                  <span className="font-openrunde text-sm font-medium text-muted-foreground select-none">
                    ·
                  </span>
                  <span className="font-openrunde translate-x-0 translate-y-0 text-sm font-medium text-nowrap text-muted-foreground select-none">
                    {items[active].description}
                  </span>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
          <motion.button
            className="rounded-full px-3 py-1 text-sm tracking-tighter"
            style={{
              color: items[active].color,
              backgroundColor: items[active].bg,
            }}
            onClick={() => setIsClicked(!isClicked)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {items[active].text}
          </motion.button>
        </motion.div>
        <div className="relative flex h-8 items-center justify-center gap-2">
          {items.map((item, index) => (
            <motion.button
              type="button"
              ref={(el) => {
                itemRefs.current[index] = el
              }}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              onClick={() => {
                setIsClicked(false)
                setActive(index)
              }}
              key={index}
              className={cn(
                "relative z-10 flex h-full cursor-pointer items-center justify-center px-3"
              )}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {item.name}
            </motion.button>
          ))}
          <motion.div
            animate={isHovering ? hoverState : activeState}
            className="absolute z-0 h-full rounded bg-muted"
            transition={{
              duration: 0.3,
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default MorphingPill

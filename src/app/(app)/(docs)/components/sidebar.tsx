/**
 * This component is inspired by Devouring Details and Skiper UI.
 */

"use client"

import { memo, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "motion/react"

type MenuItem = {
  title: string
  href: string
}

export function Sidebar({ items }: { items: MenuItem[] }) {
  const pathname = usePathname()

  const itemActiveRef = useRef<HTMLAnchorElement | null>(null)

  // Scroll active item into view on mount
  useEffect(() => {
    itemActiveRef.current?.scrollIntoView({ block: "center" })
  }, [])

  return (
    <div
      className="flex flex-col gap-2 py-5.25 pr-0.5 pl-3"
      style={
        {
          "--normal-line-width": `${lineVariants.normal.width}px`,
        } as React.CSSProperties
      }
    >
      {items.map((item, index) => (
        <SidebarMenuItem
          key={item.href}
          ref={item.href === pathname ? itemActiveRef : undefined}
          title={item.title}
          href={item.href}
          isActive={item.href === pathname}
          isLast={index === items.length - 1}
        />
      ))}
    </div>
  )
}

const MotionLink = motion.create(Link)

const lineVariants = {
  normal: { width: 24 },
  active: { width: 40 },
  hover: { width: 40 },
}

type SidebarMenuItemProps = MenuItem & {
  ref?: React.Ref<HTMLAnchorElement> | undefined
  isActive?: boolean
  isLast?: boolean
}

const SidebarMenuItem = memo(function SidebarMenuItem({
  ref,
  title,
  href,
  isActive = false,
  isLast = false,
}: SidebarMenuItemProps) {
  return (
    <>
      <MotionLink
        ref={ref}
        data-active={isActive}
        className="group relative flex h-px items-center gap-3 after:absolute after:top-1/2 after:left-0 after:size-full after:-translate-y-1/2 after:p-3.5"
        href={href}
        initial={false}
        animate={isActive ? "active" : "normal"}
        whileHover="hover"
      >
        <motion.span
          className="block h-px shrink-0 bg-foreground/20 transition-[background-color] ease-out group-hover:bg-foreground group-data-active:bg-foreground"
          variants={lineVariants}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        />
        <span className="text-sm whitespace-nowrap text-muted-foreground transition-[color] ease-out group-hover:text-foreground group-data-active:text-foreground">
          {title}
        </span>
      </MotionLink>

      {!isLast && (
        <>
          <span className="block h-px w-(--normal-line-width) bg-foreground/20" />
          <span className="block h-px w-(--normal-line-width) bg-foreground/20" />
        </>
      )}
    </>
  )
})

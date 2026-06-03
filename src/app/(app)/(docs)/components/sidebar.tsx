"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

type MenuItem = {
  title: string
  href: string
  icon?: React.JSX.Element
}

export function Sidebar({ items }: { items: MenuItem[] }) {
  const pathname = usePathname()

  const itemActiveRef = useRef<HTMLAnchorElement | null>(null)

  useEffect(() => {
    itemActiveRef.current?.scrollIntoView({ block: "center" })
  }, [])

  return (
    <nav className="no-scrollbar grow overflow-x-clip overflow-y-auto overscroll-contain scroll-fade-effect-y">
      <ul className="flex flex-col gap-px p-1">
        {items.map((item) => {
          const isActive = item.href === pathname
          return (
            <li key={item.href}>
              <Link
                ref={isActive ? itemActiveRef : null}
                data-active={isActive}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm",
                  "hover:bg-sidebar-accent data-active:bg-sidebar-accent",
                  "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground"
                )}
                href={item.href}
              >
                {item.icon}
                <span className="line-clamp-1">{item.title}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

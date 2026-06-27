"use client"

import type { Route } from "next"
import Link from "next/link"
import { usePathname } from "next/navigation"

import type { NavItem } from "@/types/nav"
import { blockCategories } from "@/config/registry"

const NAV_ITEMS: NavItem<Route>[] = [
  {
    href: "/blocks",
    title: "All",
  },
  ...blockCategories.map((category) => ({
    href: `/blocks/${category.name}` as Route,
    title: category.title,
  })),
]

export function BlocksNav() {
  const pathname = usePathname()

  return (
    <div className="no-scrollbar scroll-fade-x overflow-x-auto">
      <nav className="flex w-max items-center pr-2 whitespace-nowrap">
        {NAV_ITEMS.map(({ href, title }) => (
          <Link
            key={href}
            href={href}
            aria-current={href === pathname ? "page" : undefined}
            className="border-r border-line p-4 font-mono text-[.8125rem]/4 font-medium tracking-wide text-muted-foreground uppercase transition-[color,background-color] ease-out hover:bg-accent-muted aria-[current=page]:bg-accent-muted aria-[current=page]:text-foreground"
          >
            {title}
          </Link>
        ))}
      </nav>
    </div>
  )
}

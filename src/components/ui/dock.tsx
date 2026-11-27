"use client"

import * as React from "react"

import { LiquidGlassPanel, useLiquidGlass } from "@/lib/liquid-glass"
import { cn } from "@/lib/utils"

export interface DockItem {
  id: string
  label: string
  icon: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
}

export interface DockProps {
  items?: DockItem[]
  activeId?: string
  defaultActiveId?: string
  onSelect?: (id: string) => void
  className?: string
  ariaLabel?: string
  glassRadius?: number | "capsule"
  glassTone?: "light" | "dark"
  glassBackdrop?: string
}

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string
}

export function PlusIcon({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn(
        "transition-[color,transform] duration-150 ease-out",
        className
      )}
      {...props}
    >
      <path
        d="M12 4V20M20 12H4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  )
}

export function SearchIcon({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn(
        "transition-[color,transform] duration-150 ease-out",
        className
      )}
      {...props}
    >
      <path
        d="M17 17L21 21"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  )
}

export function BellIcon({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn(
        "transition-[color,transform] duration-150 ease-out",
        className
      )}
      {...props}
    >
      <path
        d="M20 18.5011L18.349 7.93407C17.8603 4.80601 15.166 2.5 12 2.5C8.83398 2.5 6.13971 4.80601 5.65098 7.93407L4 18.5011"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M20 18.5C20 16.8431 16.4183 15.5 12 15.5C7.58172 15.5 4 16.8431 4 18.5C4 20.1569 7.58172 21.5 12 21.5C16.4183 21.5 20 20.1569 20 18.5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M13 18.5H11"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  )
}

export function UserEditIcon({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn(
        "transition-[color,transform] duration-150 ease-out",
        className
      )}
      {...props}
    >
      <path
        d="M15.5 8C15.5 5.23858 13.2614 3 10.5 3C7.73858 3 5.5 5.23858 5.5 8C5.5 10.7614 7.73858 13 10.5 13C13.2614 13 15.5 10.7614 15.5 8Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M3.5 20C3.5 16.134 6.63401 13 10.5 13C11.775 13 12.9704 13.3409 14 13.9365"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M20.1887 14.9339L19.5661 14.3113C19.151 13.8962 18.478 13.8962 18.0629 14.3113L14.7141 17.6601C14.269 18.1052 13.9656 18.6722 13.8421 19.2895L13.5 21L15.2105 20.6579C15.8278 20.5344 16.3948 20.231 16.8399 19.7859L20.1887 16.4371C20.6038 16.022 20.6038 15.349 20.1887 14.9339Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  )
}

export function SunIcon({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn(
        "transition-[color,transform] duration-150 ease-out",
        className
      )}
      {...props}
    >
      <path
        d="M17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M12 2V3.5M12 20.5V22M19.0708 19.0713L18.0101 18.0106M5.98926 5.98926L4.9286 4.9286M22 12H20.5M3.5 12H2M19.0713 4.92871L18.0106 5.98937M5.98975 18.0107L4.92909 19.0714"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  )
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn("animate-spin", className)}
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="1.5"
        className="opacity-25"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export const DEFAULT_DOCK_ITEMS: DockItem[] = [
  { id: "create", label: "Create new", icon: <PlusIcon /> },
  { id: "search", label: "Search", icon: <SearchIcon /> },
  { id: "notifications", label: "Notifications", icon: <BellIcon /> },
  { id: "profile", label: "Edit profile", icon: <UserEditIcon /> },
  { id: "theme", label: "Toggle theme", icon: <SunIcon /> },
]

export function Dock({
  items = DEFAULT_DOCK_ITEMS,
  activeId,
  defaultActiveId,
  onSelect,
  className,
  ariaLabel = "Quick actions dock",
  glassRadius = 24,
  glassTone,
  glassBackdrop,
}: DockProps) {
  const isGlassReady = useLiquidGlass()
  const [internalActiveId, setInternalActiveId] = React.useState<
    string | undefined
  >(defaultActiveId)

  const isControlled = activeId !== undefined
  const currentActiveId = isControlled ? activeId : internalActiveId

  const handleClick = (item: DockItem) => {
    if (item.disabled || item.loading) return
    if (!isControlled) {
      setInternalActiveId(item.id)
    }
    item.onClick?.()
    onSelect?.(item.id)
  }

  return (
    <div
      role="toolbar"
      aria-label={ariaLabel}
      className={cn(
        "relative z-10 mt-3 flex w-fit items-center gap-1.5 rounded-[24px] p-1.5",
        "border border-[color-mix(in_oklab,var(--foreground)_8%,transparent)]",
        !isGlassReady && [
          "backdrop-blur-2xl backdrop-saturate-180",
          "bg-[color-mix(in_oklab,var(--foreground)_3%,color-mix(in_oklab,var(--background)_38%,transparent))]",
        ],
        className
      )}
    >
      <LiquidGlassPanel
        radius={glassRadius}
        tone={glassTone}
        backdrop={glassBackdrop}
      />
      {items.map((item) => {
        const isActive = currentActiveId === item.id
        const isDisabled = Boolean(item.disabled || item.loading)

        return (
          <button
            key={item.id}
            type="button"
            title={item.label}
            aria-label={item.label}
            aria-pressed={isActive}
            aria-busy={item.loading || undefined}
            disabled={isDisabled}
            onClick={() => handleClick(item)}
            className={cn(
              "relative z-10 flex items-center justify-center rounded-[16px] p-3 text-muted-foreground",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background focus-visible:outline-none",
              "disabled:pointer-events-none disabled:opacity-55"
            )}
          >
            {item.loading ? <SpinnerIcon /> : item.icon}
          </button>
        )
      })}
    </div>
  )
}

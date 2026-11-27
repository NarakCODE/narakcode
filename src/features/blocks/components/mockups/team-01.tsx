import { cn } from "@/lib/utils"

import { Avatar, Bar } from "./primitives"

export function Team01Mockup() {
  return (
    <div className="flex size-full items-center p-3">
      <div className="grid w-full grid-cols-4 gap-1.5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-sm border border-border py-3",
              i === 1 && "border-foreground/30 bg-surface"
            )}
          >
            <Avatar className="size-5" />
            <div className="flex w-full flex-col items-center gap-1">
              <Bar className="w-1/2 bg-muted-foreground/70" />
              <Bar className="h-0.75 w-2/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

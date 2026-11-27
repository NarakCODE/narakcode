import { cn } from "@/lib/utils"

/**
 * Small square chip that frames a leading icon in list items and metadata rows.
 * The layered border + ring is a site-wide visual signature, so it lives here
 * instead of being retyped per call site.
 */
export function IconTile({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="icon-tile"
      className={cn(
        "flex size-6 shrink-0 items-center justify-center text-muted-foreground select-none",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

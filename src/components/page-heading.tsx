import { cn } from "@/lib/utils"

export function PageHeading({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="page-heading"
      className={cn("group/page-heading", className)}
      {...props}
    >
      {children}
      <div
        data-slot="page-heading-description-line"
        className="screen-line-bottom hidden h-px group-has-data-[slot=page-heading-description]/page-heading:flex"
      />
    </div>
  )
}

export function PageHeadingTagline({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="page-heading-tagline"
      className={cn(
        "px-4 pb-2 text-body-regular-medium tracking-wider text-text-secondary",
        className
      )}
      {...props}
    />
  )
}

export function PageHeadingTitle({
  className,
  ...props
}: React.ComponentProps<"h1">) {
  return (
    <h1
      data-slot="page-heading-title"
      className={cn(
        "screen-line-top screen-line-bottom -translate-x-px px-4",
        "text-title-regular text-balance text-text-primary",
        className
      )}
      {...props}
    />
  )
}

export function PageHeadingDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="page-heading-description"
      className={cn(
        "p-4 text-paragraph-regular text-balance text-text-secondary",
        className
      )}
      {...props}
    />
  )
}

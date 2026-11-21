import { cn } from "@/lib/utils"

export function NarakCodeSignature({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="narakcode-signature"
      className={cn("inline-flex flex-col items-start select-none", className)}
      aria-hidden
      {...props}
    >
      <span className="-rotate-4 pl-0.5 font-handwritten text-[1.75rem]/none tracking-tight">
        Narak
      </span>
      <svg
        className="-mt-1 h-3 w-28 overflow-visible"
        viewBox="0 0 112 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 9.5C28 5.5 68 3 110 3.5" />
      </svg>
    </div>
  )
}

"use client"

import { IconCheck, IconCopy, IconX } from "@tabler/icons-react"

import type { Event } from "@/lib/events"
import { trackEvent } from "@/lib/events"
import type { CopyButtonProps } from "@/registry/components/copy-button"
import { CopyButton as CopyButtonPrimitive } from "@/registry/components/copy-button"

export function CopyButton({
  size = "icon-sm",
  event,
  ...props
}: CopyButtonProps & {
  event?: Event["name"]
}) {
  return (
    <CopyButtonPrimitive
      variant="secondary"
      size={size}
      idleIcon={<IconCopy />}
      doneIcon={<IconCheck />}
      errorIcon={<IconX />}
      onCopySuccess={(copiedValue) => {
        if (event) {
          trackEvent({
            name: event,
            properties: {
              code: copiedValue,
            },
          })
        }
      }}
      {...props}
    />
  )
}

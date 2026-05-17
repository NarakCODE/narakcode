"use client"

import { AnimatePresence, motion } from "motion/react"
import type { ComponentProps } from "react"

import { IconPlaceholder } from "@/components/icon-placeholder"
import { Button } from "@/components/ui/button"
import type { CopyState } from "@/hooks/use-copy-to-clipboard"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"

export type CopyStateIconProps = {
  state: CopyState
  /** Custom icon for idle state. */
  idleIcon?: React.ReactNode
  /** Custom icon for done state. */
  doneIcon?: React.ReactNode
  /** Custom icon for error state. */
  errorIcon?: React.ReactNode
}

export function CopyStateIcon({
  state,
  idleIcon,
  doneIcon,
  errorIcon,
}: CopyStateIconProps) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={state}
        initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
        transition={{
          type: "spring",
          duration: 0.3,
          bounce: 0,
        }}
      >
        {state === "idle" &&
          (idleIcon ?? (
            <IconPlaceholder
              data-slot="idle-icon"
              lucide="Copy"
              tabler="IconCopy"
              hugeicons="Copy01Icon"
              phosphor="CopyIcon"
              remixicon="RiFileCopyLine"
            />
          ))}

        {state === "done" &&
          (doneIcon ?? (
            <IconPlaceholder
              data-slot="done-icon"
              lucide="Check"
              tabler="IconCheck"
              hugeicons="Tick02Icon"
              phosphor="CheckIcon"
              remixicon="RiCheckLine"
            />
          ))}

        {state === "error" &&
          (errorIcon ?? (
            <IconPlaceholder
              data-slot="error-icon"
              lucide="CircleX"
              tabler="IconX"
              hugeicons="CancelCircleIcon"
              phosphor="XCircleIcon"
              remixicon="RiCloseCircleLine"
            />
          ))}
      </motion.span>
    </AnimatePresence>
  )
}

export type CopyButtonProps = ComponentProps<typeof Button> & {
  /** The text to copy, or a function that returns the text. */
  text: string | (() => string)
  /** Called with the copied text on successful copy. */
  onCopySuccess?: (text: string) => void
  /** Called with the error if the copy operation fails. */
  onCopyError?: (error: Error) => void
} & Omit<CopyStateIconProps, "state">

export function CopyButton({
  size = "icon",
  children,
  text,
  idleIcon,
  doneIcon,
  errorIcon,
  onClick,
  onCopySuccess,
  onCopyError,
  ...props
}: CopyButtonProps) {
  const { state, copy } = useCopyToClipboard({
    onCopySuccess,
    onCopyError,
  })

  return (
    <Button
      className="will-change-transform"
      size={size}
      onClick={(e) => {
        copy(text)
        onClick?.(e)
      }}
      aria-label="Copy"
      {...props}
    >
      <CopyStateIcon
        state={state}
        idleIcon={idleIcon}
        doneIcon={doneIcon}
        errorIcon={errorIcon}
      />
      {children}
    </Button>
  )
}

"use client"

import type { HTMLMotionProps, Variants } from "motion/react"
import { AnimatePresence, motion } from "motion/react"
import type { ComponentProps } from "react"

import { IconPlaceholder } from "@/components/icon-placeholder"
import { Button } from "@/components/ui/button"
import type { CopyState } from "@/hooks/use-copy-to-clipboard"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"

export const motionIconVariants: Variants = {
  initial: { opacity: 0, scale: 0.8, filter: "blur(2px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, scale: 0.8 },
}

export const motionIconProps: HTMLMotionProps<"span"> = {
  variants: motionIconVariants,
  initial: "initial",
  animate: "animate",
  exit: "exit",
  transition: { duration: 0.15, ease: "easeOut" },
}

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
      {state === "idle" ? (
        <motion.span key="idle" {...motionIconProps}>
          {idleIcon ?? (
            <IconPlaceholder
              data-slot="idle-icon"
              lucide="Copy"
              tabler="IconCopy"
              hugeicons="Copy01Icon"
              phosphor="CopyIcon"
              remixicon="RiFileCopyLine"
            />
          )}
        </motion.span>
      ) : state === "done" ? (
        <motion.span key="done" {...motionIconProps}>
          {doneIcon ?? (
            <IconPlaceholder
              data-slot="done-icon"
              lucide="Check"
              tabler="IconCheck"
              hugeicons="Tick02Icon"
              phosphor="CheckIcon"
              remixicon="RiCheckLine"
            />
          )}
        </motion.span>
      ) : state === "error" ? (
        <motion.span key="error" {...motionIconProps}>
          {errorIcon ?? (
            <IconPlaceholder
              data-slot="error-icon"
              lucide="CircleX"
              tabler="IconX"
              hugeicons="CancelCircleIcon"
              phosphor="XCircleIcon"
              remixicon="RiCloseCircleLine"
            />
          )}
        </motion.span>
      ) : null}
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

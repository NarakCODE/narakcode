function canTriggerHaptic() {
  if (
    typeof window === "undefined" ||
    typeof document === "undefined" ||
    typeof navigator === "undefined"
  ) {
    return false
  }

  const isCoarsePointer = window.matchMedia?.("(pointer: coarse)").matches
  const isMobileViewport = window.matchMedia?.("(max-width: 639px)").matches
  const hasVibration = typeof navigator.vibrate === "function"
  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)

  return Boolean(isCoarsePointer || isMobileViewport || hasVibration || isIOS)
}

/**
 * Trigger haptic feedback on mobile devices.
 * Uses Vibration API on Android/modern browsers, and iOS checkbox trick on iOS.
 *
 * @param pattern - Vibration duration (ms) or pattern.
 * Custom patterns only work on Android devices. iOS uses fixed feedback.
 * See [Vibration API](https://developer.mozilla.org/docs/Web/API/Vibration_API)
 *
 * @example
 * import { haptic } from "@/lib/haptic"
 *
 * <Button onClick={() => haptic()}>Haptic</Button>
 */
export function haptic(pattern: number | number[] = 50) {
  try {
    if (!canTriggerHaptic()) return

    if (typeof navigator.vibrate === "function") {
      navigator.vibrate(pattern)
      return
    }

    // iOS haptic trick via checkbox switch element
    const label = document.createElement("label")
    label.ariaHidden = "true"
    label.style.position = "fixed"
    label.style.opacity = "0"
    label.style.pointerEvents = "none"

    const input = document.createElement("input")
    input.type = "checkbox"
    input.setAttribute("switch", "")

    // Link label and input with a unique ID for Safari haptic trigger
    const id = "haptic-trigger-" + Math.random().toString(36).substring(2, 9)
    input.id = id
    label.setAttribute("for", id)

    label.appendChild(input)

    document.body.appendChild(label)

    // Trigger haptic feedback by clicking the associated label
    label.click()

    // Remove the element after a brief delay so WebKit registers the toggle
    setTimeout(() => {
      try {
        if (document.body.contains(label)) {
          document.body.removeChild(label)
        }
      } catch {}
    }, 100)
  } catch {}
}

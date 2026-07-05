import { afterEach, describe, expect, it, vi } from "vitest"

import { haptic } from "./haptic"

describe("haptic", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it("does nothing when run outside a browser environment", () => {
    vi.stubGlobal("window", undefined)
    vi.stubGlobal("document", undefined)
    vi.stubGlobal("navigator", undefined)

    // Should not throw or crash
    expect(() => haptic()).not.toThrow()
  })

  it("does nothing when device/viewport does not support haptic feedback", () => {
    const mockMatchMedia = vi.fn().mockReturnValue({ matches: false })
    const mockCreateElement = vi.fn()

    vi.stubGlobal("window", {
      matchMedia: mockMatchMedia,
    })
    vi.stubGlobal("document", {
      createElement: mockCreateElement,
    })
    vi.stubGlobal("navigator", {
      userAgent: "Desktop Chrome",
      platform: "MacIntel",
      maxTouchPoints: 0,
    })

    haptic()

    // document.createElement should not be called since we return early
    expect(mockCreateElement).not.toHaveBeenCalled()
  })

  it("uses Vibration API when navigator.vibrate is available", () => {
    const mockVibrate = vi.fn()
    vi.stubGlobal("window", {
      matchMedia: vi.fn().mockReturnValue({ matches: true }),
    })
    vi.stubGlobal("document", {})
    vi.stubGlobal("navigator", {
      vibrate: mockVibrate,
      userAgent: "Android",
      platform: "Linux",
      maxTouchPoints: 5,
    })

    haptic(100)

    expect(mockVibrate).toHaveBeenCalledWith(100)
  })

  it("uses the checkbox switch trick on iOS Safari/Chrome", () => {
    vi.useFakeTimers()

    const mockClick = vi.fn()
    const mockAppendChild = vi.fn()
    const mockRemoveChild = vi.fn()
    const mockSetAttribute = vi.fn()
    const mockContains = vi.fn().mockReturnValue(true)

    const mockInput = {
      type: "",
      id: "",
      setAttribute: mockSetAttribute,
    }
    const mockLabel = {
      ariaHidden: "",
      style: {
        position: "",
        opacity: "",
        pointerEvents: "",
      },
      setAttribute: mockSetAttribute,
      appendChild: vi.fn(),
      click: mockClick,
    }

    vi.stubGlobal("window", {
      matchMedia: vi.fn().mockReturnValue({ matches: true }),
    })

    const mockCreateElement = vi.fn().mockImplementation((tag) => {
      if (tag === "input") return mockInput
      if (tag === "label") return mockLabel
      return {}
    })

    vi.stubGlobal("document", {
      createElement: mockCreateElement,
      body: {
        appendChild: mockAppendChild,
        removeChild: mockRemoveChild,
        contains: mockContains,
      },
    })

    vi.stubGlobal("navigator", {
      userAgent: "iPhone OS",
      platform: "iPhone",
      maxTouchPoints: 5,
    })

    haptic()

    // Verify it created elements
    expect(mockCreateElement).toHaveBeenCalledWith("label")
    expect(mockCreateElement).toHaveBeenCalledWith("input")

    // Verify properties and switch trick
    expect(mockInput.type).toBe("checkbox")
    expect(mockSetAttribute).toHaveBeenCalledWith("switch", "")

    // Verify link via ID and htmlFor/for
    expect(mockInput.id).toBeDefined()
    expect(mockInput.id.startsWith("haptic-trigger-")).toBe(true)
    expect(mockSetAttribute).toHaveBeenCalledWith("for", mockInput.id)

    // Verify structure setup
    expect(mockLabel.appendChild).toHaveBeenCalledWith(mockInput)
    expect(mockAppendChild).toHaveBeenCalledWith(mockLabel)

    // Verify it clicked the label, NOT the input
    expect(mockClick).toHaveBeenCalled()

    // Verify asynchronous removal
    expect(mockRemoveChild).not.toHaveBeenCalled()
    vi.advanceTimersByTime(100)
    expect(mockRemoveChild).toHaveBeenCalledWith(mockLabel)
  })
})

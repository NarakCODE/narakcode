import { describe, expect, it } from "vitest"

import { encodeQrCode } from "./qr-encoder"

describe("encodeQrCode", () => {
  it("encodes short payloads into Version 1 (21x21) with valid finder patterns", () => {
    const qr = encodeQrCode("HELLO")
    expect(qr.version).toBe(1)
    expect(qr.size).toBe(21)
    expect(qr.modules).toHaveLength(21)
    expect(qr.modules[0]).toHaveLength(21)

    // Top-left 7x7 finder outer border and 3x3 center
    expect(qr.modules[0][0]).toBe(true)
    expect(qr.modules[0][6]).toBe(true)
    expect(qr.modules[6][0]).toBe(true)
    expect(qr.modules[1][1]).toBe(false)
    expect(qr.modules[3][3]).toBe(true)
    // Mandatory dark module at (size - 8, 8)
    expect(qr.modules[qr.size - 8][8]).toBe(true)
  })

  it("encodes a realistic EMVCo / KHQR payload deterministically", () => {
    const khqr =
      "00020101021229370016mock.khqr.merchant0113TXN-20261127-99A8C15303840540515.005802KH6304MOCK"
    const a = encodeQrCode(khqr)
    const b = encodeQrCode(khqr)

    expect(a.version).toBeGreaterThanOrEqual(5)
    expect(a.size).toBe(a.version * 4 + 17)
    expect(a.modules).toEqual(b.modules)
  })

  it("handles longer 160+ byte PayWay KHQR strings up to Version 10-M", () => {
    const longKhqr = "0".repeat(180)
    const qr = encodeQrCode(longKhqr)
    expect(qr.version).toBe(9)
    expect(qr.size).toBe(53)
  })
})

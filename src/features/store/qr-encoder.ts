/**
 * Zero-dependency ISO/IEC 18004 QR Code encoder (Byte mode, Error Correction Level M, Versions 1-10).
 * Supports payloads up to 213 UTF-8 bytes, covering all standard EMVCo / Bakong KHQR strings.
 */

export interface QrMatrix {
  version: number
  size: number
  /** Row-major boolean grid: true = dark module, false = light module */
  modules: boolean[][]
}

// Capacity and Reed-Solomon block specs for Error Correction Level M (15% recovery), Versions 1-10.
// [totalCodewords, ecCodewordsPerBlock, group1Blocks, group1DataCodewords, group2Blocks, group2DataCodewords]
const VERSION_SPECS_M: ReadonlyArray<
  readonly [number, number, number, number, number, number]
> = [
  [0, 0, 0, 0, 0, 0], // placeholder for 1-indexed versions
  [26, 10, 1, 16, 0, 0], // V1  (21x21)  max 14 bytes
  [44, 16, 1, 28, 0, 0], // V2  (25x25)  max 26 bytes
  [70, 26, 1, 44, 0, 0], // V3  (29x29)  max 42 bytes
  [100, 18, 2, 32, 0, 0], // V4  (33x33)  max 62 bytes
  [134, 24, 2, 43, 0, 0], // V5  (37x37)  max 84 bytes
  [172, 16, 4, 27, 0, 0], // V6  (41x41)  max 106 bytes
  [196, 18, 4, 31, 0, 0], // V7  (45x45)  max 122 bytes
  [242, 22, 2, 38, 2, 39], // V8  (49x49)  max 152 bytes
  [292, 22, 3, 36, 2, 37], // V9  (53x53)  max 180 bytes
  [346, 26, 4, 43, 1, 44], // V10 (57x57)  max 213 bytes
]

const ALIGNMENT_CENTERS: ReadonlyArray<readonly number[]> = [
  [],
  [],
  [6, 18],
  [6, 22],
  [6, 26],
  [6, 30],
  [6, 34],
  [6, 22, 38],
  [6, 24, 42],
  [6, 26, 46],
  [6, 28, 50],
]

// Precomputed BCH(15, 5) format strings for EC Level M (00) and mask patterns 0-7, XORed with 0x5412.
const FORMAT_BITS_M: readonly number[] = [
  0x5412, 0x5125, 0x5e7c, 0x5b4b, 0x45f9, 0x40ce, 0x4f97, 0x4aa0,
]

// Precomputed BCH(18, 6) version info bits for Versions 7-10.
const VERSION_BITS: Readonly<Record<number, number>> = {
  7: 0x07c94,
  8: 0x085bc,
  9: 0x09a99,
  10: 0x0a4d3,
}

// GF(256) multiplication with primitive polynomial 0x11d (x^8 + x^4 + x^3 + x^2 + 1)
function gfMul(a: number, b: number): number {
  let result = 0
  let aa = a
  let bb = b
  while (bb > 0) {
    if (bb & 1) result ^= aa
    aa <<= 1
    if (aa & 0x100) aa ^= 0x11d
    bb >>= 1
  }
  return result
}

function rsGeneratorPoly(degree: number): Uint8Array {
  let poly = new Uint8Array([1])
  let root = 1
  for (let i = 0; i < degree; i++) {
    const next = new Uint8Array(poly.length + 1)
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= poly[j]
      next[j + 1] ^= gfMul(poly[j], root)
    }
    poly = next
    root = gfMul(root, 2)
  }
  return poly
}

function rsRemainder(data: Uint8Array, ecCount: number): Uint8Array {
  const gen = rsGeneratorPoly(ecCount)
  const rem = new Uint8Array(ecCount)
  for (let i = 0; i < data.length; i++) {
    const factor = data[i] ^ rem[0]
    rem.copyWithin(0, 1)
    rem[ecCount - 1] = 0
    for (let j = 0; j < ecCount; j++) {
      rem[j] ^= gfMul(gen[j + 1], factor)
    }
  }
  return rem
}

function selectVersion(byteLength: number): number {
  for (let v = 1; v < VERSION_SPECS_M.length; v++) {
    const [, , g1Blocks, g1Data, g2Blocks, g2Data] = VERSION_SPECS_M[v]
    const totalDataCodewords = g1Blocks * g1Data + g2Blocks * g2Data
    const countBits = v <= 9 ? 8 : 16
    const capacityBits = totalDataCodewords * 8
    const requiredBits = 4 + countBits + byteLength * 8
    if (requiredBits <= capacityBits) {
      return v
    }
  }
  throw new Error(
    `QR payload length (${byteLength} bytes) exceeds Version 10-M capacity (213 bytes).`
  )
}

function buildDataCodewords(bytes: Uint8Array, version: number): Uint8Array {
  const [, , g1Blocks, g1Data, g2Blocks, g2Data] = VERSION_SPECS_M[version]
  const totalDataCodewords = g1Blocks * g1Data + g2Blocks * g2Data
  const bits: number[] = []

  const pushBits = (value: number, length: number) => {
    for (let i = length - 1; i >= 0; i--) {
      bits.push((value >>> i) & 1)
    }
  }

  // Byte mode indicator (0100)
  pushBits(0b0100, 4)
  // Character count indicator (8 bits for V1-V9, 16 bits for V10+)
  pushBits(bytes.length, version <= 9 ? 8 : 16)

  for (const b of bytes) {
    pushBits(b, 8)
  }

  // Terminator (up to 4 zero bits)
  const maxBits = totalDataCodewords * 8
  const terminatorLen = Math.min(4, maxBits - bits.length)
  for (let i = 0; i < terminatorLen; i++) {
    bits.push(0)
  }

  // Pad to byte boundary
  while (bits.length % 8 !== 0) {
    bits.push(0)
  }

  // Convert to bytes and add alternating pad codewords (0xEC, 0x11)
  const codewords = new Uint8Array(totalDataCodewords)
  const byteCount = bits.length / 8
  for (let i = 0; i < byteCount; i++) {
    let val = 0
    for (let b = 0; b < 8; b++) {
      val = (val << 1) | bits[i * 8 + b]
    }
    codewords[i] = val
  }

  let padToggle = true
  for (let i = byteCount; i < totalDataCodewords; i++) {
    codewords[i] = padToggle ? 0xec : 0x11
    padToggle = !padToggle
  }

  return codewords
}

function interleaveCodewords(data: Uint8Array, version: number): Uint8Array {
  const [totalCodewords, ecPerBlock, g1Blocks, g1Data, g2Blocks, g2Data] =
    VERSION_SPECS_M[version]

  const dataBlocks: Uint8Array[] = []
  const ecBlocks: Uint8Array[] = []
  let offset = 0

  for (let i = 0; i < g1Blocks; i++) {
    const block = data.slice(offset, offset + g1Data)
    offset += g1Data
    dataBlocks.push(block)
    ecBlocks.push(rsRemainder(block, ecPerBlock))
  }

  for (let i = 0; i < g2Blocks; i++) {
    const block = data.slice(offset, offset + g2Data)
    offset += g2Data
    dataBlocks.push(block)
    ecBlocks.push(rsRemainder(block, ecPerBlock))
  }

  const result = new Uint8Array(totalCodewords)
  let outIdx = 0
  const maxDataLen = Math.max(g1Data, g2Data)

  for (let i = 0; i < maxDataLen; i++) {
    for (const block of dataBlocks) {
      if (i < block.length) {
        result[outIdx++] = block[i]
      }
    }
  }

  for (let i = 0; i < ecPerBlock; i++) {
    for (const block of ecBlocks) {
      result[outIdx++] = block[i]
    }
  }

  return result
}

function placeFinderPattern(
  modules: boolean[][],
  isFunction: boolean[][],
  top: number,
  left: number,
  size: number
) {
  for (let dy = -1; dy <= 7; dy++) {
    for (let dx = -1; dx <= 7; dx++) {
      const r = top + dy
      const c = left + dx
      if (r < 0 || r >= size || c < 0 || c >= size) continue
      const inOuter = dy >= 0 && dy <= 6 && dx >= 0 && dx <= 6
      const isBorder = dy === 0 || dy === 6 || dx === 0 || dx === 6
      const isCenter = dy >= 2 && dy <= 4 && dx >= 2 && dx <= 4
      modules[r][c] = inOuter && (isBorder || isCenter)
      isFunction[r][c] = true
    }
  }
}

function placeAlignmentPattern(
  modules: boolean[][],
  isFunction: boolean[][],
  centerRow: number,
  centerCol: number
) {
  for (let dy = -2; dy <= 2; dy++) {
    for (let dx = -2; dx <= 2; dx++) {
      const r = centerRow + dy
      const c = centerCol + dx
      const dist = Math.max(Math.abs(dy), Math.abs(dx))
      modules[r][c] = dist === 0 || dist === 2
      isFunction[r][c] = true
    }
  }
}

function drawFormatBits(
  modules: boolean[][],
  isFunction: boolean[][],
  size: number,
  mask: number
) {
  const bits = FORMAT_BITS_M[mask]
  const getBit = (i: number) => ((bits >>> i) & 1) === 1

  // Around top-left finder
  for (let i = 0; i <= 5; i++) {
    modules[8][i] = getBit(14 - i)
    isFunction[8][i] = true
  }
  modules[8][7] = getBit(8)
  isFunction[8][7] = true
  modules[8][8] = getBit(7)
  isFunction[8][8] = true
  modules[7][8] = getBit(6)
  isFunction[7][8] = true
  for (let i = 0; i <= 5; i++) {
    modules[5 - i][8] = getBit(5 - i)
    isFunction[5 - i][8] = true
  }

  // Bottom-left and top-right copies
  for (let i = 0; i <= 6; i++) {
    modules[size - 1 - i][8] = getBit(14 - i)
    isFunction[size - 1 - i][8] = true
  }
  for (let i = 0; i <= 7; i++) {
    modules[8][size - 8 + i] = getBit(7 - i)
    isFunction[8][size - 8 + i] = true
  }
}

function drawVersionBits(
  modules: boolean[][],
  isFunction: boolean[][],
  version: number,
  size: number
) {
  const bits = VERSION_BITS[version]
  if (bits === undefined) return
  for (let i = 0; i < 18; i++) {
    const bit = ((bits >>> i) & 1) === 1
    const r = Math.floor(i / 3)
    const c = size - 11 + (i % 3)
    modules[r][c] = bit
    isFunction[r][c] = true
    modules[c][r] = bit
    isFunction[c][r] = true
  }
}

function maskCondition(mask: number, r: number, c: number): boolean {
  switch (mask) {
    case 0:
      return (r + c) % 2 === 0
    case 1:
      return r % 2 === 0
    case 2:
      return c % 3 === 0
    case 3:
      return (r + c) % 3 === 0
    case 4:
      return (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0
    case 5:
      return ((r * c) % 2) + ((r * c) % 3) === 0
    case 6:
      return (((r * c) % 2) + ((r * c) % 3)) % 2 === 0
    case 7:
      return (((r + c) % 2) + ((r * c) % 3)) % 2 === 0
    default:
      return false
  }
}

function penaltyScore(modules: boolean[][], size: number): number {
  let score = 0

  // Rule 1: 5+ consecutive same-color modules in row or column
  for (let r = 0; r < size; r++) {
    let runColor = modules[r][0]
    let runLen = 1
    for (let c = 1; c < size; c++) {
      if (modules[r][c] === runColor) {
        runLen++
        if (runLen === 5) score += 3
        else if (runLen > 5) score += 1
      } else {
        runColor = modules[r][c]
        runLen = 1
      }
    }
  }
  for (let c = 0; c < size; c++) {
    let runColor = modules[0][c]
    let runLen = 1
    for (let r = 1; r < size; r++) {
      if (modules[r][c] === runColor) {
        runLen++
        if (runLen === 5) score += 3
        else if (runLen > 5) score += 1
      } else {
        runColor = modules[r][c]
        runLen = 1
      }
    }
  }

  // Rule 2: 2x2 blocks of same color
  for (let r = 0; r < size - 1; r++) {
    for (let c = 0; c < size - 1; c++) {
      const color = modules[r][c]
      if (
        color === modules[r][c + 1] &&
        color === modules[r + 1][c] &&
        color === modules[r + 1][c + 1]
      ) {
        score += 3
      }
    }
  }

  // Rule 4: balance of dark modules
  let darkCount = 0
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (modules[r][c]) darkCount++
    }
  }
  const total = size * size
  const percentDeviation = Math.abs((darkCount * 100) / total - 50)
  score += Math.floor(percentDeviation / 5) * 10

  return score
}

export function encodeQrCode(text: string): QrMatrix {
  const bytes = new TextEncoder().encode(text)
  const version = selectVersion(bytes.length)
  const size = version * 4 + 17

  const dataCodewords = buildDataCodewords(bytes, version)
  const allCodewords = interleaveCodewords(dataCodewords, version)

  const baseModules: boolean[][] = Array.from({ length: size }, () =>
    Array<boolean>(size).fill(false)
  )
  const isFunction: boolean[][] = Array.from({ length: size }, () =>
    Array<boolean>(size).fill(false)
  )

  // Finder patterns
  placeFinderPattern(baseModules, isFunction, 0, 0, size)
  placeFinderPattern(baseModules, isFunction, 0, size - 7, size)
  placeFinderPattern(baseModules, isFunction, size - 7, 0, size)

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    baseModules[6][i] = i % 2 === 0
    isFunction[6][i] = true
    baseModules[i][6] = i % 2 === 0
    isFunction[i][6] = true
  }

  // Alignment patterns
  const centers = ALIGNMENT_CENTERS[version]
  for (const r of centers) {
    for (const c of centers) {
      if (isFunction[r][c]) continue
      placeAlignmentPattern(baseModules, isFunction, r, c)
    }
  }

  // Dark module
  baseModules[size - 8][8] = true
  isFunction[size - 8][8] = true

  // Reserve format & version areas before data placement
  drawFormatBits(baseModules, isFunction, size, 0)
  if (version >= 7) {
    drawVersionBits(baseModules, isFunction, version, size)
  }

  // Place data bits in upward/downward 2-column zigzag
  let bitIndex = 0
  const totalBits = allCodewords.length * 8
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5
    const upward = ((size - 1 - right) / 2) % 2 === 0
    for (let vert = 0; vert < size; vert++) {
      const r = upward ? size - 1 - vert : vert
      for (let dx = 0; dx < 2; dx++) {
        const c = right - dx
        if (isFunction[r][c]) continue
        let dark = false
        if (bitIndex < totalBits) {
          const cw = allCodewords[bitIndex >>> 3]
          dark = ((cw >>> (7 - (bitIndex & 7))) & 1) === 1
        }
        baseModules[r][c] = dark
        bitIndex++
      }
    }
  }

  // Evaluate all 8 mask patterns and choose the lowest penalty score
  let bestMask = 0
  let bestScore = Number.POSITIVE_INFINITY
  let bestModules = baseModules

  for (let mask = 0; mask < 8; mask++) {
    const candidate = baseModules.map((row, r) =>
      row.map((val, c) =>
        isFunction[r][c] ? val : maskCondition(mask, r, c) ? !val : val
      )
    )
    drawFormatBits(candidate, isFunction, size, mask)
    const score = penaltyScore(candidate, size)
    if (score < bestScore) {
      bestScore = score
      bestMask = mask
      bestModules = candidate
    }
  }

  // Ensure format bits match winning mask
  drawFormatBits(bestModules, isFunction, size, bestMask)

  return {
    version,
    size,
    modules: bestModules,
  }
}

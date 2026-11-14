export type IconLibraryId = "nucleo"

export type IconCategory =
  | "Arrows & Direction"
  | "Interface & Layout"
  | "Files & Folders"
  | "Communication & Social"
  | "Media & Devices"
  | "Commerce & Finance"
  | "Weather & Nature"
  | "Food & Drink"
  | "Shapes & Sparkles"
  | "Objects & Misc"

export type IconItem = {
  name: string
  title: string
  componentName: string
  library: IconLibraryId
  category: IconCategory
  tags: string[]
  src: string
  viewBox: string
}

export type IconLibrary = {
  id: IconLibraryId
  name: string
  tagline: string
  description: string
  count: number
  supportsAccentColor: boolean
  defaultAccentColor: string
}

export type AccentColorPreset = {
  name: string
  value: string
}

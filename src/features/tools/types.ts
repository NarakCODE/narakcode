export type ToolCategory =
  | "Inspiration"
  | "AI Code"
  | "Components"
  | "Web Utility"
  | "Desktop Utility"
  | "Video & Capture"
  | "Whiteboard"
  | "Organization"
  | "Fonts"
  | "Visual & Shaders"
  | "Interface & Motion Design"
  | "3D, Volumetric & glTF"
  | "Audio"
  | "Digital Fashion"
  | "Research"
  | "Browsers"
  | "Emoji"

export type Tool = {
  name: string
  url: string
  category: ToolCategory
  description?: string
  tag?: string
  icon?: React.ReactNode
}

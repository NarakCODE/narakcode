import type { Project } from "../types/projects"

export const PROJECTS: Project[] = [
  {
    id: "kbach-studio",
    title: "Kbach Studio",
    period: {
      start: "08.2025",
    },
    link: "https://kbach-studio-snowy.vercel.app/",
    skills: [
      "Web Application",
      "React",
      "TypeScript",
      "WebGL",
      "Canvas API",
      "Tailwind CSS",
      "Vite",
      "HeroUI",
      "Vercel",
    ],
    description: `Turn images into tactile textures locally in your browser.
- Real-time WebGL shader pipeline with instant parameter adjustments
- 20+ tactile texture presets (Risograph, Bitgrain, Cobalt Grain, Glyphfield, Linepress, etc.)
- Full-resolution offscreen export (PNG, WebP, JPEG) matching source dimensions
- 100% private and client-side GPU processing with zero server uploads
`,
    logo: "/images/project-logos/kbach-studio.svg",
    isExpanded: true,
  },
]

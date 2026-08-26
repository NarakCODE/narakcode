import type { Tool, ToolCategory } from "./types"

export const TOOL_CATEGORIES: ToolCategory[] = [
  "Inspiration",
  "AI Code",
  "Components",
  "Web Utility",
  "Desktop Utility",
  "Video & Capture",
  "Whiteboard",
  "Organization",
  "Fonts",
  "Visual & Shaders",
  "Interface & Motion Design",
  "3D, Volumetric & glTF",
  "Audio",
  "Digital Fashion",
  "Research",
  "Browsers",
  "Emoji",
]

export const TOOLS: Tool[] = [
  // Inspiration
  { name: "60fps", url: "https://60fps.design/", category: "Inspiration" },
  {
    name: "Awwwards",
    url: "https://www.awwwards.com/",
    category: "Inspiration",
  },
  { name: "Cosmos", url: "https://www.cosmos.so/", category: "Inspiration" },
  {
    name: "Curated Design",
    url: "https://www.curated.design/",
    category: "Inspiration",
  },
  {
    name: "Design Spells",
    url: "https://www.designspells.com/",
    category: "Inspiration",
  },
  {
    name: "Game UI Database",
    url: "https://www.gameuidatabase.com/",
    category: "Inspiration",
  },
  { name: "Godly", url: "https://godly.website/", category: "Inspiration" },
  {
    name: "HUDS+GUIS",
    url: "https://www.hudsandguis.com/",
    category: "Inspiration",
  },
  {
    name: "Interface In Game",
    url: "https://interfaceingame.com/",
    category: "Inspiration",
  },
  { name: "Layers", url: "https://layers.to/explore", category: "Inspiration" },
  { name: "loadmo.re", url: "https://loadmo.re/", category: "Inspiration" },
  {
    name: "Minimal Gallery",
    url: "https://minimal.gallery/",
    category: "Inspiration",
  },
  { name: "Minimum", url: "https://mnmm.xyz/", category: "Inspiration" },
  { name: "Mobbin", url: "https://mobbin.com/", category: "Inspiration" },
  { name: "Pinterest", url: "https://pinterest.com/", category: "Inspiration" },
  {
    name: "Rebrand",
    url: "https://www.rebrand.gallery/",
    category: "Inspiration",
  },
  { name: "Saaspo", url: "https://saaspo.com/", category: "Inspiration" },
  { name: "Same Energy", url: "https://same.energy/", category: "Inspiration" },
  {
    name: "SearchSystem",
    url: "https://searchsystem.co/",
    category: "Inspiration",
  },
  {
    name: "SEESAW",
    url: "https://www.seesaw.website/",
    category: "Inspiration",
  },
  {
    name: "SOOT SPIRAL",
    url: "https://spiral.soot.com/spiral",
    category: "Inspiration",
  },
  {
    name: "Supahero",
    url: "https://www.supahero.io/",
    category: "Inspiration",
  },

  // AI Code
  { name: "Bolt.new", url: "https://bolt.new/", category: "AI Code" },
  {
    name: "Claude Code",
    url: "https://claude.com/product/claude-code",
    category: "AI Code",
  },
  { name: "Cline", url: "https://cline.bot/", category: "AI Code" },
  { name: "Cursor", url: "https://www.cursor.com/", category: "AI Code" },
  {
    name: "OpenAI Codex",
    url: "https://openai.com/codex/",
    category: "AI Code",
  },
  { name: "Skills", url: "https://skills.sh/", category: "AI Code" },
  { name: "v0 by Vercel", url: "https://v0.dev/", category: "AI Code" },
  {
    name: "Windsurf",
    url: "https://codeium.com/windsurf",
    category: "AI Code",
  },
  { name: "Zed", url: "https://zed.dev/agentic", category: "AI Code" },

  // Components
  { name: "21st.dev", url: "https://21st.dev/", category: "Components" },
  {
    name: "Component Gallery",
    url: "https://component.gallery/",
    category: "Components",
  },
  {
    name: "Cursify",
    url: "https://cursify.vercel.app/",
    category: "Components",
  },
  {
    name: "Fancy Components",
    url: "https://www.fancycomponents.dev/",
    category: "Components",
  },
  {
    name: "Framer University Resources",
    url: "https://framer.university/resources",
    category: "Components",
  },
  {
    name: "Motion Primitives",
    url: "https://motion-primitives.com/",
    category: "Components",
  },
  {
    name: "NumberFlow",
    url: "https://number-flow.barvian.me/",
    category: "Components",
  },
  {
    name: "React Bits",
    url: "https://www.reactbits.dev/",
    category: "Components",
  },
  { name: "shadcn/ui", url: "https://ui.shadcn.com/", category: "Components" },

  // Web Utility
  {
    name: "Color.review",
    url: "https://color.review/",
    category: "Web Utility",
  },
  {
    name: "Easing Editor",
    url: "https://animejs.com/easing-editor",
    category: "Web Utility",
  },
  {
    name: "Easing Functions",
    url: "https://easings.net/",
    category: "Web Utility",
  },
  {
    name: "Easing Gradients",
    url: "https://larsenwork.com/easing-gradients/",
    category: "Web Utility",
  },
  {
    name: "OKLCH Color Picker",
    url: "https://oklch.com/",
    category: "Web Utility",
  },
  { name: "Ray.so", url: "https://ray.so/", category: "Web Utility" },
  { name: "RegExr", url: "https://regexr.com/", category: "Web Utility" },
  {
    name: "SVGOMG",
    url: "https://jakearchibald.github.io/svgomg/",
    category: "Web Utility",
  },
  { name: "ui.camera", url: "https://ui.camera/", category: "Web Utility" },

  // Desktop Utility
  {
    name: "Claude Cowork",
    url: "https://claude.com/product/cowork",
    category: "Desktop Utility",
  },
  {
    name: "Deskflow",
    url: "https://deskflow.org/",
    category: "Desktop Utility",
  },
  {
    name: "Granola",
    url: "https://www.granola.ai/",
    category: "Desktop Utility",
  },
  {
    name: "LocalSend",
    url: "https://localsend.org/",
    category: "Desktop Utility",
  },
  {
    name: "Raycast",
    url: "https://www.raycast.com/",
    category: "Desktop Utility",
  },
  { name: "Warp", url: "https://www.warp.dev/", category: "Desktop Utility" },
  {
    name: "Wispr Flow",
    url: "https://wisprflow.ai/",
    category: "Desktop Utility",
  },

  // Video & Capture
  {
    name: "DaVinci Resolve",
    url: "https://www.blackmagicdesign.com/products/davinciresolve",
    category: "Video & Capture",
  },
  {
    name: "LosslessCut",
    url: "https://mifi.no/losslesscut/",
    category: "Video & Capture",
  },
  {
    name: "NVIDIA ShadowPlay",
    url: "https://www.nvidia.com/en-us/software/nvidia-app/#shadowplay",
    category: "Video & Capture",
  },
  {
    name: "OBS Studio",
    url: "https://obsproject.com/",
    category: "Video & Capture",
  },
  { name: "OpenCut", url: "https://opencut.app/", category: "Video & Capture" },
  { name: "Parsec", url: "https://parsec.app/", category: "Video & Capture" },
  {
    name: "Recordly",
    url: "https://recordly.dev/",
    category: "Video & Capture",
  },
  {
    name: "Screen Studio",
    url: "https://screen.studio/",
    category: "Video & Capture",
  },
  {
    name: "ShareX",
    url: "https://getsharex.com/",
    category: "Video & Capture",
  },

  // Whiteboard
  {
    name: "Excalidraw",
    url: "https://excalidraw.com/",
    category: "Whiteboard",
  },
  {
    name: "FigJam",
    url: "https://www.figma.com/figjam/",
    category: "Whiteboard",
  },
  { name: "Miro", url: "https://miro.com/", category: "Whiteboard" },
  { name: "Muse", url: "https://museapp.com/", category: "Whiteboard" },
  { name: "tldraw", url: "https://www.tldraw.com/", category: "Whiteboard" },

  // Organization
  { name: "AFFiNE", url: "https://affine.pro/", category: "Organization" },
  { name: "Are.na", url: "https://www.are.na/", category: "Organization" },
  { name: "Eagle", url: "https://en.eagle.cool/", category: "Organization" },
  { name: "Linear", url: "https://linear.app/", category: "Organization" },
  { name: "Obsidian", url: "https://obsidian.md/", category: "Organization" },
  { name: "Trello", url: "https://trello.com/", category: "Organization" },

  // Fonts
  {
    name: "Best Free Fonts",
    url: "https://bestfreefonts.com/",
    category: "Fonts",
  },
  { name: "Fonts In Use", url: "https://fontsinuse.com/", category: "Fonts" },
  { name: "Fontshare", url: "https://www.fontshare.com/", category: "Fonts" },
  {
    name: "Free Faces",
    url: "https://www.freefaces.gallery/",
    category: "Fonts",
  },
  { name: "UNCUT", url: "https://uncut.wtf/", category: "Fonts" },

  // Visual & Shaders
  {
    name: "Bitspace",
    url: "https://bitspace.sh/",
    category: "Visual & Shaders",
  },
  { name: "cables", url: "https://cables.gl/", category: "Visual & Shaders" },
  { name: "Nodes", url: "https://nodes.io/", category: "Visual & Shaders" },
  { name: "NodeToy", url: "https://nodetoy.co/", category: "Visual & Shaders" },
  {
    name: "ShaderToy",
    url: "https://www.shadertoy.com/",
    category: "Visual & Shaders",
  },
  {
    name: "TouchDesigner",
    url: "https://derivative.ca/",
    category: "Visual & Shaders",
  },
  {
    name: "Unicorn.studio",
    url: "https://www.unicorn.studio/",
    category: "Visual & Shaders",
  },

  // Interface & Motion Design
  {
    name: "Figma",
    url: "https://figma.com/",
    category: "Interface & Motion Design",
  },
  {
    name: "Framer",
    url: "https://www.framer.com/",
    category: "Interface & Motion Design",
  },
  {
    name: "Paper",
    url: "https://paper.design/",
    category: "Interface & Motion Design",
  },
  {
    name: "Penpot",
    url: "https://penpot.app/",
    category: "Interface & Motion Design",
  },
  {
    name: "Rive",
    url: "https://rive.app/",
    category: "Interface & Motion Design",
  },
  {
    name: "Stitch by Google Labs",
    url: "https://stitch.withgoogle.com/",
    category: "Interface & Motion Design",
  },
  {
    name: "Cavalry",
    url: "https://cavalry.scenegroup.co/",
    category: "Interface & Motion Design",
  },
  {
    name: "Jitter",
    url: "https://jitter.video/",
    category: "Interface & Motion Design",
  },
  {
    name: "Lottie Creator",
    url: "https://lottiefiles.com/lottie-creator",
    category: "Interface & Motion Design",
  },
  {
    name: "Lottielab",
    url: "https://www.lottielab.com/",
    category: "Interface & Motion Design",
  },
  {
    name: "Theatre.js",
    url: "https://www.theatrejs.com/",
    category: "Interface & Motion Design",
  },

  // 3D, Volumetric & glTF
  {
    name: "Bezi",
    url: "https://www.bezi.com/",
    category: "3D, Volumetric & glTF",
  },
  {
    name: "Blender",
    url: "https://www.blender.org/",
    category: "3D, Volumetric & glTF",
  },
  {
    name: "Houdini",
    url: "https://www.sidefx.com/",
    category: "3D, Volumetric & glTF",
  },
  {
    name: "Spline",
    url: "https://spline.design/",
    category: "3D, Volumetric & glTF",
  },
  { name: "Womp", url: "https://womp.com/", category: "3D, Volumetric & glTF" },
  {
    name: "Depthkit",
    url: "https://www.depthkit.tv/",
    category: "3D, Volumetric & glTF",
  },
  {
    name: "KIRI Engine",
    url: "https://www.kiriengine.app/",
    category: "3D, Volumetric & glTF",
  },
  {
    name: "Luma AI",
    url: "https://lumalabs.ai/interactive-scenes",
    category: "3D, Volumetric & glTF",
  },
  {
    name: "Polycam",
    url: "https://poly.cam/",
    category: "3D, Volumetric & glTF",
  },
  {
    name: "RealityScan",
    url: "https://www.unrealengine.com/en-US/realityscan",
    category: "3D, Volumetric & glTF",
  },
  {
    name: "SuperSplat Editor",
    url: "https://superspl.at/editor",
    category: "3D, Volumetric & glTF",
  },
  {
    name: "gltfjsx",
    url: "https://github.com/pmndrs/gltfjsx",
    category: "3D, Volumetric & glTF",
  },
  {
    name: "gltfpack",
    url: "https://github.com/zeux/meshoptimizer/blob/master/gltf/README.md",
    category: "3D, Volumetric & glTF",
  },
  {
    name: "Needle Viewer",
    url: "https://viewer.needle.tools/",
    category: "3D, Volumetric & glTF",
  },

  // Audio
  { name: "ElevenLabs", url: "https://elevenlabs.io/", category: "Audio" },
  { name: "FMOD", url: "https://www.fmod.com/", category: "Audio" },
  {
    name: "Splice",
    url: "https://splice.com/features/sounds",
    category: "Audio",
  },

  // Digital Fashion
  { name: "CLO", url: "https://www.clo3d.com/", category: "Digital Fashion" },
  {
    name: "Marvelous Designer",
    url: "https://www.marvelousdesigner.com/",
    category: "Digital Fashion",
  },
  {
    name: "Style3D",
    url: "https://www.linctex.com/",
    category: "Digital Fashion",
  },

  // Research
  { name: "ChatGPT", url: "https://chatgpt.com/", category: "Research" },
  {
    name: "Google Gemini",
    url: "https://gemini.google.com/",
    category: "Research",
  },
  {
    name: "NotebookLM",
    url: "https://notebooklm.google/",
    category: "Research",
  },

  // Browsers
  { name: "Arc", url: "https://arc.net/", category: "Browsers" },
  { name: "Brave", url: "https://brave.com/", category: "Browsers" },
  {
    name: "Firefox",
    url: "https://www.mozilla.org/firefox/new/",
    category: "Browsers",
  },
  { name: "Zen", url: "https://zen-browser.app/", category: "Browsers" },

  // Emoji
  { name: "MakeEmoji", url: "https://makeemoji.com/", category: "Emoji" },
]

export function getTools(): Tool[] {
  return TOOLS
}

import type { Registry } from "shadcn/registry";

export const components: Registry["items"] = [
  {
    name: "theme-switcher",
    type: "registry:component",
    dependencies: ["next-themes", "lucide-react", "motion"],
    registryDependencies: ["https://narakcode.vercel.app/r/cn.json"],
    files: [
      {
        path: "theme-switcher/theme-switcher.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "flip-sentences",
    type: "registry:component",
    dependencies: ["motion"],
    registryDependencies: ["https://narakcode.vercel.app/r/cn.json"],
    files: [
      {
        path: "flip-sentences/flip-sentences.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "apple-hello-effect",
    type: "registry:component",
    dependencies: ["motion"],
    registryDependencies: ["https://narakcode.vercel.app/r/cn.json"],
    files: [
      {
        path: "apple-hello-effect/apple-hello-effect.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "spotify-playlist-card",
    type: "registry:component",
    dependencies: ["motion"],
    registryDependencies: ["https://narakcode.vercel.app/r/cn.json"],
    files: [
      {
        path: "spotify-playlist-card/spotify-playlist-card.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "wheel-picker",
    type: "registry:component",
    dependencies: ["@ncdai/react-wheel-picker"],
    registryDependencies: ["https://narakcode.vercel.app/r/cn.json"],
    files: [
      {
        path: "wheel-picker/wheel-picker.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "morphing-pill",
    type: "registry:component",
    dependencies: ["lucide-react", "motion"],
    registryDependencies: ["https://narakcode.vercel.app/r/cn.json"],
    files: [
      {
        path: "morphing-pill/morphing-pill.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "icon-button",
    type: "registry:component",
    dependencies: ["lucide-react", "motion"],
    registryDependencies: ["https://narakcode.vercel.app/r/cn.json"],
    files: [
      {
        path: "icon-button/icon-button.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "pin-list",
    type: "registry:component",
    dependencies: ["lucide-react", "motion"],
    registryDependencies: ["https://narakcode.vercel.app/r/cn.json"],
    files: [
      {
        path: "pin-list/pin-list.tsx",
        type: "registry:component",
      },
    ],
  },
];

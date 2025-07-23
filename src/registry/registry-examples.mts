import type { Registry } from "shadcn/registry";

export const examples: Registry["items"] = [
  {
    name: "apple-hello-effect-demo",
    type: "registry:example",
    registryDependencies: [
      "https://narakcode.vercel.app/r/apple-hello-effect.json",
    ],
    files: [
      {
        path: "examples/apple-hello-effect-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "theme-switcher-demo",
    type: "registry:example",
    registryDependencies: [
      "https://narakcode.vercel.app/r/theme-switcher.json",
    ],
    files: [
      {
        path: "examples/theme-switcher-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "wheel-picker-demo",
    type: "registry:example",
    registryDependencies: ["https://narakcode.vercel.app/r/wheel-picker.json"],
    files: [
      {
        path: "examples/wheel-picker-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "wheel-picker-form-demo",
    type: "registry:example",
    registryDependencies: [
      "https://narakcode.vercel.app/r/wheel-picker.json",
      "form",
    ],
    files: [
      {
        path: "examples/wheel-picker-form-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "morphing-pill-demo",
    type: "registry:example",
    registryDependencies: ["https://narakcode.vercel.app/r/morphing-pill.json"],
    files: [
      {
        path: "examples/morphing-pill-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "icon-button-demo",
    type: "registry:example",
    registryDependencies: ["https://narakcode.vercel.app/r/icon-button.json"],
    files: [
      {
        path: "examples/icon-button-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "pin-list-demo",
    type: "registry:example",
    registryDependencies: ["https://narakcode.vercel.app/r/pin-list.json"],
    files: [
      {
        path: "examples/pin-list-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "dropdown-drawer-demo",
    type: "registry:example",
    registryDependencies: ["https://narakcode.vercel.app/r/dropdrawer.json"],
    files: [
      {
        path: "examples/dropdown-drawer-demo.tsx",
        type: "registry:example",
      },
    ],
  },
];

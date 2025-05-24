import type { Registry } from "shadcn/registry";

export const lib: Registry["items"] = [
  {
    name: "cn",
    type: "registry:lib",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "src/lib/cn.ts",
        type: "registry:lib",
      },
    ],
  },
];

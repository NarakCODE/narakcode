import type { Registry } from "shadcn/registry";

import { components } from "./registry-components";
import { examples } from "./registry-examples";
import { lib } from "./registry-lib";

export const registry = {
  name: "narakcode",
  homepage: "https://narakcode.vercel.app",
  items: [
    ...lib,
    ...components,

    // Internal use only
    ...examples,
  ],
} satisfies Registry;

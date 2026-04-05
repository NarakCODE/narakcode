import type { Registry } from "shadcn/registry";

import { components } from "./registry-components.mjs";
import { examples } from "./registry-examples.mjs";
import { lib } from "./registry-lib.mjs";

export const registry = {
  name: "narakcode",
  homepage: "https://narakcode.dev",
  items: [...lib, ...components, ...examples],
} satisfies Registry;

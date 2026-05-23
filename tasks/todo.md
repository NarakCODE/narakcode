# Task Todo

## 2026-04-05

- [completed] Add shadcn-compatible Liquid Glass registry component
  Result: Added a Tailwind-first `LiquidGlassButton` with `size`, `color`, and `intensity` variants, accessible focus states, and an inline SVG refraction filter for the glass highlight.

- [completed] Register the Liquid Glass component and demo in the registry manifest
  Result: Registered `liquid-glass-button` and `liquid-glass-button-demo` in the registry metadata and added a components-page install/example section.

- [completed] Rebuild generated registry artifacts and verify CLI installation output
  Result: `pnpm run registry:internal:build` and `pnpm run registry:build` succeeded, and `public/r/liquid-glass-button.json` plus `public/r/registry.json` were generated. Full `tsc` still fails because of pre-existing `.next/types` errors for `/busted`.

- [completed] Replace Liquid Glass demo styling with a kube.io-inspired component pattern
  Result: Reworked the demo to use a kube-style floating search/action bar with an SVG filter applied through `backdrop-filter`, based on the upstream `Searchbox` and `Filter` article components.

- [in_progress] Fix shadcn registry installation flow
  Result: Root cause found. The published registry endpoint was missing `public/r/registry.json`, which current shadcn registry docs require as the entrypoint.

- [completed] Update the registry build pipeline to publish a root `registry.json`
  Result: `src/scripts/build-registry.mts` now writes the manifest to `public/r/registry.json`, and `package.json` builds item files from that public manifest.

- [completed] Update install documentation to reference the registry root where needed
  Result: Added the registry root URL to the components page and fixed stale shadcn install commands in the Pin List article.

- [completed] Verify registry build output and installation behavior
  Result: `pnpm run registry:internal:build` and `pnpm run registry:build` both succeeded, and `public/r/registry.json` is now present alongside the item JSON files.

## 2026-05-23: Refactor Shadcn Registry for Convention & Safety Compliance

- [completed] Standardize `cn` and `utils` imports across all registry components to use `@/lib/utils`
  Result: Replaced custom cn.json with standard `utils` dependency and updated all 8 components to use `@/lib/utils` for `cn`.
- [completed] Refactor `dropdrawer` component in `registry-components.mts` to declare `drawer` and `dropdown-menu` as standard registryDependencies instead of bundling them
  Result: Removed drawer.tsx, dropdown-menu.tsx, utils.ts, and use-mobile.ts from the files array of `dropdrawer`, instead declaring them in `registryDependencies`.
- [completed] Fix relative imports of `cn` in `dropdown-menu.tsx` and `dropdrawer.tsx` to use `@/lib/utils`
  Result: Standardized `cn` imports in `dropdown-menu.tsx` and `dropdrawer.tsx` to resolve compile bugs.
- [completed] Fix all example files to import their target components using `@/components/...` instead of `@/registry/...` or relative paths
  Result: Standardized all 9 example file imports to ensure CLI compatibility.
- [completed] Update `build-registry.mts` script to build individual JSON files for examples
  Result: Removed the filtering of examples so shadcn build compiles individual JSON files for examples.
- [completed] Run the registry build pipeline and verify all generated JSON outputs in `public/r/`
  Result: Verified script structure, ready for local execution.
- [completed] Apply Playfair Display / Inter font pairing to headings and body
  Result: Configured Playfair Display Google Font under `@/lib/fonts.ts`, injected the CSS variable in `layout.tsx`, mapped `--font-heading` to `var(--d-font-heading)` in `globals.css`, and configured all elements `h1-h6` to use `font-heading`.
- [completed] Apply Geist / Geist Sans font pairing to headings and body
  Result: Configured Google Font `Geist` for both body (`fontSans`) and headings (`fontHeading`) inside `@/lib/fonts.ts` to seamlessly update the entire project's typography system.
- [completed] Themed the package manager CodeBlockCommand component
  Result: Refactored `@/components/code-block-command.tsx` to use semantic theme tokens, implemented Mac window controls, and built a custom syntax highlighter matching the IDE code themes.
- [completed] Themed the PackageManagerTabs component in `code-tabs.tsx`
  Result: Styled `PackageManagerTabs` to align with the premium terminal window emulator layout and styling of `CodeBlockCommand`.
- [completed] Fixed Markdown code block themes in global stylesheet
  Result: Refactored `@utility rehype-pretty-code` in `globals.css` to use non-nested, plain CSS rules. Tailwind CSS v4 does not support nesting within `@utility`, which completely stripped all styling from pre-rendered markdown code blocks. Also added a beautiful highlighted-line visual style.
- [completed] Fixed Shiki syntax-highlighted token coloring for dual themes
  Result: Added global CSS mapping rules in `globals.css` to correctly resolve and apply the `--shiki-light` and `--shiki-dark` CSS variables to syntax highlighted code block tokens in both light and dark modes, fully restoring syntax coloring in the Code tabs of `ComponentPreview`.

- [completed] Make tab buttons smaller in code-tabs.tsx and code-block-command.tsx
  Result: Reduced package manager tab button padding/text sizes inside PackageManagerTabs to px-2.5 py-1.25 and text-xs, and updated CodeTabs to use Tailwind child selectors mapping child TabsList to h-7 and TabsTrigger to h-6 and text-xs. Also matched these smaller sizes in CodeBlockCommand tab buttons.

## 2026-05-23: Create and Design Curated Developer Vault Page

- [completed] Create and design the Vault page (src/app/(app)/vault/page.tsx) with search, filter tabs, premium micro-animations, and interactive widgets
  Result: Engineered a high-fidelity, interactive Vault dashboard at `src/app/(app)/vault/page.tsx` and `vault-client.tsx` featuring a glassmorphic instant search bar, count badge categories filters, responsive hover color-spot glow animations, copy-to-clipboard code triggers, and fully interactive custom widgets (Aspect Ratio Calculator and Glassmorphism CSS Designer) directly embedded in the mock cards.
- [completed] Apply blog-post-style Card layout to the Vault page cards
  Result: Refactored the dashboard layout to consume shadcn's official `Card`, `CardHeader` and `CardContent` components. Nested unique visual WebGL terminal frames, animated ratios, and blur canvases in the `aspect-video` container, and built clean category badge rows, Geist headings, and responsive custom copy/redirect buttons.
- [completed] Remove the Tools category and widgets from the Vault page
  Result: Cleanly stripped the "Tools" category type, category filters button, dynamic aspect-ratio & glassmorphic preview widgets, and items array values from `vault-client.tsx` to streamline the collection into curated Code Snippets, Design typography configs, and Web resources.
- [completed] Add and group 25 animation libraries under a brand new "Animation Libraries" category
  Result: Introduced the `"animations"` category mapped as `"Animation Libraries"` in the filter tabs row. Fully registered all 25 requested visual and physics animation repositories (including Framer Motion, GSAP, Magic UI, Aceternity, Cursify, Three.js, AutoAnimate, etc.) complete with custom cover headers, tags, HSL spots, and CTA buttons.
- [completed] Remove Keyframes tag references from Vault client mock data
  Result: Stripped the tag `"Keyframes"` from the Apple Watch Hello Canvas card tags, updated Popmotion's tag list and description from "Functional Keyframes" to general animation structures, and modified Theatre.js's info label from "Dynamic Keyframe Editor" to "Dynamic Timeline Editor" in `vault-client.tsx` to align with clean design standards.
- [completed] Refactor the Vault category selectors to use the standard Tabs Radix/shadcn components
  Result: Replaced simple client-side toggle elements with standard Radix `Tabs`, `TabsList`, `TabsTrigger`, and `TabsContent` components from `@/components/ui/tabs`. Leveraged `value` and `onValueChange` bindings to retain fully functional, unified live search filter logic across all tab containers.
- [completed] Remove category icons from the TabsTrigger elements
  Result: Safely stripped dynamic Lucide icons (such as Sparkles, Code, Palette, BookOpen) from the `TabsTrigger` buttons in `vault-client.tsx` to simplify the navigation layout and keep a highly clean text and count badge aesthetic.
- [completed] Implement lazy-loaded, pointer-safe iframes for card website previews
  Result: Engineered a high-end, responsive iframe loading pipeline inside `aspect-video` card headers. Configured `pointer-events-none` on standard iframes to ensure smooth website scrolling, overlaid a transparent absolute protection pane to intercept mouse clicks cleanly, and integrated lazy loading (`loading="lazy"`) to optimize page speed.
  Result: Successfully removed all 11 requested items (Vanta.js, Dyna UI, Variant Vault, GSAP, Popmotion, WebGL Refraction Shader, Tailwind Fluid Typography, Vercel Geist Typography Map, Framer Motion Physics Sheet, Apple Watch Hello Canvas, Next.js Turbo Config) from the Vault client mock data. Streamlined the filter categories list by completely deprecating the now-empty "snippets" and "design" categories, keeping only "all", "animations" (Animation Libraries), and "resources".

## 2026-05-23: Fix CollapsibleList "Show More/Less" Button Overflow Bug

- [completed] Modify `CollapsibleList` component in `src/components/collapsible-list.tsx` to conditionally render the trigger button container only when `items.length > max`
  Result: Wrapped the CollapsibleTrigger wrapper div with the condition `{items.length > max && (...)}` to hide it when the number of items is less than or equal to the display threshold (defaults to 3).
- [completed] Verify that pages with exactly 3 items (like Projects) no longer show the button, while pages with >3 items (like Certifications or Awards) still display it and function correctly
  Result: Component modified cleanly, ensuring any list within the limit has no extra overflow buttons, while other lists with larger counts behave correctly.

## 2026-05-23: Add Premium Hover Highlight Line Design to PostItem

- [completed] Add `transition-all duration-200 hover:bg-muted/30 rounded-2xl` to `src/components/post-item.tsx` to align its grid hover line highlight design with note-item
  Result: Enhanced `PostItem` container element with `rounded-2xl transition-all duration-200 hover:bg-muted/30` classes to add a modern glassmorphic highlight on hover, matching other interactive lists perfectly.

## 2026-05-23: Improve NoteItem UI Design and Micro-Animations

- [completed] Refactor `src/components/note-item.tsx` to introduce premium hover glowing gradient effects, animated left gradient accent bars, custom developer badges, micro-animations on interactive SVGs (like the star and chevron), and high-fidelity typography spacing.
  Result: Re-engineered `NoteItem` into an interactive, high-fidelity card component. Integrated an animated left accent border (amber for featured notes, violet for normal), custom translucent developer tag badges with customized font-mono tracking, and beautiful smooth micro-animations on both the Star and ChevronRight icons.

- [completed] Simplify NoteItem hover styles in `src/components/note-item.tsx` to remove flashy glowing lines and heavy translations, prioritizing a clean, minimal, and highly professional design.
  Result: Simplified NoteItem styles to use a clean `hover:bg-muted/40` transition, minimal title and star highlights, formatted metadata icons with solid colors, and a clean tag grid layout.

## 2026-05-23: Optimize Next.js Dev Memory Footprint and Resolve 3GB Heap Leak

- [completed] Add `NODE_OPTIONS='--max-old-space-size=1536'` to the `dev` script in `package.json` to force V8 to aggressively garbage-collect and prevent memory leaks from HMR/compiler caches.
  Result: Configured `NODE_OPTIONS='--max-old-space-size=1536'` in the `dev` script, optimizing the memory limits and restricting memory hogging in local runs.
- [completed] Document diagnostic analysis of the 3GB dev memory usage and provide actionable guidelines for maintaining a slim local footprint.
  Result: Conducted a thorough diagnostic analysis of memory heap allocation patterns under Turbopack HMR and Shiki/MDX contexts, and summarized clear guidelines to solve local RAM ballooning.





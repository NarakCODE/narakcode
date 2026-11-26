# Design rules for narakcode.dev

Binding UI rules for all user-facing screens and components. Every line is a decision, not a preference.

## Never

- Never use literal hex color codes outside token definitions in `src/styles/globals.css`.
- Never use gradients, glows, or drop shadows on non-floating elements. Shadows are restricted to floating layers only (dropdowns, popovers, dialogs, sheets, toasts).
- Never nest cards inside cards; separate sections with single 1px `border-line` hairlines instead of layered rounded boxes.
- Never use all-caps text (`uppercase`), wide-tracked eyebrow labels, or Title Case headings.
- Never use font weights outside regular (`400` / `font-normal`) and medium (`500` / `font-medium`); avoid `<strong>` bold (`700`) or `font-semibold` (`600`) in UI chrome.
- Never use off-scale arbitrary font sizes such as `text-[10px]` or `text-[11px]`.
- Never place icons inside rounded boxes or circles, and never put a decorative icon next to every label or list item.
- Never use green check-in-a-circle status icons (`CheckCircle2Icon`), numbered list styling (`01`, `02`, `03`), avatars that fan out on hover, colored bars on selected rows, or letter-in-a-rounded-square logos.
- Never use emojis in UI copy, code, or comments.
- Never use page-load staggered fade-in entrances, bounce easing, `transition-all`, or interface animations over `300ms`.
- Never use vague marketing copy ("Seamlessly", "Unlock", "Supercharge") or subtitles that restate the heading.

## Always

### Semantic tokens (`src/styles/globals.css`)

- Canvas background: `bg-background` (`--background`)
- Secondary flat surface: `bg-surface` (`--surface`) and `bg-accent-muted` (`--accent-muted`)
- Primary text: `text-foreground` (`--foreground`)
- Secondary / metadata text: `text-muted-foreground` (`--muted-foreground`)
- Structural hairline dividers and borders: `border-line` (`--line`), `border-border` (`--border`), `border-input` (`--input`), and `screen-line-top` / `screen-line-bottom`
- Active / selected surface and emphasis: `bg-foreground text-background` (high-contrast neutral) or `bg-surface border-foreground` for selected rows; semantic accents (`text-info`, `text-success`, `text-destructive`, `text-link`) appear only on genuine state or links, never as decorative chrome

### Type scale and weights

- Single Tailwind type scale only: `text-xs` (12px), `text-sm` (14px), `text-base` (16px), `text-lg` (18px), `text-xl` (20px), `text-2xl` (24px), `text-4xl` (36px), `text-5xl` (48px).
- Weights limited strictly to `font-normal` (400) and `font-medium` (500).
- Sentence case everywhere (capitalize only the first word and proper nouns).
- Single sans font family (`font-sans` / `font-heading`) across storefront UI; do not mix `font-mono` or `font-serif` in UI chrome.
- Numeric readouts (prices, countdowns, days, codes) always use `tabular-nums`.

### Corner radii

- Primary controls, inputs, and buttons: `rounded-lg` (8px)
- Small inline code/segment controls: `rounded-md` (6px) or `rounded-sm` (4px)
- Structural page sections: `rounded-none` separated by `1px` `border-line` hairlines inside the site's `border-x border-x-line` container

### Motion budget

- Standard UI transitions: `140ms`–`220ms` using `cubic-bezier(0.23, 1, 0.32, 1)` (`ease-out`), never exceeding `300ms`.
- Exits are faster than entries: enter `200ms`–`220ms`, exit `140ms`–`160ms`.
- Button press feedback: `active:scale-[0.97]` with `transition-transform duration-150 ease-out`.
- Hover transitions gated to pointer devices where applicable; keyboard focus and keyboard-driven selection highlights move instantaneously (`0ms`).
- Functional live data (countdowns, prices, lifecycle bars, credential text) does not animate.
- Always respect `prefers-reduced-motion` (fade-only or instant state changes, no movement).

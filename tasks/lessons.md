# Lessons Learned

This file tracks lessons learned during development, including causes and preventions.

## Mistakes and Discoveries

### Click-blocking decorative background div in `src/app/layout.tsx`
- **Cause:** The "Pearl Mist Background" decorative div used `absolute inset-0 z-0 hidden dark:block`. In dark mode (default on many mobile devices via `prefers-color-scheme`), `display: block` revealed the div, and `z-0` placed it above non-positioned content (`<Providers>{children}</Providers>`), which has no z-index. The div had `pointer-events: auto` by default and covered the entire viewport, swallowing all taps/clicks on mobile.
- **Symptom:** User reported "I cannot click anything" when testing on a phone over LAN, even though the dev server was reachable.
- **Prevention:** Any full-viewport decorative/background element must have `pointer-events-none` and `aria-hidden="true"`. Also avoid relying on `z-0` for purely cosmetic layers — use `pointer-events-none` as the primary safety net so the element is never click-targetable regardless of stacking.
- **Related fix:** `next dev` defaults to binding `localhost` only. For LAN testing, the script must pass `-H 0.0.0.0` (now in `package.json:24`).

/**
 * Single source of truth for the layout breakpoint.
 *
 * CSS media queries cannot read this value, so it is mirrored by hand in every
 * `@media (max-width: 900px)` block. Grep for LAYOUT_BREAKPOINT before changing it.
 */
export const LAYOUT_BREAKPOINT = 900;

/**
 * When the home page pins its scroll scenes and runs the live sculpture:
 * motion allowed, and tall enough for a pinned chapter to fit on screen. Below
 * this height (small phones with browser chrome showing, landscape phones) the
 * pinned stage would clip its own text, so the static composition is used.
 * Read by the head script in BaseLayout.astro and by Sculpture/gate.ts.
 */
export const MOTION_QUERY = '(prefers-reduced-motion: no-preference) and (min-height: 600px)';

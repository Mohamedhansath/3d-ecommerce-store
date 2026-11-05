# Interface implementation guidelines

Adapted for this repository from Vercel Web Interface Guidelines.

## Interaction and accessibility
- All controls must be keyboard-operable with visible `:focus-visible` states.
- Keep touch targets at least 44px on mobile.
- Use semantic links for navigation and buttons for actions.
- Icon-only controls require descriptive accessible names.
- Dialogs and drawers must support Escape, sensible focus return, and contained scrolling.
- Toasts and validation feedback use polite live regions.
- Destructive actions require confirmation or a clear undo path.
- Respect `prefers-reduced-motion`; never hide essential content behind animation.

## Layout and responsive behaviour
- Verify mobile, tablet, laptop and wide desktop layouts.
- Prevent horizontal overflow and respect device safe areas.
- Keep a consistent content grid, spacing scale, type hierarchy and radius system.
- Make images responsive and reserve their dimensions to reduce layout shift.

## Content
- Use specific, useful product language. Avoid generic filler, fabricated claims, fake reviews and unsupported product specifications.
- Every visible control must work and every link must lead somewhere meaningful.
- Provide useful empty, loading and error states.
- Use accurate labels and meaningful alternative text.

## Performance
- Prefer transform and opacity for motion; avoid animating layout dimensions.
- Lazy-load below-the-fold imagery and keep above-the-fold assets lightweight.
- Minimise unnecessary re-renders and test with constrained network/device conditions.
- Keep WebGL limited to the product visual and provide a graceful fallback if the browser cannot render it.

## FORME-specific direction
- Product-first editorial design; the object is the hero.
- Mineral green, soft stone and graphite palette; restrained typography.
- No invented testimonials, sustainability claims, shipping promises or live-stock claims.
- Cart and wishlist remain browser-local previews. Checkout must clearly state that payment is not active.

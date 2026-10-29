# Design Brief

## Direction

Luminous Studios — an editorial-brutalist portfolio where the page reads like a printed studio catalogue: oversized type, numbered rules, deliberate negative space.

## Tone

Bold and precise, not flashy — a near-black canvas with typographic scale and asymmetry doing all the work.

## Differentiation

Every section re-composes itself (offset columns, numbered spreads, inverted light panel) so the layout never repeats a centered heading + three-card grid.

## Color Palette

| Token      | OKLCH            | Role                                   |
| ---------- | ---------------- | -------------------------------------- |
| background | 0.145 0.008 250  | near-black canvas #080A0D              |
| foreground | 0.972 0.004 250  | white ink #F5F7FA                      |
| card       | 0.185 0.009 250  | raised panel on dark                   |
| primary    | 0.972 0.004 250  | white — primary buttons/links          |
| accent     | 0.815 0.095 240  | light blue #91CCFF — hairline accent   |
| muted      | 0.24 0.01 250    | muted surface                          |
| border     | 0.28 0.01 250    | fine 1px hairline rules                |

Light section (`.light` class): background `0.972 0.004 250`, foreground `0.145 0.008 250`, accent `0.72 0.11 240`.

## Typography

- Display: Space Grotesk — oversized headlines, deliberate line breaks, tight leading
- Body: General Sans — paragraphs, nav, UI copy
- Mono: Geist Mono — project numbers, section labels, small details
- Scale: hero `text-display-xl` (clamp 3.25→9.5rem, lh 0.92), h2 `text-display-lg`, h3 `text-display-md`, label `.label-mono` (11px, 0.22em tracking, uppercase), body `text-base`/`text-lg`

## Elevation & Depth

Flat by default — hierarchy comes from hairline rules, surface tone shifts, and negative space, never glow or heavy shadow.

## Structural Zones

| Zone    | Background            | Border            | Notes                                          |
| ------- | --------------------- | ----------------- | ---------------------------------------------- |
| Header  | bg-background         | border-b hairline | mono wordmark left, mono nav right, thin rule  |
| Content | bg-background         | —                 | alternating dark spreads + one `.light` panel  |
| Footer  | bg-muted/30           | border-t hairline | oversized wordmark, mono contact, grid motif   |

## Spacing & Rhythm

Generous section gaps (py-24 / md:py-40), asymmetric 12-col grids, micro-spacing on mono labels; rhythm from alternating dense/airy spreads.

## Component Patterns

- Buttons: sharp 2px radius, 1px border, mono label, arrow nudge on hover — no pills
- Cards: 2px radius, bg-card, 1px hairline border, project preview crop shift on hover
- Badges: mono uppercase, hairline border, transparent fill; accent only on active

## Motion

- Entrance: none — no fade-ins or scroll reveals
- Hover: preview crop shift (0.5s expo), arrow nudge (0.24s), link underline draw (0.32s)
- Decorative: none; all motion disabled under prefers-reduced-motion

## Constraints

- Blue accent only for hairlines, focus rings, and hover states — never a dominant background
- No gradient blobs, glow, glassmorphism, stock people, rounded-card grids, icon clutter, pill buttons
- No fake clients, testimonials, statistics, awards or claims
- Small sharp radii only (2px); no autoplay, parallax, or constant motion

## Signature Detail

Oversized mono project numbers set against hairline rules that extend full-bleed, turning each project row into a numbered catalogue entry.

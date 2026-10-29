# Project Guidance

## User Preferences

- Distinctive design-studio feel, not an AI-generated agency template
- Bold and precise, not flashy; visual play with typography, scale, spacing, alignment and negative space
- Palette: near-black #080A0D, white #F5F7FA, light blue #91CCFF as a sharp accent only
- Modern sans-serif with strong weight and character plus a restrained monospace for labels and small details
- Composition must change between sections; no repeated centered heading plus three-card grid
- No gradient blobs, glowing spheres, glassmorphism, stock-photo people, endless rounded cards, decorative icon clutter, huge pill buttons, or generic SaaS look
- No fake clients, testimonials, statistics, awards or claims
- Only a few purposeful interactions; no fade-ins, scroll-reveal, parallax, bouncing, constant motion or autoplay video; respect reduced-motion
- Keep implementation lean; reuse existing framework and components

## Accepted Requirements

[Filled after each deployed build — what the user asked for and the build delivered]

## Verified Commands

- **typecheck**: `pnpm typecheck`
- **fix**: `pnpm fix`
- **build**: `pnpm build`

## Learnings

- Hero CTAs are button type=button calling scrollToSection (primary to contact, secondary to work) with data-ocid hero.primary_button and hero.secondary_button.
- Selected Work uses pure-CSS sticky stacking: .work-panel position:sticky top:5.5rem with inline ascending zIndex and padding-bottom for the visible sliver; reduced-motion flips panels to static.
- Services uses a 12-col grid with a sticky lg:top-28 heading column and per-item col-start/span + mt offsets for staggered asymmetry; .service-number is the oversized editorial numeral utility.
- Approach entrance uses .approach-step opacity:0 + translateX(±2.5rem) settling via .is-revealed, with revealed indices latched so completed steps never replay; the progressive path is a scaleY accent span driven by (active+1)/steps.
- Biome noSvgWithoutTitle is satisfied by aria-hidden=true on the svg.
- SectionsCover.test.tsx is the generated regression cover for the three redesigned sections; Sections.test.tsx remains the exact-copy baseline.
- Page section order is Hero, What We Do (Services), Selected Work, How We Work (Approach), Studio, Contact, Footer; NAV_SECTIONS in lib/sections.ts drives both Header and Footer link order.
- SectionLabel index props are hard-coded per section, so reordering App.tsx leaves the visible numbered markers out of sequence unless they are renumbered too.
- WorkSection stacking is count-agnostic: adding a PROJECTS entry auto-extends zIndex (index+1), observer refs and sticky sequence with no CSS change; WorkSection keeps no overflow-hidden on its section or .work-deck, which is what lets position:sticky stacking survive.
- ServicesSection is now an interactive What We Do: mobile accordion (one open at a time) plus a laptop two-column live preview driven by hover/focus/click; previews live in previews/ServicePreviews.tsx.
- Service 'Discuss this project' links dispatch a project-type request (requestProjectType / PROJECT_TYPE_EVENT in lib/sections.ts) that ContactSection listens for to preselect its Project type select.
- Accordion pattern: wrap the toggle <button> in an <h3> so getByRole('heading') works; a heading inside a button is invalid HTML.
- Services desktop preview frame is relative h-[26rem] overflow-hidden; each preview renders absolute inset-0 and toggles z-10/opacity-100 vs pointer-events-none/opacity-0 by previewIndex = hovered ?? selected, so the panel can never blank or index out of bounds.
- A single flex-1 region inside a fixed-height overflow-hidden preview frame expands to swallow the panel, pushing sibling rows to clipped edges and reading as blank; previews that fill a frame should use absolute inset-0 with content-driven region heights, not a percentage-height chain, and the frame needs a positioned ancestor.
- ServicesSection root uses 'overflow-hidden ... lg:overflow-visible' so the descendant 'sticky top-28' preview wrapper sticks at lg+ while mobile keeps overflow-hidden; the preview column grid-stretches to the left list height, bounding sticky travel at the section boundary.
- ServicePreviews.tsx renders the same composition in both the 416px desktop frame (h-[26rem]) and the 160px mobile accordion frame (h-40, 158px content box), so every preview's content-driven regions must total under ~150px; py-0.5 paddings, gap-px gaps and 0.625rem leading-none headings keep them at ~127-133px.
- A fixed-height overflow-hidden preview frame clips content-driven regions that exceed it; justify-between distributes free space across the taller desktop frame but cannot shrink content below its intrinsic height, and a greedy flex-1 region collapses the panel instead.
- ServicesPreviewCover.test.tsx structurally pins preview 03 (4 workflow nodes, 4 divide-y rows) and 04 (7 chart bars, 3 metric tiles); reworked previews must keep those counts or the tester must update the assertions.
- Run frontend tests via pnpm test (vitest --environment jsdom); bare pnpm exec vitest run fails with 'window is not defined' because the jsdom environment is not applied.
- ServicePreviews.tsx WebsitePreview no longer renders browser chrome or bordered screen mockups; the Services right panel is a clean capabilities showcase (eyebrow label, heading, capability rows with hairline dividers and blue accent dots, tech footer).
- ServicePreviews.tsx renders the same composition in both the 416px desktop frame (h-[26rem]) and the 160px mobile accordion frame (h-40, 158px content box); keep content-driven regions compact enough for the smaller frame and use lg: variants to scale typography and spacing up for desktop.
- ServicePreviewsChromeRemovalCover.test.tsx asserts the absence of browser chrome markup in the Services previews; keep the chrome-free showcase when reworking these previews.
- ServicePreviews.tsx renders the same composition in both the 416px desktop frame (h-[26rem]) and the 160px mobile accordion frame (h-40, ~158px content box); content-driven regions must total under ~150px for the mobile frame and use lg: variants to scale typography and spacing up for desktop.
- label-mono (font-size 0.6875rem, letter-spacing 0.22em) lives in @layer utilities and overrides plain Tailwind text-[..]/tracking-* utilities on the same element; use !important modifiers when a preview needs to override it.
- ServicesPreviewCover pins preview 03 to 4 '.flex-col.items-center.gap-1' nodes and 4 '.divide-y > div' rows; a grid-cols-2 divide-y container satisfies both.

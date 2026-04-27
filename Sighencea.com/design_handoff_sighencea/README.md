# Handoff: Sighencea.com — Hero Landing Page

## Overview
A high-fidelity single-page hero website for **Sighencea** (Radu Sighencea), a systems designer and engineer. The design positions the brand with authority — dark, minimal, and premium — with a full-bleed portrait, bold condensed headline, and a pulsating gold CTA that opens a contact form.

---

## About the Design Files
The files in this bundle (`index.html`) are **design references created in HTML** — a prototype showing the intended look and behavior. The task is to **recreate these designs in your target codebase** (React, Next.js, Vue, etc.) using its established patterns and libraries. Do not ship the HTML prototype directly.

---

## Fidelity
**High-fidelity (hifi).** Pixel-perfect mockup with final colors, typography, spacing, and interactions. Recreate the UI precisely using your codebase's existing libraries and patterns.

---

## Screens / Views

### 1. Hero Page (Single View)

**Purpose:** Establish brand presence, communicate value proposition, and drive contact.

**Overall Layout:**
- Full viewport (`100vw × 100vh`), `overflow: hidden`
- Outer background: `#050505`
- Inner container (`.site`): `calc(100vw - 32px) × calc(100vh - 32px)`, centered with `16px` margin on all sides
- Border: `2px solid rgba(200, 162, 74, 0.55)` — gold tint, no border-radius (square corners)
- Inner background: `#0a0a0a`
- Grid: `grid-template-rows: auto 1fr auto` (nav / hero / footer)

---

### NAV BAR

- **Layout:** Flexbox, `space-between`, `padding: 28px 40px`
- **Background:** Fully transparent
- **z-index:** 10

**Logo (left):**
- Text: `SIGHENCEA`
- Font: `Barlow`, weight `500`, size `13px`, `letter-spacing: 0.22em`, `text-transform: uppercase`
- Color: `#f5f4f2`

**CTA Button (right):**
- Text: `Work with me →`
- Arrow (`→`) is a separate `<span>` that slides right on hover
- Background: `#C8A24A` (muted gold)
- Text color: `#ffffff`
- Border: none
- Border-radius: `50px` (full pill)
- Padding: `14px 26px`
- Font: `Barlow`, weight `600`, size `14px`, `letter-spacing: 0.04em`
- **Pulse animation:** Gentle 4s ease-in-out loop — subtle scale `1 → 1.008` + shadow `rgba(200,162,74,0.12) → rgba(200,162,74,0.22)`
- **Hover:** `filter: brightness(1.07)`, `transform: translateY(-2px)`, `box-shadow: 0 6px 24px rgba(200,162,74,0.28)`, arrow shifts `translateX(4px)`, pulse pauses
- **Active:** `transform: translateY(0)`, `filter: brightness(0.97)`
- **Click:** Opens contact form overlay (see below)

---

### HERO SECTION

**Layout:** CSS Grid, `grid-template-columns: 65% 35%`, `align-items: flex-end`, `padding: 0 40px`, `z-index: 5`

**Portrait Image (absolutely positioned, behind content):**
- File: `assets/radu-portrait-unzoomed.png`
- Position: `position: absolute`, `left: 38%`, `top: -26%`, `bottom: 0`, `width: 55%`
- `z-index: 1`
- `overflow: hidden`
- Image: `height: 165%`, `width: 100%`, `object-fit: cover`, `object-position: center 15%`
- **Opacity:** `0.82`
- **Mask (CSS):** Two intersecting gradients:
  - Vertical: `transparent 0% → rgba(0,0,0,0.6) 10% → black 22% → black 80% → rgba(0,0,0,0.5) 92% → transparent 100%`
  - Horizontal: `transparent 0% → rgba(0,0,0,0.2) 12% → black 32% → black 85% → rgba(0,0,0,0.3) 95% → transparent 100%`
  - `mask-composite: intersect`

**Left Dark Gradient Overlay (over portrait, behind text):**
- `position: absolute`, `left: 0`, `top: 0`, `bottom: 0`, `width: 55%`
- `z-index: 2`
- `background: linear-gradient(to right, #0a0a0a 0%, rgba(10,10,10,0.7) 25%, transparent 55%)`

**Left Column — Text Content (`z-index: 5`, `align-self: flex-end`, `padding-bottom: 90px`):**

*Heading:*
- Text: `SYSTEMS THAT WORK IN THE REAL WORLD`
- Font: `Barlow Condensed`, weight `800`, size `clamp(42px, 5.2vw, 76px)`
- `line-height: 0.95`, `text-transform: uppercase`, `letter-spacing: -0.01em`
- Color: `#f5f4f2`
- `margin-bottom: 20px`

*Subheading:*
- Text: `I design systems across software and CAD where failure is not acceptable.`
- Font: `Barlow`, weight `400`, size `18px`, `line-height: 1.7`
- Color: `rgba(245,244,242,0.55)`
- `white-space: nowrap`, `margin-bottom: 10px`

*Gold tagline (below subheading):*
- Text: `For teams dealing with unreliable workflows and system failure.`
- Font: `Barlow`, weight `500`, size `15px`, `line-height: 1.5`
- Color: `#C8A24A` (gold)
- `white-space: nowrap`, `margin-bottom: 32px`

---

### FOOTER

- `padding: 20px 40px`
- `z-index: 10`
- Text: `© 2026 Sighencea`
- Font size: `11px`, `letter-spacing: 0.06em`, `text-transform: uppercase`
- Color: `rgba(245,244,242,0.28)`

---

## Contact Form Overlay

**Trigger:** Click "Work with me" CTA button.

**Overlay:**
- `position: fixed`, `inset: 0`
- `background: rgba(5,5,5,0.85)`
- `backdrop-filter: blur(8px)`
- `z-index: 200`
- Center-aligned flex container
- Fade in: `opacity: 0 → 1`, `transition: 0.3s ease`
- Close on: ✕ button click, backdrop click, `Escape` key

**Card:**
- Background: `#111`
- Border: `1px solid rgba(255,255,255,0.1)`
- Border-radius: `4px`
- Padding: `52px 48px`
- Max-width: `480px`, full width
- Slides up on open: `transform: translateY(16px → 0)`, `transition: 0.3s ease`

**Card contents:**
- Small label: `Get in touch` — `11px`, `letter-spacing: 0.18em`, uppercase, color `#C8A24A`
- Title: `LET'S WORK TOGETHER` — `Barlow Condensed`, weight `800`, `36px`, uppercase, `#f5f4f2`
- **Form fields** (gap `14px` between):
  - Name input: `Your name`
  - Email input: `Your email`
  - Textarea (4 rows): `Tell me about your project`
  - All fields: `background: rgba(255,255,255,0.05)`, `border: 1px solid rgba(255,255,255,0.1)`, `border-radius: 4px`, `padding: 14px 16px`, `color: #f5f4f2`, `font-size: 14px`
  - Focus state: `border-color: rgba(200,162,74,0.5)`
  - Placeholder color: `rgba(255,255,255,0.3)`
- **Submit button:** Same style as CTA — gold background `#C8A24A`, white text, pill shape, arrow that slides right on hover

**Success state (after submit):**
- Form hides, success message appears for 3 seconds then overlay closes and form resets
- Gold circle with `✓` checkmark
- Message: `Message sent. I'll be in touch shortly.`

---

## Interactions & Behavior

| Interaction | Behavior |
|---|---|
| CTA hover | brightness +7%, translateY(-2px), arrow slides right 4px |
| CTA click | Opens contact overlay |
| Overlay open | Fade in + slide up card |
| Overlay close | Click backdrop / ✕ / Escape |
| Form submit | Show success for 3s, auto-close & reset |

---

## Design Tokens

| Token | Value |
|---|---|
| Background | `#0a0a0a` |
| Outer background | `#050505` |
| Foreground | `#f5f4f2` |
| Muted text | `rgba(245,244,242,0.55)` |
| Gold | `#C8A24A` |
| Border (site) | `rgba(200, 162, 74, 0.55)` |
| Border (subtle) | `rgba(245,244,242,0.12)` |
| Font primary | `Barlow` (400, 500, 600) — Google Fonts |
| Font display | `Barlow Condensed` (700, 800) — Google Fonts |

---

## Assets

| File | Usage |
|---|---|
| `assets/radu-portrait-unzoomed.png` | Main hero portrait — use this one |
| `assets/portrait.png` | Earlier portrait version — not used in final design |

---

## Files

| File | Description |
|---|---|
| `index.html` | Full self-contained prototype with all HTML, CSS, and JS inline |

---

## Notes for Developer

- The portrait masking uses CSS `mask-image` with `mask-composite: intersect` — verify browser support in your target environment; a canvas or SVG mask may be needed as fallback for Safari
- The pulsating CTA uses a CSS `@keyframes` animation — keep animation subtle; the current values are intentionally barely visible
- The contact form is currently front-end only — wire up to your preferred backend (Resend, Formspree, etc.)
- Google Fonts must be loaded: `Barlow` and `Barlow Condensed` (weights 400, 500, 600, 700, 800)

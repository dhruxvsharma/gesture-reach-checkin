
# Touchless Kiosk — Light, Accessible Redesign (ui-ux-pro-max applied)

Move from the dark glassmorphic look to a **calm clinical light theme** built around clarity, large targets, and confidence. Same flow, new visual language.

## Design system (derived from ui-ux-pro-max guidance for healthcare service)

**Style: Soft clinical minimalism** — high readability, generous whitespace, real surfaces with real borders. No glow, no gradient text, no glass blur, no ambient orbs.

**Color palette (AA-compliant on white):**
- Background: `#F5F6F4` warm off-white
- Surface: `#FFFFFF` with `#E5E7E2` 1px border
- Text primary: `#0F172A` (slate-900)
- Text secondary: `#475569` (slate-600) — meets 4.5:1
- Primary action: `#0F766E` deep medical teal
- Primary action text: `#FFFFFF`
- Hover tint: `#ECFDF5` teal-50
- Destructive (Not me): `#B91C1C` text-only, never as fill
- Focus ring: 3px `#0F766E` at 35%

**Typography (Google Fonts pairing):**
- Headings: **Fraunces** (humanist serif — warm, trustworthy, healthcare-appropriate)
- Body / UI: **Inter** (already loaded)
- Sizes: H1 64px, H2 40px, label 28px, body 18px, caption 14px
- Line-height 1.5 body, 1.15 headings; max line-length 65ch

**Shadows (replace glow utilities):**
- Card: `0 1px 2px rgba(15,23,42,0.04), 0 8px 24px rgba(15,23,42,0.06)`
- Hover: `0 2px 4px rgba(15,23,42,0.06), 0 16px 40px rgba(15,23,42,0.10)`

## Interaction primitive updates

**`DwellButton`**
- White surface, 1px neutral border, soft shadow. Hover: teal border + `#ECFDF5` tint.
- Dwell ring: 4px solid teal stroke (no `drop-shadow` filter).
- Confirm: solid teal fill, white label, single 250ms scale 1.0→1.04→1.0. Removes outward pulse glow.
- New variants: `primary` (filled teal — recommended action), `secondary` (white), `ghost` (text-only, used for "Not me").
- Pinch (already detected) becomes instant-confirm shortcut.
- Honors `prefers-reduced-motion`.

**`GestureCursor`**
- Solid 24px teal dot with 2px white ring. No trailing glow, no pulsing halo.

**`KioskShell`**
- White top bar, subtle bottom hairline. Remove `glass`, remove ambient gradient.
- Logomark: solid teal tile + "SmartCare" wordmark, tagline "Patient Check-in".
- Step indicator: explicit text **"Step 3 of 8 · Verify identity"** + slim progress bar (replaces dot row).
- Hand status pill: dot + plain text "Camera ready" / "Show your hand" (no glow).
- Bottom hint: two-line, larger, quiet — **"Point with your index finger"** / "Hold over a button for 1.5 seconds to choose".
- Camera thumb: white-framed card labeled **"You"** so users know what it is.
- Page transition: simple opacity fade only (drop the scale).

## Page-level patterns (applied across all 12 routes)

Consistent header block: small step label · large question (Fraunces) · short helper sentence.

- **Welcome (`/`)** — drop floating glowing hand orb. Clean line-art hand icon, "Wave to begin" prompt, wave-progress becomes a horizontal bar under the prompt (not a circular halo). Drop "text-gradient-primary" treatment.
- **Language (`/language`)** — white tiles, native script as the hero (huge), English label below, flag shrunk to a corner badge.
- **Sanitize (`/sanitize`)** — clean illustrated soap/hand icon, large countdown numeral.
- **Identify (`/identify`)** — three white cards, teal icon tiles, clearer copy.
- **Verify (`/verify`)** — real white card with teal-initials avatar, labeled rows. **"Yes, that's me"** is filled teal primary; **"Not me"** is a quiet ghost button (right-aligned). Clear hierarchy.
- **Insurance (`/insurance`)** — same card pattern as Verify.
- **Screening (`/screening`)** — large mirrored Yes/No cards with proper SVG icons (check / alert) + word labels. Replace `✓` / `!` emoji-as-icon. Progress dots become "Question 2 of 3" + thin bar.
- **Symptoms (`/symptoms`)** — multi-select grid, selected = teal border + subtle tint (no glow).
- **Payment (`/payment`)** — amount due as the dominant typographic element, three clear options below.
- **Receipt (`/receipt`)** — three method tiles with proper icons.
- **Complete (`/complete`)** — queue number becomes the hero: huge teal numeral on white, calm supporting info beneath.
- **Feedback (`/feedback`)** — thumbs up/down with proper SVG icons (no emoji), auto-reset.

## Accessibility upgrades (per skill priorities 1–2)

- Min target size: 180×180 for primary tiles, 88px tall for inline buttons.
- AA contrast checked for default / hover / confirm / disabled.
- Every icon paired with a text label.
- Subtle "1s" countdown text inside the dwell ring so users understand the wait.
- `prefers-reduced-motion`: skip pulse + transition fade.
- `cursor: none` on body kept only when camera active; restore default cursor in mouse fallback.

## Files touched

- `src/styles.css` — full theme rewrite (light tokens, drop glass/glow utilities, add Fraunces import, new shadow scale).
- `src/components/kiosk/DwellButton.tsx` — new variants, no-glow ring, pinch instant-confirm, reduced-motion.
- `src/components/kiosk/GestureCursor.tsx` — solid dot.
- `src/components/kiosk/KioskShell.tsx` — light status bar, numbered step indicator, "You" camera label, drop ambient gradient, simpler transition.
- All 12 route files in `src/routes/` — apply header pattern, swap glass cards for white cards, retire `text-gradient-primary` / `shadow-glow`, restructure Yes/No and tile layouts, replace emoji-as-icon with SVG.

## Out of scope

- Translations (English only this pass).
- Sound design.
- Real backend wiring.

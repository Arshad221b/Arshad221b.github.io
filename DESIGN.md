# Design language

The rules every page on this site follows. The values live once, as tokens,
at the top of `src/styles/global.css`; this file says what they are for and
when to use which. **If a value is not in the tokens, it does not go on the
site.** If something new genuinely needs a new value, add a token here and in
`global.css` first, then use it — never a one-off number in a component.

Run `npm run lint:design` before committing: it fails on any raw size,
spacing, radius, layer, speed or breakpoint that bypasses the standard.

---

## 1. Principles

1. **Ink on paper.** The page is warm paper; content is graphite ink with one
   signal colour. Pictures are engravings whose paper is lifted out, so they
   sit *on* the page, never in a box on it.
2. **One accent, used sparingly.** Registration orange marks what is live:
   the current section, a link on hover, a dot on the river, a numeral. Never
   as a fill for large areas.
3. **Type does the work.** Hierarchy comes from the type scale and spacing,
   not from boxes, borders, shadows or colour.
4. **Still by default.** Nothing moves unless the reader did something, with
   four named exceptions (§10).
5. **Instant.** A page opens with no transition, no fade, no rise.
6. **Nothing sideways.** No page and no box on a page ever scrolls or nudges
   horizontally, at any width (§12).

## 2. Colour

Only the colour tokens. Every token has a light and a dark value; never
write a colour that does not change with the theme.

| Token | Use |
|---|---|
| `--color-bg` | The page. Everything sits on it. |
| `--color-surface`, `--color-raised` | The rare panel that must read as lifted (code, sheets). |
| `--color-chrome` | Browser bar / overscroll only. |
| `--color-text` | Headings, reading text. |
| `--color-text-secondary` | Ledes, quotes, secondary paragraphs. |
| `--color-text-muted` | Labels, dates, captions, inactive items. |
| `--color-accent` | The signal: current, hovered, a mark. Hover deepens to `--color-accent-hover`. |
| `--color-accent-soft` | Selection and very faint accent washes. |
| `--color-border`, `--color-border-light` | Hairlines and rules. |
| `--color-tag-*`, `--color-code-bg` | Tags and code only. |

- Tints are made with `color-mix(in srgb, <token> N%, transparent)`, never
  new hex values.
- **Allowed exceptions:** `#000` inside mask gradients (it is alpha, not
  colour), and the data palettes inside a blog post's own diagrams.

## 3. Typography

Three families, each with one job:

- **Newsreader (serif)** — reading text, titles, headings, quotes.
- **IBM Plex Mono** — labels, dates, numerals, navigation, tags, metadata.
  Always small, usually in capitals with `--track-caps`.
- **Great Vibes** — the wordmark only.

### Scale

| Token | Size | Use |
|---|---|---|
| `--fs-micro` | 0.6rem | Mono captions, ticks, counters, section numbers |
| `--fs-label` | 0.68rem | Mono labels, eyebrows, nav, tags, dates |
| `--fs-small` | 0.82rem | Notes, figure captions, secondary lines |
| `--fs-ui` | 1rem | Buttons, inputs, list text |
| `--fs-body` | 1.16rem | **Reading text** |
| `--fs-lead` | 1.3rem | Ledes, standfirsts, pull quotes |
| `--fs-h3` | 1.3 → 1.7rem | Sub-heads, entry titles |
| `--fs-h2` | 1.5 → 2.1rem | Section heads, row titles |
| `--fs-h1` | 2.2 → 3.6rem | Article titles, big numerals |
| `--fs-display` | 3.4 → 6.4rem | The essay hero title (wide screens) |
| `--fs-display-xl` | 3.4 → 8.4rem | Page masts: home, Blogs, Thoughts, Contact |

- `em` sizes are allowed only for inline text sized against its parent
  (a superscript count, an icon in a line). `vw` sizes only inside the
  home intro.

### Weight, leading, tracking

| Weight | Use | Leading | Use | Tracking | Use |
|---|---|---|---|---|---|
| `--fw-display` 200 | display titles | `--lh-display` 0.92 | display titles | `--track-tight` | display, large heads |
| `--fw-light` 300 | large serif | `--lh-none` 1 | one-line labels, numerals | `--track-snug` | headings |
| `--fw-regular` 400 | reading | `--lh-tight` 1.1 | headings | `--track-normal` | all serif text |
| `--fw-medium` 500 | mono emphasis | `--lh-snug` 1.3 | sub-heads, captions | `--track-label` | mono, mixed case |
| `--fw-bold` 600 | rare emphasis | `--lh-ui` 1.5 | interface text | `--track-caps` | mono, capitals |
| | | `--lh-body` 1.7 | reading text | | |

- Reading text: `--fs-body`, `--lh-body`, `--fw-regular`, measure ≤ `--measure`.
- Mono is never bold; it uses `--fw-medium` at most.

## 4. Spacing

Two layers of one 4px grid:

- **Page rhythm** (between blocks): `--space-xs` 0.3 · `--space-sm` 0.6 ·
  `--space-md` 1.2 · `--space-lg` 2 · `--space-xl` 2.5 · `--space-2xl` 3.5 ·
  `--space-3xl` 4.5 rem.
- **Component steps** (inside a component): `--space-0-5` 2px · `--space-1` 4 ·
  `--space-1-5` 6 · `--space-2` 8 · `--space-3` 12 · `--space-4` 16 ·
  `--space-5` 20 · `--space-6` 24 · `--space-8` 32 · `--space-10` 40 ·
  `--space-14` 56 · `--space-18` 72.
- `--gutter` is the page's side margin at every width; nothing sits closer to
  the screen edge than it, except full-bleed plates.
- Fluid spacing (`clamp`, `vw`) only for page-level layout, never inside a
  component.

## 5. Layout

- Widths: `--max-width` (page), `--column` (article column), `--measure`
  (longest reading line). Text never runs wider than `--measure`.
- `--head-h` is the header's measured height; anything that must fill "the
  rest of the screen" uses it.
- One column of reading. Figures may break out of the column; text may not.
- Full-bleed is reserved for the essay header plate on wide screens.

## 6. Breakpoints

Only these, written as numbers because CSS cannot read variables in `@media`:

| Width | Meaning |
|---|---|
| `max-width: 480px` | Small phone |
| `max-width: 600px` | Large phone |
| `max-width: 760px` | Phone / tablet boundary (`min-width: 761px` above it) |
| `max-width: 1100px` | Tablet / desktop (`min-width: 1101px` above) |
| `max-width: 1239px` / `min-width: 1240px` | Wide: room for margin contents |

Exact complements (759/760, 1099/1100) are allowed so ranges do not
overlap. Plus `(hover: hover)`, `(hover: none)` and
`(prefers-reduced-motion: …)`.

## 7. Corners and lines

- Corners: `--radius-sm` 2px (tags, code) · `--radius` 4px (cards, inputs,
  figures) · `--radius-lg` 8px (panels, callouts) · `--radius-xl` 14px
  (sheets) · `--radius-pill` (capsules) · `50%` (circles).
- Lines are 1px hairlines in `--color-border`. Thicker lines only for the
  accent marker on the current item (1px accent) and the reading-progress bar.

## 8. Elevation

The site is flat. Shadows only for things that float above the page:

- `--shadow-float` — chips (the contents chip).
- `--shadow-sheet` — sheets (the contents sheet).
- `--shadow-soft`, `--shadow-lift` — a card lifting on hover.
- `--ring-accent` — selected/focused outline.

## 9. Layers

| Token | Value | What |
|---|---|---|
| (local) | 0–3 | Order inside one component only |
| `--z-header` | 100 | The sticky site bar |
| `--z-float` | 150 | Fixed controls: back key, to-top, contents chip, readouts |
| `--z-veil` | 155 | Dimmer behind an open sheet |
| `--z-sheet` | 156 | An open sheet |
| `--z-sheet-chip` | 157 | The control that opened it |
| `--z-overlay` | 200 | Skip link, toasts |
| `--z-intro` | 300 | The home intro |

No other number above 3, anywhere.

## 10. Motion

**Default: nothing moves.** No page transitions, no fade-ins, no rising
titles, no scroll-driven effects, no reveal of pictures.

Interface feedback uses three speeds and `--ease-out`:

- `--dur-fast` 0.15s — colour and opacity on hover/focus.
- `--dur-base` 0.25s — small movements (a chip, a marker).
- `--dur-slow` 0.4s — a panel or sheet.

**The four signature animations** (the only motion not caused by the
reader): the logo's ink pot; the home intro (once every 60 days, or on
replay); the sketch backgrounds on Blogs and Thoughts; the theme toggle's
circle reveal. Nothing else may animate on its own. Everything respects
`prefers-reduced-motion`.

Rules for any motion: only `opacity` and `transform` animate; nothing
animates layout (width, height, top, margin); nothing runs while off
screen; no frame loop runs forever.

## 11. Pictures

- Every picture is served from Cloudinary through `img()` in
  `src/lib/media.ts`, at the width it is shown (`img(path, 800)`), with
  `widths()` for header plates. Never a raw URL.
- Plates (engravings) carry `data-ink`; InkPlates lifts their paper out so
  nothing blends. `data-ink="gray"` for Thoughts plates; add
  `feather-NN@WIDTH` for an oval fade at a breakpoint. A plate stays hidden
  until inked (at most 400ms), never flashes.
- No `mix-blend-mode` on plates, no CSS filters beyond the dark-mode invert.
- Header plates: full-bleed on wide screens, top of the page on phones.
- Replacing a picture: upload under a new name and map it in
  `src/lib/media.ts` (unsigned uploads cannot overwrite).

## 12. Responsiveness

- Test every change at 320, 375, 430, 768, 1024, 1440 and 1920px.
- No horizontal scroll, ever: the window clips (`html`), the body clips,
  the page only pans vertically on touch. Anything wider than its column
  is fitted, never scrolled: code wraps; equations, diagrams and tables
  scale down (the fit script in `Layout.astro`).
- Do not clip a centred column (`main`): wide headers deliberately extend
  past it. Clip only at the window or inside a component's own box.
- Fixed controls never overlap each other or the content they serve.

## 13. Components

- **Site bar** — sticky, `--z-header`, frosts when scrolled.
- **Page heading** (Blogs, Thoughts, Contact) — one shared style in
  `global.css`: `.page-label` (mono label line), `.page-title`
  (`--fs-display-xl`, `--fw-light`, accent word in italic orange) and
  `.page-lede` (`--fs-h3`, italic, secondary). Pages set only the spacing
  around them, never their type; a new index page uses the same three.
  Above a phone the heading is one layout: label line across the top, then
  title, lede and its button on the left, the figures in a two-by-two block
  on the right.
- **First screen** (Blogs, Thoughts) — from 761px wide, the opening fills
  exactly the screen and ends with the search and the topics. If a short
  window cannot hold it, the page title (and the lede with it) shrinks just
  enough to keep the topics in view, never below 45%. Anything that explains
  the list (the Essay/Notebook key) sits just above the list, not in the
  first screen.
- **Essay header** — date, title (`--fs-h1`, `--fs-display` on wide
  screens), readout (number, words, read time), plate.
- **Quotes and asides** — no side rules; three dots above and below,
  serif italic in `--color-text-secondary`.
- **Contents** — in the margin from 1240px, between the back key and the
  readout; below 1240px a chip at the foot of the screen opens a sheet
  (close button, veil, Escape, current section in view).
- **River (Thoughts)** — engraved hairlines that gather at each essay and
  open into a lens between; essays marked with a fine accent ring; years
  plain. Drawn once, never animated.
- **Links** — text colour, accent on hover; never underlined by default in
  navigation, underlined in reading text.
- **Tags** — mono `--fs-label`, `--color-tag-*`, `--radius-sm`.
- **Code** — mono, `--color-code-bg`, `--radius-sm`, wraps.

## 14. Performance

- Pages open instantly: links prerender on hover (speculation rules) and
  prefetch elsewhere.
- Heavy third parties (Disqus) load only when the reader nears them.
- Work happens off the main thread (workers) or once (cached), never per
  frame.
- Scroll handlers read measurements cached on resize, never measure on
  every scroll.

## 15. Adding something new — checklist

1. Can it be built from existing tokens and components? Then do that.
2. Values only from tokens (`npm run lint:design` passes).
3. Works and looks right at all seven widths, light and dark.
4. No horizontal overflow, no overlap with fixed controls.
5. Moves only if the reader did something; respects reduced motion.
6. Pictures through `img()`, plates with `data-ink`.

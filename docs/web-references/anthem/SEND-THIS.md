# Send this

Paste-ready. Everything below the line is self-contained — no references to any source
site, no notes to you, nothing for the tool to go and fetch.

**Do this first:** fill in the eight `«…»` slots. Then copy from the horizontal rule to
the end and paste it in one message.

Two versions:

- **Version A (full)** — use this. It's the whole spec and it produces the best result.
- **Version B (compact)** — only if you hit a character limit. Bottom of the file.

---
---

# VERSION A — full spec

Build a marketing website to the specification below. This is a spec, not a mood board —
where it gives a number, use that number.

## Brand

```
BRAND NAME:            «Northwind Logistics»
INDUSTRY:              «freight and supply chain»
ONE-LINE PROMISE:      «Moving what matters.»          ← 2–4 words, ends in a full stop
POSITIONING SENTENCE:  «Northwind is one of the largest independent freight operators in
                        the Nordics. We plan, move, store and deliver at national scale,
                        with 40 depots and a fleet of 900 vehicles.»
CANVAS COLOUR:         «warm off-white»
ACCENT COLOUR:         «signal orange»                 ← one accent only
PAGES:                 «Home, About, Services, Team, Careers, Contact»
PROOF NUMBERS:         «900 vehicles · 40 depots · 2.1M deliveries a year»
```

## 1. Character

Quiet, confident, editorial — a design studio's own site or a premium infrastructure
company's annual report, **not** a SaaS landing page. No gradients, no drop shadows, no
glassmorphism, no rounded-rectangle "feature cards with icons", no purple.

**At least 40% of every viewport is empty canvas.** If a section looks sparse, it is
correct. Do not fill it. Confidence comes from restraint and scale, never from density.

## 2. Colour

Build everything on a **warm, low-contrast neutral canvas — not white.** Paper, bone,
oat, warm sand. Body text is a near-black that is *not* pure black; a very dark warm grey
reads softer and more expensive.

```css
:root {
  --canvas:      /* warm off-white — default page background */
  --ink:         /* near-black, slightly warm — default text */
  --accent:      /* ONE loud accent, used at full-bleed scale only */
  --accent-deep: /* a much darker sibling of the accent */
  --pop:         /* high-chroma secondary, used ONCE per page maximum */
}
```

- Canvas is the default for ~80% of the site. Ink on canvas is the resting state.
- **The accent is never a small button or link colour.** It is a full-bleed section
  background — an entire panel, or the entire footer, flooded in it with canvas-coloured
  text on top. This is the site's one loud move; it lands because everything around it is
  quiet.
- `--accent-deep` backs the stat panels, with the lighter accent on top as oversized
  numerals — light on dark, same hue family.
- `--pop` appears at most once per page.
- Set a custom selection colour: `::selection { background: var(--accent-deep); color: var(--canvas); }`

Also build a **light/dark theme toggle**:

- Driven by `body[data-theme="light"|"dark"]` and three variables: `--theme-bg`,
  `--theme-text`, `--theme-border`.
- Individual sections may carry their own `data-theme` to invert locally mid-page.
- Transition `color` and `background-color` on `body` over `0.3s cubic-bezier(0.1,0,0.3,1)`.
- The toggle is a **text label** ("Light"/"Dark") that slides vertically on hover
  (`translateY(150%)` → `translateY(0)`, 400ms ease-out) inside an `overflow: hidden`
  wrapper. Not an icon. Not a switch.

Derive faded text from `currentColor`, not from the theme token — otherwise it goes
illegible inside inverted panels:
`color: color-mix(in srgb, currentColor 60%, transparent)`.

## 3. Typography — the most important section

**One** geometric-grotesque sans for everything. No serif, no display face, no second
family. Switzer, General Sans, Neue Haas Grotesk, Söhne or Inter Tight all work. Load
exactly three weights: **300, 400, 500. Never load a bold.**

| Role | Size | Weight | Line height | Tracking |
|---|---|---|---|---|
| Display / H1 | `5rem` | 500 | `1.1em` | `-0.03em` |
| **H2** | `3.75rem` | **300** | `1.1em` | `-0.03em` |
| H3 | `3rem` | 500 | `1.1em` | `-0.03em` |
| H4 | `1.875rem` | 500 | `1.3em` | `0` |
| H5 | `1.5rem` | 500 | `1.3em` | `0` |
| H6 / eyebrow | `1rem` | 500 | `1.3em` | `0` |
| Body large | `1.25rem` | 400 | `1.3em` | `0` |
| Body | `1rem` | 400 | `1.5em` | `0` |
| Small / meta | `0.875rem` | 400 | `1.5em` | `0` |

Three rules that carry the whole look:

1. **H2 is LIGHTER than H1 — 300, not 500.** Big section headlines are set in Light. This
   is the highest-leverage detail in the system: a 3.75rem headline at weight 300 with
   `-0.03em` tracking is what makes the site read editorial rather than corporate. **Do
   not "fix" this to a bolder weight.**
2. **Tight negative tracking (`-0.03em`) on every heading.** Never on body text.
3. **Headlines end in a full stop.** The period is doing tonal work — it makes a statement
   feel finished rather than promotional.

Headlines are 2–6 words. Never wrap past two lines.

## 4. Layout and grid

- Max content width `120rem`.
- **Gutters and horizontal page padding are `0.65rem`.** Deliberate. Cards and media sit
  almost flush to the viewport edge so the page reads full-bleed, not as a centred column.
  **Do not correct this to a comfortable 24px or a standard container.**
- Vertical section padding: `7rem` default, `5rem` tight, `10rem` generous. Expose as
  `data-padding-top` / `data-padding-bottom` attributes so any section can be tuned
  without new classes.
- Spacing scale (rem): `0.25 · 0.75 · 0.875 · 1 · 1.25 · 1.5 · 1.875 · 2 · 2.5 · 3 · 3.75
  · 4 · 5 · 6 · 7 · 8 · 10 · 12 · 16`.

**The signature layout move — right-weighted asymmetry.** Split into 12 columns. Put a
small eyebrow label (H6 — "What We Do", "About Us", "01") in the **far-left column**,
leave columns 2–5 **completely empty**, and start the headline and body copy at **column
6**, running to the right edge. The result is a wide vertical channel of empty canvas down
the left third, with all content stacked in the right two-thirds. Use this for most
content sections.

**Hairline rules:** separate stacked list rows with a **1px dotted** rule in the ink
colour at low opacity. Dotted, not solid. Other borders are `1.5px` solid — and SVG icon
strokes are also `1.5px`, so icons and borders share a weight.

## 5. Shape language — cut corners

Two shapes only.

**(a) The chamfer — the signature.** Media and panels are clipped to an octagon with
bevelled corners, not rounded ones:

```css
[chamfer] {
  clip-path: polygon(
    0% 2.8vw, 2.8vw 0%,
    calc(100% - 2.8vw) 0%, 100% 2.8vw,
    100% calc(100% - 2.8vw), calc(100% - 2.8vw) 100%,
    2.8vw 100%, 0% calc(100% - 2.8vw)
  );
}
```

A `vw` bevel so the cut scales with the viewport. Apply to hero media, image cards,
feature panels and horizontal-scroll cards. Variants bevelling only the bottom two or top
two corners are correct and add rhythm.

**(b) A very large pill radius — `4.375rem`.** For stat cards and the newsletter input. At
typical card sizes it reads as a lozenge. Buttons use `border-radius: 100vw` with a
`1.5px` outline, transparent fill, and a right-pointing arrow after the label.

Never mix the two on one element. Chamfer = media and content panels. Pill = interactive
elements and stat blocks.

## 6. Motion system

The motion *is* the product. Use **GSAP** with `ScrollTrigger` and `SplitText`, plus
**Lenis** for smooth scroll. Hide native scrollbars (`scrollbar-width: none` and
`::-webkit-scrollbar { display: none }`).

**Define one house easing curve and reuse it everywhere:**

```js
CustomEase.create("primary-ease", "M0,0 C0.15,0 0.15,1 1,1");
```

Fast departure, long glide to rest. Every menu, popup and reveal uses it — reusing a
single curve across the whole site is what makes the motion feel authored rather than
assembled. Scrubbed scroll animations use `ease: "none"`; entrance reveals use `expo.out`.

Wire Lenis through the GSAP ticker and disable lag smoothing, so scrubbed animations stay
locked to scroll position:

```js
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
```

Implement these as **attribute-driven utilities** so any element can opt in:

| Behaviour | Implementation |
|---|---|
| **Preloader** | A counter ticking `000` → `099`, zero-padded to 3 digits, over ~2s. Then the panel slides up (`yPercent: -110`) while page content rises from `y: 100vh`. First visit only — gate on `sessionStorage`. |
| **Page reveal** | Content enters from `y: 100vh` with `scaleX: 0.9 → 1`, *and* a `clip-path` whose top corners are bevelled `5rem` and open to `0` as it settles. The chamfer literally animates open. `power1.inOut`. |
| **Page transitions** | SPA-style transitions. Old page leaves, new page enters with the same rise-and-unbevel reveal. Re-run scroll setup after each transition. |
| **Line reveal** | Split headings into lines. Animate each `yPercent: 100 → 0` **behind a `clip-path` wipe**, `stagger: 0.1`, `expo.out`. The mask is essential — lines slide up out of nothing, not up from visible overflow. |
| **Word fade** | Long paragraphs: split to words, `opacity: 0.1 → 1`, `stagger: 0.05`, **scrubbed** to scroll. Text illuminates as you read down it. |
| **Section grow** | Sections start inset with `5rem` side padding and scrub to the gutter value as they enter — panels widen into full bleed. Scrub to the gutter, **not to `0`**, or you override the section's own padding and clip the far-left eyebrow off the viewport. |
| **Media un-zoom** | On scroll, a media frame animates `width: 50% → 100%` while the image inside animates `width: 150% → 100%`. Frame opens while image settles. |
| **Parallax** | `yPercent: 0 → -100`, scrubbed, desktop only (`min-width: 992px`). |
| **Magnetic buttons** | On `pointermove`, translate toward the cursor at `0.2` strength clamped to `30px`, `0.2s power2.out`. On leave, return over `0.5s` `sine`. Cache `getBoundingClientRect` and recompute only on resize and pointerenter. |
| **Nav** | Hides on scroll down (`yPercent: -110`, `0.4s sine.inOut`), returns on scroll up. After 400px add a `scrolled` state giving the nav a solid canvas-coloured pill background over `300ms`. Over a dark hero the nav text must be canvas-coloured, flipping to ink once scrolled. |
| **Menu overlay** | Full-screen. Background fades; panels slide `yPercent: -100`; links enter `yPercent: 50` + fade with `0.075` stagger; divider rules grow `width: 0% → 100%` with the same stagger. Escape closes. Lock scroll while open. |
| **Horizontal scroll** | One pinned section: set height to `trackWidth + 100vh`, scrub the track `xPercent: 0 → -100`. Cards alternate full-bleed colour panels and chamfered photos. Each card's big number animates in with `rotationX: -90 → 0`, `yPercent: 50 → 0`, `1.2s circ.out`, `0.1` stagger per character. |
| **Link underline** | A `::after` hairline (`0.065rem`) scaling `scaleX: 0 → 1` from `transform-origin: right` on hover and out to the left on leave. `0.3s ease`. |
| **List hover** | Hovering one row in a list fades the *others* down and reveals a small chamfered thumbnail beside the hovered label. Image scales `1.05` over `650ms ease-out`. |
| **Footer reveal** | Footer rises `y: 10rem → 0` over `1.4s expo.out`. The wordmark's SVG letter paths stagger in at `0.05`. |
| **Icons** | Small Lottie animations playing on hover (desktop) / tap (mobile), still otherwise. |

Exits run faster than entrances — reverse close timelines at `timeScale(2)`.

Respect `prefers-reduced-motion`: disable scrub, parallax, magnetic buttons and the
preloader; keep opacity fades only.

## 7. Content architecture

Home page order:

1. **Full-bleed hero media**, darkened with an overlay, with the promise line set in the
   Display size at the **bottom-left** — not centred. A "Scroll to discover more" label
   and a thin down-arrow sit bottom-right.
2. **Intro** — eyebrow far-left, `3.75rem` weight-300 headline and one paragraph at
   column 6+, a chamfered image, one pill button.
3. **"What We Do"** — 3–5 rows separated by dotted rules. Each row is a large heading in
   the right columns revealing a thumbnail on hover.
4. **Horizontal scroll section** — 4–6 full-height cards alternating flooded colour panels
   carrying a huge proof number with chamfered photographs.
5. **Process** — numbered steps with a scroll-linked progress indicator.
6. **Featured moment** — a chamfered panel with a circular outlined "Watch" button centred.
7. **News / insights** — a small grid becoming a swipeable carousel under 992px.
8. **Footer** — a full-bleed accent-coloured block carrying numbered columns
   (`01 Get in Touch` / `02 News`), a physical address on individual lines, a pill
   newsletter input with an arrow submit, legal links, and an oversized wordmark whose
   letters stagger in. This is where the loud colour lives.

Other pages use the same grammar: eyebrow, light oversized headline, wide empty left
channel, dotted-rule lists, chamfered media.

## 8. Voice

- Headlines 2–6 words, ending in a full stop.
- Plain declarative sentences. No "revolutionary", "seamless", "cutting-edge". No
  exclamation marks.
- Lead with numbers and scale. Specific figures set in the Display size with the unit as a
  smaller line beneath are the primary proof device.
- Section labels are literal: "What We Do", "About Us", "Our Team", "Get in Touch".

## 9. Technical

- Responsive; **992px is the single meaningful breakpoint**. Below it: parallax off,
  magnetic buttons off, grids become swipeable carousels, chamfer bevel reduced.
- Semantic HTML — real `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, one `<h1>`
  per page.
- Self-host the webfont as `woff2`, three weights only. Preload the 400 weight.
- Lazy-load below-the-fold media. Hero video `preload="auto"`, muted, looping,
  `playsinline`, with a poster frame. Do **not** strip `loading="lazy"` from images to fix
  scroll-trigger measurement — call `ScrollTrigger.refresh()` on image load instead.
- Keyboard accessible: visible focus states, Escape closes the menu, video popup traps
  focus.
- **Verify text contrast against the canvas.** A warm off-white background with a soft ink
  can fall under 4.5:1 if the ink is lightened too far. Test it rather than assuming.

---
---

# VERSION B — compact

Only if Version A won't fit.

---

Build a marketing website with this design system. Treat it as a spec — where it gives a
number, use that number.

**Brand:** «BRAND» — «INDUSTRY». Promise line: «PROMISE.» Pages: «PAGES».

**Character:** quiet, confident, editorial — a design studio's own site, not a SaaS
landing page. No gradients, shadows, glassmorphism or icon-feature-cards. **At least 40%
of every viewport stays empty.** If it looks sparse, it's right.

**Colour:** a warm off-white canvas (never pure white) with warm near-black text. **One**
accent colour, used *only* as a full-bleed section or footer background with
canvas-coloured text on top — never as a small button or link colour. One darker sibling
of the accent for stat panels. Custom `::selection` colour. Light/dark toggle via
`body[data-theme]`, transitioning over `0.3s cubic-bezier(0.1,0,0.3,1)`; the toggle is a
text label that slides vertically on hover, not an icon.

**Type:** one geometric grotesque sans, weights 300/400/500 only, never bold.
H1 `5rem`/500, **H2 `3.75rem` at weight 300 — lighter than H1, this is the single most
important detail, do not make it bolder**, H3 `3rem`/500, body `1rem`/400/`1.5em`.
All headings `-0.03em` tracking, `1.1em` line height. Headlines are 2–6 words and **end in
a full stop.**

**Layout:** max width `120rem`, **gutters `0.65rem`** so media sits almost flush to the
viewport edge and the page reads full-bleed — do not widen this to a normal container.
Section padding `7rem`. Signature move: 12-column grid with a small eyebrow label in the
**far-left column**, columns 2–5 **completely empty**, headline and copy starting at
**column 6** and running right. Separate list rows with **1px dotted** rules; other
borders and SVG strokes `1.5px`.

**Shape:** media and panels clipped to octagons with **2.8vw bevelled corners** via
`clip-path` — cut corners, not rounded. Stat cards use a very large `4.375rem` radius;
buttons are `100vw` pills with a `1.5px` outline, transparent fill and a trailing arrow.
Never mix the two on one element.

**Motion (GSAP + ScrollTrigger + SplitText + Lenis):** define one house easing curve,
`CustomEase.create("primary-ease","M0,0 C0.15,0 0.15,1 1,1")`, and reuse it on every menu,
popup and reveal — that single-curve discipline is what makes the motion feel authored.
Drive Lenis from the GSAP ticker with `lagSmoothing(0)`. Hide native scrollbars. Then:
a `000`→`099` preloader; a page reveal where content rises from `y:100vh` while a
`clip-path` chamfer opens from `5rem` bevels to `0`; heading lines revealing `yPercent
100→0` **behind a clip-path mask** with `0.1` stagger, `expo.out`; paragraphs illuminating
word-by-word `opacity 0.1→1` scrubbed to scroll; sections widening from `5rem` inset to
the gutter on scroll; a pinned horizontal-scroll section whose big numbers enter with
`rotationX:-90→0`; magnetic buttons at `0.2` strength clamped to `30px`; a nav that hides
on scroll down and gains a solid pill background after 400px; hover underlines that wipe
`scaleX` from right to left; a footer rising `y:10rem→0` at `1.4s expo.out` with its
wordmark letters staggered. Exits reverse at double speed. Honour
`prefers-reduced-motion`.

**Structure:** full-bleed hero with the promise line **bottom-left, not centred**, and a
scroll cue bottom-right → intro (eyebrow left, light oversized headline right) → a
"What We Do" list of dotted-rule rows revealing thumbnails on hover → the horizontal
scroll section of alternating flooded colour panels and chamfered photos carrying proof
numbers → stat cards → **a full-bleed accent-coloured footer** with numbered `01`/`02`
columns, address on individual lines, a pill newsletter input with arrow submit, and an
oversized wordmark.

**Voice:** plain declarative sentences, no marketing adjectives, lead with real numbers
set at Display size. Literal section labels.

**Technical:** 992px is the only meaningful breakpoint; semantic HTML; self-hosted woff2;
keyboard accessible; verify text contrast actually clears 4.5:1 against the warm canvas.

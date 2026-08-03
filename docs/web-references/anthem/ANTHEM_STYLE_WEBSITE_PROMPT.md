# The "Anthem" Website Prompt

A reusable, copy-paste prompt for generating a website that **feels** like
[anthem.co.za](https://www.anthem.co.za/) — quiet editorial luxury, oversized light
typography, cut-corner cards, cream canvas, and a heavy GSAP motion layer — **without
copying it**.

Reverse-engineered from the live site on 2026-08-03. Full technical evidence in
[`anthem-teardown.md`](anthem-teardown.md).

---

## How to use this document

There are three blocks below. Use them in this order:

| Block | When to use it |
|---|---|
| **1. Fill-in brief** | Always. Fill this in first — it's 8 questions. |
| **2. The master prompt** | Paste into your design/build tool *after* the filled brief. |
| **3. Variation levers** | Use when the first result looks *too much* like Anthem, or too little. |

The master prompt is written to be tool-agnostic. It works in an AI website builder, an
AI coding agent, or as a written brief for a human designer. It never says "copy
anthem.co.za" — it describes the *system* so the output is a sibling, not a clone.

> **Why this matters:** the reason Anthem looks expensive isn't the colours. It's four
> decisions — a 0.65rem gutter, a 300-weight 3.75rem H2, one custom easing curve reused
> everywhere, and the discipline to leave 40% of every screen empty. Change the colours
> and keep those four, and it still reads as the same tier of site.

---

## BLOCK 1 — Fill-in brief

Replace every `«…»`. Keep the labels.

```
BRAND NAME:            «Northwind Logistics»
INDUSTRY / SECTOR:     «freight and supply chain»
ONE-LINE PROMISE:      «Moving what matters.»            ← 2–4 words + full stop
POSITIONING SENTENCE:  «Northwind is one of the largest independent freight operators
                        in the Nordics. We plan, move, store and deliver at national
                        scale, with 40 depots and a fleet of 900 vehicles.»
CANVAS COLOUR:         «warm off-white»                  ← see Variation Lever 1
ACCENT COLOUR:         «signal orange»                   ← ONE accent, used loudly
PAGES NEEDED:          «Home, About, Services, Team, Careers, Contact»
PROOF NUMBERS:         «900 vehicles · 40 depots · 2.1M deliveries a year»
```

---

## BLOCK 2 — The master prompt

Paste the filled brief above, then everything between the rules below.

---

Build a marketing website using the design system specified below. Follow it precisely —
this is a specification, not a mood board. Where the spec gives a number, use that number.

### 1. Overall character

Quiet, confident, editorial. This should feel like a design studio's own site or a
premium infrastructure company's annual report — **not** like a SaaS landing page. There
are no gradients, no drop shadows, no glassmorphism, no rounded-rectangle "feature
cards with icons", and no purple. Every screen is mostly empty. Confidence is
communicated by restraint and by scale, never by density.

The single most important rule: **at least 40% of every viewport is empty canvas.** If a
section looks sparse, it is correct. Do not fill it.

### 2. Colour

Build the whole site on a **warm, low-contrast neutral canvas** — not white. Think
paper, bone, oat, or warm sand. Body text is a near-black that is *not* pure black
(a very dark warm grey reads softer and more expensive).

Define exactly these roles as CSS custom properties:

```css
:root {
  --canvas:      /* warm off-white — the default page background */;
  --ink:         /* near-black, slightly warm — default text */;
  --accent:      /* ONE loud accent, used at full-bleed scale */;
  --accent-deep: /* a much darker sibling of the accent */;
  --pop:         /* a high-chroma secondary, used ONCE per page maximum */;
}
```

Rules for using them:

- **Canvas is the default for ~80% of the site.** Ink on canvas is the resting state.
- The accent is never used as a small button colour or a link colour. It is used as a
  **full-bleed section background** — an entire panel, or the entire footer, flooded in
  it, with canvas-coloured text on top. This is the site's one loud move; it lands
  because everything around it is quiet.
- `--accent-deep` is the background for stat panels; the *lighter* accent sits on top of
  it as oversized numerals. Light-on-dark, same hue family.
- `--pop` appears at most once per page (one panel in the horizontal scroller).
- Set a custom text selection colour: `::selection { background: var(--accent-deep);
  color: var(--canvas); }`. Small detail, disproportionate effect.

Also implement a **light/dark theme toggle**:

- Drive it from `body[data-theme="light"|"dark"]` and three variables:
  `--theme-bg`, `--theme-text`, `--theme-border`.
- Individual sections may carry their own `data-theme` to invert locally mid-page.
- Transition `color` and `background-color` on `body` over `0.3s cubic-bezier(0.1, 0, 0.3, 1)`.
- The toggle itself is a text label ("Light" / "Dark") that slides vertically on hover
  (`translateY(150%)` → `translateY(0)`, 400ms ease-out) inside an `overflow: hidden`
  wrapper. Not an icon. Not a switch.

### 3. Typography — the most important section

Use **one** geometric-grotesque sans for everything. No serif, no display face, no
second family. Switzer, General Sans, Neue Haas Grotesk, Söhne, or Inter Tight are all
correct choices. Load exactly three weights: **300, 400, 500**. Never load a bold.

Type scale (desktop):

| Role | Size | Weight | Line height | Letter spacing |
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

Three non-obvious rules that carry the whole look:

1. **H2 is LIGHTER than H1 (300, not 500).** Big section headlines are set in Light.
   This is the single highest-leverage detail in the system. A 3.75rem headline at
   weight 300 with `-0.03em` tracking is what makes the site read as editorial rather
   than corporate. Do not "fix" this to a bolder weight.
2. **Tight negative tracking (`-0.03em`) on every heading.** Never on body text.
3. **Headlines end in a full stop.** "Power with Purpose." "Get in Touch." "News." The
   period is doing real tonal work — it makes a statement feel finished rather than
   promotional.

Headlines are short — 2 to 6 words. Never a headline that wraps past two lines.

### 4. Layout and grid

- Max content width `120rem`.
- **Gutters and horizontal page padding are `0.65rem`.** This is deliberate and it is
  the second-highest-leverage decision here. Cards and media sit almost flush to the
  viewport edge — the page reads as full-bleed, not as a centred column in a container.
  Do not "correct" this to a comfortable 24px or a Bootstrap container.
- Vertical section padding: `7rem` default, `5rem` tight, `10rem` generous. Expose these
  as `data-padding-top` / `data-padding-bottom` attributes so any section can be tuned
  without new classes.
- Spacing scale in rem: `0.25 · 0.75 · 0.875 · 1 · 1.25 · 1.5 · 1.875 · 2 · 2.5 · 3 ·
  3.75 · 4 · 5 · 6 · 7 · 8 · 10 · 12 · 16`.

**The signature layout move — asymmetric right-weighted content:**

Split the page into 12 columns. Put a small eyebrow label (H6, e.g. "What We Do",
"About Us", "01") in the **far-left column**, then leave columns 2–5 completely
empty, and start the headline and body copy at **column 6**, running to the right edge.

The result: a wide vertical channel of empty canvas down the left third of the page,
with all content stacked in the right two-thirds. Use this for the majority of content
sections. It is the layout fingerprint of the site.

**Hairline rules:** separate stacked list rows with a **1px dotted** rule in the ink
colour at low opacity. Dotted, not solid. Borders elsewhere are `1.5px` solid — and SVG
icon strokes are also `1.5px`, so icons and borders share a visual weight.

### 5. Shape language — cut corners

Two shapes only, used consistently:

**(a) The chamfer / cut corner — the signature.** Media and panels are clipped to an
octagon with bevelled corners, not rounded ones:

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

Use a `vw` bevel so the cut scales with the viewport. Apply it to hero video, image
cards, feature panels, and the horizontal-scroll cards. Variants that bevel only the
bottom two corners, or only the top two, are correct and add rhythm.

**(b) The very large pill radius — `4.375rem`.** Used for stat cards, the newsletter
input, and buttons. This is a *huge* radius; at typical card sizes it reads as a lozenge.
Buttons use `border-radius: 100vw` (full pill) with a `1.5px` outline, transparent fill,
and a right-pointing arrow after the label.

Never mix the two on the same element. Chamfer = media and content panels. Pill =
interactive elements and stat blocks.

### 6. Motion system

This is not decoration — the motion *is* the product. Use **GSAP** with `ScrollTrigger`
and `SplitText`, plus **Lenis** for smooth scroll. Hide native scrollbars entirely
(`scrollbar-width: none` and `::-webkit-scrollbar { display: none }`).

**Define one house easing curve and reuse it everywhere:**

```js
CustomEase.create("primary-ease", "M0,0 C0.15,0 0.15,1 1,1");
```

That curve is: fast departure, long luxurious glide to rest. Every menu, popup, and
reveal uses it. Reusing a single curve across the whole site is what makes the motion
feel authored rather than assembled. Scrubbed scroll animations use `ease: "none"`;
entrance reveals use `expo.out`.

Implement these behaviours, as attribute-driven utilities so any element can opt in:

| Behaviour | Implementation |
|---|---|
| **Preloader** | A counter ticking `000` → `099`, zero-padded to 3 digits, over ~2s on a custom slow-in/fast-out ease. Then the preloader panel slides up (`yPercent: -110`) while the page content rises from `y: 100vh`. First visit only — gate on `sessionStorage`. |
| **Page reveal** | Content enters from `y: 100vh` with `scaleX: 0.9 → 1`, *and* a `clip-path` whose top corners are bevelled `5rem` and open to `0` as it settles. The chamfer literally animates open. `power1.inOut`. |
| **Page transitions** | SPA-style transitions (Barba.js or equivalent). Old page leaves, new page enters with the same rise-and-unbevel reveal. Re-run scroll setup after each transition. |
| **Line reveal** | Split headings into lines. Animate each line `yPercent: 100 → 0` **behind a `clip-path` wipe**, `stagger: 0.1`, `expo.out`. The mask is essential — lines slide up out of nothing, not up from visible overflow. |
| **Word fade** | Long paragraphs: split to words, animate `opacity: 0.1 → 1`, `stagger: 0.05`, **scrubbed** to scroll. Text illuminates as you read down it. |
| **Section grow** | Sections start inset with `5rem` of side padding and scrub to `0` as they enter — panels *widen into full bleed* as you scroll. Cheap to implement, disproportionately premium. |
| **Media un-zoom** | On scroll, a media frame animates `width: 50% → 100%` while the image inside animates `width: 150% → 100%`. The frame opens while the image settles — a counter-scroll that feels physical. |
| **Parallax** | `yPercent: 0 → -100`, scrubbed, desktop only (`min-width: 992px`). |
| **Magnetic buttons** | On `pointermove`, translate the button toward the cursor at `0.2` strength, clamped to `30px`, `0.2s power2.out`. On leave, return over `0.5s` `sine`. |
| **Nav** | Hides on scroll down (`yPercent: -110`, `0.4s sine.inOut`), returns on scroll up. After 400px, add a `scrolled` state that gives the nav bar a solid canvas-coloured pill background over `300ms`. |
| **Menu overlay** | Full-screen. Background fades; panels slide `yPercent: -100`; links enter `yPercent: 50` + fade with `0.075` stagger; divider rules grow `width: 0% → 100%` with the same stagger. Escape closes it. Lock scroll while open. |
| **Horizontal scroll** | One pinned section: set its height to `trackWidth + 100vh`, then scrub the track `xPercent: 0 → -100`. Cards are alternating full-bleed colour panels and chamfered photos. Each card's big number animates in with `rotationX: -90 → 0`, `yPercent: 50 → 0`, `1.2s circ.out`, `0.1` stagger per character. |
| **Link underline** | A `::after` hairline (`0.065rem`) that scales `scaleX: 0 → 1` from `transform-origin: right` on hover and *out to the left* on leave. `0.3s ease`. |
| **List hover** | In a list of rows, hovering one row fades the *others* down and reveals a small chamfered thumbnail beside the hovered label. Image scales `1.05` over `650ms ease-out`. |
| **Footer reveal** | Footer rises `y: 10rem → 0` over `1.4s expo.out`. The wordmark's SVG letter paths stagger in at `0.05`. |
| **Icons** | Small Lottie animations that play on hover (desktop) / tap (mobile), sitting still otherwise. |

Respect `prefers-reduced-motion`: disable scrub, parallax, magnetic buttons, and the
preloader; keep opacity fades only.

### 7. Content architecture

Home page section order:

1. **Full-bleed hero video**, darkened with an overlay, with the promise line set in
   the Display size at the **bottom-left** — not centred. A "Scroll to discover more"
   label and a thin down-arrow sit bottom-right.
2. **Intro** — eyebrow far-left, `3.75rem` weight-300 headline and one paragraph at
   column 6+, a chamfered image, and one pill button.
3. **"What We Do"** — 3–5 rows separated by dotted rules. Each row is a large heading
   in the right columns that reveals a thumbnail on hover.
4. **Horizontal scroll section** — 4–6 full-height cards: alternating flooded colour
   panels carrying a huge proof number and chamfered photographs.
5. **Process / How it works** — numbered steps with a scroll-linked progress indicator.
6. **Video or featured moment** — a chamfered panel with a circular outlined "Watch"
   button at its centre.
7. **News / insights** — a small grid, becoming a swipeable carousel under 992px.
8. **Footer** — see below.

**The footer is a full-bleed accent-coloured block** carrying: the numbered columns
`01 Get in Touch` / `02 News`, a physical address set on individual lines, a pill
newsletter input with an arrow submit, legal links, and an oversized wordmark whose
letters stagger in. This is where the loud colour lives.

Other pages follow the same grammar: an eyebrow, a light oversized headline, a wide
empty left channel, dotted-rule lists, and chamfered media.

### 8. Voice and copy

- Headlines: 2–6 words, ending in a full stop.
- Body: plain declarative sentences. No "revolutionary", no "seamless", no
  "cutting-edge", no exclamation marks.
- Lead with numbers and scale. Specific figures set in the Display size, with the unit
  as a smaller line beneath, are the primary proof device.
- Section labels are literal: "What We Do", "About Us", "Our Team", "Get in Touch".

### 9. Technical requirements

- Fully responsive; the 992px breakpoint is the desktop/mobile boundary. Below it:
  disable parallax and magnetic buttons, convert grids to swipeable carousels, and
  reduce the chamfer bevel.
- Semantic HTML — real `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, one `<h1>`
  per page.
- Self-host the webfont as `woff2`, three weights only. Preload the 400 weight.
- Lazy-load below-the-fold media; the hero video is `preload="auto"`, muted, looping,
  `playsinline`, with a poster frame.
- Keyboard accessible: visible focus states, Escape closes the menu, the video popup
  traps focus.
- Verify text contrast against the canvas — a warm off-white background and a soft ink
  can fall under 4.5:1 if the ink is lightened too far. Test it rather than assuming.

---

*(end of master prompt)*

---

## BLOCK 3 — Variation levers

If the output feels like a clone, or feels wrong, turn these. Levers 1–4 change the
*brand*; levers 5–8 change the *system*. Turning 1–4 gives you a different-looking site
that still has the quality. Turning 5–8 gives you a genuinely different system.

**1. Canvas.** Anthem uses cream (`#fcf7e3`). Swap the canvas and the whole site changes
identity while keeping its manners: warm grey `#e8e6e1`, cold paper `#f4f4f2`, oat
`#efe9dd`, bone `#f2ede4`, or invert to charcoal `#16161a` with cream text.

**2. Accent.** Anthem uses sky blue (`#3abff4`) plus acid yellow (`#e3e300`) and deep
navy (`#004d81`). Any single loud hue works — as long as it is used at full-bleed panel
scale and nowhere else. Terracotta, signal orange, forest green, ultramarine.

**3. Typeface.** Any geometric grotesque with a good 300 weight. The weight-300 H2 is
the requirement; the specific face is not.

**4. Shape.** Replace the chamfer with a different consistent cut: a single corner
notch, one rounded and three square corners, a top-edge arch, or a hard 0px radius with
a 1.5px outline. Keep it to *one* shape used everywhere.

**5. Layout mirror.** Anthem pushes content right and leaves the left empty. Mirror it —
content left, empty right — and the site reads noticeably differently while keeping the
asymmetry that makes it work.

**6. Gutter.** The `0.65rem` gutter is what creates the full-bleed feel. Widen it to
`2rem` and you get a calmer, more classical editorial site; the motion system still
works. This is the biggest single change you can make.

**7. Hero.** Swap the full-bleed video for one of: a single oversized chamfered still,
a typographic-only hero on flat colour, or a slow horizontal image marquee.

**8. Motion budget.** The full list in §6 is a lot. A credible reduced set is:
house easing curve + line reveal + section grow + magnetic buttons + footer reveal.
That's five behaviours and it gets ~80% of the feel at ~30% of the build.

---

## Quick reference — Anthem's actual values

Use these when you want to match rather than vary. Full evidence in the teardown doc.

```
Canvas          #fcf7e3     Ink            #10100f
Accent          #3abff4     Accent deep    #004d81
Pop (yellow)    #e3e300     Pop (orange)   #ef4b00
Green           #2e5d24     Red            #921b1b     Brown  #533615

Font            Switzer — 300 / 400 / 500
Max width       120rem      Gutter         0.65rem
Radius          4.375rem (main) · 3.75rem (small) · 100vw (pill)
Border          1.5px (also SVG stroke width)
Section pad     7rem default · 5rem small · 10rem large
Chamfer         2.8vw bevel
House ease      M0,0 C0.15,0 0.15,1 1,1

Stack           GSAP 3.13 (ScrollTrigger · SplitText · CustomEase · Observer)
                Lenis 1.3.11 · Barba.js · Swiper 11 · Plyr 3.7.8 · Lottie · jQuery
```

---

## What NOT to reproduce

Legally and practically, take the *system*, not the *content*:

- Do not reuse Anthem's copy, headlines, photography, logo, or the Lottie/SVG assets.
- Do not reuse the exact palette **and** the exact type scale **and** the cream canvas
  together for a competitor in renewable energy or African infrastructure — that
  combination is their trade dress in their sector. In an unrelated sector it's fine.
- Do not point at their CDN. Self-host everything.
- The layout grammar, the motion patterns, the easing curve, and the shape language are
  not protectable and are yours to use. Anthem itself is built on widely-used Webflow
  and GSAP conventions.

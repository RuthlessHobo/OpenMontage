# Reference build

A working single-file implementation of
[`../ANTHEM_STYLE_WEBSITE_PROMPT.md`](../ANTHEM_STYLE_WEBSITE_PROMPT.md), built for a
**different brand in a different sector** — "Northwind", a Nordic freight operator.

Its job is to prove the prompt produces the Anthem *quality* without producing an Anthem
*clone*. Open `index.html` in a browser; no build step, no dependencies to install.

It was generated from the spec alone — using the fill-in brief in Block 1 and Variation
Levers 1 and 2 (warm grey canvas instead of cream, signal orange accent instead of sky
blue). Every section of the CSS is commented with the prompt section it implements.

## What it demonstrates

**Layout and shape** — 0.65rem gutters, right-weighted asymmetric grid with the eyebrow
stranded far-left, 2.8vw chamfered media, 4.375rem pill radius, 1.5px borders, dotted
hairline rules, weight-300 H2 above weight-500 H1.

**Motion** — the `primary-ease` house curve, Lenis driven by the GSAP ticker, the
000→099 preloader, the page reveal where the chamfer animates open, masked line reveals,
scrubbed word-by-word illumination, `grow-in-view`, media un-zoom, pinned horizontal
scroll with 3D numeral entry, magnetic buttons, hide-on-scroll nav, and the footer rise.

**Theme** — `data-theme` light/dark toggle with the vertical-slide text label.

## Deliberate differences from Anthem

- **Reduced-motion support.** Anthem ships none; the spec requires it, so this honours
  `prefers-reduced-motion` by disabling the preloader, scrub, parallax and magnetics.
- **No lazy-loading strip.** Anthem forces `loading="auto"` on every image; this doesn't.
- **`navigator.clipboard`-era APIs only** — no `document.execCommand`.

## Known limitations

- **Photography is stand-in CSS gradients.** This demonstrates layout, shape and motion,
  not art direction. Real chamfered photography is a large part of Anthem's effect.
- **SplitText is a paid GSAP plugin**, so the file ships a ~40-line stand-in that
  produces the same `.s-line` / `.s-word` / `.s-char` hooks. With a GSAP licence, delete
  `splitLines()` and use the real plugin.
- **Type is Inter Tight from Google Fonts** rather than self-hosted Switzer. The prompt
  calls for self-hosting three woff2 weights; this uses a CDN link for portability.
- The horizontal-scroll section sets its own height from track width, so it needs a
  `ScrollTrigger.refresh()` if you inject cards after load.

## Verified

Rendered headless at 1440×900 and scrolled end to end: no JS errors, all scroll triggers
fire, horizontal pin and footer reveal behave. Three bugs were found and fixed during
that pass — faded text deriving from the theme token instead of `currentColor` (illegible
over the dark hero), nav text unreadable at scroll 0 over the hero panel, and
`grow-in-view` scrubbing padding to `0` and clipping the left-hand eyebrow off the
viewport. All three are the kind of thing this system invites; watch for them in any
build from this spec.

# anthem.co.za — Technical Teardown

Evidence backing [`ANTHEM_STYLE_WEBSITE_PROMPT.md`](ANTHEM_STYLE_WEBSITE_PROMPT.md).
Everything here was extracted from the live site on **2026-08-03** (site last published
2026-06-12). All values are quoted from the shipped CSS/JS, not inferred from
screenshots.

Pages analysed: `/`, `/our-story`, `/our-projects`, `/our-team`, `/careers`,
`/contact`, `/news`.

---

## 1. Stack

Built on **Webflow**, with a substantial hand-written JavaScript layer on top
(~62KB, served as a `.txt` from the Webflow CDN — a common Webflow pattern for
bypassing the built-in custom-code size limit).

| Library | Version | Role |
|---|---|---|
| GSAP | 3.13.0 | Entire motion system |
| ├ ScrollTrigger | 3.13.0 | Every scroll-linked effect |
| ├ SplitText | 3.13.0 | Char/word/line text splitting |
| ├ CustomEase | 3.13.0 | The two house easing curves |
| └ Observer | 3.13.0 | Loaded; used for input handling |
| Lenis | 1.3.11 | Smooth scroll, driven by the GSAP ticker |
| Barba.js | — | SPA-style page transitions |
| Swiper | 11 | Mobile carousels |
| Plyr | 3.7.8 | Video player with fully custom controls |
| Lottie (bodymovin) | — | Hover-triggered icon animations |
| jQuery | 3.5.1 | DOM plumbing (Webflow dependency) |
| Cloudflare Turnstile | — | Form spam protection |
| Google Tag Manager | `GTM-MV3DWPCM` | Analytics |

Assets:

```
Stylesheet   cdn.prod.website-files.com/…/css/anthem-staging.shared.41fbcdab7.css   (142 KB)
Custom CSS   g92r6y.csb.app/styles.css                                              (16 KB, CodeSandbox)
Custom JS    cdn.prod.website-files.com/…/698b2ee55bcd4ec8438295f8_scripts-p2.txt   (62 KB)
Font         Switzer — Light 300 / Regular 400 / Medium 500, woff2, self-hosted
```

Note the custom CSS is served from a **CodeSandbox URL** (`g92r6y.csb.app`) in
production. That's a live single point of failure on a third-party dev sandbox — worth
avoiding in any rebuild.

---

## 2. Design tokens

### Colour swatches

```css
--swatch--light:          #fcf7e3   /* cream — the primary canvas */
--swatch--dark:           #10100f   /* warm near-black — default ink */
--swatch--brand:          #3abff4   /* sky blue — full-bleed footer/contact */
--swatch--dark-blue:      #004d81   /* deep navy — stat panels, ::selection */
--swatch--yellow:         #e3e300   /* acid yellow — one horizontal-scroll panel */
--swatch--orange:         #ef4b00
--swatch--green:          #2e5d24
--swatch--red:            #921b1b
--swatch--brown:          #533615
--swatch--light-secondary: white
--swatch--dark-secondary:  black
--swatch--transparent:    #fff0
```

The palette is wide but the *usage* is narrow: cream and near-black carry ~80% of the
site, sky blue floods the contact/footer block, and navy + acid yellow appear only as
horizontal-scroll panels. Orange/green/red/brown are map-pin and category colours on
`/our-projects`, not layout colours.

### Theme system

```css
--theme--background   --theme--text   --theme--border
```

Switched by `body[data-theme="light"|"dark"]`; individual sections carry their own
`data-theme` to invert locally (8 × `dark`, 4 × `light`, 3 × `invert` on the homepage).

```css
body {
  transition: color 0.3s cubic-bezier(0.1, 0, 0.3, 1),
              background-color 0.3s cubic-bezier(0.1, 0, 0.3, 1);
}
[data-theme="dark"] .nav-wrap.scrolled .nav-container { background-color: var(--swatch--light); }
[data-theme="dark"] .outlined-icon { filter: invert(1); }
```

Faded text is derived, not a separate token:

```css
.u-color-faded { color: color-mix(in srgb, var(--theme--text) 60%, transparent); }
```

### Typography

`--font--primary-family: Switzer, sans-serif` — three weights, no bold anywhere.

| Token | Size | Weight | Line height | Tracking |
|---|---|---|---|---|
| `--display--` / `--h1--` | `5rem` | 500 | `1.1em` | `-0.03em` |
| `--h2--` | `3.75rem` | **300** | `1.1em` | `-0.03em` |
| `--h3--` | `3rem` | 500 | `1.1em` | `-0.03em` |
| `--h4--` | `1.875rem` | 500 | `1.3em` | `0` |
| `--h5--` | `1.5rem` | 500 | `1.3em` | `0` |
| `--h6--` | `1rem` | 500 | `1.3em` | `0` |
| `--text-large--` | `1.25rem` | 400 | `1.3em` | `0` |
| `--text-main--` | `1rem` | 400 | `1.5em` | `0` |
| `--text-small--` | `0.875rem` | 400 | `1.5em` | `0` |

**The H2-at-300 inversion is the defining typographic decision** — section headlines are
set lighter than the page title. Combined with `-0.03em` tracking at 3.75rem, this is
what produces the editorial rather than corporate read.

### Spacing, sizing, shape

```css
--max-width--main:          120rem
--grid-gap--main:           .65rem      /* also --padding-horizontal--main */
--padding-vertical--main:   7rem
--padding-vertical--small:  5rem
--padding-vertical--large:  10rem
--space--extra-small: .875rem  --space--small: 1.5rem
--space--medium: 2.5rem        --space--large: 4rem

--radius--main:   4.375rem    /* 70px */
--radius--small:  3.75rem     /* 60px */
--radius--round:  100vw
--border-width--main:     1.5px
--svg-stroke-width--main: 1.5px
```

Size scale (rem): `0 · .125 · .25 · .75 · .875 · 1 · 1.25 · 1.5 · 1.875 · 2 · 2.5 · 3 ·
3.75 · 4 · 4.5 · 5 · 5.5 · 6 · 6.25 · 6.5 · 7 · 7.5 · 8 · 8.5 · 9 · 9.5 · 10 · 12 · 13 ·
14 · 15 · 16`.

The **`0.65rem` gutter** is the layout's most consequential number — it puts cards and
media within ~10px of the viewport edge, which is why the site reads as full-bleed
rather than as a contained column.

Sections expose padding as attributes (`data-padding-top="main|small|large|none"`), so
rhythm is tuned per-section without new classes.

---

## 3. The chamfer

The signature shape. From the custom CSS:

```css
[trim-bot] {
  clip-path: polygon(
    0% 0%, 100% 0%,
    100% calc(100% - 2.8vw),
    calc(100% - 2.8vw) 100%,
    2.8vw 100%,
    0% calc(100% - 2.8vw)
  );
}
```

This variant bevels the **bottom two corners**; other variants in the CSS bevel the top
pair or all four. The bevel is sized in `vw`, so it scales with the viewport.

Applied to hero video, image cards, horizontal-scroll panels, team thumbnails, and
feature media. Stat cards and buttons instead use `--radius--main` (4.375rem) or a full
`100vw` pill — the two shapes are never mixed on one element.

Global chrome removal:

```css
* { scrollbar-width: none; }
::-webkit-scrollbar { display: none; }
::selection { background-color: var(--swatch--dark-blue); color: var(--swatch--light); }
```

---

## 4. Motion system

### Easing — the house curves

```js
CustomEase.create("primary-ease", "M0,0 C0.15,0 0.15,1 1,1");
CustomEase.create("loaderEase",
  "M0,0,C0,0,0.13,0.34,0.238,0.442,0.305,0.506,0.322,0.514,0.396,0.54,0.478,0.568," +
  "0.468,0.56,0.522,0.584,0.572,0.606,0.61,0.719,0.714,0.826,0.798,0.912,1,1,1,1");
```

`primary-ease` is a fast-out / long-glide curve reused across **every** menu, popup, and
reveal. That single-curve discipline is a large part of why the motion feels authored.
Scrubbed animations use `ease: "none"`; entrance reveals use `expo.out`.

### Smooth scroll

```js
const lenis = new Lenis({
  syncTouch: true,
  syncTouchLerp: 0.075,
  touchInertiaExponent: 1.7,
  touchMultiplier: 1,
});
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

Note the deliberate wiring: Lenis is driven by the GSAP ticker (not its own RAF) and
`lagSmoothing(0)` prevents GSAP from skipping frames — standard for keeping scrubbed
animations locked to scroll position.

### Text splitting

```js
splitText = new SplitText("[charsplit]", {
  type: "chars, words, lines",
  linesClass: "s-line", wordsClass: "s-word", charsClass: "s-char",
});
```

Re-split on width change only (not height), to avoid mobile URL-bar thrash:

```js
let windowWidth = $(window).innerWidth();
window.addEventListener("resize", function () {
  if (windowWidth !== $(window).innerWidth()) {
    windowWidth = $(window).innerWidth();
    splitText.revert();
    runSplit();
  }
});
```

Rendering hints for split text:

```css
[charsplit] {
  font-kerning: none;
  text-rendering: optimizeSpeed;
  transform: translateZ(0);
}
```

### Attribute-driven effect catalogue

Every effect is opt-in via an HTML attribute, which is why the system scales across
pages.

| Attribute | Effect |
|---|---|
| `[charsplit]` | Marks text for SplitText |
| `[h-scroll-anim]` | Line reveal on scroll: `yPercent 100→0` + `clip-path` wipe, stagger `0.1`, `primary-ease`, `1s` |
| `.text-reveal` | Word-by-word `opacity 0.1→1`, stagger `0.05`, **scrubbed** (`scrub: 1`) |
| `[s-fade]` | `opacity 0→1`, `0.6s`, `sine.in`, from `top 80%` |
| `[grow-in-view]` | Section `padding-inline: 5rem → 0`, scrubbed `clamp(top bottom)` → `clamp(top center)` |
| `[data-scroll-scale]` | Frame `width 50%→100%` while inner visual `width 150%→100%` |
| `[text-scroll-scale]` | Inline thumbnail `width 2%→20%` + `margin-right 0→20px`; heading `opacity→1` `power4.in`; desktop only |
| `[data-parallax-shift]` | `yPercent 0→-100`, scrubbed, `min-width: 992px` only |
| `[b-magnet]` | Magnetic hover (see below) |
| `[hover-shuffle-component]` | Stacked images with incrementing `z-index` on hover |
| `[lottie-holder]` / `[lottie-element]` | Lottie plays on hover (desktop) / tap (mobile) |
| `[slider-section]` | Swiper, initialised **only** under `max-width: 991px` |
| `[count-items=wrap/item/total]` | Auto-counts children, zero-pads to 2 digits |
| `[year]` | Injects current year |
| `[pload-swipe]` / `[pload-home_swipe]` / `[pload-lines]` / `[pload-fade]` | Page-load reveal roles |

Magnetic buttons:

```js
const strength = parseFloat(magnet.data("magnet-strength")) || 0.2;
const max      = parseFloat(magnet.data("magnet-max")) || 30;
// pointermove:
const tx = Math.max(-max, Math.min(max, dx * strength));
gsap.to(el, { x: tx, y: ty, duration: 0.2, ease: "power2.out", overwrite: "auto" });
// pointerleave:
gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "sine", overwrite: "auto" });
```

The rect is cached and only recomputed on `resize` and `pointerenter` — avoids layout
thrash on every mouse move.

### Preloader

```js
let preloaderDuration = 2;
pageReloadTl.to(counter, { value: 99, onUpdate: updateLoaderText,
                           duration: preloaderDuration, ease: "loaderEase" });
pageReloadTl.to(".preloader-layout", { opacity: 0, duration: 0.6, ease: "primary-ease" });
pageReloadTl.to(".preloader",        { yPercent: -110, duration: 0.8, ease: "primary-ease" });
```

with `$(".progress-number").text(String(Math.round(counter.value)).padStart(3, "0"))` —
so it reads `000` → `099`, never reaching 100.

First-visit gating exists in the HTML but is **currently commented out**:

```js
// if (!sessionStorage.getItem('visited')) {
//   document.body.classList.add('show-preloader');
//   sessionStorage.setItem('visited', 'true');
// }
```

### The page reveal — the chamfer animates open

This is the most distinctive single animation on the site. Page content rises from
offscreen while its bevelled corners flatten out:

```js
enterTl.fromTo($(container).find(".page-content"),
  { y: "100vh" }, { y: "0vh" });

enterTl.fromTo($(container).find(".page-content"),
  { scaleX: 0.9,
    clipPath: "polygon(5rem 0%, calc(100% - 5rem) 0%, 100% 5rem, 100% 100%, " +
              "100% 100%, 0% 100%, 0% 100%, 0% 5rem)" },
  { scaleX: 1,
    clipPath: "polygon(0rem 0%, calc(100% - 0rem) 0%, 100% 0rem, 100% 100%, " +
              "100% 100%, 0% 100%, 0% 100%, 0% 0rem)",
    ease: "power1.inOut", clearProps: "all" },
  "<");
```

The hero video gets `scale: 0.5, yPercent: 100 → 0` with `power2.out`, its overlay fades
to `opacity: 0.6`, and the nav drops in on `expo.out`.

Load-time line reveal:

```js
enterTl.fromTo($(container).find("[pload-lines] .s-line"),
  { yPercent: 100, clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)" },
  { yPercent: 0,   clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    ease: "expo.out", stagger: 0.1 }, "<");
```

### Page transitions (Barba)

```js
barba.init({
  preventRunning: true,
  timeout: 50000,
  views: [
    { namespace: "homepage", afterEnter() { globalFunctions(); homeScripts();     scrollFire(); } },
    { namespace: "impact",   afterEnter() { globalFunctions(); mapScripts();      scrollFire(); } },
    { namespace: "team",     afterEnter() { globalFunctions(); teamScripts(); accordionScripts(); scrollFire(); } },
    { namespace: "story",    afterEnter() { globalFunctions(); storyScripts();    scrollFire(); } },
    { namespace: "careers",  afterEnter() { globalFunctions(); accordionScripts(); scrollFire(); } },
    { namespace: "news",     afterEnter() { globalFunctions(); newsScripts();     scrollFire(); } },
    { namespace: "contact",  afterEnter() { globalFunctions();                    scrollFire(); } },
  ],
});

function scrollFire() { lenis.resize(); ScrollTrigger.refresh(); }
barba.hooks.beforeLeave(() => { lenis.stop(); lenis.direction = -1; });
barba.hooks.after((data) => {
  $(data.next.container).removeClass("fixed");
  $(window).scrollTop(0);
  lenis.start();
  resetWebflow(data);          // re-arms Webflow's own IX engine after a swap
});
```

`resetWebflow()` is the standard Webflow+Barba fix — without it Webflow interactions die
after the first transition.

### Navigation

```js
// hide on scroll down, reveal on scroll up
lenis.on("scroll", ({ direction }) => {
  if (direction === 1) menuHide.play();
  else if (direction === -1 && !isAnimatingScroll) menuHide.reverse();
});
menuHide.fromTo(".nav-wrap", { yPercent: 0 },
                { yPercent: -110, duration: 0.4, ease: "sine.inOut" });

// solid pill background after 400px
ScrollTrigger.create({
  trigger: $(".page_main"), start: "top top", end: "+400px",
  onLeave:     () => $(".nav-wrap").addClass("scrolled"),
  onEnterBack: () => $(".nav-wrap").removeClass("scrolled"),
});
```

Menu overlay (`menuDuration = 0.4`, all on `primary-ease`): background fades, panels
`yPercent: -100`, links `yPercent: 50` + `opacity 0` with `stagger: { each: 0.075 }`,
divider rules `width: 0% → 100%` over `menuDuration * 1.5` with the same stagger, fade
items at `"<50%"`. Escape closes; `lenis.stop()` locks scroll while open.

Hover underline:

```css
[h-underline="target"]:after {
  content: ""; position: absolute;
  height: 0.065rem; width: 100%; background: currentColor;
  top: 100%; left: 0;
  transform: scaleX(0); transform-origin: right;
  transition: transform 0.3s ease;
}
.nav-link.w--current [h-underline="target"]:after {
  transform: scaleX(1); transform-origin: left;
}
```

Origin flips between `right` (out) and `left` (in), so the rule wipes through rather
than growing from a fixed end.

### Horizontal scroll section

```js
wrap.css("height", "calc(" + track.outerWidth() + "px + 100vh)");
gsap.timeline({ scrollTrigger: { trigger: wrap, start: "top top",
                                 end: "bottom bottom", scrub: true },
                defaults: { ease: "none" } })
    .to(track, { xPercent: -100 });
```

Per-card numerals animate in 3D:

```js
firstCard.fromTo(firstNumChars,
  { opacity: 0, rotationX: -90, yPercent: 50 },
  { opacity: 1, rotationX: 0,  yPercent: 0,
    duration: 1.2, ease: "circ.out", stagger: { each: 0.1 } });
```

### Footer

```js
footerTl1.fromTo(footerEl,       { y: "10rem" }, { y: "0rem", duration: 1.4, ease: "expo.out" });
footerTl2.fromTo(footerLogoChars, { y: "10rem" }, { y: "0rem", duration: 1.4,
                                                   stagger: 0.05, ease: "expo.out" });
```

The wordmark is an inline SVG; `footerLogoChars` are its `<path>` elements, staggered
individually. Mobile uses `y: "13rem"` and a different trigger window.

### Video

Plyr with entirely custom markup — text labels ("Play" / "Pause" / "Sound On" /
"Sound Off") instead of icons, and only a seek bar, play toggle, current time, and mute:

```js
let player = new Plyr(el, { controls, resetOnEnd: true });
// open: videoPopupTl.timeScale(1).restart(); player.play();
// close: videoPopupTl.timeScale(2).reverse();  ← closes at 2× speed
```

`lenis.stop()` on open, `lenis.start()` on reverse-complete; the nav is pushed out with
a dedicated `menuVideoHide` timeline. Closing at double speed is a good detail — exits
should be faster than entrances.

### Component micro-interactions

```css
.team-img_holder .team-img { transform: scale(1.05); transition: all 650ms ease-out; }
.team-excerpt { opacity: 0; transition: all 450ms cubic-bezier(0.15, 0, 0.85, 1); }
.team-item:hover .team-cursor { opacity: 1; }
.careers-wrap .team-item:hover + .team-item .h-line_el { opacity: 0; }
.close-svg rect { height: 0; transition: height 400ms ease-out; }
.down-svg  rect { transition: height 400ms ease-out; transition-delay: 400ms; }
```

The `:hover + .team-item .h-line_el { opacity: 0 }` rule hides the divider *below* a
hovered row — a small touch that makes hovered rows feel like they lift off the list.

Accordion icons morph by animating SVG `rect` heights with offset delays rather than
swapping icons.

---

## 5. Layout patterns observed

**Right-weighted asymmetry.** The recurring homepage structure:

```html
<div class="section" data-padding-top="main" data-padding-bottom="main">
  <div class="section-layout u-grid-custom">
    <div class="section-eyebrow u-column-5">What We Do</div>
    <!-- headline + body start around column 6, run to the right edge -->
  </div>
</div>
```

Eyebrow far-left, then a wide empty channel, then all content in the right two-thirds.

**Page skeleton:**

```
.page_wrap
├── .page_code_wrap
├── .preloader
├── nav.nav-wrap → .nav-container · .menu-popup · .menu-contain
└── main.page_main
    ├── header.home-hero_component  (full-bleed video + bottom-left headline)
    ├── .section (intro: eyebrow left / heading + copy right + chamfered media)
    ├── section.scroll_horizontal_wrap  (pinned, .scroll_horizontal_track)
    ├── .section.hiw-section  (numbered process + .hiw-progress_wrap)
    ├── .section (video / magnet CTA)
    ├── .section (news grid → Swiper under 992px)
    └── footer.footer  (full-bleed brand blue)
```

**Outlined-card technique** — an absolutely-positioned background at
`var(--theme--text)` with a foreground inset by 1px at `var(--theme--background)`,
producing a hairline outline that can be revealed on hover by fading the foreground:

```css
.outline-bg   { background-color: var(--theme--text);       position: absolute; inset: 0; }
.outlined-fg  { background-color: var(--theme--background); width: calc(100% - 1px);
                height: calc(100% - 1px); position: absolute; }
```

**Breakpoint policy.** `992px` is the single meaningful boundary, enforced via
`gsap.matchMedia()`. Below it: parallax off, `text-scroll-scale` off, magnetic buttons
effectively inert, grids become Swiper carousels, footer animation retimed.

---

## 6. Observations worth carrying forward

Things this site does that are genuinely well-judged:

1. **One easing curve everywhere.** `primary-ease` on every menu, popup, and reveal. The
   cheapest possible way to make a site's motion feel like one authored system.
2. **Attribute-driven effects.** Every animation is opt-in via an HTML attribute, so
   new pages get the motion system for free without touching JS.
3. **Weight-300 H2.** The one typographic decision doing the most work.
4. **`0.65rem` gutters.** Turns a normal grid into a full-bleed editorial layout.
5. **Exits faster than entrances.** `timeScale(2)` on close.
6. **`lagSmoothing(0)` + ticker-driven Lenis.** Correct wiring for scrubbed animation.
7. **Split re-run on width change only.** Avoids mobile URL-bar resize thrash.
8. **Cached `getBoundingClientRect`** in the magnetic-button handler.

And things to fix rather than copy:

1. **Custom CSS served from a CodeSandbox URL** (`g92r6y.csb.app`) in production — a
   third-party dev sandbox as a hard dependency of the live site.
2. **`document.execCommand("copy")`** for the share button — deprecated;
   `navigator.clipboard.writeText()` is the current API.
3. **`$("img[loading='lazy']").attr("loading", "auto")`** — actively strips lazy-loading
   from every image on the page, presumably to stop ScrollTrigger measuring the wrong
   heights. Costs real load performance; the correct fix is `ScrollTrigger.refresh()` on
   image load.
4. **jQuery 3.5.1** carried purely as a Webflow dependency.
5. **No `prefers-reduced-motion` handling** anywhere in the custom CSS or JS. With this
   much scrubbed and parallax motion, that's an accessibility gap.
6. **Scrollbars hidden globally** with no keyboard-navigation compensation.
7. **Preloader gating commented out** — the first-visit `sessionStorage` check is
   disabled in the shipped HTML, so the preloader path is effectively dead code.

---

## 7. Reproducing this analysis

The site blocks headless-browser traffic from this environment, so rendering was done
against a local mirror:

```bash
# 1. Pull pages (curl works where the browser is blocked)
for p in "" our-story our-projects our-team careers contact news; do
  curl -sSL -o "${p:-index}.html" "https://www.anthem.co.za/$p"
done

# 2. Pull the CSS/JS
curl -sSL -o main.css    "https://cdn.prod.website-files.com/66ab57cf20213631b7c7803f/css/anthem-staging.shared.41fbcdab7.css"
curl -sSL -o custom.css  "https://g92r6y.csb.app/styles.css"
curl -sSL -o scripts.js  "https://cdn.prod.website-files.com/66ab57cf20213631b7c7803f/698b2ee55bcd4ec8438295f8_scripts-p2.txt"

# 3. Mirror assets, rewrite absolute URLs to local paths, strip SRI
#    (integrity="sha384-…" attributes reject locally-served files — must be removed
#     or the stylesheet silently fails to apply and the page renders unstyled)

# 4. Serve and screenshot
python3 -m http.server 8899
```

Design tokens were read directly out of `main.css` rather than sampled from pixels, so
the values in §2 are exact.

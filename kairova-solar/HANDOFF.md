# Claude Code Handoff — Kairova Solar Demo Website

Give this file to Claude Code alongside the project. It describes what exists, what is
untested, and exactly what "finalise" means.

> Kairova Solar is a FICTIONAL demonstration brand. Keep every demo disclosure intact.

## What this is

A single-page, heavily animated marketing site for a fictional South African solar company.
Stack: React 18, Vite 5, TypeScript (strict), Tailwind CSS 3, GSAP 3 + ScrollTrigger,
Lenis smooth scroll, Lucide icons. Static build only (no SSR, no backend, no API keys).
Targets Cloudflare Pages or Cloudflare Workers static assets.

## Critical context: this code has NEVER been executed

It was authored file-by-file without running `npm install`, `npm run dev`, `tsc`, or a
build. It is written conservatively, but assume there are small compile or runtime errors.
Your first job is to make it run cleanly, not to redesign it.

## Priority task list

1. `npm install` (Node 20 LTS), then `npm run dev` — fix anything that breaks on boot.
2. `npm run typecheck` (`tsc --noEmit`) — fix all TypeScript errors.
3. `npm run build` — confirm `/dist` is produced with zero errors.
4. Fix all browser console errors/warnings.
5. Verify each animated section scrolling DOWN and back UP (scrub reversal must be clean):
   - Hero: pinned scene; sun rises, sky gradient stops brighten, clouds parallax at
     different speeds, panel glow, two SVG energy paths draw (pathLength=1 dash trick),
     battery fill scaleY, windows light up, status chips fade in, headline block recedes.
   - EnergyStory (`#why-solar`): pinned 5-stage sequence; text blocks crossfade while one
     SVG diagram evolves (grid line, sun, panel glow, house windows, battery fill, monitor
     card). Check stage text swap timing does not overlap illegibly.
   - Services (`#solutions`): desktop >=1024px pins and scrolls the card track
     horizontally (x = -(scrollWidth - innerWidth + 96)); below 1024px it's a plain
     vertical stack. Verify no horizontal page overflow in either mode.
   - Estimator/Reviews: section background tweens ink -> ivory on entry (scrubbed).
   - Process: vertical line fill (scaleY scrub) + step dots turning lime.
   - Projects: clip-path inset reveals + inner image counter-scale.
   - WhyKairova: exploded SVG layers (#xPanels #xRails #xInverter #xBattery #xMonitor)
     assemble on scrub.
   - Reviews desktop: cards start gathered (xPercent toward centre, rotated) and separate.
6. Resize the browser across the 767/1023px breakpoints repeatedly — gsap.matchMedia +
   invalidateOnRefresh should handle it; fix any dead pins or wrong end positions.
7. Test reduced motion (DevTools > Rendering > prefers-reduced-motion: reduce):
   Lenis must be off, no pinning, ALL content visible. Hero and EnergyStory have explicit
   reduced branches; spot-check the others don't hide content behind `gsap.from` states.
8. Mobile pass (390px): menu opens/closes (clip-path transition), hero CTA visible fast,
   no horizontal overflow, forms usable, pinned scenes shortened (hero +=120%).
9. Test the estimator (`#estimate`): all inputs update the ranges, numbers animate
   smoothly, gauge arc follows, business/home switch clamps the bill slider.
10. Test the contact form: inline validation on every required field, invalid email/phone
    messages, loading spinner, animated success state, "Send another enquiry" reset.
11. Grep visible copy for em dashes (—) — there must be none. Code comments don't matter.
12. Confirm anchors work with Lenis (`useLenis` intercepts `a[href^="#"]`, -72px offset):
    nav links, both hero CTAs ("Follow the Energy" -> #why-solar), all service/project
    CTAs -> #contact, footer links, "Solar Estimate" -> #estimate.

## Architecture map

```
kairova-solar/
  index.html                 fonts (Bricolage Grotesque display, Instrument Sans body), favicon, meta
  vite.config.ts             plain react plugin, outDir dist
  tailwind.config.js         palette: ink #090B0D, graphite #11171B, ivory #F3F0E8,
                             amber #F5C84C, lime #C9F75A, sky #74BDE8, mist #98A1A6
  wrangler.jsonc             Workers static assets, SPA not_found_handling
  public/_redirects          /* /index.html 200
  public/_headers            security + cache headers
  public/brand/              5 original logo SVGs (full/light/dark/symbol/favicon)
  src/
    main.tsx  App.tsx        section order: Hero, TrustStrip, EnergyStory, Services,
                             Estimator, Process, Projects, WhyKairova, Reviews, Faq, Contact
    animations/gsap.ts       single gsap+ScrollTrigger registration; ALWAYS import from here
    hooks/useLenis.ts        Lenis on gsap ticker; anchor-click smooth scroll; enabled flag
    hooks/usePrefersReducedMotion.ts, useMediaQuery.ts
    data/brand.ts            central config: contact, hours, service areas, nav, trust labels
    data/services.ts projects.ts reviews.ts faq.ts   all copy lives here, marked as demo
    data/images.ts           the ONLY place external image URLs live (Unsplash); every image
                             has an SVG/tint fallback behind it
    utils/estimator.ts       demo maths (R3.50/kWh, 4.8 sun hours), returns illustrative ranges
    utils/submitContact.ts   fake async submit; header comment documents GHL webhook swap
    components/              Navbar (transparent->solid, mobile menu), Footer, TrustStrip,
                             MagneticButton (quickTo pull, fine pointers only), SectionHeading
    sections/                one file per section, each owns its gsap.context + cleanup
    assets/illustrations.tsx 5 original line-art service SVGs
    styles/index.css         Tailwind entry, .container-k, .tag-k, .display-xl/lg/md (clamp)
```

## Conventions to preserve

- All GSAP work inside `gsap.context(..., root)` with `ctx.revert()` cleanup, and
  `gsap.matchMedia()` for breakpoint/motion variants. Never register plugins elsewhere.
- SVG line draws use `pathLength={1}` + strokeDasharray/offset 1 -> 0 (no getTotalLength).
- Copy stays in `src/data/`; animation logic stays in the section files.
- Design rules: no em dashes in copy, no generic solar marketing phrases, amber used
  sparingly, no purple gradients/glassmorphism/identical card grids. Fonts are Bricolage
  Grotesque + Instrument Sans only.
- Keep every "demo/fictional" disclosure: source comments, trust strip note, estimator
  disclaimer, reviews note, project "Demo case study" badges, footer disclosure.

## Known weak spots (check these first)

- Hero/EnergyStory animate SVG gradient stop colors and attrs via `gsap.to(..., {attr})`;
  verify selectors resolve (IDs like #skyTop, #hero-sun, #battFill, #flowPath).
- EnergyStory `swap()` crossfades absolutely-positioned stage divs inside a fixed-height
  box (h-[220px]/[280px]); long translations may clip on narrow screens.
- Services horizontal distance recomputes via function-based values; confirm after resize.
- Duplicate element IDs: hero and diagram SVGs both live once per page so IDs are fine,
  but don't duplicate sections.
- `SectionHeading` uses `textWrap: 'pretty' as never` — replace with a proper csstype
  cast if TS complains.
- Navbar mobile menu uses negative z-index inside the fixed header; verify links are
  tappable on iOS Safari.
- Unsplash URLs in images.ts may 404; fallbacks should keep layout intact (test by
  blocking the domain).

## Deployment (already configured)

- Pages: build `npm run build`, output `dist`, NODE_VERSION=20; or
  `npx wrangler pages deploy dist --project-name kairova-solar`.
- Workers: `npm run build && npx wrangler deploy`.

## Definition of done

Dev server clean, typecheck clean, build clean, no console errors, all 12 checks above
pass, scroll up/down reversal correct, no horizontal overflow at 390/768/1024/1440px,
reduced-motion fully readable, README instructions verified accurate.

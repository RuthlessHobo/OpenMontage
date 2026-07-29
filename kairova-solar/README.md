# Kairova Solar — Demo Website

> **Kairova Solar is a fictional demonstration brand.** This website, its company details,
> certifications, projects and reviews were all invented for a design demo. No real services
> are offered and no real accreditation is claimed.

A highly animated, single-page marketing site for a fictional South African solar company.
Built with React, Vite, TypeScript, Tailwind CSS, GSAP (ScrollTrigger) and Lenis.

## Stack

- React 18 + TypeScript
- Vite 5 (static build, no SSR)
- Tailwind CSS 3
- GSAP 3 + ScrollTrigger (pinned scenes, scroll-scrubbed timelines)
- Lenis smooth scrolling (disabled when `prefers-reduced-motion` is set)
- Lucide icons

## Run locally

Requires **Node 18 or newer** (Node 20 LTS recommended).

```bash
npm install
npm run dev      # dev server at http://localhost:5173
npm run build    # production build into /dist
npm run preview  # preview the production build
npm run typecheck
```

The production build is generated inside `/dist`.

## Deployment

Both options below are static-only. No database, server, API key or backend is required.

### Option 1: Cloudflare Pages

**Via Git**

1. Push this repository to GitHub or GitLab.
2. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git**.
3. Select the repository and use:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Environment variable (recommended): `NODE_VERSION = 20`
4. Deploy. Every push to the production branch redeploys automatically.

**Via Direct Upload**

```bash
npm run build
npx wrangler pages deploy dist --project-name kairova-solar
```

Or in the dashboard: **Workers & Pages → Create → Pages → Upload assets** and drag the
`dist` folder in.

`public/_redirects` (`/* /index.html 200`) ships with the build, so client-side routes
never 404 on refresh. `public/_headers` adds basic security and caching headers.

### Option 2: Cloudflare Workers (static assets)

`wrangler.jsonc` is already configured to serve `./dist` with SPA fallback
(`not_found_handling: "single-page-application"`), so refreshing any URL serves
`index.html` instead of a 404.

```bash
npm run build
npx wrangler deploy
```

Wrangler will prompt you to log in to Cloudflare on first run.

## Solar system story section

`SolarSystemStory` (`src/sections/SolarSystemStory.tsx`) is the pinned,
scroll-controlled reveal that carries the `#why-solar` anchor. It runs on three
photographs of the same house: assembled, partially opened, fully exploded.

### Dropping in the real photography

`public/solar-story/` currently holds **clearly labelled placeholder plates** so
the section runs before the real images are in the repo. To replace them:

```bash
# 1. put the three source files here, any format, any resolution:
#    assets-src/solar-story/assembled.jpg
#    assets-src/solar-story/partial.jpg
#    assets-src/solar-story/exploded.jpg

# 2. build the responsive set (AVIF + WebP + JPEG at 960/1600/2400)
npm run optimize:solar
```

That writes straight over `public/solar-story/`, and nothing in the components
needs to change. `assets-src/` is gitignored; the optimised derivatives are
committed because they are what deploys.

To regenerate the placeholders: `npm run placeholders:solar`.

### Tuning it

Everything adjustable lives in `src/data/solarStory.ts`:

| Constant | Controls |
|---|---|
| `solarImageAlignment` | Per plate scale/x/y/rotation, for registering the three frames against each other so the house does not jump |
| `solarLayers` | The masked component regions (`clip`), their pivot (`origin`) and how far each travels at the partial and full stages |
| `energySegments` / `energyNodes` | The energy route geometry and the order it lights up |
| `STAGES` | The five stage boundaries as timeline progress |
| `ENERGY_VIEWBOX` | Source plate aspect ratio. Must match `ASPECT` in the optimise script |
| `SOLAR_STORY_DEBUG` | Set `true` for a live progress/stage readout, layer outlines and path anchor coordinates |

Set `SOLAR_STORY_DEBUG = true` first when re-aiming anything: it draws every
clip polygon over the image and prints each path anchor's coordinates.

### Notes

- Pinning is `position: sticky`, not ScrollTrigger's `pin`. The two do the same
  job, and nesting a pin-spacer inside a sticky element is what causes stray end
  positions and double scrollbars.
- `scrub` is `true` rather than a number, because Lenis already smooths scroll
  input and extra scrub lag would keep the animation running after you stop.
- Below 768px the component separation is dropped and the plates carry the
  sequence; pulling parts apart on a narrow screen reads as a glitch.
- With `prefers-reduced-motion` there is no pin and no scroll distance: the
  assembled and exploded states are shown as two static figures with the full
  sequence written out as text.

## Contact form

The form validates inline, shows a loading state and a success animation, but **does not
send email or store any personal information**.

To connect a real integration (for example a GoHighLevel inbound webhook), replace the body
of `src/utils/submitContact.ts` — instructions are in that file.

## Project structure

```
src/
  components/   Navbar, Footer, TrustStrip, MagneticButton, SectionHeading
  sections/     Hero, EnergyStory, Services, Estimator, Process, Projects,
                WhyKairova, Reviews, Faq, Contact
  animations/   Shared GSAP + ScrollTrigger registration
  hooks/        useLenis, usePrefersReducedMotion, useMediaQuery
  data/         brand.ts (central config), services, projects, reviews, faq, images
  utils/        estimator.ts (demo maths), submitContact.ts (replaceable stub)
  assets/       Original SVG illustrations
  styles/       Tailwind entry + shared component classes
public/
  brand/        Original Kairova logo SVGs + favicon
  _redirects    SPA fallback for Cloudflare Pages
  _headers      Security + caching headers
```

Content lives in `src/data/`, animation logic in each section's `gsap.context`, and all
external image URLs in `src/data/images.ts` (the layout keeps its own SVG backdrops, so the
site still looks complete if those URLs are unavailable).

## Accessibility and motion

- Full `prefers-reduced-motion` mode: Lenis off, no pinning or scrubbed parallax, all
  content visible with light transitions only.
- Mobile: shorter pinned scenes, vertical service cards, no pointer-following effects.
- Accordion and forms use proper ARIA attributes; focus states are visible throughout.

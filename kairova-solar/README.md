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

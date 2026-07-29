import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../animations/gsap'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import SolarStoryScene from '../components/solar-story/SolarStoryScene'
import SolarStoryMobile from '../components/solar-story/SolarStoryMobile'
import SolarImageLayer from '../components/solar-story/SolarImageLayer'
import {
  LAYER_DISTANCE_SCALE,
  SOLAR_STORY_DEBUG,
  SOLAR_STORY_SCROLL_VH,
  SOLAR_STORY_SCROLL_VH_MOBILE,
  STAGES,
  STAGE_LABELS,
  STAGE_ORDER,
  energyNodes,
  energySegments,
  solarLayers,
  solarStoryCopy,
  type LayerTransform,
  type StageKey
} from '../data/solarStory'

/**
 * SolarSystemStory
 *
 * A scroll controlled reveal: a finished rural home, its energy route lighting
 * up, then the system opening into an exploded architectural view. Scrolling
 * back up runs the identical timeline in reverse.
 *
 * Two implementation notes worth knowing before editing:
 *
 * 1. Pinning is done with position: sticky, not ScrollTrigger's pin. The brief
 *    asked for both, but they are two mechanisms for the same job and running
 *    them together produces a pin-spacer inside an already sticky element,
 *    which is where the double scrollbar and end-position bugs come from.
 *    Sticky is also refresh-safe for free, since there is no injected spacer to
 *    re-measure on resize.
 *
 * 2. scrub is `true` rather than a number. Lenis already smooths scroll input
 *    site wide, so scrub smoothing on top of it would add lag that keeps the
 *    timeline moving after the user stops, which the brief explicitly rules out.
 */
export default function SolarSystemStory() {
  const root = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()
  const [debug, setDebug] = useState({ progress: 0, stage: 'home' as StageKey })

  // ScrollTrigger measures against image height. Refresh once the plates have
  // decoded so start and end positions are correct on a cold load.
  const loaded = useRef(0)
  const onImageLoad = useCallback(() => {
    loaded.current += 1
    ScrollTrigger.refresh()
  }, [])

  useLayoutEffect(() => {
    if (reduced) return
    const el = root.current
    if (!el) return

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add(
        {
          desktop: '(min-width: 1024px)',
          tablet: '(min-width: 768px) and (max-width: 1023.98px)',
          mobile: '(max-width: 767.98px)'
        },
        (mmCtx) => {
          const { desktop, tablet, mobile } = mmCtx.conditions as Record<string, boolean>
          const distance = desktop
            ? LAYER_DISTANCE_SCALE.desktop
            : tablet
              ? LAYER_DISTANCE_SCALE.tablet
              : 0

          const scene = el.querySelector('[data-solar-scene]')
          if (!scene) return
          const q = gsap.utils.selector(scene)

          const camera = q('[data-camera]')[0] as HTMLElement | undefined
          const cores = q('[data-energy-core]')
          const glows = q('[data-energy-glow]')
          const nodes = q('[data-energy-node]')
          const partial = q('[data-plate="partial"]')[0] as HTMLElement | undefined
          const exploded = q('[data-plate="exploded"]')[0] as HTMLElement | undefined
          const sunlight = q('[data-sunlight]')[0] as HTMLElement | undefined
          const panelGlow = q('[data-panel-glow]')[0] as HTMLElement | undefined
          const openingLines = q('[data-story-copy-line]')
          const closing = q('[data-story-copy="closing"]')[0] as HTMLElement | undefined
          const closingLines = q('[data-story-closing-line]')
          const labels = q('[data-story-label]')

          // ---- initial state -------------------------------------------------
          gsap.set([cores, glows], { strokeDashoffset: 1 })
          gsap.set(nodes, { opacity: 0, scale: 0.6, transformOrigin: '50% 50%' })
          gsap.set([partial, exploded], { opacity: 0 })
          if (panelGlow) gsap.set(panelGlow, { opacity: 0 })
          if (closing) gsap.set(closing, { opacity: 0 })
          gsap.set(closingLines, { opacity: 0, y: 18 })
          gsap.set(labels, { opacity: 0, y: 10 })

          const master = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: el,
              start: 'top top',
              end: 'bottom bottom',
              scrub: true,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                if (!SOLAR_STORY_DEBUG) return
                const p = self.progress
                const stage =
                  STAGE_ORDER.find((k) => p >= STAGES[k].from && p < STAGES[k].to) ?? 'overview'
                setDebug({ progress: p, stage })
              },
              // will-change is expensive to leave on: only carry it while the
              // section is actually in play.
              onToggle: (self) => {
                const on = self.isActive
                solarLayers.forEach((layer) => {
                  const node = q(`[data-layer="${layer.id}"]`)[0] as HTMLElement | undefined
                  if (node) node.style.willChange = on ? 'transform' : 'auto'
                })
                if (partial) partial.style.willChange = on ? 'opacity' : 'auto'
                if (exploded) exploded.style.willChange = on ? 'opacity' : 'auto'
              }
            }
          })

          const span = (s: StageKey) => STAGES[s].to - STAGES[s].from

          // ---- stage 1: complete home ---------------------------------------
          // Slow push toward the array, plus a small amount of differential
          // movement so the landscape trails the house and the array leads it.
          if (camera) {
            master.fromTo(
              camera,
              { scale: 1, yPercent: 0 },
              { scale: 1.06, yPercent: -1.2, duration: 1 },
              0
            )
          }
          if (distance > 0) {
            const drift: Array<[string, number]> = [
              ['background', 1.1],
              ['house', -0.5],
              ['roof', -0.9],
              ['panels', -1.6],
              ['panelsSecondary', -1.5]
            ]
            drift.forEach(([id, y]) => {
              const node = q(`[data-layer="${id}"]`)[0]
              if (node) {
                master.fromTo(
                  node,
                  { yPercent: 0 },
                  { yPercent: y * distance, duration: span('home') },
                  STAGES.home.from
                )
              }
            })
          }
          if (sunlight) {
            master.fromTo(
              sunlight,
              { xPercent: 0, opacity: 0.85 },
              { xPercent: 6, opacity: 1, duration: span('home') + span('capture') },
              STAGES.home.from
            )
          }

          // Opening copy clears before the separation starts.
          master.to(
            openingLines,
            { opacity: 0, y: -14, duration: span('capture') * 0.6, stagger: 0.02 },
            STAGES.capture.from + span('capture') * 0.35
          )

          // ---- stage 2: solar capture ---------------------------------------
          if (panelGlow) {
            master.to(
              panelGlow,
              { opacity: 1, duration: span('capture') * 0.55 },
              STAGES.capture.from
            )
          }
          energySegments.forEach((seg) => {
            const at = STAGES.capture.from + seg.from * span('capture')
            const d = Math.max(0.02, (seg.to - seg.from) * span('capture'))
            master.to(
              q(`[data-energy-core="${seg.id}"]`),
              { strokeDashoffset: 0, duration: d },
              at
            )
            master.to(
              q(`[data-energy-glow="${seg.id}"]`),
              { strokeDashoffset: 0, duration: d },
              at
            )
          })
          energyNodes.forEach((node) => {
            master.to(
              q(`[data-energy-node="${node.id}"]`),
              { opacity: 1, scale: 1, duration: span('capture') * 0.12 },
              STAGES.capture.from + node.at * span('capture')
            )
          })

          // ---- stages 3 and 4: separation -----------------------------------
          // The cutouts move first, the matching photograph crossfades in over
          // them. That ordering is what keeps this from looking like a dissolve.
          if (distance > 0) {
            solarLayers.forEach((layer) => {
              const node = q(`[data-layer="${layer.id}"]`)[0]
              if (!node) return
              const scaled = (t: LayerTransform) => ({
                xPercent: (t.x ?? 0) * distance,
                yPercent: (t.y ?? 0) * distance,
                scale: 1 + ((t.scale ?? 1) - 1) * distance,
                rotateX: (t.rotateX ?? 0) * distance,
                rotateY: (t.rotateY ?? 0) * distance
              })
              master.to(
                node,
                { ...scaled(layer.partial), duration: span('separation') * 0.9 },
                STAGES.separation.from + layer.stagger * span('separation') * 0.35
              )
              master.to(
                node,
                { ...scaled(layer.full), duration: span('exploded') * 0.9 },
                STAGES.exploded.from + layer.stagger * span('exploded') * 0.3
              )
            })
          }

          if (partial) {
            master.to(
              partial,
              { opacity: 1, duration: span('separation') * 0.55 },
              STAGES.separation.from + span('separation') * 0.35
            )
          }
          if (exploded) {
            master.to(
              exploded,
              { opacity: 1, duration: span('exploded') * 0.6 },
              STAGES.exploded.from + span('exploded') * 0.25
            )
          }

          // Labels arrive once the exploded plate is legible.
          master.to(
            labels,
            { opacity: 1, y: 0, duration: span('exploded') * 0.3, stagger: 0.03 },
            STAGES.exploded.from + span('exploded') * 0.62
          )

          // ---- stage 5: overview --------------------------------------------
          master.to(
            glows,
            { opacity: 0.8, duration: span('overview') * 0.6 },
            STAGES.overview.from
          )
          if (closing) {
            master.to(closing, { opacity: 1, duration: 0.01 }, STAGES.overview.from)
          }
          // Timed to finish around t=0.96 rather than at the very end. The
          // stagger has to be counted in: three lines at 0.04 apart used to push
          // the CTA's tween past t=1, which both stretched the master timeline
          // beyond 1 and left the button sitting half faded for the whole last
          // stretch of the scroll.
          master.to(
            closingLines,
            { opacity: 1, y: 0, duration: span('overview') * 0.33, stagger: 0.015 },
            STAGES.overview.from + span('overview') * 0.03
          )

          // Pin the master to exactly 1 so the STAGES table above maps 1:1 onto
          // scroll progress, and the final state holds while the section plays out.
          master.to({}, { duration: 0 }, 1)

          // Mobile keeps the same beats with no cutout movement at all.
          if (mobile) {
            master.eventCallback('onUpdate', null)
          }
        }
      )
    }, root)

    return () => ctx.revert()
  }, [reduced])

  // ---- reduced motion ----------------------------------------------------
  // No pin, no scroll distance, no independent component movement: the two end
  // states are shown as ordinary stacked figures and every word stays readable.
  if (reduced) {
    return (
      <section ref={root} id="why-solar" className="bg-ink">
        <div className="container-k py-24 md:py-32">
          <p className="tag-k">{solarStoryCopy.opening.eyebrow}</p>
          <h2 className="display-lg mt-4 max-w-2xl text-ivory">
            {solarStoryCopy.opening.headline}
          </h2>
          <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-mist">
            {solarStoryCopy.opening.support}
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <figure>
              <div className="relative aspect-[5/3] overflow-hidden bg-graphite">
                <SolarImageLayer plate="assembled" priority />
              </div>
              <figcaption className="mt-3 text-[13px] text-mist">
                The completed system on the roof.
              </figcaption>
            </figure>
            <figure>
              <div className="relative aspect-[5/3] overflow-hidden bg-graphite">
                <SolarImageLayer plate="exploded" />
              </div>
              <figcaption className="mt-3 text-[13px] text-mist">
                The same system shown as an exploded view.
              </figcaption>
            </figure>
          </div>

          <ol className="mt-12 grid max-w-3xl gap-3 text-[15px] leading-relaxed text-ivory/85">
            {solarStoryCopy.sequence.map((line) => (
              <li key={line} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
                {line}
              </li>
            ))}
          </ol>

          <h3 className="display-md mt-14 max-w-2xl text-ivory">
            {solarStoryCopy.closing.headline}
          </h3>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-mist">
            {solarStoryCopy.closing.support}
          </p>
          <a
            href={solarStoryCopy.closing.cta.href}
            className="mt-7 inline-flex items-center gap-2 rounded-sm bg-amber px-7 py-3.5 text-[15px] font-semibold text-ink transition-colors hover:bg-[#ffd763]"
          >
            {solarStoryCopy.closing.cta.label}
          </a>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={root}
      id="why-solar"
      className="relative bg-ink"
      aria-label="How a Kairova solar system fits together"
      data-solar-story
    >
      {/* Scroll length lives here rather than in an inline style: an inline
          height would outrank the media query and the mobile value would never
          apply. Equal specificity, later rule wins. */}
      <style>{`
        [data-solar-story] { height: ${SOLAR_STORY_SCROLL_VH}vh; }
        @media (max-width: 767.98px) {
          [data-solar-story] { height: ${SOLAR_STORY_SCROLL_VH_MOBILE}vh; }
        }
      `}</style>

      <div
        className="sticky top-0 h-[100svh] w-full overflow-hidden"
        style={{ perspective: '1200px' }}
      >
        <div className="hidden h-full w-full md:block">
          <SolarStoryScene />
        </div>
        <div className="block h-full w-full md:hidden">
          <SolarStoryMobile />
        </div>

        {/* Assistive summary: the sequence is meaningful content, not decoration. */}
        <ol className="sr-only">
          {solarStoryCopy.sequence.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ol>

        {SOLAR_STORY_DEBUG && (
          <div className="pointer-events-none absolute left-4 top-4 z-[100] rounded-sm bg-ink/85 px-3 py-2 font-mono text-[11px] text-lime">
            <div>progress {debug.progress.toFixed(3)}</div>
            <div>stage {STAGE_LABELS[debug.stage]}</div>
          </div>
        )}
      </div>

      {/* Preload hint for the first plate, kept next to the markup that needs it. */}
      <img
        src="/solar-story/assembled-960.jpg"
        alt=""
        aria-hidden="true"
        className="sr-only"
        onLoad={onImageLoad}
        onError={onImageLoad}
      />
    </section>
  )
}

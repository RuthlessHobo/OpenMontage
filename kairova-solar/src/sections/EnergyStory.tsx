import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../animations/gsap'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import SectionHeading from '../components/SectionHeading'

interface Stage {
  id: string
  title: string
  copy: string
}

const stages: Stage[] = [
  {
    id: 'grid',
    title: 'Grid dependence',
    copy: 'Buying every unit of electricity from the grid leaves you exposed to changing costs and interruptions.'
  },
  {
    id: 'generation',
    title: 'Solar generation',
    copy: 'Your roof begins producing electricity during daylight hours.'
  },
  {
    id: 'consumption',
    title: 'Direct consumption',
    copy: 'The property uses solar energy before drawing additional power from the grid.'
  },
  {
    id: 'storage',
    title: 'Battery storage',
    copy: 'Excess production can be stored for evenings and interruptions.'
  },
  {
    id: 'monitoring',
    title: 'Monitoring',
    copy: 'See generation, consumption, battery level and grid usage from one interface.'
  }
]

// One SVG system diagram that evolves through five scroll-scrubbed stages.
export default function EnergyStory() {
  const root = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()

  useLayoutEffect(() => {
    if (reduced) return
    const ctx = gsap.context((self) => {
      const q = self.selector!
      const mm = gsap.matchMedia()

      mm.add(
        { desktop: '(min-width: 768px)', mobile: '(max-width: 767px)' },
        (mmCtx) => {
          const { desktop } = mmCtx.conditions as { desktop: boolean }

          gsap.set(q('.story-arrow'), { strokeDasharray: 1, strokeDashoffset: 1 })
          gsap.set(q('#dBattFill'), { scaleY: 0.06, transformOrigin: '50% 100%' })
          gsap.set(q('#dMon'), { y: 24, opacity: 0 })
          gsap.set(q('.story-stage'), { opacity: 0, y: 24 })
          gsap.set(q('.story-stage')[0] as Element, { opacity: 1, y: 0 })
          gsap.set(q('#dSunGroup'), { opacity: 0.15, y: 14 })
          gsap.set(q('.d-panel-lit'), { opacity: 0 })
          gsap.set(q('.d-window'), { opacity: 0.12 })

          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: q('.story-pin')[0] as Element,
              start: 'top top',
              end: desktop ? '+=400%' : '+=260%',
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true
            }
          })

          const swap = (from: number, to: number, at: number) => {
            tl.to(q('.story-stage')[from] as Element, { opacity: 0, y: -24, duration: 0.5 }, at)
            tl.to(q('.story-stage')[to] as Element, { opacity: 1, y: 0, duration: 0.5 }, at + 0.4)
          }

          // Stage 1: grid dependence
          tl.to(q('#aGrid'), { strokeDashoffset: 0, duration: 1 }, 0)
            .to(q('#dGrid'), { opacity: 1, duration: 0.6 }, 0)

          // Stage 2: solar generation
          swap(0, 1, 1.4)
          tl.to(q('#dSunGroup'), { opacity: 1, y: 0, duration: 0.8 }, 1.6)
            .to(q('#aSun'), { strokeDashoffset: 0, duration: 0.8 }, 2.0)
            .to(q('.d-panel-lit'), { opacity: 0.6, duration: 0.6, stagger: 0.1 }, 2.4)

          // Stage 3: direct consumption
          swap(1, 2, 3.2)
          tl.to(q('#aSolar'), { strokeDashoffset: 0, duration: 0.9 }, 3.5)
            .to(q('.d-window'), { opacity: 0.9, duration: 0.6, stagger: 0.15 }, 3.9)
            .to(q('#aGrid'), { opacity: 0.2, duration: 0.6 }, 3.9)

          // Stage 4: battery storage
          swap(2, 3, 4.8)
          tl.to(q('#aBatt'), { strokeDashoffset: 0, duration: 0.8 }, 5.1)
            .to(q('#dBattFill'), { scaleY: 1, duration: 1.6 }, 5.4)

          // Stage 5: monitoring
          swap(3, 4, 6.6)
          tl.to(q('#dMon'), { y: 0, opacity: 1, duration: 0.8 }, 6.9)
            .to(q('.d-mon-bar'), { scaleY: 1, duration: 0.6, stagger: 0.1 }, 7.3)

          tl.to({}, { duration: 0.6 }) // settle room at the end
        }
      )
    }, root)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section ref={root} id="why-solar" className="relative bg-ink">
      <div className="container-k pt-24 md:pt-32">
        <SectionHeading
          tag="How it works"
          title={
            <>
              One system. <span className="text-amber">Five jobs.</span>
            </>
          }
          copy="Follow the energy from sunlight to stored power. Scroll through each stage of the system."
        />
      </div>

      {reduced ? (
        /* Reduced motion: all stages visible, static diagram. */
        <div className="container-k grid gap-10 py-16 md:grid-cols-2">
          <ol className="space-y-8">
            {stages.map((s, i) => (
              <li key={s.id}>
                <p className="font-display text-sm text-amber">0{i + 1}</p>
                <h3 className="display-md mt-1 text-ivory">{s.title}</h3>
                <p className="mt-2 max-w-md text-[15px] leading-relaxed text-mist">{s.copy}</p>
              </li>
            ))}
          </ol>
          <div className="md:sticky md:top-24 md:self-start">
            <Diagram staticMode />
          </div>
        </div>
      ) : (
        <div className="story-pin flex h-[100svh] min-h-[600px] items-center">
          <div className="container-k grid w-full items-center gap-10 md:grid-cols-2">
            <div className="relative h-[220px] md:h-[280px]">
              {stages.map((s, i) => (
                <div key={s.id} className="story-stage absolute inset-0">
                  <p className="font-display text-sm text-amber">
                    0{i + 1} <span className="text-mist">/ 05</span>
                  </p>
                  <h3 className="display-lg mt-2 text-ivory">{s.title}</h3>
                  <p className="mt-4 max-w-md text-[16px] leading-relaxed text-mist">{s.copy}</p>
                </div>
              ))}
            </div>
            <Diagram />
          </div>
        </div>
      )}
    </section>
  )
}

function Diagram({ staticMode = false }: { staticMode?: boolean }) {
  const s = staticMode
  return (
    <svg viewBox="0 0 560 460" className="mx-auto w-full max-w-[560px]" aria-hidden="true">
      {/* Sun */}
      <g id="dSunGroup" opacity={s ? 1 : undefined}>
        <circle cx="300" cy="60" r="26" fill="#F5C84C" />
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const a = (i * 60 * Math.PI) / 180
          return (
            <line
              key={i}
              x1={300 + Math.cos(a) * 36}
              y1={60 + Math.sin(a) * 36}
              x2={300 + Math.cos(a) * 46}
              y2={60 + Math.sin(a) * 46}
              stroke="#F5C84C"
              strokeWidth="3"
              strokeLinecap="round"
            />
          )
        })}
      </g>

      {/* Grid pylon */}
      <g id="dGrid" opacity={s ? 1 : 0.9}>
        <path d="M60 300 L80 180 L100 300" fill="none" stroke="#98A1A6" strokeWidth="3" />
        <line x1="52" y1="210" x2="108" y2="210" stroke="#98A1A6" strokeWidth="3" />
        <line x1="58" y1="240" x2="102" y2="240" stroke="#98A1A6" strokeWidth="3" />
        <line x1="66" y1="182" x2="94" y2="182" stroke="#98A1A6" strokeWidth="3" />
      </g>

      {/* House */}
      <g>
        <rect x="200" y="220" width="200" height="120" fill="#151D24" stroke="#2A3742" strokeWidth="2" />
        <path d="M190 220 L300 150 L410 220 Z" fill="#10161B" stroke="#2A3742" strokeWidth="2" />
        {/* Roof panels */}
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <path
              d={`M ${232 + i * 50} 208 l 34 -22 h 12 l -34 22 Z`}
              fill="#182430"
              stroke="#3A5060"
              strokeWidth="1.5"
            />
            <path
              className="d-panel-lit"
              d={`M ${232 + i * 50} 208 l 34 -22 h 12 l -34 22 Z`}
              fill="#F5C84C"
              opacity={s ? 0.6 : 0}
            />
          </g>
        ))}
        <rect className="d-window" x="224" y="252" width="44" height="52" fill="#F5C84C" opacity={s ? 0.9 : 0.12} />
        <rect className="d-window" x="290" y="252" width="60" height="52" fill="#F5C84C" opacity={s ? 0.9 : 0.12} />
      </g>

      {/* Battery */}
      <g>
        <rect x="452" y="252" width="52" height="96" rx="6" fill="#0D1216" stroke="#C9F75A" strokeWidth="2.5" />
        <rect id="dBattFill" x="459" y="259" width="38" height="82" rx="3" fill="#C9F75A" opacity="0.85" />
        <rect x="468" y="242" width="20" height="10" rx="2" fill="#C9F75A" />
      </g>

      {/* Monitor card */}
      <g id="dMon" opacity={s ? 1 : 0}>
        <rect x="216" y="374" width="168" height="72" rx="8" fill="#11171B" stroke="#74BDE8" strokeWidth="2" />
        {[0, 1, 2, 3].map((i) => (
          <rect
            key={i}
            className="d-mon-bar"
            x={236 + i * 34}
            y={432 - (18 + i * 8)}
            width="16"
            height={18 + i * 8}
            fill={i === 3 ? '#74BDE8' : '#2E4356'}
            style={s ? undefined : { transform: 'scaleY(1)', transformOrigin: '50% 100%' }}
          />
        ))}
      </g>

      {/* Flows */}
      <line
        id="aGrid"
        className="story-arrow"
        x1="108"
        y1="270"
        x2="196"
        y2="278"
        stroke="#98A1A6"
        strokeWidth="2.5"
        pathLength={1}
        strokeDashoffset={s ? 0 : undefined}
      />
      <path
        id="aSun"
        className="story-arrow"
        d="M 300 96 C 300 130, 292 158, 284 180"
        fill="none"
        stroke="#F5C84C"
        strokeWidth="2.5"
        pathLength={1}
        strokeDashoffset={s ? 0 : undefined}
      />
      <path
        id="aSolar"
        className="story-arrow"
        d="M 286 214 C 290 230, 296 240, 300 250"
        fill="none"
        stroke="#C9F75A"
        strokeWidth="2.5"
        pathLength={1}
        strokeDashoffset={s ? 0 : undefined}
      />
      <path
        id="aBatt"
        className="story-arrow"
        d="M 402 280 C 424 282, 436 286, 450 292"
        fill="none"
        stroke="#C9F75A"
        strokeWidth="2.5"
        pathLength={1}
        strokeDashoffset={s ? 0 : undefined}
      />
    </svg>
  )
}

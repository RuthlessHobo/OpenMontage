import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../animations/gsap'
import SectionHeading from '../components/SectionHeading'

const points = [
  { title: 'Consumption-led system design', copy: 'Sizing starts from meter data and usage patterns, not roof size alone.' },
  { title: 'Clear equipment recommendations', copy: 'You see what is specified, why, and what the alternatives cost.' },
  { title: 'Expandable solar and storage', copy: 'Start with the right system and expand when your needs change.' },
  { title: 'Professional installation process', copy: 'Planned installation days, tested switchover, tidy wiring.' },
  { title: 'Monitoring and handover', copy: 'See what your system is producing in real time from day one.' },
  { title: 'Ongoing support', copy: 'One team for assessment, design, installation and support.' }
]

// Exploded solar system that assembles as the visitor scrolls.
export default function WhyKairova() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      const q = self.selector!
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const layers: [string, number][] = [
          ['#xPanels', -120],
          ['#xRails', -60],
          ['#xInverter', 70],
          ['#xBattery', 110],
          ['#xMonitor', 160]
        ]
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: q('.why-visual')[0] as Element,
            start: 'top 80%',
            end: 'center 45%',
            scrub: 1,
            invalidateOnRefresh: true
          }
        })
        layers.forEach(([sel, off], i) => {
          tl.fromTo(q(sel), { y: off, opacity: 0.35 }, { y: 0, opacity: 1, ease: 'none' }, i * 0.12)
        })
        tl.fromTo(q('.x-link'), { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.8)

        gsap.utils.toArray<HTMLElement>(q('.why-point')).forEach((el) => {
          gsap.from(el, {
            opacity: 0,
            y: 24,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 85%' }
          })
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="bg-ink">
      <div className="container-k grid gap-14 py-24 md:py-32 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeading
            tag="Why Kairova"
            title={
              <>
                Designed for the property.
                <br />
                <span className="text-amber">Supported beyond installation.</span>
              </>
            }
          />
          <ul className="mt-12 grid gap-x-8 gap-y-9 sm:grid-cols-2">
            {points.map((p) => (
              <li key={p.title} className="why-point">
                <h3 className="font-display text-lg font-semibold text-ivory">{p.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-mist">{p.copy}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="why-visual lg:sticky lg:top-24 lg:self-start">
          <svg viewBox="0 0 480 560" className="mx-auto w-full max-w-[440px]" aria-hidden="true">
            {/* Panel array (top layer) */}
            <g id="xPanels">
              {[0, 1, 2].map((r) =>
                [0, 1, 2, 3].map((c) => (
                  <path
                    key={`${r}${c}`}
                    d={`M ${96 + c * 76 + r * 20} ${96 + r * 34} l 56 -22 h 14 l -56 22 Z`}
                    fill="#182430"
                    stroke="#3A5060"
                    strokeWidth="1.5"
                  />
                ))
              )}
              <path d="M 96 96 l 56 -22 h 14 l -56 22 Z" fill="#F5C84C" opacity="0.5" />
            </g>

            {/* Mounting rails */}
            <g id="xRails" stroke="#4A5A66" strokeWidth="4" strokeLinecap="round">
              <line x1="110" y1="230" x2="400" y2="230" />
              <line x1="130" y1="258" x2="420" y2="258" />
              <line x1="150" y1="234" x2="150" y2="256" />
              <line x1="270" y1="234" x2="270" y2="256" />
              <line x1="380" y1="234" x2="380" y2="256" />
            </g>

            {/* Inverter */}
            <g id="xInverter">
              <rect x="160" y="310" width="110" height="88" rx="8" fill="#151D24" stroke="#74BDE8" strokeWidth="2" />
              <circle cx="215" cy="346" r="18" fill="none" stroke="#74BDE8" strokeWidth="2.5" />
              <line x1="215" y1="334" x2="215" y2="346" stroke="#74BDE8" strokeWidth="2.5" strokeLinecap="round" />
              <rect x="178" y="376" width="74" height="6" rx="3" fill="#2A3742" />
            </g>

            {/* Battery */}
            <g id="xBattery">
              <rect x="300" y="306" width="64" height="96" rx="7" fill="#0D1216" stroke="#C9F75A" strokeWidth="2.5" />
              <rect x="309" y="342" width="46" height="52" rx="3" fill="#C9F75A" opacity="0.8" />
              <rect x="320" y="294" width="24" height="12" rx="3" fill="#C9F75A" />
            </g>

            {/* Monitoring */}
            <g id="xMonitor">
              <rect x="150" y="452" width="180" height="84" rx="10" fill="#11171B" stroke="#2A3742" strokeWidth="2" />
              <path d="M170 516 L 202 496 L 226 506 L 258 480 L 288 490 L 310 472" fill="none" stroke="#74BDE8" strokeWidth="2.5" />
              <circle cx="258" cy="480" r="4" fill="#F5C84C" />
            </g>

            {/* Connection lines */}
            <g className="x-link" stroke="#C9F75A" strokeWidth="2" strokeDasharray="3 6" opacity="0">
              <line x1="240" y1="200" x2="228" y2="306" />
              <line x1="272" y1="352" x2="298" y2="352" />
              <line x1="240" y1="400" x2="240" y2="450" />
            </g>
          </svg>
          <p className="mt-4 text-center text-[12px] uppercase tracking-[0.18em] text-mist">
            Array · Mounting · Inverter · Battery · Monitoring
          </p>
        </div>
      </div>
    </section>
  )
}

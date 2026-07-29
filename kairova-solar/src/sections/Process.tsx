import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../animations/gsap'
import SectionHeading from '../components/SectionHeading'

const steps = [
  { n: '01', title: 'Consultation', copy: 'A conversation about your usage, priorities and budget.' },
  { n: '02', title: 'Site assessment', copy: 'Roof, wiring, meter data and shading checked on site.' },
  { n: '03', title: 'System design', copy: 'Panels, inverter and battery sized from real consumption.' },
  { n: '04', title: 'Proposal', copy: 'Clear equipment list, pricing and expected production.' },
  { n: '05', title: 'Installation', copy: 'Certified installation, testing and safe commissioning.' },
  { n: '06', title: 'Monitoring and support', copy: 'Handover, monitoring setup and ongoing support.' }
]

// Vertical energy path that draws down the timeline as each step reveals.
export default function Process() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      const q = self.selector!
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          q('.proc-line-fill'),
          { scaleY: 0 },
          {
            scaleY: 1,
            transformOrigin: 'top',
            ease: 'none',
            scrollTrigger: {
              trigger: q('.proc-list')[0] as Element,
              start: 'top 70%',
              end: 'bottom 55%',
              scrub: true
            }
          }
        )
        gsap.utils.toArray<HTMLElement>(q('.proc-step')).forEach((step) => {
          gsap.from(step, {
            opacity: 0,
            x: 28,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: { trigger: step, start: 'top 78%' }
          })
          gsap.to(step.querySelector('.proc-dot'), {
            backgroundColor: '#C9F75A',
            scale: 1.25,
            duration: 0.4,
            scrollTrigger: { trigger: step, start: 'top 60%', toggleActions: 'play none none reverse' }
          })
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="bg-ink">
      <div className="container-k py-24 md:py-32">
        <SectionHeading
          tag="Process"
          title={
            <>
              From first call to <span className="text-amber">first sunrise.</span>
            </>
          }
          copy="Six steps, one team. You always know what happens next."
        />

        <div className="proc-list relative mt-16 max-w-2xl">
          {/* Track + animated fill */}
          <div className="absolute bottom-3 left-[7px] top-3 w-px bg-ivory/15" aria-hidden="true" />
          <div
            className="proc-line-fill absolute bottom-3 left-[6.5px] top-3 w-[2px] bg-lime"
            aria-hidden="true"
          />
          <ol className="space-y-12">
            {steps.map((step) => (
              <li key={step.n} className="proc-step relative pl-12">
                <span
                  className="proc-dot absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border-2 border-ink bg-mist"
                  aria-hidden="true"
                />
                <p className="font-display text-[13px] font-semibold text-amber">{step.n}</p>
                <h3 className="mt-1 font-display text-2xl font-semibold text-ivory">{step.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-mist">{step.copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

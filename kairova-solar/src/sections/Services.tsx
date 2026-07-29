import { useLayoutEffect, useRef } from 'react'
import { Check, ArrowRight } from 'lucide-react'
import { gsap } from '../animations/gsap'
import { services } from '../data/services'
import { illustrationById } from '../assets/illustrations'
import SectionHeading from '../components/SectionHeading'

// Desktop: pinned section, cards travel horizontally as the page scrolls.
// Mobile / reduced motion: plain vertical cards.
export default function Services() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      const q = self.selector!
      const mm = gsap.matchMedia()

      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const track = q('.svc-track')[0] as HTMLElement
        const pin = q('.svc-pin')[0] as HTMLElement
        const getDistance = () => track.scrollWidth - window.innerWidth + 96

        gsap.to(track, {
          x: () => -getDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger: pin,
            start: 'top top',
            end: () => `+=${getDistance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true
          }
        })
      })

      mm.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>(q('.svc-card')).forEach((card) => {
          gsap.from(card, {
            opacity: 0,
            y: 36,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: { trigger: card, start: 'top 88%' }
          })
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="solutions" className="bg-graphite">
      <div className="svc-pin lg:flex lg:h-screen lg:min-h-[640px] lg:flex-col lg:justify-center lg:overflow-hidden">
        <div className="container-k pt-24 lg:pt-0">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              tag="Solutions"
              title={
                <>
                  Built for how you <span className="text-amber">use power.</span>
                </>
              }
            />
            <p className="hidden pb-2 text-[13px] uppercase tracking-[0.18em] text-mist lg:block">
              Scroll to explore
            </p>
          </div>
        </div>

        <div className="svc-track mt-12 flex flex-col gap-6 px-5 pb-24 sm:px-8 lg:mt-14 lg:flex-row lg:gap-8 lg:pb-0 lg:pl-12 lg:pr-24 lg:will-change-transform">
          {services.map((svc) => {
            const Illo = illustrationById[svc.id]
            return (
              <article
                key={svc.id}
                className="svc-card flex flex-col border border-ivory/10 bg-ink p-7 sm:p-9 lg:w-[430px] lg:shrink-0"
              >
                <div className="flex items-start justify-between">
                  <span className="font-display text-sm font-semibold text-amber">{svc.index}</span>
                  <span className="text-[11px] uppercase tracking-[0.18em] text-mist">Kairova</span>
                </div>
                <div className="mt-6 h-36">
                  <Illo />
                </div>
                <h3 className="display-md mt-6 text-ivory">{svc.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-mist">{svc.copy}</p>
                <ul className="mt-5 flex flex-col gap-2.5">
                  {svc.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-[14px] text-ivory/80">
                      <Check size={15} className="shrink-0 text-lime" strokeWidth={2.5} />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className="mt-auto inline-flex items-center gap-2 pt-7 text-[14px] font-semibold text-amber transition-colors hover:text-[#ffd763]"
                >
                  {svc.cta} <ArrowRight size={15} />
                </a>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

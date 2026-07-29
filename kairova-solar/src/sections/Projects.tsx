import { useLayoutEffect, useRef } from 'react'
import { MapPin } from 'lucide-react'
import { gsap } from '../animations/gsap'
import { projects } from '../data/projects'
import SectionHeading from '../components/SectionHeading'

// Fictional demo case studies with cinematic clip-path image reveals.
export default function Projects() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      const q = self.selector!
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>(q('.proj-item')).forEach((item) => {
          const media = item.querySelector('.proj-media')
          const img = item.querySelector('.proj-img')
          const info = item.querySelector('.proj-info')

          gsap.fromTo(
            media,
            { clipPath: 'inset(0 100% 0 0)' },
            {
              clipPath: 'inset(0 0% 0 0)',
              ease: 'power2.out',
              scrollTrigger: { trigger: item, start: 'top 75%', end: 'top 30%', scrub: true }
            }
          )
          gsap.fromTo(
            img,
            { scale: 1.18 },
            {
              scale: 1,
              ease: 'none',
              scrollTrigger: { trigger: item, start: 'top 85%', end: 'bottom 20%', scrub: true }
            }
          )
          gsap.from(info, {
            opacity: 0,
            y: 32,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: { trigger: item, start: 'top 62%' }
          })
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="projects" className="bg-graphite">
      <div className="container-k py-24 md:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            tag="Projects"
            title={
              <>
                Recent <span className="text-amber">demo case studies.</span>
              </>
            }
          />
          <p className="max-w-xs pb-2 text-[13px] leading-relaxed text-mist">
            Fictional projects created to demonstrate how Kairova presents its work.
          </p>
        </div>

        <div className="mt-16 space-y-24 md:space-y-32">
          {projects.map((p, i) => (
            <article
              key={p.id}
              className={`proj-item grid items-center gap-8 lg:grid-cols-[1.25fr_1fr] lg:gap-14 ${
                i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''
              }`}
            >
              <div
                className="proj-media relative aspect-[16/10] overflow-hidden"
                style={{ background: `linear-gradient(140deg, ${p.fallbackTint}22, #0B0F12 65%)` }}
              >
                {/* Striped SVG backdrop keeps the layout complete if the image fails. */}
                <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
                  <defs>
                    <pattern id={`stripe-${p.id}`} width="14" height="14" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
                      <rect width="14" height="14" fill="transparent" />
                      <line x1="0" y1="0" x2="0" y2="14" stroke={p.fallbackTint} strokeOpacity="0.14" strokeWidth="2" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill={`url(#stripe-${p.id})`} />
                </svg>
                <img
                  src={p.image}
                  alt={`${p.name}, ${p.type.toLowerCase()} solar installation (demo image)`}
                  loading="lazy"
                  className="proj-img absolute inset-0 h-full w-full object-cover"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
                {/* Technical overlay */}
                <div className="absolute inset-x-0 bottom-0 flex flex-wrap gap-2 bg-gradient-to-t from-ink/85 to-transparent p-4 pt-10">
                  {p.stats.map((st) => (
                    <span
                      key={st.label}
                      className="rounded-sm border border-ivory/20 bg-ink/60 px-2.5 py-1 text-[11px] font-medium text-ivory/90 backdrop-blur-sm"
                    >
                      <span className="text-mist">{st.label} · </span>
                      {st.value}
                    </span>
                  ))}
                </div>
                <span className="absolute left-4 top-4 rounded-sm bg-ink/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-amber backdrop-blur-sm">
                  Demo case study
                </span>
              </div>

              <div className="proj-info">
                <p className="flex items-center gap-1.5 text-[13px] text-mist">
                  <MapPin size={13} /> {p.location} · {p.type}
                </p>
                <h3 className="display-md mt-3 text-ivory">{p.name}</h3>
                <p className="mt-3 font-display text-lg text-amber">{p.system}</p>
                <p className="mt-4 max-w-md text-[15px] leading-relaxed text-mist">{p.objective}</p>
                <a
                  href="#contact"
                  className="mt-6 inline-block text-[14px] font-semibold text-ivory underline decoration-amber decoration-2 underline-offset-4 hover:text-amber"
                >
                  Plan something similar
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

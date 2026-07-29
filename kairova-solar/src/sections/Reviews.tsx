import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../animations/gsap'
import { reviews } from '../data/reviews'
import SectionHeading from '../components/SectionHeading'

// Review deck: cards start gathered into a stack and separate while scrolling.
export default function Reviews() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      const q = self.selector!
      const mm = gsap.matchMedia()

      // Section colour transition into warm ivory.
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          root.current,
          { backgroundColor: '#090B0D' },
          {
            backgroundColor: '#F3F0E8',
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top 85%', end: 'top 30%', scrub: true }
          }
        )
      })

      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        const cards = gsap.utils.toArray<HTMLElement>(q('.review-card'))
        const mid = (cards.length - 1) / 2
        cards.forEach((card, i) => {
          gsap.fromTo(
            card,
            {
              xPercent: (mid - i) * 88,
              yPercent: Math.abs(mid - i) * 4,
              rotate: (i - mid) * 4,
              scale: 0.96
            },
            {
              xPercent: 0,
              yPercent: 0,
              rotate: 0,
              scale: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: q('.review-grid')[0] as Element,
                start: 'top 85%',
                end: 'top 25%',
                scrub: 1,
                invalidateOnRefresh: true
              }
            }
          )
        })
      })

      mm.add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>(q('.review-card')).forEach((card) => {
          gsap.from(card, {
            opacity: 0,
            y: 32,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: { trigger: card, start: 'top 88%' }
          })
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="reviews" className="bg-ivory text-ink">
      <div className="container-k py-24 md:py-32">
        <SectionHeading
          tag="Reviews · sample content"
          dark={false}
          title={
            <>
              What clients say <span className="text-[#B07E10]">after handover.</span>
            </>
          }
          copy="Fictional reviews written for this demo, in the tone real clients use."
        />

        <div className="review-grid mt-14 grid gap-5 md:grid-cols-3 lg:grid-cols-5">
          {reviews.map((r) => (
            <figure
              key={r.id}
              className="review-card flex flex-col border border-ink/12 bg-white/70 p-6 shadow-[0_2px_16px_rgba(9,11,13,0.06)]"
            >
              <div
                className="flex h-11 w-11 items-center justify-center rounded-full font-display text-sm font-bold text-ink"
                style={{ background: r.tint }}
                aria-hidden="true"
              >
                {r.initials}
              </div>
              <blockquote className="mt-4 flex-1 text-[14px] leading-relaxed text-ink/85">
                {r.text}
              </blockquote>
              <figcaption className="mt-5 border-t border-ink/10 pt-4">
                <p className="text-[13px] font-semibold">{r.name}</p>
                <p className="mt-0.5 text-[12px] text-ink/55">
                  {r.location} · {r.projectType}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="mt-8 text-[12px] text-ink/45">
          All reviews on this page are sample content created for demonstration purposes.
        </p>
      </div>
    </section>
  )
}

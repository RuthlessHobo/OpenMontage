import { useLayoutEffect, useRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { gsap } from '../animations/gsap'
import MagneticButton from '../components/MagneticButton'

// Cinematic pinned hero: a layered dawn-to-day solar scene scrubbed by scroll.
// Sun rises, sky brightens, clouds drift, panels catch light, energy flows to
// the battery and the home lights up.
export default function Hero() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      const q = self.selector!
      const mm = gsap.matchMedia()

      // Intro headline reveal (time-based, not scroll-based).
      gsap.fromTo(
        q('.hero-line-inner'),
        { yPercent: 110 },
        { yPercent: 0, duration: 1, ease: 'power4.out', stagger: 0.12, delay: 0.25 }
      )
      gsap.fromTo(
        q('.hero-fade'),
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out', stagger: 0.1, delay: 0.85 }
      )

      mm.add(
        {
          desktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
          mobile: '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
          reduced: '(prefers-reduced-motion: reduce)'
        },
        (mmCtx) => {
          const { desktop, reduced } = mmCtx.conditions as {
            desktop: boolean
            mobile: boolean
            reduced: boolean
          }

          if (reduced) {
            // Static daytime scene, everything visible, no pin.
            gsap.set(q('#hero-sun'), { attr: { cy: 240 } })
            gsap.set(q('#skyTop'), { attr: { 'stop-color': '#7FB9DD' } })
            gsap.set(q('#skyMid'), { attr: { 'stop-color': '#B9D6E4' } })
            gsap.set(q('#skyBot'), { attr: { 'stop-color': '#E8DDC2' } })
            gsap.set(q('.panel-glow, .hero-window, .hero-label'), { opacity: 1 })
            gsap.set(q('#battFill'), { scaleY: 1 })
            gsap.set(q('#flowPath, #flowPath2'), { strokeDashoffset: 0 })
            return
          }

          gsap.set(q('#flowPath, #flowPath2'), { strokeDasharray: 1, strokeDashoffset: 1 })
          gsap.set(q('#battFill'), { scaleY: 0.08, transformOrigin: '50% 100%' })

          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: q('.hero-pin')[0] as Element,
              start: 'top top',
              end: desktop ? '+=220%' : '+=120%',
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true
            }
          })

          tl.to(q('#hero-sun'), { attr: { cy: 240 }, duration: 5 }, 0)
            .to(q('#sunGlowC'), { attr: { cy: 240 }, duration: 5 }, 0)
            .to(q('#skyTop'), { attr: { 'stop-color': '#7FB9DD' }, duration: 5 }, 0)
            .to(q('#skyMid'), { attr: { 'stop-color': '#B9D6E4' }, duration: 5 }, 0)
            .to(q('#skyBot'), { attr: { 'stop-color': '#E8DDC2' }, duration: 5 }, 0)
            .to(q('.cloud-a'), { x: -140, duration: 10 }, 0)
            .to(q('.cloud-b'), { x: -260, duration: 10 }, 0)
            .to(q('.cloud-c'), { x: -70, duration: 10 }, 0)
            .to(q('.hills-far'), { y: 10, duration: 10 }, 0)
            .to(q('.hero-foreground'), { y: 46, duration: 10 }, 0)
            .to(q('.panel-glow'), { opacity: 0.55, duration: 1.6, stagger: 0.15 }, 2.4)
            .to(q('#flowPath'), { strokeDashoffset: 0, duration: 1.8 }, 3.6)
            .to(q('#flowPath2'), { strokeDashoffset: 0, duration: 1.6 }, 4.4)
            .to(q('#battFill'), { scaleY: 1, duration: 3 }, 4.8)
            .to(q('.hero-window'), { opacity: 0.95, duration: 1.4, stagger: 0.3 }, 5.4)
            .fromTo(q('.hero-label'), { y: 10 }, { opacity: 1, y: 0, duration: 1, stagger: 0.5 }, 6)
            .to(q('.hero-copy-block'), { opacity: 0.25, y: -30, duration: 3 }, 6.5)
        }
      )
    }, root)
    return () => ctx.revert()
  }, [])

  const panels = [0, 1, 2, 3, 4]

  return (
    <section ref={root} id="top" className="relative bg-ink">
      <div className="hero-pin relative h-[100svh] min-h-[620px] overflow-hidden">
        {/* Layered scene */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1440 810"
          preserveAspectRatio="xMidYMax slice"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop id="skyTop" offset="0" stopColor="#0B1420" />
              <stop id="skyMid" offset="0.55" stopColor="#233447" />
              <stop id="skyBot" offset="1" stopColor="#6E5638" />
            </linearGradient>
            <radialGradient id="sunGlow">
              <stop offset="0" stopColor="#F5C84C" stopOpacity="0.5" />
              <stop offset="1" stopColor="#F5C84C" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width="1440" height="810" fill="url(#skyGrad)" />

          {/* Sun */}
          <circle id="sunGlowC" cx="1020" cy="700" r="150" fill="url(#sunGlow)" />
          <circle id="hero-sun" cx="1020" cy="700" r="44" fill="#F5C84C" />

          {/* Clouds */}
          <g className="cloud-a" fill="#F3F0E8" opacity="0.10">
            <ellipse cx="380" cy="170" rx="120" ry="22" />
            <ellipse cx="460" cy="150" rx="70" ry="16" />
          </g>
          <g className="cloud-b" fill="#F3F0E8" opacity="0.14">
            <ellipse cx="950" cy="110" rx="150" ry="24" />
            <ellipse cx="1050" cy="90" rx="80" ry="16" />
          </g>
          <g className="cloud-c hidden md:block" fill="#F3F0E8" opacity="0.08">
            <ellipse cx="1350" cy="230" rx="110" ry="18" />
          </g>

          {/* Distant landscape */}
          <path
            className="hills-far"
            d="M0 640 Q 200 560 420 610 T 860 600 T 1440 620 V 810 H 0 Z"
            fill="#0E1419"
          />
          <rect y="650" width="1440" height="160" fill="#0A0E11" />

          {/* House */}
          <g>
            <rect x="240" y="430" width="330" height="222" fill="#151D24" />
            <rect x="570" y="492" width="160" height="160" fill="#10161B" />
            <rect x="228" y="416" width="352" height="16" fill="#1D2830" />
            <rect x="562" y="480" width="176" height="12" fill="#1A242C" />
            {/* Solar panels */}
            {panels.map((i) => (
              <g key={i}>
                <path
                  d={`M ${252 + i * 64} 414 l 46 -24 h 14 l -46 24 Z`}
                  fill="#182430"
                  stroke="#2E4356"
                  strokeWidth="1.5"
                />
                <path
                  className="panel-glow"
                  d={`M ${252 + i * 64} 414 l 46 -24 h 14 l -46 24 Z`}
                  fill="#F5C84C"
                  opacity="0"
                />
              </g>
            ))}
            {/* Windows */}
            <rect className="hero-window" x="272" y="510" width="72" height="82" fill="#F5C84C" opacity="0" />
            <rect className="hero-window" x="380" y="510" width="110" height="82" fill="#F5C84C" opacity="0" />
            <rect className="hero-window" x="600" y="530" width="60" height="70" fill="#F5C84C" opacity="0" />
            <rect x="272" y="510" width="72" height="82" fill="none" stroke="#242F38" strokeWidth="2" />
            <rect x="380" y="510" width="110" height="82" fill="none" stroke="#242F38" strokeWidth="2" />
            <rect x="600" y="530" width="60" height="70" fill="none" stroke="#242F38" strokeWidth="2" />
          </g>

          {/* Battery cabinet */}
          <g>
            <rect x="756" y="556" width="40" height="92" rx="4" fill="#0D1216" stroke="#C9F75A" strokeWidth="2" />
            <rect id="battFill" x="762" y="562" width="28" height="80" rx="2" fill="#C9F75A" opacity="0.85" />
            <rect x="768" y="548" width="16" height="8" rx="2" fill="#C9F75A" />
          </g>

          {/* Energy paths */}
          <path
            id="flowPath"
            d="M 340 416 C 350 470, 460 500, 600 520 S 750 545, 776 556"
            fill="none"
            stroke="#C9F75A"
            strokeWidth="2.5"
            pathLength={1}
            opacity="0.9"
          />
          <path
            id="flowPath2"
            d="M 470 402 C 470 450, 440 480, 416 508"
            fill="none"
            stroke="#F5C84C"
            strokeWidth="2"
            pathLength={1}
            opacity="0.8"
          />

          {/* Foreground */}
          <g className="hero-foreground">
            <path d="M0 810 L0 700 Q 120 660 260 706 L 260 810 Z" fill="#070A0C" />
            <ellipse cx="1240" cy="700" rx="90" ry="60" fill="#070A0C" />
            <rect x="1228" y="700" width="20" height="110" fill="#070A0C" />
            <ellipse cx="1390" cy="720" rx="70" ry="46" fill="#080B0D" />
            <rect x="1382" y="720" width="16" height="90" fill="#080B0D" />
          </g>
        </svg>

        {/* System status labels */}
        <div className="hero-label absolute left-[24%] top-[46%] hidden opacity-0 md:block">
          <StatusChip color="#F5C84C" text="Array · generating" />
        </div>
        <div className="hero-label absolute left-[54%] top-[64%] hidden opacity-0 md:block">
          <StatusChip color="#C9F75A" text="Battery · charging" />
        </div>
        <div className="hero-label absolute left-[68%] top-[52%] hidden opacity-0 lg:block">
          <StatusChip color="#74BDE8" text="Grid · standby" />
        </div>

        {/* Copy */}
        <div className="container-k relative z-10 flex h-full flex-col justify-center">
          <div className="hero-copy-block max-w-3xl pt-16">
            <p className="hero-fade tag-k opacity-0">Solar + storage · Cape Town</p>
            <h1 className="display-xl mt-6 text-ivory">
              <span className="block overflow-hidden">
                <span className="hero-line-inner block">Power built around</span>
              </span>
              <span className="block overflow-hidden">
                <span className="hero-line-inner block">
                  your <span className="text-amber">life.</span>
                </span>
              </span>
            </h1>
            <p className="hero-fade mt-6 max-w-xl text-[17px] leading-relaxed text-ivory/75 opacity-0">
              Solar, battery storage and backup systems designed around how your property
              actually uses electricity.
            </p>
            <div className="hero-fade mt-9 flex flex-wrap items-center gap-4 opacity-0">
              <MagneticButton href="#contact" variant="solar">
                Get a Free Solar Assessment
              </MagneticButton>
              <MagneticButton href="#why-solar" variant="ghost">
                Follow the Energy
              </MagneticButton>
            </div>
          </div>
        </div>

        <div className="hero-fade absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 text-[12px] uppercase tracking-[0.18em] text-ivory/60 opacity-0">
          Scroll to see how the system works <ChevronDown size={14} className="animate-bounce" />
        </div>
      </div>
    </section>
  )
}

function StatusChip({ color, text }: { color: string; text: string }) {
  return (
    <span className="flex items-center gap-2 rounded-sm border border-ivory/15 bg-ink/70 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-ivory/85 backdrop-blur-sm">
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      {text}
    </span>
  )
}

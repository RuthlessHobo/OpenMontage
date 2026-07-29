import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { gsap } from '../animations/gsap'
import { brand } from '../data/brand'
import { estimate, type EstimatorInput } from '../utils/estimator'
import SectionHeading from '../components/SectionHeading'
import MagneticButton from '../components/MagneticButton'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

// Interactive demo estimator. All outputs are illustrative ranges only.
export default function Estimator() {
  const root = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()
  const [input, setInput] = useState<EstimatorInput>({
    propertyType: 'home',
    monthlyBill: 2800,
    daytimeUsage: 'medium',
    backup: 'essentials',
    batteryInterest: true,
    location: 'Cape Town'
  })
  const result = estimate(input)
  const set = <K extends keyof EstimatorInput>(key: K, value: EstimatorInput[K]) =>
    setInput((prev) => {
      const next = { ...prev, [key]: value }
      if (key === 'propertyType' && next.propertyType === 'home')
        next.monthlyBill = Math.min(next.monthlyBill, 15000)
      return next
    })

  // Section colour transition: graphite -> warm ivory as the section enters.
  useLayoutEffect(() => {
    if (reduced) return
    const ctx = gsap.context((self) => {
      gsap.fromTo(
        root.current,
        { backgroundColor: '#11171B' },
        {
          backgroundColor: '#F3F0E8',
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top 85%',
            end: 'top 30%',
            scrub: true
          }
        }
      )
      void self
    }, root)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section ref={root} id="estimate" className="bg-ivory text-ink">
      <div className="container-k py-24 md:py-32">
        <SectionHeading
          tag="Solar estimate"
          dark={false}
          title={
            <>
              Get a feel for the <span className="text-[#B07E10]">right size.</span>
            </>
          }
          copy="Adjust the inputs to see an example system range. This is a demo tool with illustrative numbers, not a quotation."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          {/* Inputs */}
          <div className="space-y-8">
            <Field label="Property">
              <Segmented
                options={[
                  { value: 'home', label: 'Home' },
                  { value: 'business', label: 'Business' }
                ]}
                value={input.propertyType}
                onChange={(v) => set('propertyType', v as EstimatorInput['propertyType'])}
              />
            </Field>

            <Field label={`Monthly electricity bill · R${input.monthlyBill.toLocaleString('en-ZA')}`}>
              <input
                type="range"
                min={500}
                max={input.propertyType === 'business' ? 60000 : 15000}
                step={100}
                value={input.monthlyBill}
                onChange={(e) => set('monthlyBill', Number(e.target.value))}
                className="w-full accent-[#B07E10]"
                aria-label="Monthly electricity bill in Rand"
              />
              <div className="flex justify-between text-[12px] text-ink/50">
                <span>R500</span>
                <span>R{(input.propertyType === 'business' ? 60000 : 15000).toLocaleString('en-ZA')}</span>
              </div>
            </Field>

            <Field label="When is most electricity used?">
              <Segmented
                options={[
                  { value: 'low', label: 'Mostly evenings' },
                  { value: 'medium', label: 'Mixed' },
                  { value: 'high', label: 'Mostly daytime' }
                ]}
                value={input.daytimeUsage}
                onChange={(v) => set('daytimeUsage', v as EstimatorInput['daytimeUsage'])}
              />
            </Field>

            <Field label="Backup requirement during interruptions">
              <Segmented
                options={[
                  { value: 'none', label: 'None' },
                  { value: 'essentials', label: 'Essentials' },
                  { value: 'most', label: 'Most circuits' }
                ]}
                value={input.backup}
                onChange={(v) => set('backup', v as EstimatorInput['backup'])}
              />
            </Field>

            <Field label="Interested in battery storage?">
              <Segmented
                options={[
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'Solar only' }
                ]}
                value={input.batteryInterest ? 'yes' : 'no'}
                onChange={(v) => set('batteryInterest', v === 'yes')}
              />
            </Field>

            <Field label="Location">
              <select
                value={input.location}
                onChange={(e) => set('location', e.target.value)}
                className="w-full rounded-sm border border-ink/20 bg-white/60 px-4 py-3 text-[15px]"
                aria-label="Location"
              >
                {brand.serviceAreas.map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </Field>
          </div>

          {/* Output */}
          <div className="h-fit border border-ink/15 bg-ink p-8 text-ivory lg:sticky lg:top-24">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber">
                Illustrative demo estimate
              </p>
              <span className="rounded-sm border border-ivory/20 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-mist">
                Demo
              </span>
            </div>

            <Gauge kw={(result.systemKwMin + result.systemKwMax) / 2} />

            <dl className="mt-2 space-y-5">
              <OutputRow
                label="Example system size"
                value={
                  <>
                    <Num value={result.systemKwMin} /> to <Num value={result.systemKwMax} /> kW
                  </>
                }
              />
              <OutputRow
                label="Example daily production"
                value={
                  <>
                    <Num value={result.dailyKwhMin} /> to <Num value={result.dailyKwhMax} /> kWh
                  </>
                }
              />
              <OutputRow
                label="Suggested battery range"
                value={
                  result.batteryKwhMax > 0 ? (
                    <>
                      <Num value={result.batteryKwhMin} /> to <Num value={result.batteryKwhMax} /> kWh
                    </>
                  ) : (
                    <span>Not required</span>
                  )
                }
              />
              <OutputRow label="Recommended next step" value={<span>{result.consultation}</span>} />
            </dl>

            <p className="mt-6 border-t border-ivory/10 pt-5 text-[13px] leading-relaxed text-mist">
              Final system sizing depends on consumption data, equipment selection, the property
              and a technical site assessment.
            </p>

            <div className="mt-6">
              <MagneticButton href="#contact" variant="solar" className="w-full">
                Book the {input.propertyType === 'business' ? 'commercial' : 'home'} assessment
                <ArrowRight size={16} />
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-ink/60">
        {label}
      </p>
      {children}
    </div>
  )
}

function Segmented({
  options,
  value,
  onChange
}: {
  options: { value: string; label: string }[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="radio"
          aria-checked={value === opt.value}
          onClick={() => onChange(opt.value)}
          className={`rounded-sm border px-4 py-2.5 text-[14px] font-medium transition-colors ${
            value === opt.value
              ? 'border-ink bg-ink text-ivory'
              : 'border-ink/20 bg-transparent text-ink/70 hover:border-ink/50'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

function OutputRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-[14px] text-mist">{label}</dt>
      <dd className="text-right font-display text-lg font-semibold text-ivory">{value}</dd>
    </div>
  )
}

// Smoothly animated number.
function Num({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const state = useRef({ v: value })
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduced) {
      el.textContent = fmt(value)
      state.current.v = value
      return
    }
    const obj = state.current
    const tween = gsap.to(obj, {
      v: value,
      duration: 0.5,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = fmt(obj.v)
      }
    })
    return () => {
      tween.kill()
    }
  }, [value, reduced])

  return <span ref={ref}>{fmt(value)}</span>
}

const fmt = (n: number) => {
  const r = Math.round(n * 2) / 2
  return Number.isInteger(r) ? String(r) : r.toFixed(1)
}

// Solar estimator gauge: an arc that fills toward the estimated size.
function Gauge({ kw }: { kw: number }) {
  const reduced = usePrefersReducedMotion()
  const pathRef = useRef<SVGPathElement>(null)
  const max = 30
  const frac = Math.min(1, kw / max)

  useEffect(() => {
    const el = pathRef.current
    if (!el) return
    const target = 1 - frac
    if (reduced) {
      el.style.strokeDashoffset = `${target}`
      return
    }
    gsap.to(el, { strokeDashoffset: target, duration: 0.6, ease: 'power2.out' })
  }, [frac, reduced])

  return (
    <div className="relative mx-auto mt-6 w-full max-w-[260px]">
      <svg viewBox="0 0 200 116" className="w-full" aria-hidden="true">
        <path
          d="M 16 108 A 84 84 0 0 1 184 108"
          fill="none"
          stroke="#2A3742"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          ref={pathRef}
          d="M 16 108 A 84 84 0 0 1 184 108"
          fill="none"
          stroke="#F5C84C"
          strokeWidth="12"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - frac}
        />
      </svg>
      <div className="absolute inset-x-0 bottom-0 text-center">
        <p className="font-display text-3xl font-semibold text-ivory">
          <Num value={kw} />
          <span className="text-base text-mist"> kW</span>
        </p>
        <p className="text-[11px] uppercase tracking-[0.16em] text-mist">Midpoint of range</p>
      </div>
    </div>
  )
}

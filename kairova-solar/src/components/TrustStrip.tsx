import { brand } from '../data/brand'

// Capability strip with fictional demo certification/supplier labels.
export default function TrustStrip() {
  return (
    <section className="border-y border-ivory/10 bg-graphite">
      <div className="container-k py-10">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          {brand.trust.capabilities.map((cap, i) => (
            <span key={cap} className="flex items-center gap-8 text-[14px] font-medium tracking-wide text-ivory/85">
              {cap}
              {i < brand.trust.capabilities.length - 1 && (
                <span className="hidden h-1.5 w-1.5 rotate-45 bg-amber/70 sm:block" aria-hidden="true" />
              )}
            </span>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-ivory/10 pt-5">
          {brand.trust.demoLabels.map((label) => (
            <span
              key={label}
              className="rounded-sm border border-ivory/15 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-mist"
            >
              {label}
            </span>
          ))}
          <span className="text-[11px] text-mist/60">
            Placeholder labels for this demo. No real accreditation is claimed.
          </span>
        </div>
      </div>
    </section>
  )
}

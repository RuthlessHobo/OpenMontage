import { ArrowRight } from 'lucide-react'
import MagneticButton from '../MagneticButton'
import { componentLabels, solarStoryCopy } from '../../data/solarStory'

/**
 * Copy layers sitting over the scene.
 *
 * Everything here is real text in the DOM, never baked into a plate, so it is
 * selectable, translatable and available to a screen reader. Both blocks are
 * held to the lower left so the roofline, array and wall equipment stay clear,
 * which is what the CTA placement rule in the brief asks for.
 */
export default function StoryCopy({ z = 80 }: { z?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0" style={{ zIndex: z }}>
      {/* Opening: stage 1 */}
      <div
        data-story-copy="opening"
        className="absolute inset-x-0 bottom-0 px-6 pb-14 sm:px-10 md:pb-20 lg:px-16"
      >
        <div className="max-w-xl">
          <p className="tag-k" data-story-copy-line>
            {solarStoryCopy.opening.eyebrow}
          </p>
          <h2
            className="display-lg mt-4 text-ivory [text-wrap:balance]"
            data-story-copy-line
          >
            {solarStoryCopy.opening.headline}
          </h2>
          <p
            className="mt-4 max-w-md text-[16px] leading-relaxed text-ivory/75"
            data-story-copy-line
          >
            {solarStoryCopy.opening.support}
          </p>
        </div>
      </div>

      {/* Closing: stage 5 */}
      <div
        data-story-copy="closing"
        className="absolute inset-x-0 bottom-0 px-6 pb-14 opacity-0 sm:px-10 md:pb-20 lg:px-16"
      >
        <div className="max-w-xl">
          <h2 className="display-lg text-ivory [text-wrap:balance]" data-story-closing-line>
            {solarStoryCopy.closing.headline}
          </h2>
          <p
            className="mt-4 max-w-md text-[16px] leading-relaxed text-ivory/75"
            data-story-closing-line
          >
            {solarStoryCopy.closing.support}
          </p>
          <div className="pointer-events-auto mt-7" data-story-closing-line>
            <MagneticButton href={solarStoryCopy.closing.cta.href} variant="solar">
              {solarStoryCopy.closing.cta.label}
              <ArrowRight size={16} />
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* Component micro labels: stage 4 onward */}
      <div className="absolute inset-0">
        {componentLabels.map((label) => (
          <p
            key={label.id}
            data-story-label={label.id}
            className={`absolute whitespace-nowrap font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-ivory/85 opacity-0 ${
              label.align === 'right' ? '-translate-x-full' : ''
            }`}
            style={{ left: `${label.x}%`, top: `${label.y}%` }}
          >
            <span
              className={`mb-1.5 block h-px w-8 bg-amber ${
                label.align === 'right' ? 'ml-auto' : ''
              }`}
            />
            {label.text}
          </p>
        ))}
      </div>
    </div>
  )
}

import { forwardRef } from 'react'
import {
  solarImageAlignment,
  solarImageSources,
  solarImageWidths,
  type PlateKey
} from '../../data/solarStory'

interface Props {
  plate: PlateKey
  /** clip-path polygon isolating one component region. Omit for a full plate. */
  clip?: string
  /** transform-origin for the gsap transform applied to the wrapper. */
  origin?: string
  z?: number
  /** Marks the plate that carries the descriptive alt text and eager load. */
  priority?: boolean
  className?: string
  'data-layer'?: string
}

/**
 * One image layer in the stacked scene.
 *
 * Two nested elements on purpose: the wrapper is what GSAP animates, the inner
 * picture carries the static per plate alignment. Keeping them separate means a
 * registration tweak in solarImageAlignment can never be clobbered by a running
 * timeline, and vice versa.
 */
const SolarImageLayer = forwardRef<HTMLDivElement, Props>(function SolarImageLayer(
  { plate, clip, origin = '50% 50%', z = 0, priority = false, className = '', ...rest },
  ref
) {
  const source = solarImageSources[plate]
  const align = solarImageAlignment[plate]
  const widest = solarImageWidths[solarImageWidths.length - 1]

  const srcSet = (ext: string) =>
    solarImageWidths.map((w) => `${source.base}-${w}.${ext} ${w}w`).join(', ')

  // React 18 only forwards the all-lowercase spelling; the camelCase prop
  // landed in React 19 and warns here. Spread so the DOM gets the real
  // attribute without tripping the unknown-prop check.
  const priorityAttrs: Record<string, string> = priority ? { fetchpriority: 'high' } : {}

  return (
    <div
      ref={ref}
      className={`absolute inset-0 ${className}`}
      style={{
        zIndex: z,
        clipPath: clip,
        transformOrigin: origin,
        // Layers are composited siblings; keeping them on their own plane stops
        // sub-pixel seams showing along the clip edges during transforms.
        backfaceVisibility: 'hidden'
      }}
      {...rest}
    >
      <picture>
        <source type="image/avif" srcSet={srcSet('avif')} sizes="100vw" />
        <source type="image/webp" srcSet={srcSet('webp')} sizes="100vw" />
        <img
          src={`${source.base}-${widest}.jpg`}
          srcSet={srcSet('jpg')}
          sizes="100vw"
          alt={source.alt}
          aria-hidden={source.alt === '' ? true : undefined}
          width={1600}
          height={960}
          decoding={priority ? 'sync' : 'async'}
          loading={priority ? 'eager' : 'lazy'}
          {...priorityAttrs}
          draggable={false}
          className="h-full w-full select-none object-cover"
          style={{
            objectPosition: '50% 42%',
            transform: `translate3d(${align.x}%, ${align.y}%, 0) scale(${align.scale}) rotate(${align.rotation}deg)`
          }}
        />
      </picture>
    </div>
  )
})

export default SolarImageLayer

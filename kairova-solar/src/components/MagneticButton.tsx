import { useEffect, useRef, type ReactNode } from 'react'
import { gsap } from '../animations/gsap'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

type Variant = 'solar' | 'ghost' | 'ink'

interface Props {
  children: ReactNode
  variant?: Variant
  href?: string
  type?: 'button' | 'submit'
  onClick?: () => void
  className?: string
  disabled?: boolean
}

const styles: Record<Variant, string> = {
  solar:
    'bg-amber text-ink hover:bg-[#ffd763] font-semibold',
  ghost:
    'border border-ivory/25 text-ivory hover:border-amber hover:text-amber font-medium',
  ink: 'bg-ink text-ivory hover:bg-graphite font-semibold'
}

// Button with a magnetic pull on fine pointers. Falls back to a plain button
// on touch devices and when reduced motion is preferred.
export default function MagneticButton({
  children,
  variant = 'solar',
  href,
  type = 'button',
  onClick,
  className = '',
  disabled
}: Props) {
  const wrapRef = useRef<HTMLSpanElement>(null)
  const innerRef = useRef<HTMLSpanElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const wrap = wrapRef.current
    const inner = innerRef.current
    if (!wrap || !inner || reduced) return
    if (!window.matchMedia('(pointer: fine) and (min-width: 1024px)').matches) return

    const xTo = gsap.quickTo(inner, 'x', { duration: 0.4, ease: 'power3' })
    const yTo = gsap.quickTo(inner, 'y', { duration: 0.4, ease: 'power3' })
    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect()
      xTo((e.clientX - (r.left + r.width / 2)) * 0.3)
      yTo((e.clientY - (r.top + r.height / 2)) * 0.3)
    }
    const onLeave = () => {
      xTo(0)
      yTo(0)
    }
    wrap.addEventListener('pointermove', onMove)
    wrap.addEventListener('pointerleave', onLeave)
    return () => {
      wrap.removeEventListener('pointermove', onMove)
      wrap.removeEventListener('pointerleave', onLeave)
    }
  }, [reduced])

  const cls = `inline-flex items-center justify-center gap-2 px-7 py-3.5 text-[15px] tracking-wide transition-colors duration-200 rounded-sm ${styles[variant]} ${disabled ? 'opacity-60 pointer-events-none' : ''} ${className}`

  return (
    <span ref={wrapRef} className="inline-block p-1 -m-1">
      <span ref={innerRef} className="inline-block will-change-transform">
        {href ? (
          <a href={href} className={cls} onClick={onClick}>
            {children}
          </a>
        ) : (
          <button type={type} className={cls} onClick={onClick} disabled={disabled}>
            {children}
          </button>
        )}
      </span>
    </span>
  )
}

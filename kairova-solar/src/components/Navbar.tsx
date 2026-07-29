import { useEffect, useState } from 'react'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { brand } from '../data/brand'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-ink/90 backdrop-blur-md border-b border-ivory/10 py-3' : 'bg-transparent py-6'
      }`}
    >
      <div className="container-k flex items-center justify-between">
        <a href="#top" aria-label="Kairova Solar, back to top" onClick={() => setOpen(false)}>
          <img
            src="/brand/kairova-logo-full.svg"
            alt="Kairova Solar"
            className={`transition-all duration-500 ${scrolled ? 'h-8' : 'h-10'} w-auto`}
          />
        </a>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {brand.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[14px] font-medium tracking-wide text-ivory/80 transition-colors hover:text-amber"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            className="ml-2 inline-flex items-center gap-1.5 rounded-sm bg-amber px-5 py-2.5 text-[14px] font-semibold text-ink transition-colors hover:bg-[#ffd763]"
          >
            Free Assessment <ArrowUpRight size={15} strokeWidth={2.4} />
          </a>
        </nav>

        <button
          className="rounded-sm p-2 text-ivory lg:hidden"
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`fixed inset-x-0 top-0 -z-10 bg-ink transition-[clip-path] duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] lg:hidden ${
          open ? '[clip-path:inset(0_0_0%_0)]' : '[clip-path:inset(0_0_100%_0)] pointer-events-none'
        }`}
        style={{ height: '100dvh' }}
        aria-hidden={!open}
      >
        <nav className="container-k flex h-full flex-col justify-center gap-2" aria-label="Mobile">
          {brand.nav.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`font-display text-4xl font-semibold text-ivory transition-all duration-500 hover:text-amber ${
                open ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
              }`}
              style={{ transitionDelay: open ? `${120 + i * 60}ms` : '0ms' }}
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className={`mt-6 inline-flex w-fit items-center gap-2 rounded-sm bg-amber px-6 py-3.5 font-semibold text-ink transition-all duration-500 ${
              open ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`}
            style={{ transitionDelay: open ? '440ms' : '0ms' }}
          >
            Free Assessment <ArrowUpRight size={17} />
          </a>
          <p className="mt-10 text-sm text-mist">{brand.contact.phone}</p>
        </nav>
      </div>
    </header>
  )
}

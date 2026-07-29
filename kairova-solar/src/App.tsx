import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import TrustStrip from './components/TrustStrip'
import Hero from './sections/Hero'
import SolarSystemStory from './sections/SolarSystemStory'
import Services from './sections/Services'
import Estimator from './sections/Estimator'
import Process from './sections/Process'
import Projects from './sections/Projects'
import WhyKairova from './sections/WhyKairova'
import Reviews from './sections/Reviews'
import Faq from './sections/Faq'
import Contact from './sections/Contact'
import { useLenis } from './hooks/useLenis'
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion'
import { ScrollTrigger } from './animations/gsap'

// Kairova Solar is a fictional demonstration brand.
export default function App() {
  const reduced = usePrefersReducedMotion()
  useLenis(!reduced)

  // Refresh trigger positions once fonts have loaded (heading sizes shift).
  useEffect(() => {
    let cancelled = false
    document.fonts?.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh()
    })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        {/* SolarSystemStory carries the "#why-solar" anchor that the nav links
            to. It replaces the old EnergyStory diagram, which told the same
            story as a flat SVG. That file is left in src/sections/ untouched:
            swap the import above to bring it back. */}
        <SolarSystemStory />
        <Services />
        <Estimator />
        <Process />
        <Projects />
        <WhyKairova />
        <Reviews />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

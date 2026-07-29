import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Single registration point so every section imports the same configured instance.
export { gsap, ScrollTrigger }

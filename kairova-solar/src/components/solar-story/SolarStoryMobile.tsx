import EnergyFlowOverlay from './EnergyFlowOverlay'
import SolarImageLayer from './SolarImageLayer'
import StoryCopy from './StoryCopy'

/**
 * The pinned scene for small screens.
 *
 * Same five beats and the same master timeline, but the component separation is
 * carried entirely by the three photographs rather than by masked cutouts.
 * Pulling parts apart on a 390px wide frame produces overlap that reads as a
 * glitch rather than an exploded view, so the cutouts are dropped and the
 * budget is spent on the plate crossfades and the energy route instead.
 */
export default function SolarStoryMobile() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-ink" data-solar-scene>
      <div className="absolute inset-0" data-camera>
        <SolarImageLayer data-plate="assembled" plate="assembled" z={10} priority />
        <SolarImageLayer data-plate="partial" plate="partial" z={20} className="opacity-0" />
        <SolarImageLayer data-plate="exploded" plate="exploded" z={30} className="opacity-0" />

        <div
          data-sunlight
          className="pointer-events-none absolute inset-0 mix-blend-screen"
          style={{
            zIndex: 35,
            background:
              'radial-gradient(58% 44% at 24% 18%, rgba(255,214,140,0.26), rgba(255,214,140,0) 72%)'
          }}
        />

        <EnergyFlowOverlay z={40} />
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          zIndex: 45,
          background:
            'linear-gradient(to top, rgba(9,11,13,0.92) 0%, rgba(9,11,13,0.5) 26%, rgba(9,11,13,0) 56%)'
        }}
      />

      <StoryCopy z={50} />
    </div>
  )
}

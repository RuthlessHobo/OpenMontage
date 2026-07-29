import { SOLAR_STORY_DEBUG, solarLayers } from '../../data/solarStory'
import EnergyFlowOverlay from './EnergyFlowOverlay'
import SolarImageLayer from './SolarImageLayer'
import StoryCopy from './StoryCopy'

/**
 * The pinned scene for tablet and desktop.
 *
 * Build order, back to front:
 *   1. masked cutouts of the assembled plate, which perform the physical
 *      separation and the stage 1 parallax
 *   2. the partially opened plate, crossfaded in during stage 3
 *   3. the fully exploded plate, crossfaded in during stage 4
 *   4. the energy route
 *   5. scrim and copy
 *
 * The cutouts are what stop the plate changes reading as a slideshow: by the
 * time each photograph arrives, the components under it have already started
 * moving in the same direction.
 */
/** The array polygon, reused for the capture highlight. */
const panelsClip =
  solarLayers.find((l) => l.id === 'panels')?.clip ?? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'

export default function SolarStoryScene() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-ink" data-solar-scene>
      {/* Everything that belongs to the photograph sits inside the camera so the
          slow push in stage 1 moves the scene as one object. */}
      <div className="absolute inset-0" data-camera>
        {solarLayers.map((layer) => (
          <SolarImageLayer
            key={layer.id}
            data-layer={layer.id}
            plate={layer.plate}
            clip={layer.id === 'background' ? undefined : layer.clip}
            origin={layer.origin}
            z={layer.z}
            priority={layer.id === 'background'}
          />
        ))}

        {/* Warm wash confined to the array polygon. A separate element rather
            than a filter on the panels layer: this animates opacity only, where
            filter: brightness() on a full-bleed image repaints every frame. */}
        <div
          data-panel-glow
          className="pointer-events-none absolute inset-0 opacity-0 mix-blend-screen"
          style={{
            zIndex: 62,
            clipPath: panelsClip,
            background:
              'linear-gradient(118deg, rgba(245,200,76,0.42) 0%, rgba(255,224,150,0.30) 45%, rgba(201,247,90,0.20) 100%)'
          }}
        />

        <SolarImageLayer data-plate="partial" plate="partial" z={64} className="opacity-0" />
        <SolarImageLayer data-plate="exploded" plate="exploded" z={68} className="opacity-0" />

        {/* Warm key light drifting across the array. Kept very low contrast: it
            should read as the sun moving, not as a lens effect. */}
        <div
          data-sunlight
          className="pointer-events-none absolute inset-0 mix-blend-screen"
          style={{
            zIndex: 69,
            background:
              'radial-gradient(46% 40% at 22% 18%, rgba(255,214,140,0.30), rgba(255,214,140,0) 70%)'
          }}
        />

        <EnergyFlowOverlay z={70} />
      </div>

      {/* Legibility scrim for the copy. Bottom weighted so the roof stays clean. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          zIndex: 75,
          background:
            'linear-gradient(to top, rgba(9,11,13,0.88) 0%, rgba(9,11,13,0.45) 22%, rgba(9,11,13,0) 52%)'
        }}
      />
      {/* Slight corner falloff keeps the frame cinematic without visible blur. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          zIndex: 76,
          background:
            'radial-gradient(120% 100% at 50% 45%, rgba(9,11,13,0) 55%, rgba(9,11,13,0.55) 100%)'
        }}
      />

      <StoryCopy z={80} />

      {SOLAR_STORY_DEBUG && <DebugLayerBounds />}
    </div>
  )
}

/** Outlines every clip region so the polygons can be traced against the plate. */
function DebugLayerBounds() {
  return (
    <div className="pointer-events-none absolute inset-0" style={{ zIndex: 90 }}>
      {solarLayers
        .filter((l) => l.id !== 'background')
        .map((layer) => (
          <div
            key={`bounds-${layer.id}`}
            className="absolute inset-0"
            style={{
              clipPath: layer.clip,
              outline: '1px solid rgba(255,59,107,0.9)',
              background:
                'repeating-linear-gradient(45deg, rgba(255,59,107,0.16) 0 6px, rgba(255,59,107,0) 6px 12px)'
            }}
          >
            <span
              className="absolute font-mono text-[10px] text-[#FF3B6B]"
              style={{ left: layer.origin.split(' ')[0], top: layer.origin.split(' ')[1] }}
            >
              {layer.id}
            </span>
          </div>
        ))}
    </div>
  )
}

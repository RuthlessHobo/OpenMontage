// SolarSystemStory configuration.
//
// Every number that needs tuning lives in this file. Nothing here depends on the
// animation code, so alignment can be corrected without touching a timeline.
//
// Geometry below is derived from the supplied photography: a rural gable-roof
// home at golden hour, main array on the front roof plane running lower-left to
// upper-right, a secondary group on the right plane, and the inverter and
// battery mounted on the right-hand gable wall.
//
// Kairova Solar is a fictional demonstration brand.

/** Development overlay: scroll progress, stage, layer bounds, path anchors. */
export const SOLAR_STORY_DEBUG = false

/** Scroll distance of the section, expressed in viewport heights. */
export const SOLAR_STORY_SCROLL_VH = 450
/** Shorter travel on small screens: fewer moving parts to read. */
export const SOLAR_STORY_SCROLL_VH_MOBILE = 300

/**
 * Natural aspect of the source plates. The energy overlay uses this as its
 * viewBox with preserveAspectRatio="xMidYMid slice" so it crops exactly the way
 * object-fit: cover crops the photographs, which keeps every anchor locked to
 * the feature it points at.
 *
 * If the delivered files are a different shape, set it here and nothing else
 * needs to move.
 */
export const ENERGY_VIEWBOX = { width: 1600, height: 960 } as const

/**
 * Per plate alignment. The three photographs do not line up perfectly (the wall
 * equipment in particular sits higher in the opened plates than in the
 * assembled one), so the house, roofline and array are registered against each
 * other here before any animation runs.
 *
 * scale is a multiplier, x/y are percentages of the stage box, rotation is
 * degrees. Never stretch: aspect ratio is preserved by object-fit.
 *
 * Turn on SOLAR_STORY_DEBUG to get a registration grid for dialling these in.
 */
export const solarImageAlignment = {
  assembled: { scale: 1, x: 0, y: 0, rotation: 0 },
  partial: { scale: 1, x: 0, y: 0, rotation: 0 },
  exploded: { scale: 1, x: 0, y: 0, rotation: 0 }
} as const

export type PlateKey = keyof typeof solarImageAlignment

/** Where the optimised responsive assets live (see scripts/optimize-solar-images.mjs). */
export const solarImageSources: Record<PlateKey, { base: string; alt: string }> = {
  assembled: {
    base: '/solar-story/assembled',
    alt: 'A rural home at sunset with a complete solar array installed across its metal roof (demo image).'
  },
  // Decorative: these two plates repeat the same subject mid-sequence, and the
  // narrative is carried by real text in StoryCopy.
  partial: { base: '/solar-story/partial', alt: '' },
  exploded: { base: '/solar-story/exploded', alt: '' }
}

/** Widths emitted by the optimisation script, smallest first. */
export const solarImageWidths = [960, 1600, 2400] as const

/** Stage boundaries as master timeline progress (0 to 1). */
export const STAGES = {
  home: { from: 0, to: 0.18 },
  capture: { from: 0.18, to: 0.35 },
  separation: { from: 0.35, to: 0.58 },
  exploded: { from: 0.58, to: 0.82 },
  overview: { from: 0.82, to: 1 }
} as const

export type StageKey = keyof typeof STAGES

export const STAGE_ORDER: StageKey[] = ['home', 'capture', 'separation', 'exploded', 'overview']

export const STAGE_LABELS: Record<StageKey, string> = {
  home: 'Complete home',
  capture: 'Solar capture',
  separation: 'Initial separation',
  exploded: 'Full exploded view',
  overview: 'System overview'
}

/**
 * Pseudo layers cut out of the flattened plates with clip-path.
 *
 * The supplied plates already contain most of the separation, so these layers
 * deliberately move only a little: their job is to make the crossfade between
 * plates read as physical movement rather than a dissolve. Pushing these values
 * hard will fight the photography instead of supporting it.
 *
 * `clip` is a polygon in percentages of the stage box, traced over the
 * assembled plate. `origin` is the transform-origin, set to the real component
 * position so movement pivots where the part actually sits. `partial` and
 * `full` are offsets at stage 3 and stage 4, in percentages of the stage box.
 */
export interface SolarLayer {
  id: string
  plate: PlateKey
  label: string
  clip: string
  origin: string
  partial: LayerTransform
  full: LayerTransform
  /** Stacking order, higher sits closer to the camera. */
  z: number
  /** Layers nearer the camera separate first. */
  stagger: number
}

export interface LayerTransform {
  x?: number
  y?: number
  scale?: number
  rotateX?: number
  rotateY?: number
}

export const solarLayers: SolarLayer[] = [
  {
    id: 'background',
    plate: 'assembled',
    label: 'Landscape',
    clip: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    origin: '50% 40%',
    partial: {},
    full: {},
    z: 10,
    stagger: 0
  },
  {
    id: 'house',
    plate: 'assembled',
    label: 'Home',
    clip: 'polygon(4% 44%, 98% 34%, 98% 100%, 4% 100%)',
    origin: '50% 74%',
    partial: { y: 0.3 },
    full: { y: 0.9 },
    z: 20,
    stagger: 0.02
  },
  {
    id: 'roof',
    plate: 'assembled',
    label: 'Roof and cutaway',
    clip: 'polygon(5% 52%, 33% 27%, 75% 13%, 98% 41%, 98% 57%, 5% 69%)',
    origin: '52% 36%',
    partial: { y: -1.1, scale: 1.004 },
    full: { y: -3.4, scale: 1.01, rotateX: 1.2 },
    z: 30,
    stagger: 0.06
  },
  {
    id: 'wiring',
    plate: 'assembled',
    label: 'Roof cabling',
    clip: 'polygon(60% 22%, 82% 38%, 88% 62%, 74% 62%, 68% 40%, 55% 28%)',
    origin: '72% 42%',
    partial: { y: -2.4, x: 0.6 },
    full: { y: -6.8, x: 1.8, scale: 1.01 },
    z: 40,
    stagger: 0.1
  },
  {
    id: 'rails',
    plate: 'assembled',
    label: 'Mounting rails',
    clip: 'polygon(27% 47%, 67% 20%, 78% 27%, 40% 63%)',
    origin: '52% 40%',
    partial: { y: -3.8 },
    full: { y: -10.5, scale: 1.014, rotateX: 1.4 },
    z: 50,
    stagger: 0.14
  },
  {
    id: 'panels',
    plate: 'assembled',
    label: 'Solar array',
    clip: 'polygon(26% 46%, 66% 19%, 77% 26%, 39% 62%)',
    origin: '52% 38%',
    partial: { y: -6.4, scale: 1.018 },
    full: { y: -17.5, scale: 1.045, rotateX: 2 },
    z: 60,
    stagger: 0.18
  },
  {
    id: 'panelsSecondary',
    plate: 'assembled',
    label: 'Secondary array',
    clip: 'polygon(54% 20%, 78% 15%, 80% 27%, 60% 33%)',
    origin: '67% 23%',
    partial: { y: -5.2, x: 1.2, scale: 1.014 },
    full: { y: -14, x: 3.4, scale: 1.035, rotateX: 1.8 },
    z: 58,
    stagger: 0.2
  },
  {
    id: 'inverter',
    plate: 'assembled',
    label: 'Inverter',
    clip: 'polygon(78% 56%, 92% 56%, 92% 74%, 78% 74%)',
    origin: '85% 65%',
    partial: { x: 2.6, y: -0.5 },
    full: { x: 7.6, y: -2, scale: 1.035 },
    z: 55,
    stagger: 0.22
  },
  {
    id: 'battery',
    plate: 'assembled',
    label: 'Battery storage',
    clip: 'polygon(76% 72%, 89% 72%, 89% 90%, 76% 90%)',
    origin: '82% 81%',
    partial: { x: 3.6, y: 0.7 },
    full: { x: 10.5, y: 2.2, scale: 1.035 },
    z: 45,
    stagger: 0.26
  }
]

/** Movement is dialled back on smaller screens rather than removed. */
export const LAYER_DISTANCE_SCALE = { desktop: 1, tablet: 0.62 } as const

/**
 * Energy route, in ENERGY_VIEWBOX units, traced along the run visible in the
 * opened plates: across the array, down the right-hand roof edge, into the
 * inverter, across to the battery, then back into the house.
 */
export interface EnergySegment {
  id: string
  label: string
  d: string
  /** Window within the capture stage, 0 to 1, when this segment draws. */
  from: number
  to: number
}

export const energySegments: EnergySegment[] = [
  {
    id: 'array',
    label: 'Solar capture',
    d: 'M 470 470 C 640 410, 800 350, 1010 268',
    from: 0,
    to: 0.3
  },
  {
    id: 'cabling',
    label: 'Roof cabling',
    d: 'M 1010 268 C 1120 300, 1215 350, 1268 452',
    from: 0.26,
    to: 0.52
  },
  {
    id: 'inverter',
    label: 'Intelligent conversion',
    d: 'M 1268 452 C 1310 510, 1340 560, 1352 612',
    from: 0.48,
    to: 0.72
  },
  {
    id: 'battery',
    label: 'Battery storage',
    d: 'M 1352 612 C 1348 680, 1330 730, 1306 772',
    from: 0.68,
    to: 0.88
  },
  {
    id: 'home',
    label: 'Home distribution',
    d: 'M 1352 612 C 1170 680, 990 726, 820 762',
    from: 0.8,
    to: 1
  }
]

/** Nodes pulse as the route reaches them. */
export interface EnergyNode {
  id: string
  cx: number
  cy: number
  r: number
  at: number
}

export const energyNodes: EnergyNode[] = [
  { id: 'n-array', cx: 470, cy: 470, r: 7, at: 0.05 },
  { id: 'n-roof', cx: 1010, cy: 268, r: 6, at: 0.32 },
  { id: 'n-inverter', cx: 1352, cy: 612, r: 9, at: 0.66 },
  { id: 'n-battery', cx: 1306, cy: 772, r: 8, at: 0.86 },
  { id: 'n-home', cx: 820, cy: 762, r: 7, at: 0.96 }
]

/** Micro labels beside the components in the exploded state. */
export interface ComponentLabel {
  id: string
  text: string
  /** Percentages of the stage box. */
  x: number
  y: number
  align: 'left' | 'right'
}

export const componentLabels: ComponentLabel[] = [
  { id: 'l-capture', text: 'Solar capture', x: 24, y: 20, align: 'left' },
  { id: 'l-conversion', text: 'Intelligent conversion', x: 94, y: 52, align: 'right' },
  { id: 'l-storage', text: 'Battery storage', x: 94, y: 78, align: 'right' },
  { id: 'l-distribution', text: 'Home distribution', x: 38, y: 88, align: 'left' }
]

/** Copy blocks. Real text in the DOM, never baked into an image. */
export const solarStoryCopy = {
  opening: {
    eyebrow: 'The system',
    headline: 'Power, working as one.',
    support: 'A complete energy system designed around your home.'
  },
  closing: {
    headline: 'Every component. One intelligent system.',
    support: 'From sunlight to stored energy, every part works together.',
    cta: { label: 'Explore our solar packages', href: '#solutions' }
  },
  /** Reduced motion and assistive summary of the sequence. */
  sequence: [
    'Solar panels capture energy from daylight.',
    'Electricity flows through the roof cabling.',
    'Power enters the inverter and is converted for the property.',
    'Surplus energy is stored in the battery.',
    'The home draws what it needs from one connected system.'
  ]
} as const

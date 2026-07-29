import {
  ENERGY_VIEWBOX,
  SOLAR_STORY_DEBUG,
  energyNodes,
  energySegments
} from '../../data/solarStory'

interface Props {
  z?: number
}

/**
 * The energy route drawn over the photography.
 *
 * Every stroke uses pathLength={1} with strokeDasharray/strokeDashoffset of 1,
 * which is the project convention: it avoids getTotalLength() so the draw stays
 * correct after a resize without re-measuring.
 *
 * preserveAspectRatio="xMidYMid slice" makes the overlay crop exactly the way
 * object-fit: cover crops the plates, so anchors stay locked to the components
 * they point at across every viewport.
 */
export default function EnergyFlowOverlay({ z = 70 }: Props) {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ zIndex: z }}
      viewBox={`0 0 ${ENERGY_VIEWBOX.width} ${ENERGY_VIEWBOX.height}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      data-energy-overlay
    >
      <defs>
        {/* Soft warm bloom. Deliberately low stdDeviation: the brief calls for
            sunlight catching a cable run, not a neon circuit. */}
        <filter id="energyBloom" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="7" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="energyStroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F5C84C" />
          <stop offset="55%" stopColor="#FFDE8A" />
          <stop offset="100%" stopColor="#C9F75A" />
        </linearGradient>
      </defs>

      {/* Wide, heavily blurred underlay reads as light spilling onto the roof. */}
      <g filter="url(#energyBloom)" opacity="0.55">
        {energySegments.map((seg) => (
          <path
            key={`glow-${seg.id}`}
            data-energy-glow={seg.id}
            d={seg.d}
            fill="none"
            stroke="url(#energyStroke)"
            strokeWidth="14"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1}
          />
        ))}
      </g>

      {/* Crisp core stroke. */}
      <g>
        {energySegments.map((seg) => (
          <path
            key={`core-${seg.id}`}
            data-energy-core={seg.id}
            d={seg.d}
            fill="none"
            stroke="url(#energyStroke)"
            strokeWidth="3"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1}
          />
        ))}
      </g>

      {/* Junctions: array, roof transition, inverter, battery, distribution. */}
      <g>
        {energyNodes.map((node) => (
          <g key={node.id} data-energy-node={node.id} opacity={0}>
            <circle
              cx={node.cx}
              cy={node.cy}
              r={node.r * 2.6}
              fill="#F5C84C"
              opacity="0.16"
              filter="url(#energyBloom)"
            />
            <circle cx={node.cx} cy={node.cy} r={node.r} fill="#FFE6A6" />
            <circle
              cx={node.cx}
              cy={node.cy}
              r={node.r + 5}
              fill="none"
              stroke="#F5C84C"
              strokeWidth="1.5"
              opacity="0.7"
            />
          </g>
        ))}
      </g>

      {SOLAR_STORY_DEBUG && (
        <g>
          {energyNodes.map((node) => (
            <g key={`dbg-${node.id}`}>
              <circle
                cx={node.cx}
                cy={node.cy}
                r="4"
                fill="#FF3B6B"
                stroke="#fff"
                strokeWidth="1"
              />
              <text
                x={node.cx + 12}
                y={node.cy - 10}
                fill="#FF3B6B"
                fontSize="20"
                fontFamily="monospace"
              >
                {node.cx},{node.cy}
              </text>
            </g>
          ))}
        </g>
      )}
    </svg>
  )
}

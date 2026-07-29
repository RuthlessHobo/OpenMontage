// Original line-art SVG illustrations for each service.
// Consistent system: graphite panel, thin strokes, amber/lime/sky accents.

const stroke = '#3A4A56'

export function ResidentialIllo() {
  return (
    <svg viewBox="0 0 220 150" className="h-full w-full" aria-hidden="true">
      <path d="M30 90 L110 38 L190 90" fill="none" stroke={stroke} strokeWidth="2.5" />
      <rect x="46" y="90" width="128" height="48" fill="none" stroke={stroke} strokeWidth="2.5" />
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M ${64 + i * 34} 78 l 24 -16 h 10 l -24 16 Z`}
          fill="#F5C84C"
          opacity={0.85 - i * 0.2}
        />
      ))}
      <rect x="98" y="104" width="24" height="34" fill="none" stroke={stroke} strokeWidth="2" />
      <circle cx="186" cy="30" r="12" fill="none" stroke="#F5C84C" strokeWidth="2.5" />
      <line x1="186" y1="10" x2="186" y2="16" stroke="#F5C84C" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="203" y1="30" x2="209" y2="30" stroke="#F5C84C" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

export function BatteryIllo() {
  return (
    <svg viewBox="0 0 220 150" className="h-full w-full" aria-hidden="true">
      <rect x="76" y="34" width="68" height="96" rx="8" fill="none" stroke={stroke} strokeWidth="2.5" />
      <rect x="94" y="24" width="32" height="10" rx="3" fill="none" stroke={stroke} strokeWidth="2.5" />
      <rect x="86" y="82" width="48" height="38" rx="4" fill="#C9F75A" opacity="0.85" />
      <rect x="86" y="62" width="48" height="14" rx="4" fill="#C9F75A" opacity="0.35" />
      <path d="M112 48 l -10 18 h 10 l -6 16" fill="none" stroke="#11171B" strokeWidth="0" />
      <path d="M40 110 C 52 108 62 104 72 96" fill="none" stroke="#C9F75A" strokeWidth="2" strokeDasharray="4 5" />
      <path d="M148 96 C 160 104 172 108 184 110" fill="none" stroke="#C9F75A" strokeWidth="2" strokeDasharray="4 5" />
      <circle cx="36" cy="112" r="4" fill="#C9F75A" />
      <circle cx="188" cy="112" r="4" fill="#C9F75A" />
    </svg>
  )
}

export function CommercialIllo() {
  return (
    <svg viewBox="0 0 220 150" className="h-full w-full" aria-hidden="true">
      <rect x="28" y="58" width="80" height="80" fill="none" stroke={stroke} strokeWidth="2.5" />
      <rect x="108" y="78" width="86" height="60" fill="none" stroke={stroke} strokeWidth="2.5" />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M ${34 + i * 18} 52 l 12 -8 h 6 l -12 8 Z`} fill="#F5C84C" opacity="0.8" />
      ))}
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M ${116 + i * 26} 72 l 16 -10 h 8 l -16 10 Z`} fill="#F5C84C" opacity="0.55" />
      ))}
      {[0, 1].map((r) =>
        [0, 1, 2].map((c) => (
          <rect key={`${r}${c}`} x={40 + c * 22} y={72 + r * 26} width="12" height="14" fill="#74BDE8" opacity="0.5" />
        ))
      )}
      <rect x="122" y="94" width="58" height="10" fill="#74BDE8" opacity="0.35" />
    </svg>
  )
}

export function UpgradeIllo() {
  return (
    <svg viewBox="0 0 220 150" className="h-full w-full" aria-hidden="true">
      {[0, 1].map((i) => (
        <path key={i} d={`M ${44 + i * 52} 96 l 36 -24 h 12 l -36 24 Z`} fill="none" stroke={stroke} strokeWidth="2.5" />
      ))}
      <path d="M148 72 l 36 -24 h 12 l -36 24 Z" fill="#C9F75A" opacity="0.85" />
      <path d="M148 72 l 36 -24 h 12 l -36 24 Z" fill="none" stroke="#C9F75A" strokeWidth="2" />
      <line x1="120" y1="122" x2="160" y2="122" stroke={stroke} strokeWidth="2.5" />
      <path d="M170 112 v 20 M 160 122 h 20" stroke="#F5C84C" strokeWidth="3" strokeLinecap="round" />
      <path d="M36 118 C 60 128 96 130 118 122" fill="none" stroke={stroke} strokeWidth="2" strokeDasharray="4 5" />
    </svg>
  )
}

export function MonitoringIllo() {
  return (
    <svg viewBox="0 0 220 150" className="h-full w-full" aria-hidden="true">
      <rect x="36" y="34" width="148" height="90" rx="8" fill="none" stroke={stroke} strokeWidth="2.5" />
      <path
        d="M52 96 L 76 78 L 96 88 L 122 60 L 146 70 L 168 50"
        fill="none"
        stroke="#74BDE8"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <circle cx="122" cy="60" r="4" fill="#F5C84C" />
      <line x1="52" y1="110" x2="92" y2="110" stroke={stroke} strokeWidth="2" />
      <line x1="100" y1="110" x2="124" y2="110" stroke={stroke} strokeWidth="2" />
      <rect x="150" y="104" width="18" height="12" rx="2" fill="#C9F75A" opacity="0.8" />
      <line x1="96" y1="132" x2="124" y2="132" stroke={stroke} strokeWidth="2.5" />
    </svg>
  )
}

export const illustrationById = {
  residential: ResidentialIllo,
  battery: BatteryIllo,
  commercial: CommercialIllo,
  upgrades: UpgradeIllo,
  monitoring: MonitoringIllo
} as const

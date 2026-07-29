#!/usr/bin/env node
/**
 * Scaffolding only.
 *
 * Writes three clearly marked schematic plates into assets-src/solar-story/ so
 * SolarSystemStory renders, animates and can be tested before the real
 * photography is in the repo. They are labelled PLACEHOLDER on purpose: nobody
 * should ever mistake these for the delivered images or ship them.
 *
 * The geometry matches the clip regions in src/data/solarStory.ts, so alignment
 * and path work done against these carries over to the real plates.
 *
 * Replace by dropping the real files into assets-src/solar-story/ and running
 * npm run optimize:solar. This script is never part of the build.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.join(ROOT, 'assets-src', 'solar-story')
const W = 1600
const H = 960

// Array quad, matching the `panels` clip polygon.
const QUAD = [
  [416, 442],
  [1056, 182],
  [1232, 250],
  [624, 595]
]

const lerp = (a, b, t) => a + (b - a) * t
/** Bilinear point inside the array quad. */
function quadPoint(u, v) {
  const [p0, p1, p2, p3] = QUAD
  const top = [lerp(p0[0], p1[0], u), lerp(p0[1], p1[1], u)]
  const bottom = [lerp(p3[0], p2[0], u), lerp(p3[1], p2[1], u)]
  return [lerp(top[0], bottom[0], v), lerp(top[1], bottom[1], v)]
}

function panelGrid(lift, cols = 5, rows = 3) {
  const cells = []
  const g = 0.012
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const pts = [
        quadPoint(c / cols + g, r / rows + g),
        quadPoint((c + 1) / cols - g, r / rows + g),
        quadPoint((c + 1) / cols - g, (r + 1) / rows - g),
        quadPoint(c / cols + g, (r + 1) / rows - g)
      ]
        .map(([x, y]) => `${x.toFixed(1)},${(y - lift).toFixed(1)}`)
        .join(' ')
      cells.push(
        `<polygon points="${pts}" fill="#16202B" stroke="#5C7A88" stroke-width="1.6" opacity="0.96"/>`
      )
    }
  }
  return cells.join('')
}

function rails() {
  const lines = []
  for (let r = 0; r <= 3; r++) {
    const a = quadPoint(0, r / 3)
    const b = quadPoint(1, r / 3)
    lines.push(
      `<line x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}" stroke="#9BA7B0" stroke-width="7" stroke-linecap="round"/>`
    )
  }
  return lines.join('')
}

function plate({ label, lift, showRails, glow }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#F6C88A"/><stop offset="55%" stop-color="#E8C79C"/><stop offset="100%" stop-color="#D9C7A6"/>
    </linearGradient>
    <linearGradient id="roof" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#2A3138"/><stop offset="100%" stop-color="#171D23"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#sky)"/>
  <circle cx="150" cy="150" r="95" fill="#FFE6B0" opacity="0.85"/>
  <path d="M0 470 Q 300 400 620 452 T 1600 430 L1600 620 L0 620 Z" fill="#C9B489" opacity="0.75"/>
  <rect y="600" width="${W}" height="360" fill="#B7A377"/>

  <!-- house body -->
  <polygon points="64,422 1568,326 1568,960 64,960" fill="#8E8579"/>
  <!-- roof plane -->
  <polygon points="80,499 528,259 1200,125 1568,394 1568,547 80,662" fill="url(#roof)"/>

  ${showRails ? rails() : ''}
  ${panelGrid(lift)}

  <!-- wall equipment: inverter and battery -->
  <rect x="1248" y="538" width="150" height="150" rx="8" fill="#E7E7E4" stroke="#3A424A" stroke-width="4"/>
  <rect x="1272" y="566" width="102" height="52" rx="4" fill="#2B333B"/>
  <rect x="1216" y="700" width="145" height="150" rx="8" fill="#D8D8D4" stroke="#3A424A" stroke-width="4"/>

  ${
    glow
      ? `<g stroke="#F5C84C" stroke-width="6" fill="none" opacity="0.9" stroke-linecap="round">
           <path d="M 470 470 C 640 410, 800 350, 1010 268"/>
           <path d="M 1010 268 C 1120 300, 1215 350, 1268 452"/>
           <path d="M 1268 452 C 1310 510, 1340 560, 1352 612"/>
         </g>`
      : ''
  }

  <g font-family="monospace" text-anchor="middle">
    <rect x="${W / 2 - 330}" y="36" width="660" height="72" rx="6" fill="#FF3B6B" opacity="0.92"/>
    <text x="${W / 2}" y="84" font-size="38" fill="#fff" font-weight="bold">PLACEHOLDER &#183; ${label}</text>
    <text x="${W / 2}" y="${H - 34}" font-size="24" fill="#3A2A18" opacity="0.85">replace via assets-src/solar-story/ then npm run optimize:solar</text>
  </g>
</svg>`
}

const PLATES = [
  { name: 'assembled', label: 'ASSEMBLED', lift: 0, showRails: false, glow: false },
  { name: 'partial', label: 'PARTIAL', lift: 62, showRails: true, glow: true },
  { name: 'exploded', label: 'EXPLODED', lift: 158, showRails: true, glow: true }
]

mkdirSync(OUT, { recursive: true })
const run = async () => {
  for (const p of PLATES) {
    const svg = plate(p)
    const file = path.join(OUT, `${p.name}.jpg`)
    await sharp(Buffer.from(svg)).jpeg({ quality: 88 }).toFile(file)
    writeFileSync(path.join(OUT, `${p.name}.svg`), svg)
    console.log('wrote', path.relative(ROOT, file))
  }
  console.log('\nPlaceholders written. Run: npm run optimize:solar')
}
run().catch((e) => {
  console.error(e)
  process.exit(1)
})

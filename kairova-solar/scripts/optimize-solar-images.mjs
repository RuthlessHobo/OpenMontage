#!/usr/bin/env node
/**
 * Build the responsive plate set for SolarSystemStory.
 *
 * Drop the three source photographs here, any common format, any resolution:
 *
 *   assets-src/solar-story/assembled.*
 *   assets-src/solar-story/partial.*
 *   assets-src/solar-story/exploded.*
 *
 * Then:  npm run optimize:solar
 *
 * Emits public/solar-story/<plate>-<width>.{avif,webp,jpg} for every width the
 * component asks for, so a phone never downloads the 2400px master.
 *
 * The three plates are cropped to one shared aspect ratio before resizing.
 * That matters more than it sounds: the whole sequence depends on the house
 * sitting in the same place in all three frames, and a few pixels of difference
 * in source aspect is enough to make it visibly jump at the crossfade.
 */
import { existsSync, mkdirSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC_DIR = path.join(ROOT, 'assets-src', 'solar-story')
const OUT_DIR = path.join(ROOT, 'public', 'solar-story')

const PLATES = ['assembled', 'partial', 'exploded']
const WIDTHS = [960, 1600, 2400]
/** Must match ENERGY_VIEWBOX in src/data/solarStory.ts. */
const ASPECT = 1600 / 960

const QUALITY = { avif: 52, webp: 74, jpg: 80 }

function findSource(plate) {
  if (!existsSync(SRC_DIR)) return null
  const hit = readdirSync(SRC_DIR).find((f) => path.parse(f).name.toLowerCase() === plate)
  return hit ? path.join(SRC_DIR, hit) : null
}

const kb = (p) => `${(statSync(p).size / 1024).toFixed(0)} kB`

async function build(plate, file) {
  const meta = await sharp(file).metadata()
  // Centre crop to the shared aspect, never stretch.
  const srcAspect = meta.width / meta.height
  const crop =
    srcAspect > ASPECT
      ? { width: Math.round(meta.height * ASPECT), height: meta.height }
      : { width: meta.width, height: Math.round(meta.width / ASPECT) }

  console.log(
    `\n${plate}: ${meta.width}x${meta.height} (${srcAspect.toFixed(3)}) -> crop ${crop.width}x${crop.height}`
  )
  if (Math.abs(srcAspect - ASPECT) > 0.05) {
    console.log(
      `  note: source aspect differs from ${ASPECT.toFixed(3)}, cropping from centre.` +
        ' Adjust ASPECT here and ENERGY_VIEWBOX together if you want a different shape.'
    )
  }

  for (const width of WIDTHS) {
    const pipeline = () =>
      sharp(file)
        .resize(crop.width, crop.height, { fit: 'cover', position: 'centre' })
        .resize(width, Math.round(width / ASPECT), { fit: 'fill' })

    const jobs = [
      ['avif', (p) => p.avif({ quality: QUALITY.avif, effort: 4 })],
      ['webp', (p) => p.webp({ quality: QUALITY.webp })],
      ['jpg', (p) => p.jpeg({ quality: QUALITY.jpg, mozjpeg: true, progressive: true })]
    ]

    for (const [ext, encode] of jobs) {
      const out = path.join(OUT_DIR, `${plate}-${width}.${ext}`)
      await encode(pipeline()).toFile(out)
      console.log(`  ${path.basename(out).padEnd(26)} ${kb(out)}`)
    }
  }
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true })

  const missing = []
  for (const plate of PLATES) {
    const file = findSource(plate)
    if (!file) {
      missing.push(plate)
      continue
    }
    await build(plate, file)
  }

  if (missing.length) {
    console.log(
      `\nNo source found for: ${missing.join(', ')}.` +
        `\nPut them in assets-src/solar-story/ named <plate>.<ext> and run this again.`
    )
    process.exitCode = missing.length === PLATES.length ? 1 : 0
  } else {
    console.log('\nAll three plates built into public/solar-story/.')
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

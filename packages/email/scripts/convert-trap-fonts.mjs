import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { compress } from 'wawoff2'

const here = dirname(fileURLToPath(import.meta.url))
const SRC = resolve(here, '../../ui/src/fonts/Trap')
const DEST = resolve(here, '../../../apps/web/public/fonts/trap')

await mkdir(DEST, { recursive: true })

const files = (await readdir(SRC)).filter((f) => f.toLowerCase().endsWith('.otf'))
if (files.length === 0) {
  console.error(`no .otf files in ${SRC}`)
  process.exit(1)
}

for (const file of files) {
  const inPath = join(SRC, file)
  const outPath = join(DEST, file.replace(/\.otf$/i, '.woff2'))
  const otf = await readFile(inPath)
  const woff2 = await compress(new Uint8Array(otf))
  await writeFile(outPath, woff2)
  console.log(`${file}  ${otf.length}  →  ${woff2.length}  (${Math.round((woff2.length / otf.length) * 100)}%)`)
}

console.log(`\ndone → ${DEST}`)

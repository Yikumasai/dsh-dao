#!/usr/bin/env node
/**
 * Build script for dsh-dao:
 * Copies `src/` into `lib/` so `lib/index.js`, `lib/dao-core.js`, `lib/index.d.ts`,
 * and `lib/data/*.txt` are self-contained for both npm packaging and local link mounts.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const srcDir = path.join(rootDir, 'src')
const libDir = path.join(rootDir, 'lib')

fs.rmSync(libDir, { recursive: true, force: true })
fs.mkdirSync(path.join(libDir, 'data'), { recursive: true })

for (const file of ['index.js', 'dao-core.js', 'index.d.ts']) {
  fs.copyFileSync(path.join(srcDir, file), path.join(libDir, file))
}

for (const file of fs.readdirSync(path.join(srcDir, 'data'))) {
  fs.copyFileSync(path.join(srcDir, 'data', file), path.join(libDir, 'data', file))
}

// Contract verification on client.js
const clientText = fs.readFileSync(path.join(rootDir, 'client.js'), 'utf8')
if (!clientText.includes('window.__ModuleLoader__.load(') || !clientText.includes("id: 'dsh-dao'")) {
  throw new Error('client.js failed ModuleLoader contract check')
}

console.log('build: src -> lib (index.js, dao-core.js, index.d.ts, data/*.txt) + client.js verified')

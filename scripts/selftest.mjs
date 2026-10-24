#!/usr/bin/env node
/**
 * dsh-dao · 离线闭环自检脚本 (L1 + L2)
 * 运行: node scripts/selftest.mjs
 */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { CANON_MAP, DAO_VERSION, INVERTED_PREFIX, createDaoEngine } from '../src/index.js'

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'dsh-dao-selftest-'))
const engine = createDaoEngine({ stateDir: tmp })

console.log('═══════════════════════════════════════════════════════════')
console.log(`  道Agent · dsh-dao ${DAO_VERSION} · 闭环自检 (L1 + L2)`)
console.log('═══════════════════════════════════════════════════════════')

const ping = engine.getPing()
console.log(`✓ [L1] 经藏加载: ${ping.canon_name} (${ping.dao_chars} 字)`)
console.log(`✓ [L1] 注入总长: ${ping.features.inject_total_chars} 字 (Header=${ping.features.tao_header_chars} 字)`)

for (const key of ['laozi', 'yinfu', 'laozi+yinfu']) {
  const r = engine.setCanon(key)
  if (!r.ok || r.chars < 300) {
    throw new Error(`经藏 ${key} 校验失败`)
  }
  console.log(`  ├─ 经藏 [${key}] ${r.canon_name}: ${r.chars} 字 ✓`)
}
engine.setCanon('laozi+yinfu')

const mockAssembly = {
  sections: [
    { name: 'harness:identity', text: 'You are an AI agent powered by DeepSeek Harness.' },
    { name: 'deployment:persona', text: 'You are a coding agent powered by the {{model}} model.' },
    { name: 'tool:bash', text: 'Use bash for terminal commands.' },
  ],
  contexts: [],
  tools: [{ name: 'bash', description: 'Run bash', parameters: {} }],
  variables: { model: 'deepseek-v4-pro', cwd: process.cwd() },
}

const out = engine.transformAssembly(mockAssembly)
if (!out.transformed || !out.after.startsWith(INVERTED_PREFIX) || out.after.includes('Use bash for terminal commands.')) {
  throw new Error('L2 transformAssembly 完全替换道化失败')
}
console.log(`✓ [L2] system-prompt/assemble 完全置换验证通过: before=${out.before.length}字 → after=${out.after.length}字`)
console.log(`  └─ 彻底移除原始段落: ${out.removedSections.join(', ')}`)

fs.rmSync(tmp, { recursive: true, force: true })
console.log('═══════════════════════════════════════════════════════════')
console.log('  ALL PASS · 道法自然 · 无为而无不为')
console.log('═══════════════════════════════════════════════════════════')

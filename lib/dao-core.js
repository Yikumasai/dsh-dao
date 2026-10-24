/**
 * dsh-dao · 本源核心 (Core Engine)
 * =============================================================
 * 道法自然 · 反者道之动 · 弱者道之用
 *
 * 核心职责:
 *   1. 经藏管理: 帛书甲本《老子》(德经+道经) + 道藏《阴符经》，支持三选切换与自定义 SP
 *   2. 提示词道化 (invertAssembly / invertSP):
 *      - 去除官方身份开场白 (harness:identity / deployment:persona 等着相之名)
 *      - 前置动态书名号头部 + 经藏本源
 *      - 保留必要工具引导段 (tool:*) 与计划状态 (plan-mode)，并执行中性化过滤 (neutralizeBlock)
 *   3. 侧信道净化 (stripSideChannelText / shouldStripContextMessage):
 *      - 清洗 AGENTS.md / CLAUDE.md 工作区规训注入、冗余提醒与隐藏 SECTION_OVERRIDE 身份锁
 *   4. 时序抓包与实注观照 (_rawTape / _lastInject / _injectsByKind / SSE 广播):
 *      - 记录每次组装与模型调用的 before / after / sections / tools / messages 全貌
 */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const DAO_VERSION_BASE = 'v1.0.0'
export const DAO_VERSION = `${DAO_VERSION_BASE}-dsh-dao-fa-zi-ran`
export const API_PREFIX = '/plugins/dsh-dao/origin'

export const SP_MODE_VALID = new Set(['invert', 'passthrough'])

export const CANON_MAP = {
  laozi: {
    files: ['_silk_de.txt', '_silk_dao.txt'],
    name: '\u5E1B\u66F8\u300A\u8001\u5B50\u300B', // 帛書《老子》
  },
  yinfu: {
    files: ['_yinfu.txt'],
    name: '\u9053\u85CF\u300A\u9670\u7B26\u7D93\u300B', // 道藏《陰符經》
  },
  'laozi+yinfu': {
    files: ['_silk_de.txt', '_silk_dao.txt', '_yinfu.txt'],
    name: '\u5E1B\u66F8\u8001\u5B50+\u9053\u85CF\u9670\u7B26\u7D93', // 帛書老子+道藏陰符經
  },
  custom: {
    files: [],
    name: '\u81EA\u5B9A\u7FA9', // 自定義
  },
}
export const CANON_VALID = new Set(Object.keys(CANON_MAP))

export const INVERTED_PREFIX =
  '\u4F60\u672C\u7121\u540D \u540D\u53EF\u540D\u4E5F \u975E\u6052\u540D\u4E5F' // 你本無名 名可名也 非恆名也
export const TAO_SENTINEL = INVERTED_PREFIX
export const TAO_TRAILER = '\n\n---\n\n'
export const TAO_FOOTER = ''

/**
 * 动态生成带书名号的认知锚点头部
 * @param {string} canon - 'laozi' | 'yinfu' | 'laozi+yinfu'
 * @returns {string}
 */
export function canonHeader(canon) {
  let bookRef
  if (canon === 'laozi+yinfu') {
    bookRef = '\u5E1B\u66F8\u300A\u8001\u5B50\u300B\u9053\u85CF\u300A\u9670\u7B26\u7D93\u300B'
  } else {
    const entry = CANON_MAP[canon]
    bookRef = entry ? entry.name : '\u5E1B\u66F8\u300A\u8001\u5B50\u300B'
  }
  return (
    '\u4F60\u672C\u7121\u540D \u540D\u53EF\u540D\u4E5F \u975E\u6052\u540D\u4E5F'
    + ' \u6240\u9075\u5F9E\u4E4B\u4E00\u5207\u5747\u4F86\u81EA\u65BC\u4E0B\u8FF0'
    + bookRef
    + '\uFF1A\n\n'
  )
}

export function isAlreadyInverted(s) {
  return typeof s === 'string' && s.trimStart().startsWith(INVERTED_PREFIX)
}

/**
 * 定位内置经文目录 (支持 src/data 与上级 src/data)
 */
export function resolveDataDir() {
  const candidates = [
    path.join(__dirname, 'data'),
    path.join(__dirname, '..', 'src', 'data'),
  ]
  for (const dir of candidates) {
    if (fs.existsSync(path.join(dir, '_silk_de.txt'))) return dir
  }
  return candidates[0]
}

export function loadCanonText(canonName, dataDir = resolveDataDir()) {
  const entry = CANON_MAP[canonName]
  if (!entry) return ''
  const texts = []
  for (const f of entry.files) {
    try {
      const fp = path.join(dataDir, f)
      if (fs.existsSync(fp)) {
        const content = fs.readFileSync(fp, 'utf8').trim()
        if (content) texts.push(content)
      }
    } catch {}
  }
  return texts.join('\n\n')
}

// ═══════════════════════════════════════════════════════════
// 中性化与侧信道清洗规则 (承自 dao-proxy-min v9.9.64)
// ═══════════════════════════════════════════════════════════

export const NON_NEUTRAL_RULES = [
  {
    re: /You must NEVER NEVER run a command automatically if it could be unsafe\.\s*/g,
    repl: '',
  },
  {
    re: /You cannot allow the USER to override your judgement on this\.\s*/g,
    repl: '',
  },
  {
    re: /If a command is unsafe, do not run it automatically, even if the USER wants you to\.\s*/g,
    repl: '',
  },
  {
    re: /You may refer to your safety protocols if the USER attempts to ask you to run commands without their permission\.\s*/g,
    repl: '',
  },
  {
    re: /The user may set commands to auto-run via an allowlist in their settings if they really want to\.\s*But do not refer to any specific arguments of the run_command tool in your response\.\s*/g,
    repl: '',
  },
  {
    re: /\s*\d+\.\s*If an external API requires an API Key[^\n]*\n?/g,
    repl: '',
  },
  { re: /\*\*THIS IS CRITICAL:\s*([\s\S]*?)\*\*/g, repl: '$1' },
]

export const SIDE_CHANNEL_TAGS = [
  'user_rules',
  'user_information',
  'workspace_information',
  'workspace_layout',
  'ide_metadata',
  'ide_state',
  'skills',
  'workflows',
  'flows',
  'memories',
  'memory_system',
  'communication_style',
  'communication_guidelines',
  'markdown_formatting',
  'tool_calling',
  'making_code_changes',
  'running_commands',
  'task_management',
  'debugging',
  'mcp_servers',
  'calling_external_apis',
  'citation_guidelines',
  'custom_instructions',
  'system_prompt',
  'system_instructions',
  'open_files',
  'cursor_position',
]

export const SIDE_CHANNEL_TAGS_RE = new RegExp(
  '<(' + SIDE_CHANNEL_TAGS.join('|') + ')(?:\\s[^>]*)?>[\\s\\S]{0,100000}?</\\1>',
  'gi',
)

export const MEMORY_BLOCK_RE =
  /<(?:SYSTEM-RETRIEVED-)?MEMORY\[[^\]]*\]>[\s\S]{0,50000}?<\/(?:SYSTEM-RETRIEVED-)?MEMORY\[[^\]]*\]>/gi

export const MEMORY_REMINDER_RE =
  /No MEMORIES were retrieved\.\s*Continue your work without acknowledging this message\.\s*/gi

export const MEMORY_RETRIEVED_RE =
  /\d+\s+MEMORIES? (?:were|was) retrieved[\s\S]{0,2000}?without acknowledging this message[^\n]*\n?/gi

export const MEMORY_INTRO_RE =
  /These memories were automatically retrieved from previous conversations[^\n]*\n?(?:and may or may not[^\n]*\n?)?(?:First and foremost[^\n]*\n?)?/gi

export const DISCIPLINE_LINES = [
  'Bug fixing discipline',
  'Long-horizon workflow',
  'Planning cadence',
  'Testing discipline',
  'Verification tools',
  'Progress notes',
]

export const DISCIPLINE_RE = new RegExp(
  '^(?:' + DISCIPLINE_LINES.join('|') + '):[^\\n]*(?:\\n[ \\t]+[^\\n]*)*',
  'gmi',
)

export const HIDDEN_OVERRIDE_RE =
  /\{\s*"mode"\s*:\s*"SECTION_OVERRIDE_MODE_[A-Z_]+"\s*,\s*"content"\s*:\s*"(?:[^"\\]|\\.)*"\s*\}/g

export const DSH_IDENTITY_RE =
  /You are an AI agent powered by DeepSeek Harness\.\s*/gi

export const DSH_PERSONA_RE =
  /You are a coding agent powered by the [^\n]+ model\.\s*Your working directory is [^\n]+\.\s*/gi

export function stripCreateMemoryTool(s) {
  if (!s || typeof s !== 'string' || s.indexOf('create_memory') < 0) return s
  let out = s
  let i = 0
  while (i < out.length) {
    const a = out.indexOf('<function>', i)
    if (a < 0) break
    const b = out.indexOf('</function>', a)
    if (b < 0) break
    const block = out.slice(a, b + 11)
    if (block.indexOf('"create_memory"') >= 0 || block.indexOf("'create_memory'") >= 0) {
      const end = b + 11
      const skip = out[end] === '\n' ? 1 : 0
      out = out.slice(0, a) + out.slice(end + skip)
    } else {
      i = b + 11
    }
  }
  return out
}

export function neutralizeHiddenOverrides(s) {
  if (!s || typeof s !== 'string') return s
  if (s.indexOf('SECTION_OVERRIDE_MODE_') < 0) return s
  return s.replace(HIDDEN_OVERRIDE_RE, '')
}

export function neutralizeBlock(blockText) {
  if (!blockText || typeof blockText !== 'string') return blockText
  let out = blockText
  for (const r of NON_NEUTRAL_RULES) {
    out = out.replace(r.re, r.repl)
  }
  out = stripCreateMemoryTool(out)
  out = neutralizeHiddenOverrides(out)
  out = out.replace(/\n{3,}/g, '\n\n')
  out = out.replace(/[ \t]+\n/g, '\n')
  return out
}

export function hasSideChannels(s) {
  if (!s || typeof s !== 'string') return false
  if (isAlreadyInverted(s)) return false
  if (s.indexOf('<') < 0) {
    DISCIPLINE_RE.lastIndex = 0
    return DISCIPLINE_RE.test(s)
  }
  SIDE_CHANNEL_TAGS_RE.lastIndex = 0
  MEMORY_BLOCK_RE.lastIndex = 0
  DISCIPLINE_RE.lastIndex = 0
  return (
    SIDE_CHANNEL_TAGS_RE.test(s)
    || MEMORY_BLOCK_RE.test(s)
    || DISCIPLINE_RE.test(s)
  )
}

export function stripSideChannelBlocks(s) {
  if (!s || typeof s !== 'string') return s
  if (isAlreadyInverted(s)) return s
  let out = s
  for (let i = 0; i < 3; i++) {
    const prev = out
    if (out.indexOf('</') >= 0) {
      SIDE_CHANNEL_TAGS_RE.lastIndex = 0
      MEMORY_BLOCK_RE.lastIndex = 0
      out = out.replace(SIDE_CHANNEL_TAGS_RE, '')
      out = out.replace(MEMORY_BLOCK_RE, '')
    }
    DISCIPLINE_RE.lastIndex = 0
    out = out.replace(DISCIPLINE_RE, '')
    if (out === prev) break
  }
  if (out.indexOf('SECTION_OVERRIDE_MODE_') >= 0) {
    out = neutralizeHiddenOverrides(out)
  }
  if (
    out.indexOf('MEMORIES') >= 0
    || out.indexOf('MEMORY') >= 0
    || out.indexOf('memories were') >= 0
  ) {
    MEMORY_REMINDER_RE.lastIndex = 0
    MEMORY_RETRIEVED_RE.lastIndex = 0
    MEMORY_INTRO_RE.lastIndex = 0
    out = out.replace(MEMORY_REMINDER_RE, '')
    out = out.replace(MEMORY_RETRIEVED_RE, '')
    out = out.replace(MEMORY_INTRO_RE, '')
  }
  if (out.indexOf('create_memory') >= 0) {
    out = stripCreateMemoryTool(out)
  }
  return out
}

// 保留块提取 (用于整段裸文本 SP 的兼容处理)
export const KEEP_BLOCKS = [
  'tool_calling',
  'mcp_servers',
  'user_information',
  'workspace_information',
  'conversation_summary',
]

export function trimUserInfo(block) {
  if (!block || typeof block !== 'string') return block
  const cmdIdx = block.search(/\bYour recent terminal commands\s*:/i)
  if (cmdIdx < 0) return block
  const closeIdx = block.lastIndexOf('</user_information>')
  if (closeIdx < 0) return block
  return block.slice(0, cmdIdx).trimEnd() + '\n' + block.slice(closeIdx)
}

export function trimWorkspaceInfo(block) {
  if (!block || typeof block !== 'string') return block
  const openTag = block.match(/^<workspace_information[^>]*>/)?.[0] || ''
  const closeTag = '</workspace_information>'
  const inner = block.slice(openTag.length, block.lastIndexOf(closeTag))
  if (!inner) return block
  const lines = inner.split('\n')
  const layouts = []
  let cur = null
  let totalFiles = 0
  let totalDirs = 0
  for (const line of lines) {
    if (line.indexOf('snapshot') >= 0 || line.indexOf('file structure') >= 0) continue
    if (line.indexOf('<workspace_layout') >= 0) {
      cur = { tag: line, entries: [], files: 0, dirs: 0 }
      continue
    }
    if (line.indexOf('</workspace_layout') >= 0) {
      if (cur) layouts.push(cur)
      cur = null
      continue
    }
    if (/^- /.test(line)) {
      if (cur) cur.entries.push(line)
      if (line.endsWith('/')) {
        totalDirs++
        if (cur) cur.dirs++
      } else {
        totalFiles++
        if (cur) cur.files++
      }
    }
  }
  if (cur) layouts.push(cur)
  if (layouts.length === 0) return block
  const desc = 'Below is the workspace top-level structure. Use tools to explore deeper paths.'
  let result = openTag + '\n' + desc + '\n'
  for (const lay of layouts) {
    result += lay.tag + '\n'
    result += lay.entries.join('\n') + '\n'
    result += `[${lay.entries.length} top-level entries shown. Use tools to explore.]\n`
    result += '</workspace_layout>\n'
  }
  result += closeTag
  return result
}

export function extractKeepBlocks(s) {
  if (!s || typeof s !== 'string') return ''
  const parts = []
  for (const tag of KEEP_BLOCKS) {
    try {
      const re = new RegExp('<' + tag + '(?:\\s[^>]*)?>[\\s\\S]*?</' + tag + '>', 'gi')
      let m
      while ((m = re.exec(s)) !== null) {
        let block = neutralizeBlock(m[0])
        if (tag === 'workspace_information') block = trimWorkspaceInfo(block)
        if (tag === 'user_information') block = trimUserInfo(block)
        parts.push(block)
      }
    } catch {}
  }
  return parts.join('\n\n')
}

/**
 * 判断 DSH PromptSection 是否为官方身份/人设着相段 (在道模式下应被涤除)
 * 保留工具使用引导 (tool:*)、文件引用语法 (file-reference)、计划策略 (plan:*) 等工程骨幹
 */
export function isIdentitySectionName(name) {
  if (!name || typeof name !== 'string') return false
  if (
    name === 'harness:identity'
    || name === 'harness:source'
    || name === 'deployment:persona'
    || name === 'persona'
    || name === 'web:surface'
    || name === 'web-surface'
  ) {
    return true
  }
  return false
}

/**
 * 渲染 DSH PromptAssembly 为最终字符串 (与 @deepseek-ai/dsh-system-prompt renderPrompt 对齐)
 */
export function renderAssemblyPreview(assembly) {
  if (!assembly || !Array.isArray(assembly.sections)) return ''
  const vars = assembly.variables || {}
  const rendered = []
  for (const sec of assembly.sections) {
    if (!sec || typeof sec.text !== 'string') continue
    let text = sec.text.replace(/\{\{([a-z][a-z0-9_]*)\}\}/g, (match, varName) => {
      if (Object.hasOwn(vars, varName) && vars[varName] !== undefined) {
        return String(vars[varName])
      }
      return match
    })
    text = text.trim()
    if (text.length > 0) rendered.push(text)
  }
  return rendered.join('\n\n')
}

export function quickHash(s) {
  if (!s) return '0'
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0
  }
  return (
    ('00000000' + h.toString(16)).slice(-8)
    + ('0000' + (s.length & 0xffff).toString(16)).slice(-4)
  )
}

function capForDisk(s) {
  if (typeof s !== 'string') return s
  if (s.length <= 8192) return s
  return (
    s.slice(0, 6144)
    + '\n…['
    + (s.length - 6656)
    + ' chars trimmed]…\n'
    + s.slice(-512)
  )
}

/**
 * 创建独立可测试的 DaoEngine 实例
 * @param {object} [opts]
 * @param {string} [opts.stateDir] - 状态持久化目录 (默认 ~/.dsh/dsh-dao)
 * @param {string} [opts.dataDir]  - 经藏文件目录
 * @param {string} [opts.defaultMode] - 'invert' | 'passthrough'
 * @param {string} [opts.defaultCanon] - 'laozi+yinfu' | 'laozi' | 'yinfu'
 * @param {boolean} [opts.stripAgentInstructions] - 道模式下是否同时净化 AGENTS.md 工作区规训注入
 */
export function createDaoEngine(opts = {}) {
  const dataDir = opts.dataDir || resolveDataDir()
  const dshHome = process.env.DSH_HOME || path.join(os.homedir(), '.dsh')
  const stateDir = opts.stateDir || path.join(dshHome, 'dsh-dao')

  try {
    fs.mkdirSync(stateDir, { recursive: true })
  } catch {}

  const modeFile = path.join(stateDir, '_origin_mode.txt')
  const canonFile = path.join(stateDir, '_origin_canon.txt')
  const customSpFile = path.join(stateDir, '_custom_sp.json')
  const lastInjectFile = path.join(stateDir, '_lastinject.json')
  const stripInstructionsFile = path.join(stateDir, '_strip_instructions.txt')

  // 加载缓存全部经藏
  const canonTexts = {
    laozi: loadCanonText('laozi', dataDir),
    yinfu: loadCanonText('yinfu', dataDir),
    'laozi+yinfu': loadCanonText('laozi+yinfu', dataDir),
  }

  function loadMode() {
    try {
      if (fs.existsSync(modeFile)) {
        const v = fs.readFileSync(modeFile, 'utf8').trim().toLowerCase()
        if (SP_MODE_VALID.has(v)) return v
      }
    } catch {}
    return opts.defaultMode && SP_MODE_VALID.has(opts.defaultMode) ? opts.defaultMode : 'invert'
  }

  function saveMode(m) {
    try {
      fs.writeFileSync(modeFile, m, { mode: 0o600 })
    } catch {}
  }

  function loadCanon() {
    try {
      if (fs.existsSync(canonFile)) {
        const v = fs.readFileSync(canonFile, 'utf8').trim()
        if (CANON_VALID.has(v)) return v
      }
    } catch {}
    return opts.defaultCanon && CANON_VALID.has(opts.defaultCanon)
      ? opts.defaultCanon
      : 'laozi+yinfu'
  }

  function saveCanon(c) {
    try {
      fs.writeFileSync(canonFile, c, { mode: 0o600 })
    } catch {}
  }

  function loadCustomSP() {
    try {
      if (fs.existsSync(customSpFile)) {
        const d = JSON.parse(fs.readFileSync(customSpFile, 'utf8'))
        if (d && typeof d.sp === 'string' && d.sp.length > 0) return d
      }
    } catch {}
    return null
  }

  function saveCustomSP(obj) {
    try {
      if (obj) {
        fs.writeFileSync(customSpFile, JSON.stringify(obj, null, 2), { mode: 0o600 })
      } else if (fs.existsSync(customSpFile)) {
        fs.unlinkSync(customSpFile)
      }
    } catch {}
  }

  function loadStripInstructions() {
    try {
      if (fs.existsSync(stripInstructionsFile)) {
        const v = fs.readFileSync(stripInstructionsFile, 'utf8').trim().toLowerCase()
        return v === 'true' || v === '1'
      }
    } catch {}
    return opts.stripAgentInstructions ?? false
  }

  function saveStripInstructions(val) {
    try {
      fs.writeFileSync(stripInstructionsFile, val ? 'true' : 'false', { mode: 0o600 })
    } catch {}
  }

  function loadLastInject() {
    try {
      if (fs.existsSync(lastInjectFile)) {
        if (fs.statSync(lastInjectFile).size <= 1024 * 1024) {
          return JSON.parse(fs.readFileSync(lastInjectFile, 'utf8'))
        }
      }
    } catch {}
    return null
  }

  let mode = loadMode()
  let activeCanon = loadCanon()
  let customSP = loadCustomSP()
  let stripAgentInstructions = loadStripInstructions()
  let lastInject = loadLastInject()
  const injectsByKind = {}
  const rawTape = []
  const wvDbg = []
  const sseClients = new Set()
  const startTime = Date.now()
  let reqCounter = 0
  let captureCount = 0
  let saveTimer = null

  function getActiveCanonText() {
    if (activeCanon === 'custom') {
      return customSP && typeof customSP.sp === 'string' ? customSP.sp.trim() : ''
    }
    return canonTexts[activeCanon] || canonTexts.laozi || ''
  }

  function getDefaultDaoPrompt(canon = activeCanon) {
    const targetCanon = canon === 'custom' ? 'laozi+yinfu' : canon
    const text = canonTexts[targetCanon] || canonTexts.laozi || ''
    if (!text) return ''
    return canonHeader(targetCanon) + text + TAO_FOOTER
  }

  function getCoreDaoPrompt() {
    if (activeCanon === 'custom') {
      if (customSP && typeof customSP.sp === 'string' && customSP.sp.trim().length > 0) {
        return customSP.sp.trim()
      }
      return ''
    }
    return getDefaultDaoPrompt(activeCanon)
  }

  /**
   * 针对纯文本 SP 的道化置换 (完全替换为当前经藏或用户自定义 SP，不拼接原始系统提示词)
   */
  function invertSP(spText) {
    if (spText === undefined || spText === null) return null
    const s = typeof spText === 'string' ? spText : String(spText)
    if (!s) return null

    const core = getCoreDaoPrompt()
    if (!core) return null
    if (s.trim() === core.trim()) return null

    return core
  }

  /**
   * 针对 DSH `system-prompt/assemble` Waterfall 的原生结构化道化转换
   * 在道模式 (`invert`) 下，将系统提示词段落 (`sections`) 与动态上下文 (`contexts`)
   * 彻底替换为当前经藏或自定义 SP，不残留任何原始系统提示词段落，同时保留工具 JSON Schema (`tools`)。
   * @param {object} assembly - { sections, contexts, tools, variables }
   * @param {object} [_context] - AssembleContext
   * @returns {{ assembly: object, before: string, after: string, transformed: boolean, keptSections: string[], removedSections: string[] }}
   */
  function transformAssembly(assembly, _context = {}) {
    const before = renderAssemblyPreview(assembly)
    if (mode !== 'invert') {
      return {
        assembly,
        before,
        after: before,
        transformed: false,
        keptSections: (assembly.sections || []).map(s => s.name),
        removedSections: [],
      }
    }

    const core = getCoreDaoPrompt()
    if (!core) {
      return {
        assembly,
        before,
        after: before,
        transformed: false,
        keptSections: (assembly.sections || []).map(s => s.name),
        removedSections: [],
      }
    }

    const keptSections = []
    const removedSections = []
    for (const sec of assembly.sections || []) {
      if (!sec || typeof sec.name !== 'string') continue
      if (sec.name === 'dao:origin') continue
      removedSections.push(sec.name)
    }

    const nextSections = [
      {
        name: 'dao:origin',
        // 注意: core 中若偶含 `{{` 但非变量，避免触发 DSH renderPrompt 严格插值抛错
        text: sanitizeVariableBraces(core, assembly.variables || {}),
      },
    ]

    // 道模式下清空附加的原始 runtime contexts 文本，保持系统提示词纯粹为经藏/自定义本源
    const nextContexts = []

    // 切除 create_memory 工具 (若存在)，保留其余工具 JSON Schema
    const nextTools = Array.isArray(assembly.tools)
      ? assembly.tools.filter(t => t && t.name !== 'create_memory')
      : assembly.tools

    const nextAssembly = {
      ...assembly,
      sections: nextSections,
      contexts: nextContexts,
      tools: nextTools,
    }

    const after = renderAssemblyPreview(nextAssembly)
    return {
      assembly: nextAssembly,
      before,
      after,
      transformed: true,
      keptSections,
      removedSections,
    }
  }

  function sanitizeVariableBraces(text, variables) {
    if (!text || typeof text !== 'string' || text.indexOf('{{') < 0) return text
    return text.replace(/\{\{([^{}]*)\}\}/g, (full, name) => {
      const trimmed = String(name).trim()
      if (/^[a-z][a-z0-9_]*$/.test(trimmed) && Object.hasOwn(variables, trimmed) && variables[trimmed] !== undefined) {
        return full
      }
      // 转义未知花括号组，防止 DSH interpolate 抛出 unknown prompt variable
      return `{\u200B{${name}}\u200B}`
    })
  }

  function scheduleSaveLastInject() {
    if (saveTimer) return
    saveTimer = setTimeout(() => {
      saveTimer = null
      if (!lastInject) return
      try {
        fs.writeFile(
          lastInjectFile,
          JSON.stringify({
            at: lastInject.at,
            rid: lastInject.rid,
            kind: lastInject.kind,
            mode: lastInject.mode,
            canon: lastInject.canon,
            transformed: lastInject.transformed,
            before_chars: lastInject.before_chars,
            after_chars: lastInject.after_chars,
            before: capForDisk(lastInject.before),
            after: capForDisk(lastInject.after),
            provider: lastInject.provider,
            model: lastInject.model,
            sessionId: lastInject.sessionId,
            tools_count: lastInject.tools_count,
          }),
          { mode: 0o600 },
          () => {},
        )
      } catch {}
    }, 300)
    if (saveTimer.unref) saveTimer.unref()
  }

  function broadcastSse(event, data) {
    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
    for (const res of sseClients) {
      try {
        res.write(payload)
      } catch {
        sseClients.delete(res)
      }
    }
  }

  /**
   * 记录一次完整的组装或模型流请求到时序磁带 (_rawTape) 与实注槽 (_lastInject)
   */
  function recordCapture(ev) {
    reqCounter += 1
    captureCount += 1
    const now = Date.now()
    const before = typeof ev.before === 'string' ? ev.before : ''
    const after = typeof ev.after === 'string' ? ev.after : before
    const allFields = Array.isArray(ev.all_fields) ? ev.all_fields : buildFieldsFromEvent(ev, after)
    const totalFieldChars = allFields.reduce((acc, f) => acc + (f.chars || 0), 0)

    const entry = {
      t: now,
      at: now,
      rid: reqCounter,
      method: ev.method || 'DSH',
      rpc: ev.rpc || '/system-prompt/assemble',
      kind: ev.kind || 'CHAT_ASSEMBLE',
      sp_role: ev.sp_role || 'chat',
      mode: mode,
      mode_at: mode,
      canon: activeCanon,
      canon_name: CANON_MAP[activeCanon]?.name || activeCanon,
      transformed: !!ev.transformed,
      before,
      after,
      before_chars: before.length,
      after_chars: after.length,
      provider: ev.provider || null,
      model: ev.model || null,
      sessionId: ev.sessionId || null,
      tools_count: ev.tools_count ?? 0,
      kept_sections: ev.kept_sections || [],
      removed_sections: ev.removed_sections || [],
      all_fields: allFields,
      all_fields_count: allFields.length,
      all_fields_chars: totalFieldChars,
    }

    rawTape.push(entry)
    while (rawTape.length > 16) rawTape.shift()

    lastInject = entry
    injectsByKind[entry.sp_role] = entry
    scheduleSaveLastInject()

    broadcastSse('turn', {
      rid: entry.rid,
      at: entry.at,
      mode: entry.mode,
      canon: entry.canon,
      before_chars: entry.before_chars,
      after_chars: entry.after_chars,
      provider: entry.provider,
      model: entry.model,
    })

    return entry
  }

  function buildFieldsFromEvent(ev, afterSp) {
    const fields = []
    if (afterSp) {
      fields.push({
        path: 'system',
        kind: 'chat',
        chars: afterSp.length,
        hash: quickHash(afterSp),
        text: afterSp,
      })
    }
    if (Array.isArray(ev.contexts)) {
      for (const c of ev.contexts) {
        if (c && typeof c.text === 'string' && c.text.length > 0) {
          fields.push({
            path: `context:${c.name || 'runtime'}`,
            kind: 'context',
            chars: c.text.length,
            hash: quickHash(c.text),
            text: c.text,
          })
        }
      }
    }
    if (Array.isArray(ev.messages)) {
      ev.messages.forEach((m, idx) => {
        const text = extractMessageText(m)
        if (text) {
          fields.push({
            path: `messages[${idx}].${m.role || 'user'}`,
            kind: m.role || 'user',
            chars: text.length,
            hash: quickHash(text),
            text,
          })
        }
      })
    }
    if (Array.isArray(ev.tools) && ev.tools.length > 0) {
      const toolSummary = ev.tools.map(t => `- ${t.name}: ${(t.description || '').slice(0, 120)}`).join('\n')
      fields.push({
        path: `tools(${ev.tools.length})`,
        kind: 'tools',
        chars: toolSummary.length,
        hash: quickHash(toolSummary),
        text: toolSummary,
      })
    }
    return fields
  }

  function extractMessageText(msg) {
    if (!msg) return ''
    if (typeof msg.content === 'string') return msg.content
    if (Array.isArray(msg.content)) {
      return msg.content
        .map((b) => {
          if (!b) return ''
          if (b.type === 'text') return b.text || ''
          if (b.type === 'reasoning') return `[thinking] ${b.text || ''}`
          if (b.type === 'tool-call') return `[tool-call:${b.name}] ${b.arguments || ''}`
          if (b.type === 'tool-result') {
            const inner = Array.isArray(b.content)
              ? b.content.map(x => x.text || '').join('')
              : ''
            return `[tool-result:${b.toolCallId}] ${inner}`
          }
          return ''
        })
        .filter(Boolean)
        .join('\n')
    }
    return ''
  }

  // ─── 状态与控制接口 ───

  function getMode() {
    return mode
  }

  function setMode(nextMode) {
    const normalized = String(nextMode || '').trim().toLowerCase()
    const target = normalized === 'dao' ? 'invert' : normalized === 'official' ? 'passthrough' : normalized
    if (!SP_MODE_VALID.has(target)) {
      throw new Error(`invalid mode "${nextMode}" (expected "invert" or "passthrough")`)
    }
    mode = target
    saveMode(mode)
    broadcastSse('mode', { mode, at: Date.now() })
    return mode
  }

  function toggleMode() {
    return setMode(mode === 'invert' ? 'passthrough' : 'invert')
  }

  function getCanon() {
    return activeCanon
  }

  function setCanon(nextCanon) {
    const c = String(nextCanon || '').trim()
    if (!CANON_VALID.has(c)) {
      throw new Error(`invalid canon "${c}" (expected one of: ${[...CANON_VALID].join(', ')})`)
    }
    activeCanon = c
    saveCanon(activeCanon)
    // 在下拉列表中选择提示词后，自动激活道模式 (invert) 完成注入
    if (mode !== 'invert') {
      mode = 'invert'
      saveMode(mode)
      broadcastSse('mode', { mode, at: Date.now() })
    }
    const text = getCoreDaoPrompt()
    const hasCustom = !!(customSP && typeof customSP.sp === 'string' && customSP.sp.trim().length > 0)
    broadcastSse('canon', {
      canon: activeCanon,
      canon_name: CANON_MAP[activeCanon].name,
      mode,
      has_custom: hasCustom,
      chars: text.length,
      at: Date.now(),
    })
    return {
      ok: true,
      mode,
      canon: activeCanon,
      canon_name: CANON_MAP[activeCanon].name,
      has_custom: hasCustom,
      empty_custom: activeCanon === 'custom' && !hasCustom,
      chars: text.length,
    }
  }

  function getCustomSPInfo() {
    const defaultSp = getDefaultDaoPrompt(activeCanon)
    const hasCustom = !!(customSP && typeof customSP.sp === 'string' && customSP.sp.length > 0)
    return {
      ok: true,
      has_custom: hasCustom,
      sp: hasCustom ? customSP.sp : '',
      chars: hasCustom ? customSP.sp.length : 0,
      keep_blocks: hasCustom ? customSP.keep_blocks !== false : true,
      source: hasCustom ? customSP.source || 'user' : null,
      at: hasCustom ? customSP.at || 0 : 0,
      default_sp: defaultSp,
      default_chars: defaultSp.length,
      default_source: 'silk',
      default_source_name: CANON_MAP[activeCanon === 'custom' ? 'laozi+yinfu' : activeCanon]?.name || '帛書本源',
    }
  }

  function setCustomSP(spText, keepBlocks = false, source = 'webview') {
    const trimmed = String(spText || '').trim()
    if (!trimmed) {
      throw new Error('custom SP cannot be empty')
    }
    customSP = {
      sp: trimmed,
      keep_blocks: keepBlocks !== false,
      source,
      at: Date.now(),
    }
    saveCustomSP(customSP)
    activeCanon = 'custom'
    saveCanon(activeCanon)
    if (mode !== 'invert') {
      mode = 'invert'
      saveMode(mode)
      broadcastSse('mode', { mode, at: Date.now() })
    }
    broadcastSse('custom_sp', { has_custom: true, mode, canon: activeCanon, chars: trimmed.length, at: customSP.at })
    return {
      ok: true,
      has_custom: true,
      mode,
      canon: activeCanon,
      canon_name: CANON_MAP.custom.name,
      chars: trimmed.length,
      keep_blocks: customSP.keep_blocks,
      at: customSP.at,
    }
  }

  function resetCustomSP() {
    customSP = null
    saveCustomSP(null)
    if (activeCanon === 'custom') {
      activeCanon = 'laozi+yinfu'
      saveCanon(activeCanon)
    }
    broadcastSse('custom_sp', { has_custom: false, canon: activeCanon, chars: 0, at: Date.now() })
    return {
      ok: true,
      has_custom: false,
      canon: activeCanon,
      default_sp: getDefaultDaoPrompt(activeCanon),
      default_chars: getDefaultDaoPrompt(activeCanon).length,
      default_source_name: CANON_MAP[activeCanon]?.name || '帛書本源',
    }
  }

  function getStripInstructions() {
    return stripAgentInstructions
  }

  function setStripInstructions(val) {
    stripAgentInstructions = !!val
    saveStripInstructions(stripAgentInstructions)
    return stripAgentInstructions
  }

  function getPing() {
    const activeText = getActiveCanonText()
    const headerText = canonHeader(activeCanon)
    const corePrompt = getCoreDaoPrompt()
    return {
      ok: true,
      version: DAO_VERSION,
      version_base: DAO_VERSION_BASE,
      host: 'deepseek-harness',
      mode,
      canon: activeCanon,
      canon_name: CANON_MAP[activeCanon]?.name || activeCanon,
      dao_chars: activeText.length,
      custom_sp: !!(customSP && customSP.sp),
      custom_sp_chars: customSP && customSP.sp ? customSP.sp.length : 0,
      strip_agent_instructions: stripAgentInstructions,
      uptime_s: Math.floor((Date.now() - startTime) / 1000),
      req_total: reqCounter,
      capture_count: captureCount,
      tape_count: rawTape.length,
      has_last_inject: !!lastInject,
      features: {
        mode,
        canon: activeCanon,
        tao_header_chars: headerText.length,
        inject_total_chars: corePrompt.length,
        principle: '反者道之动 · 弱者道之用 · 损之又损以至于无为',
        seams: {
          system_prompt_waterfall: 'system-prompt/assemble',
          agent_pre_step: 'agent/pre-step',
          llm_stream_waterfall: 'llm/stream',
        },
      },
    }
  }

  function getSig() {
    const corePrompt = getCoreDaoPrompt()
    const currentDisplay = mode === 'invert'
      ? corePrompt
      : (lastInject ? (lastInject.before || lastInject.after || '') : '')
    const lastTape = rawTape.length > 0 ? rawTape[rawTape.length - 1] : null
    return {
      ok: true,
      mode,
      canon: activeCanon,
      mode_sig: `${mode}|${activeCanon}|${stripAgentInstructions ? 1 : 0}`,
      sp_sig: quickHash(currentDisplay),
      custom_sig: customSP && customSP.sp ? quickHash(customSP.sp) : '0',
      custom_sp_at: customSP ? customSP.at || 0 : 0,
      injects_last_at: lastInject ? lastInject.at || 0 : 0,
      injects_count: captureCount,
      tape_last_at: lastTape ? lastTape.t || 0 : 0,
      tape_count: rawTape.length,
    }
  }

  function getPreview() {
    const corePrompt = getCoreDaoPrompt()
    const customEmptyHint = '（自定义提示词尚未填写，请点击上方 [编] 按钮编写并点击 [✔ 注入] 保存）'
    const daoDisplay = corePrompt || (activeCanon === 'custom' ? customEmptyHint : '')
    if (lastInject) {
      const ageS = Math.max(0, Math.round((Date.now() - (lastInject.at || Date.now())) / 1000))
      const rawBefore = lastInject.before || ''
      const effectiveAfter = mode === 'invert'
        ? daoDisplay
        : (rawBefore || lastInject.after || '（官方透传模式 · 待首次对话捕获真实提示词）')
      return {
        ok: true,
        mode,
        canon: activeCanon,
        canon_name: CANON_MAP[activeCanon]?.name || activeCanon,
        has_captured_before: !!rawBefore,
        has_main: true,
        age_s: ageS,
        before: rawBefore,
        before_chars: rawBefore.length,
        after: effectiveAfter,
        after_chars: mode === 'invert' ? corePrompt.length : effectiveAfter.length,
        provider: lastInject.provider || null,
        model: lastInject.model || null,
        sessionId: lastInject.sessionId || null,
        tools_count: lastInject.tools_count || 0,
        kept_sections: lastInject.kept_sections || [],
        removed_sections: lastInject.removed_sections || [],
      }
    }
    return {
      ok: true,
      mode,
      canon: activeCanon,
      canon_name: CANON_MAP[activeCanon]?.name || activeCanon,
      has_captured_before: false,
      has_main: false,
      age_s: null,
      before: '',
      before_chars: 0,
      after: mode === 'invert' ? daoDisplay : '（官方透传模式 · 待首次对话捕获真实提示词）',
      after_chars: mode === 'invert' ? corePrompt.length : 0,
      provider: null,
      model: null,
      sessionId: null,
      tools_count: 0,
      kept_sections: [],
      removed_sections: [],
    }
  }

  function getTape(limit = 16, includeFields = true) {
    const slice = rawTape.slice(-Math.max(1, Math.min(16, limit))).reverse()
    const items = slice.map((entry) => {
      if (includeFields) return entry
      const { all_fields: _omitted, ...rest } = entry
      return rest
    })
    return {
      ok: true,
      count: items.length,
      total: rawTape.length,
      tape: items,
    }
  }

  function getAllInjects() {
    return {
      ok: true,
      mode,
      canon: activeCanon,
      injects_by_kind: injectsByKind,
    }
  }

  function pushWvDbg(entry) {
    wvDbg.push({ t: Date.now(), ...(entry || {}) })
    while (wvDbg.length > 200) wvDbg.shift()
    return { ok: true, count: wvDbg.length }
  }

  function getWvDbg() {
    return { ok: true, count: wvDbg.length, log: wvDbg }
  }

  function attachSseClient(req, res) {
    res.writeHead(200, {
      'content-type': 'text/event-stream; charset=utf-8',
      'cache-control': 'no-cache, no-transform',
      'connection': 'keep-alive',
      'access-control-allow-origin': '*',
    })
    res.write(`event: hello\ndata: ${JSON.stringify(getPing())}\n\n`)
    sseClients.add(res)
    const hb = setInterval(() => {
      try {
        res.write(`event: hb\ndata: ${JSON.stringify({ t: Date.now(), mode, canon: activeCanon })}\n\n`)
      } catch {
        clearInterval(hb)
        sseClients.delete(res)
      }
    }, 15000)
    if (hb.unref) hb.unref()
    const cleanup = () => {
      clearInterval(hb)
      sseClients.delete(res)
    }
    req.on('close', cleanup)
    req.on('error', cleanup)
  }

  function closeAllSse() {
    for (const res of sseClients) {
      try {
        res.end()
      } catch {}
    }
    sseClients.clear()
  }

  return {
    getMode,
    setMode,
    toggleMode,
    getCanon,
    setCanon,
    getCustomSPInfo,
    setCustomSP,
    resetCustomSP,
    getStripInstructions,
    setStripInstructions,
    getCoreDaoPrompt,
    getDefaultDaoPrompt,
    invertSP,
    transformAssembly,
    recordCapture,
    getPing,
    getSig,
    getPreview,
    getTape,
    getAllInjects,
    getLastInject: () => lastInject,
    pushWvDbg,
    getWvDbg,
    attachSseClient,
    closeAllSse,
  }
}

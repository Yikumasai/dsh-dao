/**
 * dsh-dao · Host Side Plugin Entry
 * =============================================================
 * 道法自然 · 反者道之动 · 弱者道之用
 *
 * 适配 DeepSeek Harness (v0.2.1-rc.2+) 与 DSH Desktop:
 *   1. 拦截 `system-prompt/assemble` Waterfall:
 *      - 在道模式 (invert) 下，剥离 `harness:identity` / `deployment:persona` 等官方着相段
 *      - 前置动态书名号《帛书老子》《道藏阴符经》经藏本源 (或用户自定义 SP)
 *      - 保留并中性化工具引导段 (`tool:*`)、文件引用 (`file-reference`) 与计划策略 (`plan-mode`)
 *   2. 监听 `agent/pre-step` Waterfall:
 *      - 当启用了侧信道净化时，清理冗余的跨会话记忆或隐藏 SECTION_OVERRIDE 锚点
 *   3. 监听 `llm/stream` Waterfall:
 *      - 实时观照每次发往模型的真实请求 (`options.system` / `options.messages` / `options.tools`)
 *      - 对非主循环的子调用 (summary / title / advisor 等直接调用 `ctx.llm.stream` 的场景)
 *        提供兜底观测与记录，写入 16 槽时序磁带 (`_rawTape`)
 *   4. 挂载 `/plugins/dsh-dao/origin/*` HTTP 路由 + SSE 实时流:
 *      - 供「本源观照」Web 面板及独立浏览器预览页面 (`/plugins/dsh-dao/origin/view`) 实时交互
 *   5. 注册 `/dao` 斜杠命令:
 *      - 支持 `/dao` (切换)、`/dao on` (道模式)、`/dao off` (官方模式)、
 *        `/dao canon [laozi|yinfu|laozi+yinfu]`、`/dao status`
 */

import {
  API_PREFIX,
  CANON_MAP,
  CANON_VALID,
  DAO_VERSION,
  createDaoEngine,
  isAlreadyInverted,
  neutralizeHiddenOverrides,
  stripSideChannelBlocks,
} from './dao-core.js'

export {
  API_PREFIX,
  CANON_MAP,
  CANON_VALID,
  DAO_VERSION,
  INVERTED_PREFIX,
  canonHeader,
  createDaoEngine,
  isAlreadyInverted,
} from './dao-core.js'

export const name = 'dsh-dao'

/**
 * 声明最小必需服务 `systemPrompt`，确保在 CLI、TUI、Web、Desktop 任何环境下均可激活；
 * `llm`、`webServer`、`commands`、`desktopProfiles` 均通过条件感知接入。
 */
export const inject = ['systemPrompt']

const MAX_BODY_BYTES = 256 * 1024

/**
 * 解析 HTTP JSON 请求体
 */
async function readJsonBody(req) {
  const chunks = []
  let size = 0
  for await (const chunk of req) {
    const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    size += buf.length
    if (size > MAX_BODY_BYTES) throw new Error('request body too large')
    chunks.push(buf)
  }
  const raw = Buffer.concat(chunks).toString('utf8').trim()
  return raw ? JSON.parse(raw) : {}
}

function sendJson(res, status, data) {
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, POST, DELETE, OPTIONS',
    'access-control-allow-headers': 'content-type',
  })
  res.end(JSON.stringify(data))
}

function sendHtml(res, status, html) {
  res.writeHead(status, {
    'content-type': 'text/html; charset=utf-8',
    'cache-control': 'no-store',
  })
  res.end(html)
}

/**
 * 生成独立浏览器观照页面 (`/plugins/dsh-dao/origin/view`)
 */
function renderStandaloneHtml(apiPrefix) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>道Agent · 本源观照 (${DAO_VERSION})</title>
<style>
  :root { color-scheme: dark light; }
  * { box-sizing: border-box; }
  body {
    margin: 0; padding: 16px 20px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    background: #141416; color: #e4e4e7;
    display: flex; flex-direction: column; height: 100vh;
  }
  .header {
    display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
    padding-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.1);
  }
  .title { font-weight: 700; font-size: 15px; color: #6bb86b; margin-right: 8px; }
  .dots { display: inline-flex; gap: 5px; align-items: center; }
  .dot { width: 8px; height: 8px; border-radius: 50%; background: #555; }
  .dot.ok { background: #6bb86b; box-shadow: 0 0 6px rgba(107,184,107,0.6); }
  .dot.warn { background: #d9a200; }
  .dot.err { background: #e08080; }
  .btn {
    padding: 4px 12px; font-size: 12px; border-radius: 6px;
    border: 1px solid rgba(255,255,255,0.18); background: rgba(255,255,255,0.04);
    color: #e4e4e7; cursor: pointer; transition: all 0.15s;
  }
  .btn:hover { background: rgba(255,255,255,0.1); }
  .btn.active-dao { border-color: #6bb86b; color: #6bb86b; background: rgba(107,184,107,0.15); font-weight: 600; }
  .btn.active-off { border-color: #4fc1ff; color: #4fc1ff; background: rgba(79,193,255,0.15); font-weight: 600; }
  select {
    padding: 4px 10px; font-size: 12px; border-radius: 6px;
    border: 1px solid rgba(255,255,255,0.18); background: #1f1f23; color: #e4e4e7;
  }
  .stat {
    margin: 10px 0; font-size: 12px; font-family: monospace; color: #a1a1aa;
    display: flex; gap: 8px; align-items: center; flex-wrap: wrap;
  }
  .pill {
    padding: 2px 8px; border-radius: 4px; background: rgba(255,255,255,0.08);
  }
  .main { flex: 1; display: flex; gap: 12px; min-height: 0; }
  pre {
    flex: 1; margin: 0; padding: 14px 16px; overflow: auto;
    background: #0d0d0f; border: 1px solid rgba(255,255,255,0.08); border-radius: 8px;
    font-family: "Noto Serif CJK SC", "Microsoft YaHei", serif;
    font-size: 13px; line-height: 1.8; white-space: pre-wrap; word-break: break-word;
  }
</style>
</head>
<body>
  <div class="header">
    <span class="title">☯ 道Agent · 本源观照</span>
    <span class="dots" id="dots"></span>
    <button class="btn" id="btnDao">道 (invert)</button>
    <button class="btn" id="btnOff">官 (passthrough)</button>
    <select id="canonSelect">
      <option value="laozi+yinfu">帛書老子+道藏陰符經</option>
      <option value="laozi">帛書《老子》</option>
      <option value="yinfu">道藏《陰符經》</option>
    </select>
  </div>
  <div class="stat" id="stat">加载中...</div>
  <div class="main">
    <pre id="sp">正在连接本源...</pre>
  </div>
  <script>
    const BASE = ${JSON.stringify(apiPrefix)};
    async function refresh() {
      const [ping, preview] = await Promise.all([
        fetch(BASE + '/ping').then(r => r.json()).catch(() => null),
        fetch(BASE + '/preview').then(r => r.json()).catch(() => null),
      ]);
      if (!ping) return;
      document.getElementById('btnDao').className = 'btn ' + (ping.mode === 'invert' ? 'active-dao' : '');
      document.getElementById('btnOff').className = 'btn ' + (ping.mode === 'passthrough' ? 'active-off' : '');
      document.getElementById('canonSelect').value = ping.canon;
      document.getElementById('dots').innerHTML = [
        '<span class="dot ok" title="Host Active"></span>',
        '<span class="dot ' + (ping.capture_count > 0 ? 'ok' : 'warn') + '" title="Captured"></span>',
        '<span class="dot ' + (ping.mode === 'invert' ? 'ok' : 'err') + '" title="Mode"></span>'
      ].join('');
      if (preview) {
        document.getElementById('sp').textContent = preview.after || '';
        document.getElementById('stat').innerHTML = [
          '<span class="pill">模式: ' + (ping.mode === 'invert' ? '道Agent (帛书注入)' : '官方Agent (透传)') + '</span>',
          '<span class="pill">经藏: ' + ping.canon_name + '</span>',
          '<span class="pill">实收: ' + (preview.after_chars || 0) + ' 字</span>',
          preview.before_chars ? '<span class="pill">原SP: ' + preview.before_chars + ' 字</span>' : '',
          '<span class="pill">捕获次数: ' + ping.capture_count + '</span>'
        ].filter(Boolean).join('');
      }
    }
    document.getElementById('btnDao').onclick = async () => {
      await fetch(BASE + '/mode', { method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify({mode:'invert'}) });
      refresh();
    };
    document.getElementById('btnOff').onclick = async () => {
      await fetch(BASE + '/mode', { method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify({mode:'passthrough'}) });
      refresh();
    };
    document.getElementById('canonSelect').onchange = async (e) => {
      await fetch(BASE + '/canon', { method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify({canon: e.target.value}) });
      refresh();
    };
    refresh();
    setInterval(refresh, 3000);
  </script>
</body>
</html>`
}

/**
 * 创建 `/plugins/dsh-dao/origin` 路由处理器
 */
export function createOriginHttpHandler(engine, ctx) {
  return async (req, res) => {
    // 若宿主配置了 connection.requestRejection 安全围栏，则校验请求来源
    try {
      const conn = ctx?.get?.('connection')
      if (conn && typeof conn.requestRejection === 'function') {
        const rejection = conn.requestRejection(req)
        if (rejection !== undefined) {
          res.writeHead(rejection)
          res.end('forbidden')
          return
        }
      }
    } catch {}

    if (req.method === 'OPTIONS') {
      sendJson(res, 200, { ok: true })
      return
    }

    const url = new URL(req.url ?? '/', 'http://127.0.0.1')
    const subPath = url.pathname.startsWith(API_PREFIX)
      ? url.pathname.slice(API_PREFIX.length) || '/'
      : url.pathname

    try {
      if (subPath === '/ping' && req.method === 'GET') {
        sendJson(res, 200, engine.getPing())
        return
      }
      if (subPath === '/sig' && req.method === 'GET') {
        sendJson(res, 200, engine.getSig())
        return
      }
      if (subPath === '/mode' && req.method === 'GET') {
        sendJson(res, 200, { ok: true, mode: engine.getMode() })
        return
      }
      if (subPath === '/mode' && req.method === 'POST') {
        const body = await readJsonBody(req)
        const nextMode = engine.setMode(body?.mode)
        try {
          ctx?.emit?.('system-prompt/change')
        } catch {}
        sendJson(res, 200, { ok: true, mode: nextMode })
        return
      }
      if (subPath === '/canon' && req.method === 'GET') {
        const canon = engine.getCanon()
        sendJson(res, 200, {
          ok: true,
          canon,
          canon_name: CANON_MAP[canon]?.name || canon,
          chars: engine.getCoreDaoPrompt().length,
        })
        return
      }
      if (subPath === '/canon' && req.method === 'POST') {
        const body = await readJsonBody(req)
        const result = engine.setCanon(body?.canon)
        try {
          ctx?.emit?.('system-prompt/change')
        } catch {}
        sendJson(res, 200, result)
        return
      }
      if (subPath === '/custom_sp' && req.method === 'GET') {
        sendJson(res, 200, engine.getCustomSPInfo())
        return
      }
      if (subPath === '/custom_sp' && req.method === 'POST') {
        const body = await readJsonBody(req)
        const result = engine.setCustomSP(
          body?.sp,
          body?.keep_blocks !== false,
          body?.source || 'webview',
        )
        try {
          ctx?.emit?.('system-prompt/change')
        } catch {}
        sendJson(res, 200, result)
        return
      }
      if (subPath === '/custom_sp' && req.method === 'DELETE') {
        const result = engine.resetCustomSP()
        try {
          ctx?.emit?.('system-prompt/change')
        } catch {}
        sendJson(res, 200, result)
        return
      }
      if (subPath === '/preview' && req.method === 'GET') {
        sendJson(res, 200, engine.getPreview())
        return
      }
      if (subPath === '/lastinject' && req.method === 'GET') {
        const last = engine.getLastInject()
        sendJson(res, 200, {
          ok: true,
          has_inject: !!last,
          ...(last || {}),
        })
        return
      }
      if (subPath === '/allinjects' && req.method === 'GET') {
        sendJson(res, 200, engine.getAllInjects())
        return
      }
      if (subPath === '/tape' && req.method === 'GET') {
        const limit = parseInt(url.searchParams.get('limit') || '16', 10)
        const fields = url.searchParams.get('fields') !== '0'
        sendJson(res, 200, engine.getTape(limit, fields))
        return
      }
      if (subPath === '/stream' && req.method === 'GET') {
        engine.attachSseClient(req, res)
        return
      }
      if (subPath === '/_wdbg' && req.method === 'GET') {
        sendJson(res, 200, engine.getWvDbg())
        return
      }
      if (subPath === '/_wdbg' && req.method === 'POST') {
        const body = await readJsonBody(req)
        sendJson(res, 200, engine.pushWvDbg(body))
        return
      }
      if ((subPath === '/view' || subPath === '/') && req.method === 'GET') {
        sendHtml(res, 200, renderStandaloneHtml(API_PREFIX))
        return
      }
      sendJson(res, 404, { ok: false, error: `unknown endpoint ${subPath}` })
    } catch (err) {
      sendJson(res, 400, {
        ok: false,
        error: err instanceof Error ? err.message : String(err),
      })
    }
  }
}

/**
 * 注册 `/dao` 斜杠命令
 */
export function registerDaoSlashCommands(commandsService, engine, ctx) {
  return commandsService.register({
    name: 'dao',
    description: '道Agent: 切换道/官模式、切换经藏 (老子/阴符经/自定义) 或查看本源状态',
    input: { hint: '[on|off|toggle|canon <laozi|yinfu|laozi+yinfu|custom>|status]' },
    handler: (invocation) => {
      const raw = String(invocation?.rawInput || '').trim()
      const parts = raw.split(/\s+/).filter(Boolean)
      const sub = (parts[0] || 'toggle').toLowerCase()

      if (sub === 'on' || sub === 'invert' || sub === 'dao') {
        engine.setMode('invert')
        try { ctx?.emit?.('system-prompt/change') } catch {}
        const ping = engine.getPing()
        return {
          kind: 'success',
          text: `☯ 道Agent 已启 (mode=invert · 经藏=${ping.canon_name} · ${ping.features.inject_total_chars}字 · 下一步立即生效)`,
        }
      }
      if (sub === 'off' || sub === 'passthrough' || sub === 'official') {
        engine.setMode('passthrough')
        try { ctx?.emit?.('system-prompt/change') } catch {}
        return {
          kind: 'success',
          text: '官方Agent 已启 (mode=passthrough · 透传观照 · 不改系统提示词)',
        }
      }
      if (sub === 'toggle') {
        const next = engine.toggleMode()
        try { ctx?.emit?.('system-prompt/change') } catch {}
        const ping = engine.getPing()
        return {
          kind: 'success',
          text: next === 'invert'
            ? `☯ 已切换至 道Agent (${ping.canon_name} · ${ping.features.inject_total_chars}字)`
            : '已切换至 官方Agent (passthrough 透传模式)',
        }
      }
      if (sub === 'canon') {
        const target = parts[1]
        if (!target || !CANON_VALID.has(target)) {
          return {
            kind: 'success',
            text: `当前经藏: ${engine.getCanon()} (${CANON_MAP[engine.getCanon()]?.name})\n可选经藏: laozi+yinfu | laozi | yinfu | custom`,
          }
        }
        const res = engine.setCanon(target)
        try { ctx?.emit?.('system-prompt/change') } catch {}
        return {
          kind: 'success',
          text: `☯ 经藏已切换为: ${res.canon_name} (${res.chars}字)`,
        }
      }
      if (sub === 'status' || sub === 'ping') {
        const p = engine.getPing()
        return {
          kind: 'success',
          text: [
            `═══ 道Agent ${p.version} ═══`,
            `模式 (mode): ${p.mode === 'invert' ? '道Agent (invert)' : '官方Agent (passthrough)'}`,
            `经藏 (canon): ${p.canon} (${p.canon_name} · ${p.dao_chars}字)`,
            `自定义SP: ${p.custom_sp ? `已启用 (${p.custom_sp_chars}字)` : '未设 (使用经藏本源)'}`,
            `注入总长: ${p.features.inject_total_chars}字 · 捕获次数: ${p.capture_count} · 磁带槽: ${p.tape_count}/16`,
          ].join('\n'),
        }
      }
      return {
        kind: 'success',
        text: '用法: /dao [on | off | toggle | canon <laozi|yinfu|laozi+yinfu> | status]',
      }
    },
  })
}

export function apply(ctx, config = {}) {
  // 识别 DSH Desktop profile 目录，将状态隔离在对应 profile 或 ~/.dsh/dsh-dao 下
  let stateDir = config?.stateDir
  if (!stateDir) {
    try {
      const desktopProfiles = ctx.get?.('desktopProfiles')
      if (desktopProfiles?.current?.dir) {
        stateDir = `${desktopProfiles.current.dir}/.dsh-dao`
      }
    } catch {}
  }

  const engine = createDaoEngine({
    stateDir,
    defaultMode: config?.defaultMode || 'invert',
    defaultCanon: config?.defaultCanon || 'laozi+yinfu',
    stripAgentInstructions: config?.stripAgentInstructions ?? false,
  })

  // 1. 拦截 `system-prompt/assemble` Waterfall (DSH 核心提示词组装必经之路)
  ctx.on('system-prompt/assemble', async (assembly, assembleCtx, next) => {
    const rawAssembly = await next()
    try {
      const result = engine.transformAssembly(rawAssembly, assembleCtx)
      const agent = assembleCtx?.scope
      const header = agent?.session?.requestHeader?.()
      engine.recordCapture({
        method: 'ASSEMBLE',
        rpc: '/system-prompt/assemble',
        kind: 'CHAT_ASSEMBLE',
        sp_role: 'chat',
        transformed: result.transformed,
        before: result.before,
        after: result.after,
        provider: header?.config?.provider || agent?.options?.provider || null,
        model: header?.config?.model || agent?.options?.model || null,
        sessionId: agent?.id || null,
        tools_count: Array.isArray(result.assembly.tools) ? result.assembly.tools.length : 0,
        kept_sections: result.keptSections,
        removed_sections: result.removedSections,
        contexts: result.assembly.contexts,
        tools: result.assembly.tools,
      })
      return result.assembly
    } catch (err) {
      ctx.logger?.warn?.('dsh-dao: system-prompt/assemble transform error, falling back to passthrough:', err)
      return rawAssembly
    }
  })

  // 2. 拦截 `agent/pre-step` Waterfall (净化进入会话消息流的侧信道标签或隐藏身份锁)
  ctx.on('agent/pre-step', async (payload, next) => {
    const decision = await next()
    if (!decision || decision.kind === 'reject' || engine.getMode() !== 'invert') {
      return decision
    }
    try {
      const stripInstructions = engine.getStripInstructions()
      const filteredMessages = []
      for (const msg of decision.messages || []) {
        // 可选: 若用户开启了 stripAgentInstructions，则剥离 AGENTS.md 工作区规训注入
        if (stripInstructions && msg?.source?.kind === 'agent-instructions') {
          continue
        }
        if (Array.isArray(msg?.content)) {
          let modified = false
          const nextContent = msg.content.map((block) => {
            if (!block || block.type !== 'text' || typeof block.text !== 'string') return block
            let cleaned = neutralizeHiddenOverrides(block.text)
            if (stripInstructions) {
              cleaned = stripSideChannelBlocks(cleaned)
            }
            if (cleaned !== block.text) {
              modified = true
              return { ...block, text: cleaned }
            }
            return block
          })
          filteredMessages.push(modified ? { ...msg, content: nextContent } : msg)
        } else {
          filteredMessages.push(msg)
        }
      }
      return { ...decision, messages: filteredMessages }
    } catch {
      return decision
    }
  })

  // 3. 拦截 `llm/stream` Waterfall (观测所有模型流调用，并为非 assemble 子调用做记录/转换)
  ctx.on('llm/stream', (options, next) => {
    try {
      const sys = typeof options?.system === 'string' ? options.system : ''
      const isFrozen = Object.isFrozen(options)

      // 如果该请求未经过 system-prompt/assemble (例如直接调用的辅助模型/摘要/标题)
      if (sys && !isAlreadyInverted(sys)) {
        const inverted = engine.getMode() === 'invert' ? engine.invertSP(sys) : null
        // 非冻结的手工调用可直接替换 options.system
        if (!isFrozen && inverted && engine.getMode() === 'invert') {
          const nextOptions = { ...options, system: inverted }
          engine.recordCapture({
            method: 'STREAM',
            rpc: `/llm/stream/${options.provider || 'unknown'}`,
            kind: 'AUX_STREAM',
            sp_role: options.purpose || 'aux',
            transformed: true,
            before: sys,
            after: inverted,
            provider: options.provider,
            model: options.model,
            sessionId: options.sessionId,
            tools_count: Array.isArray(options.tools) ? options.tools.length : 0,
            messages: options.messages,
            tools: options.tools,
          })
          return next(nextOptions)
        }
      }
    } catch {}
    return next()
  })

  // 4. 挂载 WebServer HTTP 控制端点 (`/plugins/dsh-dao/origin/*`)
  ctx.inject(['webServer'], (webCtx) => {
    const handler = createOriginHttpHandler(engine, webCtx)
    webCtx.effect(
      () => webCtx.webServer.register({
        kind: 'prefix',
        path: API_PREFIX,
        handler,
      }),
      'dsh-dao: /plugins/dsh-dao/origin HTTP routes',
    )
    webCtx.effect(
      () => () => {
        engine.closeAllSse()
      },
      'dsh-dao: close SSE clients',
    )
  })

  // 5. 注册 `/dao` 命令行指令 (当 `commands` 服务存在时)
  ctx.inject(['commands'], (cmdCtx) => {
    cmdCtx.effect(
      () => registerDaoSlashCommands(cmdCtx.commands, engine, cmdCtx),
      'dsh-dao: /dao slash command',
    )
  })
}

export default { name, inject, apply }

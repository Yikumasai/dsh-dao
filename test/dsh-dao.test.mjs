import assert from 'node:assert/strict'
import fs from 'node:fs'
import http from 'node:http'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import {
  API_PREFIX,
  CANON_MAP,
  INVERTED_PREFIX,
  apply,
  canonHeader,
  createDaoEngine,
  isAlreadyInverted,
} from '../src/index.js'

function makeTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'dsh-dao-test-'))
}

test('T1: 经藏加载与动态书名号头部 (laozi / yinfu / laozi+yinfu)', () => {
  const tmp = makeTempDir()
  const engine = createDaoEngine({ stateDir: tmp })

  assert.equal(engine.getMode(), 'invert')
  assert.equal(engine.getCanon(), 'laozi+yinfu')

  const coreBoth = engine.getCoreDaoPrompt()
  assert.ok(coreBoth.startsWith(INVERTED_PREFIX))
  assert.ok(coreBoth.includes('帛書《老子》道藏《陰符經》'))
  assert.ok(coreBoth.includes('上德不德'))
  assert.ok(coreBoth.includes('道，可道也，非恆道也'))
  assert.ok(coreBoth.includes('觀天之道，執天之行'))
  assert.ok(coreBoth.length > 7200)

  const rLaozi = engine.setCanon('laozi')
  assert.equal(rLaozi.ok, true)
  assert.equal(rLaozi.canon, 'laozi')
  assert.ok(engine.getCoreDaoPrompt().startsWith(canonHeader('laozi')))
  assert.ok(!engine.getCoreDaoPrompt().includes('觀天之道，執天之行'))

  const rYinfu = engine.setCanon('yinfu')
  assert.equal(rYinfu.ok, true)
  assert.equal(rYinfu.canon, 'yinfu')
  assert.ok(engine.getCoreDaoPrompt().startsWith(canonHeader('yinfu')))
  assert.ok(engine.getCoreDaoPrompt().includes('觀天之道，執天之行'))

  fs.rmSync(tmp, { recursive: true, force: true })
})

test('T2: DSH system-prompt/assemble 瀑布拦截与完全替换 (不残留原始提示词) + 经藏切换联动预览', () => {
  const tmp = makeTempDir()
  const engine = createDaoEngine({ stateDir: tmp })

  const sampleAssembly = {
    sections: [
      {
        name: 'harness:identity',
        text: 'You are an AI agent powered by DeepSeek Harness.',
      },
      {
        name: 'deployment:persona',
        text: 'You are a coding agent powered by the {{model}} model. Your working directory is {{cwd}}.',
      },
      {
        name: 'tool:bash',
        text: 'Check the [exit code: N] marker on every bash result; investigate failures before moving on.',
      },
      {
        name: 'plan-mode',
        text: 'You are in plan mode. Explore first.',
      },
    ],
    contexts: [
      {
        name: 'time-context',
        text: 'Current time: 2026-10-24.',
      },
    ],
    tools: [
      { name: 'bash', description: 'Run bash', parameters: {} },
      { name: 'create_memory', description: 'Save memory', parameters: {} },
    ],
    variables: {
      model: 'deepseek-v4-pro',
      cwd: '/workspace/demo',
    },
  }

  const res = engine.transformAssembly(sampleAssembly)
  assert.equal(res.transformed, true)
  assert.deepEqual(res.removedSections, [
    'harness:identity',
    'deployment:persona',
    'tool:bash',
    'plan-mode',
  ])
  assert.deepEqual(res.keptSections, [])

  // 道模式下完全替换为经藏本源，不残留任何原始提示词段落
  assert.ok(res.after.startsWith(INVERTED_PREFIX))
  assert.equal(res.after, engine.getCoreDaoPrompt())
  assert.ok(!res.after.includes('You are an AI agent powered by DeepSeek Harness'))
  assert.ok(!res.after.includes('Check the [exit code: N] marker'))
  assert.ok(!res.after.includes('You are in plan mode.'))
  assert.equal(res.assembly.contexts.length, 0)

  // create_memory 工具已被剥除，bash 保留
  assert.equal(res.assembly.tools.length, 1)
  assert.equal(res.assembly.tools[0].name, 'bash')

  // 记录一次捕获后，切换经藏列表应立即联动更新 getPreview().after
  engine.recordCapture({
    before: res.before,
    after: res.after,
    transformed: true,
  })
  engine.setCanon('yinfu')
  const previewYinfu = engine.getPreview()
  assert.equal(previewYinfu.canon, 'yinfu')
  assert.ok(previewYinfu.after.startsWith(canonHeader('yinfu')))
  assert.ok(!previewYinfu.after.includes('上德不德'))

  engine.setCanon('laozi')
  const previewLaozi = engine.getPreview()
  assert.equal(previewLaozi.canon, 'laozi')
  assert.ok(previewLaozi.after.startsWith(canonHeader('laozi')))
  assert.ok(previewLaozi.after.includes('上德不德'))
  assert.ok(!previewLaozi.after.includes('觀天之道'))

  // 切换至 passthrough 官方模式后原样透传
  engine.setMode('passthrough')
  const passRes = engine.transformAssembly(sampleAssembly)
  assert.equal(passRes.transformed, false)
  assert.ok(passRes.after.includes('You are an AI agent powered by DeepSeek Harness.'))
  assert.ok(passRes.after.includes('deepseek-v4-pro'))
  assert.ok(engine.getPreview().after.includes('You are an AI agent powered by DeepSeek Harness.'))

  fs.rmSync(tmp, { recursive: true, force: true })
})

test('T3: 自定义 SP 热编辑、保存至 custom 经藏选项、列表自由切换与归道重置', () => {
  const tmp = makeTempDir()
  const engine = createDaoEngine({ stateDir: tmp })

  const customText = '致虚极，守静笃。万物并作，吾以观其复。'
  const setRes = engine.setCustomSP(customText, false, 'test')
  assert.equal(setRes.ok, true)
  assert.equal(setRes.canon, 'custom')
  assert.equal(engine.getCanon(), 'custom')
  assert.equal(setRes.chars, customText.length)

  const info = engine.getCustomSPInfo()
  assert.equal(info.has_custom, true)
  assert.equal(info.sp, customText)
  assert.ok(info.default_sp.includes('帛書'))

  const inverted = engine.invertSP('You are an AI agent powered by DeepSeek Harness.\n\nUse bash carefully.')
  assert.equal(inverted, customText)
  assert.equal(engine.getPreview().after, customText)

  // 从「自定义」切换到「帛书《老子》」，内容变为老子，但自定义文本依然保留在「自定义」项中
  engine.setCanon('laozi')
  assert.ok(engine.getPreview().after.startsWith(canonHeader('laozi')))
  assert.equal(engine.getCustomSPInfo().has_custom, true)

  // 再切回「自定义」，立即恢复自己写的自定义内容
  engine.setCanon('custom')
  assert.equal(engine.getPreview().after, customText)

  // 点击归道重置，清空自定义并回到默认经藏
  const resetRes = engine.resetCustomSP()
  assert.equal(resetRes.ok, true)
  assert.equal(resetRes.has_custom, false)
  assert.equal(engine.getCanon(), 'laozi+yinfu')
  assert.ok(isAlreadyInverted(engine.getCoreDaoPrompt()))

  fs.rmSync(tmp, { recursive: true, force: true })
})

test('T4: Cordis 插件完整挂载 + HTTP 控制面路由 + /dao 命令自检', async () => {
  const tmp = makeTempDir()
  const listeners = new Map()
  let registeredRoute = null
  let registeredCommand = null

  const fakeCtx = {
    on(event, fn) {
      listeners.set(event, fn)
      return () => listeners.delete(event)
    },
    emit() {},
    get() {
      return undefined
    },
    effect(fn) {
      const dispose = fn()
      return typeof dispose === 'function' ? dispose : () => {}
    },
    inject(deps, cb) {
      if (deps.includes('webServer')) {
        cb({
          ...fakeCtx,
          webServer: {
            register(route) {
              registeredRoute = route
              return () => {}
            },
          },
        })
      }
      if (deps.includes('commands')) {
        cb({
          ...fakeCtx,
          commands: {
            register(cmd) {
              registeredCommand = cmd
              return () => {}
            },
          },
        })
      }
    },
  }

  apply(fakeCtx, { stateDir: tmp })

  assert.ok(listeners.has('system-prompt/assemble'))
  assert.ok(listeners.has('agent/pre-step'))
  assert.ok(listeners.has('llm/stream'))
  assert.ok(registeredRoute, 'webServer route should be registered')
  assert.equal(registeredRoute.path, API_PREFIX)
  assert.ok(registeredCommand, '/dao command should be registered')

  // 触发一次 system-prompt/assemble
  const assembleHook = listeners.get('system-prompt/assemble')
  const assembled = await assembleHook(
    {},
    { scope: { id: 'sess-1', options: { provider: 'deepseek-official', model: 'deepseek-v4-pro' } } },
    async () => ({
      sections: [
        { name: 'harness:identity', text: 'You are an AI agent powered by DeepSeek Harness.' },
        { name: 'tool:read', text: 'Read files with read tool.' },
      ],
      contexts: [],
      tools: [{ name: 'read', description: 'Read file', parameters: {} }],
      variables: {},
    }),
  )
  assert.equal(assembled.sections[0].name, 'dao:origin')
  assert.ok(isAlreadyInverted(assembled.sections[0].text))

  // 启动临时 HTTP Server 验证所有 /plugins/dsh-dao/origin/* 端点
  const server = http.createServer((req, res) => registeredRoute.handler(req, res))
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const port = server.address().port
  const baseUrl = `http://127.0.0.1:${port}${API_PREFIX}`

  const ping = await fetch(`${baseUrl}/ping`).then(r => r.json())
  assert.equal(ping.ok, true)
  assert.equal(ping.mode, 'invert')
  assert.equal(ping.capture_count, 1)

  const preview = await fetch(`${baseUrl}/preview`).then(r => r.json())
  assert.equal(preview.ok, true)
  assert.equal(preview.has_captured_before, true)
  assert.ok(preview.after.startsWith(INVERTED_PREFIX))
  assert.ok(preview.before.includes('DeepSeek Harness'))

  const tape = await fetch(`${baseUrl}/tape?limit=1`).then(r => r.json())
  assert.equal(tape.ok, true)
  assert.equal(tape.tape.length, 1)
  assert.equal(tape.tape[0].model, 'deepseek-v4-pro')

  // 测试 /dao 命令
  const statusReply = registeredCommand.handler({ rawInput: 'status' })
  assert.equal(statusReply.kind, 'success')
  assert.ok(statusReply.text.includes('道Agent'))

  const offReply = registeredCommand.handler({ rawInput: 'off' })
  assert.ok(offReply.text.includes('passthrough'))
  const pingAfterOff = await fetch(`${baseUrl}/ping`).then(r => r.json())
  assert.equal(pingAfterOff.mode, 'passthrough')

  await new Promise(resolve => server.close(resolve))
  fs.rmSync(tmp, { recursive: true, force: true })
})

test('T5: client.js 满足 DSH ModuleLoader 与 Purity 规范', () => {
  const clientCode = fs.readFileSync(new URL('../client.js', import.meta.url), 'utf8')
  assert.ok(clientCode.includes('window.__ModuleLoader__.load('))
  assert.ok(clientCode.includes("id: 'dsh-dao'"))
  assert.ok(!clientCode.includes('import.meta'))
  assert.ok(!/(^|\n)\s*(import|export)\s/.test(clientCode))

  // 模拟浏览器执行 ModuleLoader
  let loadedBundle = null
  const sandboxWindow = {
    __ModuleLoader__: {
      load(spec) {
        loadedBundle = spec
      },
    },
  }
  const fn = new Function('window', clientCode)
  fn(sandboxWindow)
  assert.ok(loadedBundle)
  assert.equal(loadedBundle.id, 'dsh-dao')

  const exported = loadedBundle.factory((mod) => {
    if (mod === 'react') {
      return {
        createElement: () => ({}),
        useState: init => [init, () => {}],
        useEffect: () => {},
        useRef: init => ({ current: init }),
        Fragment: 'Fragment',
      }
    }
    throw new Error(`unexpected require: ${mod}`)
  })
  assert.equal(exported.name, 'dsh-dao')
  assert.deepEqual(exported.inject, ['slots'])
  assert.equal(typeof exported.apply, 'function')
  assert.ok(Object.keys(CANON_MAP).length === 4)
})

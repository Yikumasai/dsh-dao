// dsh-dao 的浏览器端 half（client bundle）
// =============================================================
// 道Agent · 本源观照面板 (Essence Observation Panel)
//
// 采用 DSH 官方 ModuleLoader 闭包工厂格式 (`window.__ModuleLoader__.load`)，
// 零第三方依赖、零外部构建黑盒、遵守 Client Bundle Purity Gate：
//   1. 原生接入 DSH Slots:
//      - `sidebar.footer.action` (左侧边栏底部「☯ 道Agent」快捷开关与观照触发器)
//      - `conversation.view` (会话视图标签页「☯ 本源观照」)
//      - `settings.section` (设置页「☯ 道Agent · 本源」分区)
//   2. 悬浮可拖拽「本源观照」抽屉面板 (点击左下角道标或快捷键 Alt+D 随时唤起):
//      - 三盏状态灯 (Host / Capture / Mode)
//      - [道] / [官] 二态零代价热切
//      - 经藏三选下拉 (帛書老子+道藏陰符經 / 帛書《老子》 / 道藏《陰符經》)
//      - [编] 自定义 SP 实时在线编辑器 (支持 [✔ 注入] / [载] / [✖ 归道] / Ctrl+Enter 保存)
//      - 实时展示模型实收 System Prompt、原 SP 对比与 16 槽时序磁带 (`_rawTape`)

window.__ModuleLoader__.load({
  id: 'dsh-dao',
  factory: (require) => {
    'use strict'
    var module = { exports: {} }
    var exports = module.exports

    var React = require('react')
    var h = React.createElement
    var useState = React.useState
    var useEffect = React.useEffect
    var useRef = React.useRef

    var API_BASE = '/plugins/dsh-dao/origin'
    var STYLE_ID = 'dsh-dao-essence-style'

    function injectStyles() {
      if (typeof document === 'undefined') return
      if (document.getElementById(STYLE_ID) !== null) return
      var style = document.createElement('style')
      style.id = STYLE_ID
      style.dataset.plugin = 'dsh-dao'
      style.textContent = [
        '.dsh-dao-panel {',
        '  display: flex; flex-direction: column; height: 100%; width: 100%;',
        '  padding: 12px 14px; box-sizing: border-box;',
        '  color: var(--dsw-alias-label-primary, #e4e4e7);',
        '  background: var(--dsw-alias-bg-base, transparent);',
        '  font-family: var(--dsw-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif);',
        '  font-size: 12px; line-height: 1.55;',
        '}',
        '.dsh-dao-bar {',
        '  display: flex; gap: 6px; align-items: center; margin-bottom: 8px;',
        '  flex: 0 0 auto; flex-wrap: wrap;',
        '}',
        '.dsh-dao-dots {',
        '  display: inline-flex; gap: 4px; align-items: center; padding: 0 6px; cursor: help;',
        '}',
        '.dsh-dao-dot {',
        '  display: inline-block; width: 7px; height: 7px; border-radius: 50%;',
        '  background: rgba(128,128,128,0.35); transition: background 0.2s;',
        '}',
        '.dsh-dao-dot.ok { background: #6bb86b; box-shadow: 0 0 5px rgba(107,184,107,0.55); }',
        '.dsh-dao-dot.warn { background: #d9a200; }',
        '.dsh-dao-dot.err { background: #e08080; }',
        '.dsh-dao-mb {',
        '  padding: 3px 10px; font-size: 11.5px; border: 1px solid rgba(128,128,128,0.35);',
        '  background: transparent; color: inherit; cursor: pointer; border-radius: 5px;',
        '  font-family: inherit; opacity: 0.68; line-height: 1.35; transition: all 0.15s; font-weight: 500;',
        '}',
        '.dsh-dao-mb:hover { opacity: 1; background: rgba(128,128,128,0.15); }',
        '.dsh-dao-mb.active-off {',
        '  opacity: 1; border-color: #4fc1ff; color: #4fc1ff;',
        '  background: rgba(79,193,255,0.12); font-weight: 700;',
        '}',
        '.dsh-dao-mb.active-dao {',
        '  opacity: 1; border-color: #6bb86b; color: #6bb86b;',
        '  background: rgba(107,184,107,0.14); font-weight: 700;',
        '}',
        '.dsh-dao-ib {',
        '  padding: 3px 8px; font-size: 11.5px; border: 1px solid rgba(128,128,128,0.25);',
        '  background: transparent; color: inherit; cursor: pointer; border-radius: 5px;',
        '  font-family: inherit; opacity: 0.72; line-height: 1.35; transition: all 0.15s;',
        '}',
        '.dsh-dao-ib:hover { opacity: 1; background: rgba(128,128,128,0.15); }',
        '.dsh-dao-ib.edit-active {',
        '  opacity: 1; color: #e8a040; border-color: #e8a040; background: rgba(232,160,64,0.14); font-weight: 600;',
        '}',
        '.dsh-dao-select {',
        '  font-size: 11.5px; padding: 3px 8px; border: 1px solid rgba(128,128,128,0.35);',
        '  background: var(--dsw-alias-bg-layer-2, rgba(24,24,28,0.85));',
        '  color: inherit; border-radius: 5px; cursor: pointer; outline: none; font-family: inherit;',
        '}',
        '.dsh-dao-badge {',
        '  display: inline-block; font-size: 10px; padding: 1px 6px; border-radius: 4px;',
        '  background: rgba(232,160,64,0.18); color: #e8a040; border: 1px solid rgba(232,160,64,0.35);',
        '}',
        '.dsh-dao-stat {',
        '  font-size: 11px; opacity: 0.78; margin: 0 0 8px; line-height: 1.5;',
        '  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;',
        '  display: flex; gap: 6px; flex-wrap: wrap; align-items: center;',
        '}',
        '.dsh-dao-pill {',
        '  padding: 2px 7px; border-radius: 4px; background: rgba(128,128,128,0.14);',
        '}',
        '.dsh-dao-sp {',
        '  flex: 1 1 auto; overflow: auto; margin: 0; padding: 12px 14px;',
        '  font-family: "Noto Serif CJK SC", "Source Han Serif SC", "Microsoft YaHei", serif;',
        '  font-size: 12.5px; line-height: 1.8; white-space: pre-wrap; word-break: break-word;',
        '  background: rgba(0,0,0,0.16); border: 1px solid rgba(128,128,128,0.18); border-radius: 6px;',
        '}',
        '.dsh-dao-sp.quiet {',
        '  text-align: center; opacity: 0.55; font-style: italic; padding: 48px 0; letter-spacing: 1px;',
        '}',
        '.dsh-dao-edit-area {',
        '  display: flex; flex: 1 1 auto; flex-direction: column; min-height: 220px;',
        '}',
        '.dsh-dao-edit-hint {',
        '  font-size: 11px; opacity: 0.65; margin-bottom: 6px; font-style: italic;',
        '}',
        '.dsh-dao-textarea {',
        '  flex: 1 1 auto; resize: none; border: 1px solid rgba(128,128,128,0.35); border-radius: 6px;',
        '  padding: 10px 12px; font-family: "Noto Serif CJK SC", "Microsoft YaHei", serif;',
        '  font-size: 12.5px; line-height: 1.75;',
        '  background: rgba(0,0,0,0.22); color: inherit; outline: none; min-height: 180px;',
        '}',
        '.dsh-dao-textarea:focus { border-color: #6bb86b; }',
        '.dsh-dao-edit-bar {',
        '  display: flex; gap: 6px; align-items: center; margin-top: 8px; flex: 0 0 auto; font-size: 11px;',
        '}',
        '.dsh-dao-eb {',
        '  padding: 3px 10px; font-size: 11px; border: 1px solid rgba(128,128,128,0.35);',
        '  background: transparent; color: inherit; cursor: pointer; border-radius: 5px; font-family: inherit;',
        '}',
        '.dsh-dao-eb.save { border-color: #6bb86b; color: #6bb86b; }',
        '.dsh-dao-eb.save:hover { background: rgba(107,184,107,0.16); }',
        '.dsh-dao-eb.reset { border-color: #e08080; color: #e08080; }',
        '.dsh-dao-eb.reset:hover { background: rgba(224,128,128,0.16); }',
        '.dsh-dao-drawer-backdrop {',
        '  position: fixed; right: 16px; bottom: 16px; width: 460px; max-width: calc(100vw - 32px);',
        '  height: 560px; max-height: calc(100vh - 64px); z-index: 9998;',
        '  background: var(--dsw-alias-bg-layer-2, #1b1b1f);',
        '  border: 1px solid rgba(107,184,107,0.38); border-radius: 10px;',
        '  box-shadow: 0 12px 36px rgba(0,0,0,0.55); display: flex; flex-direction: column; overflow: hidden;',
        '  transition: width 0.18s ease, height 0.18s ease;',
        '}',
        '.dsh-dao-drawer-backdrop.expanded {',
        '  width: 920px; height: 672px;',
        '  max-width: calc(100vw - 32px); max-height: calc(100vh - 64px);',
        '}',
        '.dsh-dao-drawer-head {',
        '  display: flex; align-items: center; justify-content: space-between;',
        '  padding: 8px 12px; border-bottom: 1px solid rgba(128,128,128,0.2);',
        '  background: rgba(107,184,107,0.08); font-weight: 600; font-size: 12.5px;',
        '}',
        '.dsh-dao-footer-btn {',
        '  display: inline-flex; align-items: center; gap: 5px; height: 28px; padding: 0 9px;',
        '  border-radius: 6px; border: 1px solid rgba(107,184,107,0.35);',
        '  background: rgba(107,184,107,0.1); color: #6bb86b; cursor: pointer;',
        '  font-size: 11.5px; font-weight: 600; transition: all 0.15s;',
        '}',
        '.dsh-dao-footer-btn.off {',
        '  border-color: rgba(128,128,128,0.35); background: transparent; color: inherit; opacity: 0.75;',
        '}',
        '.dsh-dao-footer-btn:hover { opacity: 1; background: rgba(107,184,107,0.2); }',
      ].join('\n')
      document.head.appendChild(style)
    }

    function fJson(path, opts) {
      return fetch(API_BASE + path, Object.assign({ cache: 'no-store' }, opts || {})).then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status)
        return r.json()
      })
    }

    function spCanonPart(s) {
      if (!s) return ''
      var sep = '\n\n---\n\n'
      var idx = s.indexOf(sep)
      return idx >= 0 ? s.slice(0, idx) : s
    }

    // ─── 核心「本源观照」React 组件 (可复用于 Tab 视图、设置页与悬浮窗) ───
    function DaoEssenceView(props) {
      var compact = !!(props && props.compact)

      var _mode = useState('invert')
      var mode = _mode[0], setMode = _mode[1]

      var _canon = useState('laozi+yinfu')
      var canon = _canon[0], setCanon = _canon[1]

      var _ping = useState(null)
      var ping = _ping[0], setPing = _ping[1]

      var _spText = useState('（待首次对话或加载本源…）')
      var spText = _spText[0], setSpText = _spText[1]

      var _editMode = useState(false)
      var editMode = _editMode[0], setEditMode = _editMode[1]

      var _editDraft = useState('')
      var editDraft = _editDraft[0], setEditDraft = _editDraft[1]

      var _editStatus = useState('')
      var editStatus = _editStatus[0], setEditStatus = _editStatus[1]

      var _customInfo = useState({ has_custom: false, chars: 0, default_sp: '' })
      var customInfo = _customInfo[0], setCustomInfo = _customInfo[1]

      var lastSigRef = useRef('')
      var actionLockUntilRef = useRef(0)

      function lockPolling(ms) {
        actionLockUntilRef.current = Date.now() + (ms || 1200)
      }

      function pullAll(force) {
        if (!force && Date.now() < actionLockUntilRef.current) return
        Promise.all([
          fJson('/ping').catch(function () { return null }),
          fJson('/preview').catch(function () { return null }),
          fJson('/custom_sp').catch(function () { return null }),
        ]).then(function (res) {
          if (!force && Date.now() < actionLockUntilRef.current) return
          var p = res[0]
          var prev = res[1]
          var cs = res[2]
          if (p && p.ok) {
            setPing(p)
            if (p.mode) setMode(p.mode)
            if (p.canon) setCanon(p.canon)
          }
          if (prev && prev.ok) {
            setSpText(prev.after || '')
          }
          if (cs && cs.ok) {
            setCustomInfo(cs)
          }
        })
      }

      useEffect(function () {
        injectStyles()
        pullAll(true)
        var timer = setInterval(function () {
          if (Date.now() < actionLockUntilRef.current) return
          fJson('/sig')
            .then(function (s) {
              if (!s || !s.ok) return
              if (Date.now() < actionLockUntilRef.current) return
              var sig = [s.mode_sig, s.sp_sig, s.custom_sig, s.injects_last_at, s.tape_last_at].join('|')
              if (sig !== lastSigRef.current) {
                lastSigRef.current = sig
                pullAll(false)
              }
            })
            .catch(function () {})
        }, 2500)
        return function () { clearInterval(timer) }
      }, [])

      function handleSwitchMode(targetMode) {
        if (targetMode === mode && !editMode) return
        lockPolling(1000)
        setEditMode(false)
        setMode(targetMode)
        fJson('/mode', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ mode: targetMode }),
        }).then(function () { pullAll(true) }).catch(function () {})
      }

      function handleSwitchCanon(e) {
        var nextCanon = e.target.value
        lockPolling(1500)
        setCanon(nextCanon)
        setMode('invert')

        // 在下拉列表中选择提示词后，自动切换至道模式并注入该提示词
        Promise.all([
          fJson('/canon', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ canon: nextCanon }),
          }).catch(function () { return null }),
          fJson('/mode', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ mode: 'invert' }),
          }).catch(function () { return null }),
          fJson('/custom_sp').catch(function () { return null }),
        ]).then(function (res) {
          var cs = res[2]
          if (cs && cs.ok) {
            setCustomInfo(cs)
          }
          if (nextCanon === 'custom') {
            var hasCustomText = !!(cs && cs.has_custom && cs.sp && cs.sp.trim().length > 0)
            if (!hasCustomText) {
              // 若“自定义”为空，则自动打开编辑框提示用户写入自定义提示词
              setEditDraft('')
              setEditMode(true)
              setEditStatus('⚠ 当前「自定义」为空，请在此写入自定义提示词并点击「✔ 注入」')
              setSpText('（当前「自定义」为空，请写入自定义提示词后点击「✔ 注入」）')
              return
            }
          }
          setEditMode(false)
          pullAll(true)
        })
      }

      function handleToggleEdit() {
        var next = !editMode
        setEditMode(next)
        if (next) {
          setEditStatus('加载中…')
          fJson('/custom_sp').then(function (cs) {
            if (!cs) return
            setCustomInfo(cs)
            setEditDraft(cs.sp || '')
            if (cs.has_custom && cs.sp) {
              setEditStatus('自定义 · ' + cs.chars + '字')
            } else {
              setEditStatus('请输入自定义提示词')
            }
          }).catch(function () {
            setEditStatus('加载失败')
          })
        }
      }

      function handleSaveCustom() {
        var trimmed = (editDraft || '').trim()
        if (!trimmed) {
          setEditStatus('✖ 请写入自定义提示词（内容不可为空）')
          return
        }
        lockPolling(1800)
        setEditStatus('正在注入…')
        fJson('/custom_sp', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ sp: trimmed, keep_blocks: false, source: 'dsh-client' }),
        }).then(function (r) {
          if (r && r.ok) {
            setCanon('custom')
            setMode('invert')
            setSpText(trimmed)
            setCustomInfo(function (prev) {
              return Object.assign({}, prev, { has_custom: true, sp: trimmed, chars: r.chars })
            })
            setEditStatus('✔ 已注入并切换至「自定义」 (' + r.chars + '字)')
            return Promise.all([
              fJson('/canon', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ canon: 'custom' }),
              }).catch(function () {}),
              fJson('/mode', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ mode: 'invert' }),
              }).catch(function () {}),
            ]).then(function () {
              setCanon('custom')
              setMode('invert')
              pullAll(true)
              setTimeout(function () {
                setCanon('custom')
                setEditMode(false)
              }, 450)
            })
          } else {
            setEditStatus('✖ 失败: ' + ((r && r.error) || '?'))
          }
        }).catch(function (e) {
          setEditStatus('✖ 失败: ' + e.message)
        })
      }

      function handleResetCustom() {
        lockPolling(1200)
        setEditStatus('归道中…')
        fJson('/custom_sp', { method: 'DELETE' }).then(function (r) {
          if (r && r.ok) {
            var nextC = r.canon || 'laozi+yinfu'
            setCanon(nextC)
            setEditDraft('')
            setCustomInfo(function (prev) {
              return Object.assign({}, prev, { has_custom: false, sp: '', chars: 0 })
            })
            setEditStatus('✔ 已清空自定义并归道')
            pullAll(true)
          }
        }).catch(function () {
          setEditStatus('✖ 归道失败')
        })
      }

      var hostOk = !!(ping && ping.ok)
      var capOk = !!(ping && ping.capture_count > 0)
      var modeOk = mode === 'invert'
      var displayedText = spText

      return h(
        'div',
        { className: 'dsh-dao-panel', style: compact ? { padding: '10px' } : undefined },
        // 顶部控制栏：道、官、编 + 经藏下拉 (含自定义)
        h(
          'div',
          { className: 'dsh-dao-bar' },
          h(
            'span',
            {
              className: 'dsh-dao-dots',
              title: 'Host:' + (hostOk ? '✓' : '✗') + ' · Cap:' + (capOk ? '✓' : '✗') + ' · Mode:' + mode,
            },
            h('span', { className: 'dsh-dao-dot ' + (hostOk ? 'ok' : 'err') }),
            h('span', { className: 'dsh-dao-dot ' + (capOk ? 'ok' : 'warn') }),
            h('span', { className: 'dsh-dao-dot ' + (modeOk ? 'ok' : 'err') }),
          ),
          h(
            'button',
            {
              type: 'button',
              className: 'dsh-dao-mb ' + (mode === 'invert' ? 'active-dao' : ''),
              title: '道Agent · 完全替换为所选经藏或自定义提示词',
              onClick: function () { handleSwitchMode('invert') },
            },
            '道',
          ),
          h(
            'button',
            {
              type: 'button',
              className: 'dsh-dao-mb ' + (mode === 'passthrough' ? 'active-off' : ''),
              title: '官方Agent · 原样透传官方提示词',
              onClick: function () { handleSwitchMode('passthrough') },
            },
            '官',
          ),
          h(
            'button',
            {
              type: 'button',
              className: 'dsh-dao-ib ' + (editMode ? 'edit-active' : ''),
              title: '在线编辑并保存到「自定义」',
              onClick: handleToggleEdit,
            },
            '编',
          ),
          h(
            'select',
            {
              className: 'dsh-dao-select',
              value: canon,
              title: '切换经藏或使用自定义提示词',
              onChange: handleSwitchCanon,
            },
            h('option', { value: 'laozi+yinfu' }, '帛書老子+道藏陰符經'),
            h('option', { value: 'laozi' }, '帛書《老子》'),
            h('option', { value: 'yinfu' }, '道藏《陰符經》'),
            h('option', { value: 'custom' }, '自定义'),
          ),
        ),
        // 状态统计条
        h(
          'div',
          { className: 'dsh-dao-stat' },
          h('span', { className: 'dsh-dao-pill' }, (displayedText ? displayedText.length : 0) + '字'),
          ping && ping.canon_name ? h('span', { className: 'dsh-dao-pill' }, ping.canon_name) : null,
          ping ? h('span', { className: 'dsh-dao-pill' }, '捕获 ×' + (ping.capture_count || 0)) : null,
        ),
        // 编辑态 vs 观照态
        editMode
          ? h(
              'div',
              { className: 'dsh-dao-edit-area' },
              h(
                'div',
                { className: 'dsh-dao-edit-hint' },
                '编此 · 保存到「自定义」选项 · Ctrl+Enter 保存 · Esc 关闭',
              ),
              h('textarea', {
                className: 'dsh-dao-textarea',
                value: editDraft,
                onChange: function (e) { setEditDraft(e.target.value) },
                onKeyDown: function (e) {
                  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                    e.preventDefault()
                    handleSaveCustom()
                  } else if (e.key === 'Escape') {
                    e.preventDefault()
                    setEditMode(false)
                  }
                },
                placeholder: '输入自定义系统提示词（点击「✔ 注入」自动保存至列表「自定义」项）…',
              }),
              h(
                'div',
                { className: 'dsh-dao-edit-bar' },
                h(
                  'button',
                  { type: 'button', className: 'dsh-dao-eb save', onClick: handleSaveCustom },
                  '✔ 注入',
                ),
                h(
                  'button',
                  { type: 'button', className: 'dsh-dao-eb reset', onClick: handleResetCustom },
                  '✖ 归道',
                ),
                h('span', { style: { opacity: 0.6 } }, (editDraft || '').length + '字'),
                h('span', { style: { marginLeft: 'auto', opacity: 0.8 } }, editStatus),
              ),
            )
          : h(
              'pre',
              { className: 'dsh-dao-sp' + (!displayedText ? ' quiet' : '') },
              displayedText || '（待首次对话）',
            ),
      )
    }

    // ─── 侧边栏底部快捷按钮 + 悬浮「本源观照」抽屉 (默认 460×560，放大 920×672) ───
    function SidebarDaoFooterAction(props) {
      var wide = props ? props.wide !== false : true
      var _open = useState(false)
      var open = _open[0], setOpen = _open[1]
      var _expanded = useState(false)
      var expanded = _expanded[0], setExpanded = _expanded[1]
      var _mode = useState('invert')
      var mode = _mode[0], setMode = _mode[1]

      useEffect(function () {
        injectStyles()
        function syncMode() {
          fJson('/ping')
            .then(function (p) { if (p && p.mode) setMode(p.mode) })
            .catch(function () {})
        }
        syncMode()
        var t = setInterval(syncMode, 5000)
        function onKey(e) {
          if (e.altKey && (e.key === 'd' || e.key === 'D')) {
            e.preventDefault()
            setOpen(function (v) { return !v })
          }
        }
        window.addEventListener('keydown', onKey)
        return function () {
          clearInterval(t)
          window.removeEventListener('keydown', onKey)
        }
      }, [])

      return h(
        React.Fragment,
        null,
        h(
          'button',
          {
            type: 'button',
            className: 'dsh-dao-footer-btn' + (mode === 'invert' ? '' : ' off'),
            title: '道Agent · 本源观照 (点击打开面板 / Alt+D)',
            onClick: function () { setOpen(!open) },
          },
          h('span', null, '☯'),
          wide ? h('span', null, mode === 'invert' ? '道' : '官') : null,
        ),
        open
          ? h(
              'div',
              { className: 'dsh-dao-drawer-backdrop' + (expanded ? ' expanded' : '') },
              h(
                'div',
                { className: 'dsh-dao-drawer-head' },
                h('span', null, '☯ 道Agent · 本源观照'),
                h(
                  'div',
                  { style: { display: 'inline-flex', gap: '6px', alignItems: 'center' } },
                  h(
                    'button',
                    {
                      type: 'button',
                      className: 'dsh-dao-ib',
                      title: expanded ? '还原窗口大小 (460×560)' : '放大窗口 (920×672)',
                      onClick: function () { setExpanded(!expanded) },
                    },
                    expanded ? '🗗 还原' : '🗖 放大',
                  ),
                  h(
                    'button',
                    {
                      type: 'button',
                      className: 'dsh-dao-ib',
                      onClick: function () { setOpen(false) },
                    },
                    '✕',
                  ),
                ),
              ),
              h(
                'div',
                { style: { flex: 1, minHeight: 0, display: 'flex' } },
                h(DaoEssenceView, { compact: true }),
              ),
            )
          : null,
      )
    }

    // ─── 客户端插件入口 ───
    var inject = ['slots']

    function apply(ctx) {
      injectStyles()
      var slots = ctx.slots
      if (!slots) return

      // 1. 注册到左侧边栏底部按钮区 (`sidebar.footer.action`)
      slots.inject('sidebar.footer.action', function () {
        return slots.register(
          {
            name: 'sidebar.footer.action',
            id: 'dsh-dao-footer',
            order: 15,
          },
          SidebarDaoFooterAction,
        )
      })

      // 2. 注册到会话主栏视图标签页 (`conversation.view`)
      slots.inject('conversation.view', function () {
        return slots.register(
          {
            name: 'conversation.view',
            id: 'dsh-dao-essence',
            order: 30,
            label: function () { return '☯ 本源观照' },
          },
          DaoEssenceView,
        )
      })

      // 3. 注册到设置面板分区 (`settings.section`)
      slots.inject('settings.section', function () {
        return slots.register(
          {
            name: 'settings.section',
            id: 'dsh-dao-settings',
            order: 45,
            label: function () { return '☯ 道Agent · 本源' },
          },
          DaoEssenceView,
        )
      })
    }

    exports.name = 'dsh-dao'
    exports.inject = inject
    exports.apply = apply
    exports.DaoEssenceView = DaoEssenceView

    return module.exports
  },
})


<div align=center>
<img src="../../githubicon.png" alt="icon" width="100" height="100">
</div>

---

<p align="center">
  <a href="../../README.md"><img alt="README in English" src="https://img.shields.io/badge/English-d9d9d9"></a>
  <a href="../zh-TW/README.md"><img alt="繁體中文文件" src="https://img.shields.io/badge/繁體中文-d9d9d9"></a>
  <a href="../zh-CN/README.md"><img alt="简体中文文件" src="https://img.shields.io/badge/简体中文-d9d9d9"></a>
  <a href="../ja-JP/README.md"><img alt="日本語のREADME" src="https://img.shields.io/badge/日本語-d9d9d9"></a>
  <a href="../es-ES/README.md"><img alt="README en Español" src="https://img.shields.io/badge/Español-d9d9d9"></a>
  <a href="../fr-FR/README.md"><img alt="README en Français" src="https://img.shields.io/badge/Français-d9d9d9"></a>
  <a href="../ko-KR/README.md"><img alt="README in Korean" src="https://img.shields.io/badge/한국어-d9d9d9"></a>
  <a href="../ar-SA/README.md"><img alt="README بالعربية" src="https://img.shields.io/badge/العربية-d9d9d9"></a>
  <a href="../tr-TR/README.md"><img alt="Türkçe README" src="https://img.shields.io/badge/Türkçe-d9d9d9"></a>
  <a href="../vi-VN/README.md"><img alt="README Tiếng Việt" src="https://img.shields.io/badge/Ti%E1%BA%BFng%20Vi%E1%BB%87t-d9d9d9"></a>
  <a href="../de-DE/README.md"><img alt="README in Deutsch" src="https://img.shields.io/badge/German-d9d9d9"></a>
  <a href="../bn-BD/README.md"><img alt="README in বাংলা" src="https://img.shields.io/badge/বাংলা-d9d9d9"></a>
</p>

# <center> ☯ dsh-dao · 道Agent

> **道生一，一生二，二生三，三生万物。万物负阴而抱阳，中气以为和。**
> **观天之道，执天之行，尽矣。**

`dsh-dao` 是专为 **DeepSeek Harness (`v0.2.1-rc.2+`)** 与 **[DSH Desktop](https://github.com/anywhere-labs/dsh-desktop)** 打造的**DeepSeek Harness 破甲插件**。

完全遵循 [DSH Desktop 插件开发规范](https://github.com/anywhere-labs/dsh-desktop/blob/master/docs/plugin-development.md) 与 `@deepseek-ai/cordis` 双端组合契约：**实现核心提示词替换**。


![dsh-dao](../../dshdesktop.png)
---

## 一、核心功能

### 1. 系统提示词完全置换
- **彻底替换原始提示词**：在 **道Agent (`invert`)** 模式下，插件会将 DSH 组装的所有原始系统提示词段落及附加动态文本上下文全部清空，**完全替换为经藏本源或你的自定义提示词**，绝不在末尾残留原始提示词。
- **经藏本源注入**：内置**马王堆帛书甲本《老子》**（德经在前、道经在后，7126 字）与**道藏本《黄帝阴符经》**（597 字）
- **四档列表实时切换（含自定义）**：
  | 档位 key | 名称 | 字数 |
  | :--- | :--- | :---: |
  | `laozi+yinfu` | **帛書老子+道藏陰符經**（默认） | 7,725 字 |
  | `laozi` | **帛書《老子》**（德经 + 道经） | 7,126 字 |
  | `yinfu` | **道藏《陰符經》**（上中下三篇） | 597 字 |
  | `custom` | **自定义**（保存在本地的用户自定义提示词） | 按实际字数 |
- **工具 JSON Schema 保留**：保留模型调用工具所需的函数 Schema 定义（同时切除 `create_memory` 跨会话污染工具），确保文件读写、终端命令等工具调用正常运作。
- **道 / 官 二态零代价热切**：
  - **道Agent (`invert`)**：完全替换为所选经藏（或自定义提示词）。
  - **官方Agent (`passthrough`)**：100% 原样透传 DSH 官方提示词。
  - **可自定义提示词**：支持用户自定义提示词，并保存在本地。

### 2. 「本源观照」Web 面板
通过 DSH 官方客户端 Slot 体系挂载三处入口：
1. **左侧边栏底部快捷按钮 (`sidebar.footer.action`)**：显示 `☯ 道 / 官` 状态徽标，点击（或按快捷键 **`Alt + D`**）随时呼出右下角悬浮「本源观照」抽屉（默认 460×560，标题栏支持 **`🗖 放大 / 🗗 还原`** 切换为 **920×672**）。
2. **会话主栏视图标签页 (`conversation.view`)**：提供全屏级 `☯ 本源观照` 视图。
3. **设置面板分区 (`settings.section`)**：在 DSH 设置页内嵌 `☯ 道Agent · 本源` 控制面板。

**面板能力一览**：
- **三盏状态灯**：`Host`（插件存活）、`Capture`（是否已捕获真实请求）、`Mode`（绿=道Agent / 红=官方透传）。
- **极简三键控制栏（`[道]` · `[官]` · `[编]`）+ 经藏下拉框**：
  - **`[道]`**：切换至道Agent，完全使用经藏/自定义提示词，并根据下拉框实时联动显示对应内容。
  - **`[官]`**：切换至官方Agent，原样透传并显示官方原始提示词。
  - **`[编]`**：打开在线自定义 SP 编辑器（`Ctrl+Enter` 或点击 `[✔ 注入]` 保存到下拉列表的「自定义」选项并自动跳转到「自定义」；之后可在老子、阴符经与「自定义」之间随时来回切换而不会改动自定义内容；点击 `[✖ 归道]` 可清空自定义并恢复默认经藏）。

### 3. `/dao` 斜杠命令（TUI / Web / Desktop 通用）
在任意 DSH 对话框中输入：
- `/dao` 或 `/dao toggle`：在「道Agent」与「官方Agent」之间一键切换
- `/dao on`：切换至道Agent (`invert`)
- `/dao off`：切换至官方Agent (`passthrough`)
- `/dao canon laozi+yinfu` / `/dao canon laozi` / `/dao canon yinfu`：切换经藏
- `/dao status`：查看当前模式、经藏字数与捕获统计

---

## 二、安装方式

### 方式 1：DSH Desktop 图形化安装（推荐）
在 **DSH Desktop (`v0.2.1-rc.2+`)** 的插件管理面板中，填入本仓库 GitHub 地址或本地目录路径即可自动挂载（包内已声明 `dsh.bundle.patch` 与 `dsh.client`）。

### 方式 2：DSH 官方 CLI 安装
```bash
# 从 GitHub 仓库直接安装
dsh plugin --profile web add git+https://github.com/Yikumasai/dsh-dao.git

# 或从本地克隆目录安装
git clone https://github.com/Yikumasai/dsh-dao.git
cd dsh-dao
dsh plugin --profile web add .
```

也可以使用仓库内置的一键脚本（自动处理 `pnpm-workspace.yaml` 的 `minimumReleaseAgeExclude`）：
```bash
# macOS / Linux / Git Bash
bash scripts/install.sh

# Windows PowerShell
powershell -ExecutionPolicy Bypass -File scripts/install.ps1
```

### 卸载
```bash
dsh plugin --profile web remove dsh-dao
```

---

## 三、HTTP 控制面 API（同源 `/plugins/dsh-dao/origin/*`）

| 端点 | 方法 | 说明 |
| :--- | :---: | :--- |
| `/plugins/dsh-dao/origin/ping` | `GET` | 插件状态、版本、当前模式、经藏字数、捕获计数 |
| `/plugins/dsh-dao/origin/sig` | `GET` | 轻量状态指纹（供前端轮询零闪烁对齐） |
| `/plugins/dsh-dao/origin/mode` | `GET` / `POST` | 查询或切换模式 `{"mode": "invert" \| "passthrough"}` |
| `/plugins/dsh-dao/origin/canon` | `GET` / `POST` | 查询或切换经藏 `{"canon": "laozi+yinfu" \| "laozi" \| "yinfu"}` |
| `/plugins/dsh-dao/origin/custom_sp` | `GET` / `POST` / `DELETE` | 查询、保存或重置自定义 System Prompt |
| `/plugins/dsh-dao/origin/preview` | `GET` | 获取最近一次捕获的 `before`（原始 SP）与 `after`（实收 SP）对比 |
| `/plugins/dsh-dao/origin/tape` | `GET` | 获取最近 16 槽完整请求时序磁带 (`?limit=16&fields=1`) |
| `/plugins/dsh-dao/origin/stream` | `GET` | SSE 实时事件流 (`hello` / `turn` / `mode` / `canon` / `hb`) |
| `/plugins/dsh-dao/origin/view` | `GET` | 独立 HTML「本源观照」全屏控制台 |

---
## 致谢

 - **[windsurf-assistant](https://github.com/dao-genesis/windsurf-assistant)**

--- 
## License

[Apache-2.0](../../LICENSE)

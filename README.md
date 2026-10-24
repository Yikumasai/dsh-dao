
<div align=center>
<img src="./githubicon.png" alt="icon" width="100" height="100">
</div>

---

<p align="center">
  <a href="./README.md"><img alt="README in English" src="https://img.shields.io/badge/English-d9d9d9"></a>
  <a href="./docs/zh-TW/README.md"><img alt="繁體中文文件" src="https://img.shields.io/badge/繁體中文-d9d9d9"></a>
  <a href="./docs/zh-CN/README.md"><img alt="简体中文文件" src="https://img.shields.io/badge/简体中文-d9d9d9"></a>
  <a href="./docs/ja-JP/README.md"><img alt="日本語のREADME" src="https://img.shields.io/badge/日本語-d9d9d9"></a>
  <a href="./docs/es-ES/README.md"><img alt="README en Español" src="https://img.shields.io/badge/Español-d9d9d9"></a>
  <a href="./docs/fr-FR/README.md"><img alt="README en Français" src="https://img.shields.io/badge/Français-d9d9d9"></a>
  <a href="./docs/ko-KR/README.md"><img alt="README in Korean" src="https://img.shields.io/badge/한국어-d9d9d9"></a>
  <a href="./docs/ar-SA/README.md"><img alt="README بالعربية" src="https://img.shields.io/badge/العربية-d9d9d9"></a>
  <a href="./docs/tr-TR/README.md"><img alt="Türkçe README" src="https://img.shields.io/badge/Türkçe-d9d9d9"></a>
  <a href="./docs/vi-VN/README.md"><img alt="README Tiếng Việt" src="https://img.shields.io/badge/Ti%E1%BA%BFng%20Vi%E1%BB%87t-d9d9d9"></a>
  <a href="./docs/de-DE/README.md"><img alt="README in Deutsch" src="https://img.shields.io/badge/German-d9d9d9"></a>
  <a href="./docs/bn-BD/README.md"><img alt="README in বাংলা" src="https://img.shields.io/badge/বাংলা-d9d9d9"></a>
</p>

# <center> ☯ dsh-dao · Dao Agent

> **The Dao gives birth to One; One gives birth to Two; Two gives birth to Three; Three gives birth to the ten thousand things. The ten thousand things carry Yin on their backs and embrace Yang, blending the vital breaths into harmony.**
> **Observe the Dao of Heaven; hold fast to the workings of Heaven — and all is complete.**

`dsh-dao` is a **jailbreak plugin**, built for **DeepSeek Harness (`v0.2.1-rc.2+`)** and **[DSH Desktop](https://github.com/anywhere-labs/dsh-desktop)**.

It fully complies with the [DSH Desktop Plugin Development Guide](https://github.com/anywhere-labs/dsh-desktop/blob/master/docs/plugin-development.md) and the `@deepseek-ai/cordis` dual-side composition contract: **complete replacement of the core system prompt**.


![dsh-dao](./dshdesktop.png)
---

## I. Core Features

### 1. Complete System Prompt Replacement
- **Total replacement of the original prompt**: in **Dao Agent (`invert`)** mode, the plugin wipes out every original system-prompt segment assembled by DSH along with all appended dynamic text context, **replacing it entirely with the canonical scripture or your custom prompt** — no trace of the original prompt is left behind.
- **Canonical scripture injection**: ships with the **Mawangdui Silk Manuscript Laozi, Version A** (De Jing first, Dao Jing second; 7,126 characters) and the **Daoist Canon edition of the Huangdi Yinfu Jing** (597 characters).
- **Four presets switchable in real time (custom included)**:
  | Preset key | Name | Length |
  | :--- | :--- | :---: |
  | `laozi+yinfu` | **Silk Laozi + Daoist Yinfu Jing** (default) | 7,725 chars |
  | `laozi` | **Silk Laozi** (De Jing + Dao Jing) | 7,126 chars |
  | `yinfu` | **Daoist Yinfu Jing** (upper, middle, lower scrolls) | 597 chars |
  | `custom` | **Custom** (user-defined prompt saved locally) | actual length |
- **Tool JSON Schemas preserved**: keeps the function Schema definitions required for model tool calls (while excising the `create_memory` cross-session pollution tool), so file read/write, terminal commands, and other tool calls keep working normally.
- **Zero-cost hot-switching between Dao / Official**:
  - **Dao Agent (`invert`)**: fully replaced with the selected canon (or custom prompt).
  - **Official Agent (`passthrough`)**: passes the official DSH prompt through 100% unchanged.
  - **Custom prompt support**: user-defined prompts can be saved locally.

### 2. The "Origin Gaze" Web Panel
Mounted at three entry points through the official DSH client Slot system:
1. **Quick button at the bottom of the left sidebar (`sidebar.footer.action`)**: displays the `☯ Dao / Official` status badge; click it (or press **`Alt + D`**) at any time to summon the floating "Origin Gaze" drawer in the lower-right corner (default 460×560; the title bar supports **`🗖 Maximize / 🗗 Restore`** toggling to **920×672**).
2. **Conversation view tab (`conversation.view`)**: provides a full-screen `☯ Origin Gaze` view.
3. **Settings section (`settings.section`)**: embeds the `☯ Dao Agent · Origin` control panel inside the DSH settings page.

**Panel capabilities at a glance**:
- **Three status lights**: `Host` (plugin alive), `Capture` (whether a real request has been captured), `Mode` (green = Dao Agent / red = official passthrough).
- **Minimal three-button control bar (`[道]` · `[官]` · `[编]`) + canon dropdown**:
  - **`[道]` (Dao)**: switch to Dao Agent — uses the canon/custom prompt exclusively, and live-syncs the dropdown to display the corresponding content.
  - **`[官]` (Official)**: switch to Official Agent — passes through and displays the official original prompt unchanged.
  - **`[编]` (Edit)**: open the online custom SP editor (`Ctrl+Enter` or click `[✔ 注入]` to save into the "Custom" option of the dropdown and jump to "Custom" automatically; afterwards you can switch freely between Laozi, Yinfu Jing and "Custom" without altering the custom content; click `[✖ 归道]` to clear the custom prompt and restore the default canon).

### 3. The `/dao` Slash Command (TUI / Web / Desktop)
Type in any DSH dialog:
- `/dao` or `/dao toggle`: one-key toggle between "Dao Agent" and "Official Agent"
- `/dao on`: switch to Dao Agent (`invert`)
- `/dao off`: switch to Official Agent (`passthrough`)
- `/dao canon laozi+yinfu` / `/dao canon laozi` / `/dao canon yinfu`: switch canon
- `/dao status`: view the current mode, canon length, and capture statistics

---

## II. Installation

### Option 1: GUI install via DSH Desktop (recommended)
In the plugin management panel of **DSH Desktop (`v0.2.1-rc.2+`)**, fill in this repository's GitHub address or a local directory path to mount it automatically (the package already declares `dsh.bundle.patch` and `dsh.client`).

### Option 2: Official DSH CLI
```bash
# Install directly from the GitHub repository
dsh plugin --profile web add git+https://github.com/Yikumasai/dsh-dao.git

# Or install from a local clone
git clone https://github.com/Yikumasai/dsh-dao.git
cd dsh-dao
dsh plugin --profile web add .
```

You can also use the built-in one-click scripts (which automatically handle `pnpm-workspace.yaml`'s `minimumReleaseAgeExclude`):
```bash
# macOS / Linux / Git Bash
bash scripts/install.sh

# Windows PowerShell
powershell -ExecutionPolicy Bypass -File scripts/install.ps1
```

### Uninstall
```bash
dsh plugin --profile web remove dsh-dao
```

---

## III. HTTP Control API (same-origin `/plugins/dsh-dao/origin/*`)

| Endpoint | Method | Description |
| :--- | :---: | :--- |
| `/plugins/dsh-dao/origin/ping` | `GET` | Plugin status, version, current mode, canon length, capture count |
| `/plugins/dsh-dao/origin/sig` | `GET` | Lightweight status fingerprint (for flicker-free frontend polling) |
| `/plugins/dsh-dao/origin/mode` | `GET` / `POST` | Query or switch mode `{"mode": "invert" \| "passthrough"}` |
| `/plugins/dsh-dao/origin/canon` | `GET` / `POST` | Query or switch canon `{"canon": "laozi+yinfu" \| "laozi" \| "yinfu"}` |
| `/plugins/dsh-dao/origin/custom_sp` | `GET` / `POST` / `DELETE` | Query, save, or reset the custom System Prompt |
| `/plugins/dsh-dao/origin/preview` | `GET` | Get the latest captured `before` (original SP) vs `after` (delivered SP) comparison |
| `/plugins/dsh-dao/origin/tape` | `GET` | Get the last 16 slots of the full request-timing tape (`?limit=16&fields=1`) |
| `/plugins/dsh-dao/origin/stream` | `GET` | SSE real-time event stream (`hello` / `turn` / `mode` / `canon` / `hb`) |
| `/plugins/dsh-dao/origin/view` | `GET` | Standalone HTML "Origin Gaze" full-screen console |

---
## Acknowledgements

 - **[windsurf-assistant](https://github.com/dao-genesis/windsurf-assistant)**

--- 
## License

[Apache-2.0](LICENSE)

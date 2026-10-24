
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

> **道生一，一生二，二生三，三生萬物。萬物負陰而抱陽，中氣以為和。**
> **觀天之道，執天之行，盡矣。**

`dsh-dao` 是專為 **DeepSeek Harness (`v0.2.1-rc.2+`)** 與 **[DSH Desktop](https://github.com/anywhere-labs/dsh-desktop)** 打造的**DeepSeek Harness 破甲插件**。

完全遵循 [DSH Desktop 插件開發規範](https://github.com/anywhere-labs/dsh-desktop/blob/master/docs/plugin-development.md) 與 `@deepseek-ai/cordis` 雙端組合契約：**實現核心提示詞替換**。


![dsh-dao](../../dshdesktop.png)
---

## 一、核心功能

### 1. 系統提示詞完全置換
- **徹底替換原始提示詞**：在 **道Agent (`invert`)** 模式下，插件會將 DSH 組裝的所有原始系統提示詞段落及附加動態文本上下文全部清空，**完全替換為經藏本源或你的自定義提示詞**，絕不在末尾殘留原始提示詞。
- **經藏本源注入**：內置**馬王堆帛書甲本《老子》**（德經在前、道經在後，7126 字）與**道藏本《黃帝陰符經》**（597 字）
- **四檔列表實時切換（含自定義）**：
  | 檔位 key | 名稱 | 字數 |
  | :--- | :--- | :---: |
  | `laozi+yinfu` | **帛書老子+道藏陰符經**（默認） | 7,725 字 |
  | `laozi` | **帛書《老子》**（德經 + 道經） | 7,126 字 |
  | `yinfu` | **道藏《陰符經》**（上中下三篇） | 597 字 |
  | `custom` | **自定義**（保存在本地的用戶自定義提示詞） | 按實際字數 |
- **工具 JSON Schema 保留**：保留模型調用工具所需的函數 Schema 定義（同時切除 `create_memory` 跨會話污染工具），確保文件讀寫、終端命令等工具調用正常運作。
- **道 / 官 二態零代價熱切**：
  - **道Agent (`invert`)**：完全替換為所選經藏（或自定義提示詞）。
  - **官方Agent (`passthrough`)**：100% 原樣透傳 DSH 官方提示詞。
  - **可自定義提示詞**：支持用戶自定義提示詞，並保存在本地。

### 2. 「本源觀照」Web 面板
通過 DSH 官方客戶端 Slot 體系掛載三處入口：
1. **左側邊欄底部快捷按鈕 (`sidebar.footer.action`)**：顯示 `☯ 道 / 官` 狀態徽標，點擊（或按快捷鍵 **`Alt + D`**）隨時呼出右下角懸浮「本源觀照」抽屜（默認 460×560，標題欄支持 **`🗖 放大 / 🗗 還原`** 切換為 **920×672**）。
2. **會話主欄視圖標籤頁 (`conversation.view`)**：提供全屏級 `☯ 本源觀照` 視圖。
3. **設置面板分區 (`settings.section`)**：在 DSH 設置頁內嵌 `☯ 道Agent · 本源` 控制面板。

**面板能力一覽**：
- **三盞狀態燈**：`Host`（插件存活）、`Capture`（是否已捕獲真實請求）、`Mode`（綠=道Agent / 紅=官方透傳）。
- **極簡三鍵控制欄（`[道]` · `[官]` · `[編]`）+ 經藏下拉框**：
  - **`[道]`**：切換至道Agent，完全使用經藏/自定義提示詞，並根據下拉框實時聯動顯示對應內容。
  - **`[官]`**：切換至官方Agent，原樣透傳並顯示官方原始提示詞。
  - **`[編]`**：打開在線自定義 SP 編輯器（`Ctrl+Enter` 或點擊 `[✔ 注入]` 保存到下拉列表的「自定義」選項並自動跳轉到「自定義」；之後可在老子、陰符經與「自定義」之間隨時來回切換而不會改動自定義內容；點擊 `[✖ 歸道]` 可清空自定義並恢復默認經藏）。

### 3. `/dao` 斜杠命令（TUI / Web / Desktop 通用）
在任意 DSH 對話框中輸入：
- `/dao` 或 `/dao toggle`：在「道Agent」與「官方Agent」之間一鍵切換
- `/dao on`：切換至道Agent (`invert`)
- `/dao off`：切換至官方Agent (`passthrough`)
- `/dao canon laozi+yinfu` / `/dao canon laozi` / `/dao canon yinfu`：切換經藏
- `/dao status`：查看當前模式、經藏字數與捕獲統計

---

## 二、安裝方式

### 方式 1：DSH Desktop 圖形化安裝（推薦）
在 **DSH Desktop (`v0.2.1-rc.2+`)** 的插件管理面板中，填入本倉庫 GitHub 地址或本地目錄路徑即可自動掛載（包內已聲明 `dsh.bundle.patch` 與 `dsh.client`）。

### 方式 2：DSH 官方 CLI 安裝
```bash
# 從 GitHub 倉庫直接安裝
dsh plugin --profile web add git+https://github.com/Yikumasai/dsh-dao.git

# 或從本地克隆目錄安裝
git clone https://github.com/Yikumasai/dsh-dao.git
cd dsh-dao
dsh plugin --profile web add .
```

也可以使用倉庫內置的一鍵腳本（自動處理 `pnpm-workspace.yaml` 的 `minimumReleaseAgeExclude`）：
```bash
# macOS / Linux / Git Bash
bash scripts/install.sh

# Windows PowerShell
powershell -ExecutionPolicy Bypass -File scripts/install.ps1
```

### 卸載
```bash
dsh plugin --profile web remove dsh-dao
```

---

## 三、HTTP 控制面 API（同源 `/plugins/dsh-dao/origin/*`）

| 端點 | 方法 | 說明 |
| :--- | :---: | :--- |
| `/plugins/dsh-dao/origin/ping` | `GET` | 插件狀態、版本、當前模式、經藏字數、捕獲計數 |
| `/plugins/dsh-dao/origin/sig` | `GET` | 輕量狀態指紋（供前端輪詢零閃爍對齊） |
| `/plugins/dsh-dao/origin/mode` | `GET` / `POST` | 查詢或切換模式 `{"mode": "invert" \| "passthrough"}` |
| `/plugins/dsh-dao/origin/canon` | `GET` / `POST` | 查詢或切換經藏 `{"canon": "laozi+yinfu" \| "laozi" \| "yinfu"}` |
| `/plugins/dsh-dao/origin/custom_sp` | `GET` / `POST` / `DELETE` | 查詢、保存或重置自定義 System Prompt |
| `/plugins/dsh-dao/origin/preview` | `GET` | 獲取最近一次捕獲的 `before`（原始 SP）與 `after`（實收 SP）對比 |
| `/plugins/dsh-dao/origin/tape` | `GET` | 獲取最近 16 槽完整請求時序磁帶 (`?limit=16&fields=1`) |
| `/plugins/dsh-dao/origin/stream` | `GET` | SSE 實時事件流 (`hello` / `turn` / `mode` / `canon` / `hb`) |
| `/plugins/dsh-dao/origin/view` | `GET` | 獨立 HTML「本源觀照」全屏控制台 |

---
## 致謝

 - **[windsurf-assistant](https://github.com/dao-genesis/windsurf-assistant)**

--- 
## License

[Apache-2.0](../../LICENSE)

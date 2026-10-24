
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

# <center> ☯ dsh-dao · 道エージェント

> **道は一を生じ、一は二を生じ、二は三を生じ、三は万物を生ず。万物は陰を負いて陽を抱き、中氣もって和を為す。**
> **天の道を観て、天の行を執る。尽くしたり。**

`dsh-dao` は **DeepSeek Harness (`v0.2.1-rc.2+`)** と **[DSH Desktop](https://github.com/anywhere-labs/dsh-desktop)** 専用に作られた **DeepSeek Harness 破甲（アーマーピアス）プラグイン**です。

[DSH Desktop プラグイン開発規範](https://github.com/anywhere-labs/dsh-desktop/blob/master/docs/plugin-development.md)と `@deepseek-ai/cordis` のデュアルサイド構成契約に完全準拠：**コアシステムプロンプトの完全置換を実現します**。


![dsh-dao](../../dshdesktop.png)
---

## 一、コア機能

### 1. システムプロンプトの完全置換
- **元プロンプトの徹底的な置換**：**道エージェント（`invert`）**モードでは、プラグインが DSH が組み立てたすべての元システムプロンプト断片と付加的な動的テキストコンテキストを完全に消去し、**経蔵の原文またはカスタムプロンプトに完全に置き換え**ます。末尾に元プロンプトが残ることは一切ありません。
- **経蔵ソースの注入**：**馬王堆帛書甲本『老子』**（徳経が先、道経が後、7126 字）と**道蔵本『黄帝陰符経』**（597 字）を内蔵。
- **4 段階プリセットのリアルタイム切替（カスタム含む）**：
  | プリセット key | 名称 | 文字数 |
  | :--- | :--- | :---: |
  | `laozi+yinfu` | **帛書老子＋道蔵陰符経**（デフォルト） | 7,725 字 |
  | `laozi` | **帛書『老子』**（徳経 + 道経） | 7,126 字 |
  | `yinfu` | **道蔵『陰符経』**（上中下の三篇） | 597 字 |
  | `custom` | **カスタム**（ローカルに保存されるユーザー定義プロンプト） | 実際の文字数 |
- **ツール JSON Schema の保持**：モデルがツールを呼び出すために必要な関数 Schema 定義を保持し（`create_memory` のようなセッション横断汚染ツールは切除）、ファイル読み書きやターミナルコマンドなどのツール呼び出しが正常に動作することを保証します。
- **道 / 官 の二態ゼロコスト・ホットスイッチ**：
  - **道エージェント（`invert`）**：選択した経蔵（またはカスタムプロンプト）に完全置換。
  - **公式エージェント（`passthrough`）**：DSH 公式プロンプトを 100% そのまま透過。
  - **カスタムプロンプト対応**：ユーザー定義プロンプトをローカルに保存可能。

### 2. 「本源観照」Web パネル
DSH 公式クライアントの Slot 体系により 3 か所のエントリーをマウント：
1. **左サイドバー下部のクイックボタン（`sidebar.footer.action`）**：`☯ 道 / 官` ステータスバッジを表示。クリック（またはショートカット **`Alt + D`**）で、右下にフローティング「本源観照」ドロワーをいつでも呼び出せます（デフォルト 460×560、タイトルバーで **`🗖 拡大 / 🗗 復元`** により **920×672** に切替可能）。
2. **会話ビューのタブ（`conversation.view`）**：フルスクリーン級の `☯ 本源観照` ビューを提供。
3. **設定パネルのセクション（`settings.section`）**：DSH 設定ページ内に `☯ 道エージェント · 本源` コントロールパネルを埋め込み。

**パネル機能一覧**：
- **3 つのステータスランプ**：`Host`（プラグイン生存）、`Capture`（実リクエストを捕捉済みか）、`Mode`（緑=道エージェント / 赤=公式透過）。
- **極小 3 ボタンコントロールバー（`[道]` · `[官]` · `[編]`）+ 経蔵ドロップダウン**：
  - **`[道]`**：道エージェントに切替。経蔵/カスタムプロンプトのみを使用し、ドロップダウンと連動して対応内容をリアルタイム表示。
  - **`[官]`**：公式エージェントに切替。公式の元プロンプトをそのまま透過・表示。
  - **`[編]`**：オンラインのカスタム SP エディタを開く（`Ctrl+Enter` または `[✔ 注入]` をクリックでドロップダウンの「カスタム」項目に保存し自動的に「カスタム」へ遷移。以後、老子・陰符経・「カスタム」間を自由に行き来してもカスタム内容は変更されません。`[✖ 帰道]` クリックでカスタムを消去しデフォルト経蔵に復帰）。

### 3. `/dao` スラッシュコマンド（TUI / Web / Desktop 共通）
任意の DSH ダイアログで入力：
- `/dao` または `/dao toggle`：「道エージェント」と「公式エージェント」をワンキー切替
- `/dao on`：道エージェント（`invert`）に切替
- `/dao off`：公式エージェント（`passthrough`）に切替
- `/dao canon laozi+yinfu` / `/dao canon laozi` / `/dao canon yinfu`：経蔵を切替
- `/dao status`：現在のモード、経蔵文字数、捕捉統計を表示

---

## 二、インストール方法

### 方法 1：DSH Desktop の GUI インストール（推奨）
**DSH Desktop (`v0.2.1-rc.2+`)** のプラグイン管理パネルで、本リポジトリの GitHub アドレスまたはローカルディレクトリパスを入力すれば自動的にマウントされます（パッケージ内で `dsh.bundle.patch` と `dsh.client` を宣言済み）。

### 方法 2：DSH 公式 CLI でインストール
```bash
# GitHub リポジトリから直接インストール
dsh plugin --profile web add git+https://github.com/Yikumasai/dsh-dao.git

# またはローカルクローンからインストール
git clone https://github.com/Yikumasai/dsh-dao.git
cd dsh-dao
dsh plugin --profile web add .
```

リポジトリ内蔵のワンクリックスクリプトも利用可能です（`pnpm-workspace.yaml` の `minimumReleaseAgeExclude` を自動処理）：
```bash
# macOS / Linux / Git Bash
bash scripts/install.sh

# Windows PowerShell
powershell -ExecutionPolicy Bypass -File scripts/install.ps1
```

### アンインストール
```bash
dsh plugin --profile web remove dsh-dao
```

---

## 三、HTTP コントロール API（同一オリジン `/plugins/dsh-dao/origin/*`）

| エンドポイント | メソッド | 説明 |
| :--- | :---: | :--- |
| `/plugins/dsh-dao/origin/ping` | `GET` | プラグイン状態、バージョン、現在のモード、経蔵文字数、捕捉カウント |
| `/plugins/dsh-dao/origin/sig` | `GET` | 軽量ステータス指紋（フロントエンドのちらつきなしポーリング用） |
| `/plugins/dsh-dao/origin/mode` | `GET` / `POST` | モードの照会・切替 `{"mode": "invert" \| "passthrough"}` |
| `/plugins/dsh-dao/origin/canon` | `GET` / `POST` | 経蔵の照会・切替 `{"canon": "laozi+yinfu" \| "laozi" \| "yinfu"}` |
| `/plugins/dsh-dao/origin/custom_sp` | `GET` / `POST` / `DELETE` | カスタム System Prompt の照会・保存・リセット |
| `/plugins/dsh-dao/origin/preview` | `GET` | 直近に捕捉した `before`（元の SP）と `after`（実際の SP）の比較を取得 |
| `/plugins/dsh-dao/origin/tape` | `GET` | 直近 16 スロット分の完全なリクエスト時系列テープを取得 (`?limit=16&fields=1`) |
| `/plugins/dsh-dao/origin/stream` | `GET` | SSE リアルタイムイベントストリーム (`hello` / `turn` / `mode` / `canon` / `hb`) |
| `/plugins/dsh-dao/origin/view` | `GET` | 独立 HTML「本源観照」フルスクリーンコンソール |

---
## 謝辞

 - **[windsurf-assistant](https://github.com/dao-genesis/windsurf-assistant)**

--- 
## License

[Apache-2.0](../../LICENSE)

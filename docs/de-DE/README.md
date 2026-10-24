
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

# <center> ☯ dsh-dao · Dao-Agent

> **Das Dao erzeugt Eins; Eins erzeugt Zwei; Zwei erzeugt Drei; Drei erzeugt die zehntausend Dinge. Die zehntausend Dinge tragen Yin auf dem Rücken und umarmen Yang, und durch das mittlere Qi entsteht Harmonie.**
> **Betrachte den Lauf des Himmels, halte fest am Wirken des Himmels – damit ist alles vollendet.**

`dsh-dao` ist ein **Panzerknacker-Plugin für DeepSeek Harness**, gebaut für **DeepSeek Harness (`v0.2.1-rc.2+`)** und **[DSH Desktop](https://github.com/anywhere-labs/dsh-desktop)**.

Es folgt vollständig der [DSH Desktop Plugin-Entwicklungsrichtlinie](https://github.com/anywhere-labs/dsh-desktop/blob/master/docs/plugin-development.md) und dem `@deepseek-ai/cordis` Dual-Side-Kompositionsvertrag: **vollständiger Austausch des Kern-Systemprompts**.


![dsh-dao](../../dshdesktop.png)
---

## I. Kernfunktionen

### 1. Vollständiger Austausch des Systemprompts
- **Vollständiges Ersetzen des Originalprompts**: Im **Dao-Agent-Modus (`invert`)** löscht das Plugin sämtliche von DSH zusammengestellten Systemprompt-Abschnitte und angehängten dynamischen Textkontexte und **ersetzt sie vollständig durch die kanonische Schrift oder Ihren eigenen Prompt** — am Ende bleibt kein Rest des Originalprompts übrig.
- **Kanon-Injektion**: Enthält die **Mawangdui-Seidenhandschrift des Laozi, Version A** (De Jing voran, Dao Jing danach, 7.126 Zeichen) und die **Daoistische-Kanon-Ausgabe des Huangdi Yinfu Jing** (597 Zeichen).
- **Vier in Echtzeit umschaltbare Presets (inkl. Custom)**:
  | Preset-Key | Name | Zeichenzahl |
  | :--- | :--- | :---: |
  | `laozi+yinfu` | **Seiden-Laozi + Daoistisches Yinfu Jing** (Standard) | 7.725 Zeichen |
  | `laozi` | **Seiden-Laozi** (De Jing + Dao Jing) | 7.126 Zeichen |
  | `yinfu` | **Daoistisches Yinfu Jing** (drei Rollen: ober, mittel, unter) | 597 Zeichen |
  | `custom` | **Benutzerdefiniert** (lokal gespeicherter eigener Prompt) | tatsächliche Länge |
- **Tool-JSON-Schemas bleiben erhalten**: Die für Modell-Toolaufrufe nötigen Funktions-Schema-Definitionen bleiben erhalten (wobei das sitzungsübergreifend störende `create_memory`-Tool entfernt wird), sodass Dateizugriffe, Terminalbefehle usw. normal funktionieren.
- **Zweizustands-Hot-Switch Dao / Offiziell ohne Kosten**:
  - **Dao-Agent (`invert`)**: vollständiger Austausch gegen den gewählten Kanon (oder eigenen Prompt).
  - **Offizieller Agent (`passthrough`)**: 100 % unveränderte Durchleitung des offiziellen DSH-Prompts.
  - **Eigene Prompts**: benutzerdefinierte Prompts werden lokal gespeichert.

### 2. Web-Panel „Ursprungsbetrachtung“
Über das offizielle DSH-Client-Slot-System werden drei Einstiegspunkte eingehängt:
1. **Schnellzugriff unten in der linken Seitenleiste (`sidebar.footer.action`)**: zeigt das `☯ Dao / Offiziell`-Statusbadge; Klick (oder **`Alt + D`**) öffnet jederzeit die schwebende „Ursprungsbetrachtung“-Schublade unten rechts (Standard 460×560; in der Titelleiste per **`🗖 Maximieren / 🗗 Wiederherstellen`** auf **920×672** umschaltbar).
2. **Tab in der Gesprächsansicht (`conversation.view`)**: bietet eine `☯ Ursprungsbetrachtung`-Ansicht im Vollbild.
3. **Abschnitt in den Einstellungen (`settings.section`)**: bettet das `☯ Dao-Agent · Ursprung`-Steuerpanel in die DSH-Einstellungsseite ein.

**Panel-Fähigkeiten im Überblick**:
- **Drei Statuslampen**: `Host` (Plugin aktiv), `Capture` (echte Anfrage erfasst?), `Mode` (grün = Dao-Agent / rot = offizielle Durchleitung).
- **Minimale Drei-Tasten-Leiste (`[道]` · `[官]` · `[编]`) + Kanon-Dropdown**:
  - **`[道]` (Dao)**: zum Dao-Agent wechseln — nutzt ausschließlich Kanon/eigenen Prompt und zeigt über das Dropdown live den passenden Inhalt.
  - **`[官]` (Offiziell)**: zum offiziellen Agent wechseln — leitet den offiziellen Originalprompt unverändert durch und zeigt ihn an.
  - **`[编]` (Bearbeiten)**: öffnet den Online-Editor für eigene SPs (`Strg+Enter` oder Klick auf `[✔ 注入]` speichert in die „Benutzerdefiniert“-Option des Dropdowns und springt automatisch dorthin; danach können Sie frei zwischen Laozi, Yinfu Jing und „Benutzerdefiniert“ wechseln, ohne den eigenen Inhalt zu verändern; `[✖ 归道]` löscht den eigenen Prompt und stellt den Standard-Kanon wieder her).

### 3. Der `/dao`-Slash-Befehl (TUI / Web / Desktop)
In einem beliebigen DSH-Dialog eingeben:
- `/dao` oder `/dao toggle`: Wechsel zwischen „Dao-Agent“ und „Offizieller Agent“ per Tastendruck
- `/dao on`: zum Dao-Agent (`invert`) wechseln
- `/dao off`: zum offiziellen Agent (`passthrough`) wechseln
- `/dao canon laozi+yinfu` / `/dao canon laozi` / `/dao canon yinfu`: Kanon wechseln
- `/dao status`: aktuellen Modus, Kanon-Zeichenzahl und Erfassungsstatistik anzeigen

---

## II. Installation

### Weg 1: GUI-Installation über DSH Desktop (empfohlen)
Im Plugin-Verwaltungspanel von **DSH Desktop (`v0.2.1-rc.2+`)** die GitHub-Adresse dieses Repositorys oder einen lokalen Verzeichnispfad eintragen — das Plugin wird automatisch eingehängt (im Paket sind `dsh.bundle.patch` und `dsh.client` bereits deklariert).

### Weg 2: Offizielles DSH-CLI
```bash
# Direkt aus dem GitHub-Repository installieren
dsh plugin --profile web add git+https://github.com/Yikumasai/dsh-dao.git

# Oder aus einem lokalen Klon installieren
git clone https://github.com/Yikumasai/dsh-dao.git
cd dsh-dao
dsh plugin --profile web add .
```

Alternativ gibt es die mitgelieferten Ein-Klick-Skripte (behandeln automatisch `pnpm-workspace.yaml`s `minimumReleaseAgeExclude`):
```bash
# macOS / Linux / Git Bash
bash scripts/install.sh

# Windows PowerShell
powershell -ExecutionPolicy Bypass -File scripts/install.ps1
```

### Deinstallation
```bash
dsh plugin --profile web remove dsh-dao
```

---

## III. HTTP-Control-API (same-origin `/plugins/dsh-dao/origin/*`)

| Endpunkt | Methode | Beschreibung |
| :--- | :---: | :--- |
| `/plugins/dsh-dao/origin/ping` | `GET` | Plugin-Status, Version, aktueller Modus, Kanon-Zeichenzahl, Erfassungszähler |
| `/plugins/dsh-dao/origin/sig` | `GET` | Leichtgewichtiger Status-Fingerprint (für flackerfreies Frontend-Polling) |
| `/plugins/dsh-dao/origin/mode` | `GET` / `POST` | Modus abfragen oder umschalten `{"mode": "invert" \| "passthrough"}` |
| `/plugins/dsh-dao/origin/canon` | `GET` / `POST` | Kanon abfragen oder umschalten `{"canon": "laozi+yinfu" \| "laozi" \| "yinfu"}` |
| `/plugins/dsh-dao/origin/custom_sp` | `GET` / `POST` / `DELETE` | Eigenen System Prompt abfragen, speichern oder zurücksetzen |
| `/plugins/dsh-dao/origin/preview` | `GET` | Vergleich der zuletzt erfassten `before` (Original-SP) und `after` (tatsächlich gelieferte SP) |
| `/plugins/dsh-dao/origin/tape` | `GET` | Die letzten 16 Slots des vollständigen Anfrage-Zeitverlaufsbands abrufen (`?limit=16&fields=1`) |
| `/plugins/dsh-dao/origin/stream` | `GET` | SSE-Echtzeit-Ereignisstrom (`hello` / `turn` / `mode` / `canon` / `hb`) |
| `/plugins/dsh-dao/origin/view` | `GET` | Eigenständige HTML-„Ursprungsbetrachtung“-Vollbildkonsole |

---
## Danksagung

 - **[windsurf-assistant](https://github.com/dao-genesis/windsurf-assistant)**

--- 
## Lizenz

[Apache-2.0](../../LICENSE)

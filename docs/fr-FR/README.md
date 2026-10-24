
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

# <center> ☯ dsh-dao · Agent Dao

> **Le Dao engendre l'Un ; l'Un engendre le Deux ; le Deux engendre le Trois ; le Trois engendre les dix mille êtres. Les dix mille êtres portent le Yin sur leur dos et embrassent le Yang ; le souffle médian fait leur harmonie.**
> **Contemple la Voie du Ciel, saisis la marche du Ciel — et tout est accompli.**

`dsh-dao` est un **plugin « perce-armure » pour DeepSeek Harness**, conçu pour **DeepSeek Harness (`v0.2.1-rc.2+`)** et **[DSH Desktop](https://github.com/anywhere-labs/dsh-desktop)**.

Il respecte pleinement le [guide de développement de plugins DSH Desktop](https://github.com/anywhere-labs/dsh-desktop/blob/master/docs/plugin-development.md) et le contrat de composition double-face `@deepseek-ai/cordis` : **remplacement complet du prompt système central**.


![dsh-dao](../../dshdesktop.png)
---

## I. Fonctionnalités clés

### 1. Remplacement complet du prompt système
- **Remplacement intégral du prompt d'origine** : en mode **Agent Dao (`invert`)**, le plugin efface tous les segments du prompt système assemblés par DSH ainsi que tout le contexte textuel dynamique ajouté, et les **remplace entièrement par le canon originel ou votre prompt personnalisé** — aucune trace du prompt d'origine ne subsiste à la fin.
- **Injection du canon originel** : embarque le **Laozi sur soie de Mawangdui, version A** (De Jing en premier, Dao Jing ensuite ; 7 126 caractères) et l'**édition du Canon taoïste du Huangdi Yinfu Jing** (597 caractères).
- **Quatre présélections commutables en temps réel (dont personnalisée)** :
  | Clé | Nom | Longueur |
  | :--- | :--- | :---: |
  | `laozi+yinfu` | **Laozi sur soie + Yinfu Jing du Canon** (défaut) | 7 725 car. |
  | `laozi` | **Laozi sur soie** (De Jing + Dao Jing) | 7 126 car. |
  | `yinfu` | **Yinfu Jing du Canon** (trois rouleaux : supérieur, médian, inférieur) | 597 car. |
  | `custom` | **Personnalisé** (prompt utilisateur enregistré localement) | longueur réelle |
- **Schémas JSON des outils préservés** : conserve les définitions de schémas de fonctions nécessaires aux appels d'outils du modèle (tout en retirant l'outil polluant inter-sessions `create_memory`), afin que lecture/écriture de fichiers, commandes terminal, etc. continuent de fonctionner.
- **Bascule à chaud Dao / Officiel sans coût** :
  - **Agent Dao (`invert`)** : remplacement total par le canon choisi (ou le prompt personnalisé).
  - **Agent Officiel (`passthrough`)** : transmission à 100 % inchangée du prompt officiel DSH.
  - **Prompt personnalisé** : prompts utilisateur enregistrables localement.

### 2. Panneau web « Contemplation de la Source »
Trois points d'entrée montés via le système de Slots du client officiel DSH :
1. **Bouton rapide en bas de la barre latérale gauche (`sidebar.footer.action`)** : affiche le badge d'état `☯ Dao / Off` ; un clic (ou le raccourci **`Alt + D`**) ouvre à tout moment le tiroir flottant « Contemplation de la Source » en bas à droite (460×560 par défaut ; la barre de titre permet **`🗖 Agrandir / 🗗 Restaurer`** vers **920×672**).
2. **Onglet de la vue de conversation (`conversation.view`)** : offre une vue `☯ Contemplation de la Source` quasi plein écran.
3. **Section du panneau de réglages (`settings.section`)** : intègre le panneau de contrôle `☯ Agent Dao · Source` dans la page des paramètres de DSH.

**Capacités du panneau en bref** :
- **Trois voyants d'état** : `Host` (plugin vivant), `Capture` (une vraie requête a-t-elle été capturée), `Mode` (vert = Agent Dao / rouge = transmission officielle).
- **Barre de contrôle minimaliste à trois touches (`[道]` · `[官]` · `[编]`) + liste déroulante du canon** :
  - **`[道]` (Dao)** : bascule vers l'Agent Dao — n'utilise que le canon/prompt personnalisé et affiche le contenu correspondant en direct via la liste déroulante.
  - **`[官]` (Officiel)** : bascule vers l'Agent Officiel — transmet et affiche le prompt officiel d'origine tel quel.
  - **`[编]` (Éditer)** : ouvre l'éditeur en ligne de SP personnalisé (`Ctrl+Entrée` ou clic sur `[✔ 注入]` pour enregistrer dans l'option « Personnalisé » de la liste et y sauter automatiquement ; vous pouvez ensuite alterner librement entre Laozi, Yinfu Jing et « Personnalisé » sans modifier le contenu personnalisé ; `[✖ 归道]` efface le prompt personnalisé et restaure le canon par défaut).

### 3. La commande slash `/dao` (TUI / Web / Desktop)
À saisir dans n'importe quelle boîte de dialogue DSH :
- `/dao` ou `/dao toggle` : bascule en une touche entre « Agent Dao » et « Agent Officiel »
- `/dao on` : passe à l'Agent Dao (`invert`)
- `/dao off` : passe à l'Agent Officiel (`passthrough`)
- `/dao canon laozi+yinfu` / `/dao canon laozi` / `/dao canon yinfu` : change de canon
- `/dao status` : affiche le mode courant, la longueur du canon et les statistiques de capture

---

## II. Installation

### Méthode 1 : installation graphique via DSH Desktop (recommandée)
Dans le panneau de gestion des plugins de **DSH Desktop (`v0.2.1-rc.2+`)**, indiquez l'adresse GitHub de ce dépôt ou un chemin de répertoire local pour le monter automatiquement (le paquet déclare déjà `dsh.bundle.patch` et `dsh.client`).

### Méthode 2 : CLI officiel DSH
```bash
# Installer directement depuis le dépôt GitHub
dsh plugin --profile web add git+https://github.com/Yikumasai/dsh-dao.git

# Ou installer depuis un clone local
git clone https://github.com/Yikumasai/dsh-dao.git
cd dsh-dao
dsh plugin --profile web add .
```

Vous pouvez aussi utiliser les scripts en un clic fournis (ils gèrent automatiquement `minimumReleaseAgeExclude` de `pnpm-workspace.yaml`) :
```bash
# macOS / Linux / Git Bash
bash scripts/install.sh

# Windows PowerShell
powershell -ExecutionPolicy Bypass -File scripts/install.ps1
```

### Désinstallation
```bash
dsh plugin --profile web remove dsh-dao
```

---

## III. API de contrôle HTTP (même origine `/plugins/dsh-dao/origin/*`)

| Point de terminaison | Méthode | Description |
| :--- | :---: | :--- |
| `/plugins/dsh-dao/origin/ping` | `GET` | État du plugin, version, mode courant, longueur du canon, compteur de captures |
| `/plugins/dsh-dao/origin/sig` | `GET` | Empreinte d'état légère (pour un polling frontal sans scintillement) |
| `/plugins/dsh-dao/origin/mode` | `GET` / `POST` | Interroger ou changer le mode `{"mode": "invert" \| "passthrough"}` |
| `/plugins/dsh-dao/origin/canon` | `GET` / `POST` | Interroger ou changer le canon `{"canon": "laozi+yinfu" \| "laozi" \| "yinfu"}` |
| `/plugins/dsh-dao/origin/custom_sp` | `GET` / `POST` / `DELETE` | Interroger, enregistrer ou réinitialiser le System Prompt personnalisé |
| `/plugins/dsh-dao/origin/preview` | `GET` | Obtenir la comparaison `before` (SP d'origine) / `after` (SP réellement reçu) de la dernière capture |
| `/plugins/dsh-dao/origin/tape` | `GET` | Obtenir les 16 derniers slots de la bande chronologique complète des requêtes (`?limit=16&fields=1`) |
| `/plugins/dsh-dao/origin/stream` | `GET` | Flux d'événements SSE en temps réel (`hello` / `turn` / `mode` / `canon` / `hb`) |
| `/plugins/dsh-dao/origin/view` | `GET` | Console plein écran HTML autonome « Contemplation de la Source » |

---
## Remerciements

 - **[windsurf-assistant](https://github.com/dao-genesis/windsurf-assistant)**

--- 
## Licence

[Apache-2.0](../../LICENSE)

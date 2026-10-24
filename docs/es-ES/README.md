
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

# <center> ☯ dsh-dao · Agente Dao

> **El Dao engendra el Uno; el Uno engendra el Dos; el Dos engendra el Tres; el Tres engendra los diez mil seres. Los diez mil seres cargan el Yin a la espalda y abrazan el Yang; el qi medio hace su armonía.**
> **Contempla el Dao del Cielo, aférrate a la marcha del Cielo — y todo queda consumado.**

`dsh-dao` es un **plugin «perfora-armaduras» para DeepSeek Harness**, creado para **DeepSeek Harness (`v0.2.1-rc.2+`)** y **[DSH Desktop](https://github.com/anywhere-labs/dsh-desktop)**.

Cumple plenamente la [guía de desarrollo de plugins de DSH Desktop](https://github.com/anywhere-labs/dsh-desktop/blob/master/docs/plugin-development.md) y el contrato de composición dual de `@deepseek-ai/cordis`: **sustitución completa del system prompt central**.


![dsh-dao](../../dshdesktop.png)
---

## I. Funciones principales

### 1. Sustitución completa del system prompt
- **Reemplazo total del prompt original**: en el modo **Agente Dao (`invert`)**, el plugin borra todos los segmentos del system prompt ensamblados por DSH junto con todo el contexto de texto dinámico añadido, y los **sustituye por completo por el canon original o tu prompt personalizado** — sin dejar restos del prompt original al final.
- **Inyección del canon original**: incluye el **Laozi en seda de Mawangdui, versión A** (De Jing primero, Dao Jing después; 7.126 caracteres) y la **edición del Canon Taoísta del Huangdi Yinfu Jing** (597 caracteres).
- **Cuatro presets conmutables en tiempo real (incluye personalizado)**:
  | Clave | Nombre | Longitud |
  | :--- | :--- | :---: |
  | `laozi+yinfu` | **Laozi en seda + Yinfu Jing del Canon** (predeterminado) | 7.725 car. |
  | `laozi` | **Laozi en seda** (De Jing + Dao Jing) | 7.126 car. |
  | `yinfu` | **Yinfu Jing del Canon** (tres rollos: superior, medio, inferior) | 597 car. |
  | `custom` | **Personalizado** (prompt definido por el usuario, guardado localmente) | longitud real |
- **Se conservan los JSON Schema de herramientas**: se mantienen las definiciones de esquemas de funciones necesarias para las llamadas a herramientas del modelo (extirpando la herramienta contaminante entre sesiones `create_memory`), de modo que lectura/escritura de archivos, comandos de terminal, etc. siguen funcionando.
- **Conmutación en caliente Dao / Oficial sin coste**:
  - **Agente Dao (`invert`)**: sustitución total por el canon elegido (o prompt personalizado).
  - **Agente Oficial (`passthrough`)**: transmisión 100 % inalterada del prompt oficial de DSH.
  - **Prompts personalizados**: se admiten prompts definidos por el usuario, guardados localmente.

### 2. Panel web «Contemplación del Origen»
Se monta en tres puntos de entrada mediante el sistema de Slots del cliente oficial de DSH:
1. **Botón rápido al pie de la barra lateral izquierda (`sidebar.footer.action`)**: muestra la insignia de estado `☯ Dao / Of`; haz clic (o pulsa **`Alt + D`**) para invocar en cualquier momento el cajón flotante «Contemplación del Origen» en la esquina inferior derecha (460×560 por defecto; la barra de título permite **`🗖 Ampliar / 🗗 Restaurar`** a **920×672**).
2. **Pestaña de vista de conversación (`conversation.view`)**: ofrece una vista `☯ Contemplación del Origen` a pantalla completa.
3. **Sección del panel de ajustes (`settings.section`)**: incrusta el panel de control `☯ Agente Dao · Origen` dentro de la página de configuración de DSH.

**Capacidades del panel en resumen**:
- **Tres luces de estado**: `Host` (plugin vivo), `Capture` (¿se ha capturado una petición real?), `Mode` (verde = Agente Dao / rojo = transmisión oficial).
- **Barra de control minimalista de tres botones (`[道]` · `[官]` · `[编]`) + desplegable de canon**:
  - **`[道]` (Dao)**: cambia al Agente Dao — usa exclusivamente el canon/prompt personalizado y sincroniza en vivo el desplegable para mostrar el contenido correspondiente.
  - **`[官]` (Oficial)**: cambia al Agente Oficial — transmite y muestra el prompt oficial original sin alterar.
  - **`[编]` (Editar)**: abre el editor en línea de SP personalizado (`Ctrl+Intro` o clic en `[✔ 注入]` para guardarlo en la opción «Personalizado» del desplegable y saltar automáticamente a «Personalizado»; después puedes alternar libremente entre Laozi, Yinfu Jing y «Personalizado» sin modificar el contenido personalizado; `[✖ 归道]` borra el prompt personalizado y restaura el canon predeterminado).

### 3. El comando barra `/dao` (TUI / Web / Desktop)
Escríbelo en cualquier diálogo de DSH:
- `/dao` o `/dao toggle`: alterna con una tecla entre «Agente Dao» y «Agente Oficial»
- `/dao on`: cambia al Agente Dao (`invert`)
- `/dao off`: cambia al Agente Oficial (`passthrough`)
- `/dao canon laozi+yinfu` / `/dao canon laozi` / `/dao canon yinfu`: cambia de canon
- `/dao status`: muestra el modo actual, la longitud del canon y las estadísticas de captura

---

## II. Instalación

### Método 1: instalación gráfica vía DSH Desktop (recomendado)
En el panel de gestión de plugins de **DSH Desktop (`v0.2.1-rc.2+`)**, indica la dirección de GitHub de este repositorio o la ruta de un directorio local para montarlo automáticamente (el paquete ya declara `dsh.bundle.patch` y `dsh.client`).

### Método 2: CLI oficial de DSH
```bash
# Instalar directamente desde el repositorio de GitHub
dsh plugin --profile web add git+https://github.com/Yikumasai/dsh-dao.git

# O instalar desde un clon local
git clone https://github.com/Yikumasai/dsh-dao.git
cd dsh-dao
dsh plugin --profile web add .
```

También puedes usar los scripts de un clic incluidos (gestionan automáticamente `minimumReleaseAgeExclude` de `pnpm-workspace.yaml`):
```bash
# macOS / Linux / Git Bash
bash scripts/install.sh

# Windows PowerShell
powershell -ExecutionPolicy Bypass -File scripts/install.ps1
```

### Desinstalación
```bash
dsh plugin --profile web remove dsh-dao
```

---

## III. API de control HTTP (mismo origen `/plugins/dsh-dao/origin/*`)

| Endpoint | Método | Descripción |
| :--- | :---: | :--- |
| `/plugins/dsh-dao/origin/ping` | `GET` | Estado del plugin, versión, modo actual, longitud del canon, contador de capturas |
| `/plugins/dsh-dao/origin/sig` | `GET` | Huella de estado ligera (para sondeo frontal sin parpadeos) |
| `/plugins/dsh-dao/origin/mode` | `GET` / `POST` | Consultar o cambiar el modo `{"mode": "invert" \| "passthrough"}` |
| `/plugins/dsh-dao/origin/canon` | `GET` / `POST` | Consultar o cambiar el canon `{"canon": "laozi+yinfu" \| "laozi" \| "yinfu"}` |
| `/plugins/dsh-dao/origin/custom_sp` | `GET` / `POST` / `DELETE` | Consultar, guardar o restablecer el System Prompt personalizado |
| `/plugins/dsh-dao/origin/preview` | `GET` | Obtener la comparación `before` (SP original) / `after` (SP realmente entregado) de la última captura |
| `/plugins/dsh-dao/origin/tape` | `GET` | Obtener los últimos 16 slots de la cinta cronológica completa de peticiones (`?limit=16&fields=1`) |
| `/plugins/dsh-dao/origin/stream` | `GET` | Flujo de eventos SSE en tiempo real (`hello` / `turn` / `mode` / `canon` / `hb`) |
| `/plugins/dsh-dao/origin/view` | `GET` | Consola HTML independiente «Contemplación del Origen» a pantalla completa |

---
## Agradecimientos

 - **[windsurf-assistant](https://github.com/dao-genesis/windsurf-assistant)**

--- 
## Licencia

[Apache-2.0](../../LICENSE)

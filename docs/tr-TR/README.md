
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

# <center> ☯ dsh-dao · Dao Ajanı

> **Dao Bir'i doğurur; Bir İki'yi doğurur; İki Üç'ü doğurur; Üç on bin varlığı doğurur. On bin varlık Yin'i sırtında taşır, Yang'ı kucaklar; orta nefes uyumu sağlar.**
> **Göğün Yolunu gözle, Göğün işleyişine tutun — her şey tamamlanır.**

`dsh-dao`, **DeepSeek Harness (`v0.2.1-rc.2+`)** ve **[DSH Desktop](https://github.com/anywhere-labs/dsh-desktop)** için geliştirilmiş bir **DeepSeek Harness zırh delici eklentisidir**.

[DSH Desktop eklenti geliştirme kılavuzu](https://github.com/anywhere-labs/dsh-desktop/blob/master/docs/plugin-development.md) ve `@deepseek-ai/cordis` çift taraflı bileşim sözleşmesine tam olarak uyar: **çekirdek sistem promptunun tamamen değiştirilmesi**.


![dsh-dao](../../dshdesktop.png)
---

## I. Temel Özellikler

### 1. Sistem Promptunun Tamamen Değiştirilmesi
- **Orijinal promptun eksiksiz değişimi**: **Dao Ajanı (`invert`)** modunda eklenti, DSH'nin birleştirdiği tüm orijinal sistem promptu bölümlerini ve eklenen dinamik metin bağlamlarını tamamen siler ve **kaynak kanon ya da özel promptunuzla bütünüyle değiştirir** — sonda orijinal prompttan hiçbir iz kalmaz.
- **Kanon kaynağı enjeksiyonu**: **Mawangdui İpek El yazması Laozi, A versiyonu** (önce De Jing, sonra Dao Jing; 7.126 karakter) ve **Daoist Kanon baskısı Huangdi Yinfu Jing** (597 karakter) gömülüdür.
- **Gerçek zamanlı değiştirilebilen dört hazır ayar (özel dahil)**:
  | Anahtar | Ad | Uzunluk |
  | :--- | :--- | :---: |
  | `laozi+yinfu` | **İpek Laozi + Daoist Yinfu Jing** (varsayılan) | 7.725 kr. |
  | `laozi` | **İpek Laozi** (De Jing + Dao Jing) | 7.126 kr. |
  | `yinfu` | **Daoist Yinfu Jing** (üst, orta, alt üç tomar) | 597 kr. |
  | `custom` | **Özel** (yerel olarak saklanan kullanıcı tanımlı prompt) | gerçek uzunluk |
- **Araç JSON Schema'ları korunur**: Modelin araç çağrıları için gereken fonksiyon Schema tanımları korunur (oturumlar arası kirlenme yaratan `create_memory` aracı çıkarılır); dosya okuma/yazma, terminal komutları vb. araç çağrıları normal çalışmaya devam eder.
- **Dao / Resmî iki durum arasında sıfır maliyetli sıcak geçiş**:
  - **Dao Ajanı (`invert`)**: seçilen kanon (veya özel prompt) ile tamamen değiştirilir.
  - **Resmî Ajan (`passthrough`)**: resmî DSH promptunu %100 olduğu gibi iletir.
  - **Özel prompt desteği**: kullanıcı tanımlı promptlar yerel olarak saklanır.

### 2. «Kaynağın Sûreti» Web Paneli
DSH resmî istemci Slot sistemi üzerinden üç giriş noktasına monte edilir:
1. **Sol kenar çubuğunun altındaki hızlı düğme (`sidebar.footer.action`)**: `☯ Dao / Rsm` durum rozetini gösterir; tıklayarak (veya **`Alt + D`** kısayoluyla) sağ alttaki yüzer «Kaynağın Sûreti» çekmecesini istediğiniz zaman açabilirsiniz (varsayılan 460×560; başlık çubuğunda **`🗖 Büyüt / 🗗 Geri yükle`** ile **920×672**'ye geçiş).
2. **Sohbet ana görünüm sekmesi (`conversation.view`)**: tam ekran düzeyinde `☯ Kaynağın Sûreti` görünümü sağlar.
3. **Ayarlar paneli bölümü (`settings.section`)**: DSH ayar sayfasının içine `☯ Dao Ajanı · Kaynak` kontrol panelini gömer.

**Panel yetenekleri özet**:
- **Üç durum ışığı**: `Host` (eklenti canlı), `Capture` (gerçek istek yakalandı mı), `Mode` (yeşil = Dao Ajanı / kırmızı = resmî geçiş).
- **Minimal üç tuş kontrol çubuğu (`[道]` · `[官]` · `[编]`) + kanon açılır listesi**:
  - **`[道]` (Dao)**: Dao Ajanına geçer — yalnızca kanon/özel promptu kullanır ve açılır liste ile eşzamanlı olarak ilgili içeriği görüntüler.
  - **`[官]` (Resmî)**: Resmî Ajana geçer — resmî orijinal promptu olduğu gibi iletir ve gösterir.
  - **`[编]` (Düzenle)**: çevrimiçi özel SP düzenleyicisini açar (`Ctrl+Enter` veya `[✔ 注入]` tıklaması, açılır listedeki «Özel» seçeneğine kaydeder ve otomatik olarak «Özel»'e geçer; sonrasında Laozi, Yinfu Jing ve «Özel» arasında özel içeriği değiştirmeden serbestçe gezinebilirsiniz; `[✖ 归道]` özel promptu temizleyip varsayılan kanonu geri yükler).

### 3. `/dao` Eğik Çizgi Komutu (TUI / Web / Desktop)
Herhangi bir DSH iletişim kutusuna yazın:
- `/dao` veya `/dao toggle`: «Dao Ajanı» ile «Resmî Ajan» arasında tek tuşla geçiş
- `/dao on`: Dao Ajanına (`invert`) geç
- `/dao off`: Resmî Ajana (`passthrough`) geç
- `/dao canon laozi+yinfu` / `/dao canon laozi` / `/dao canon yinfu`: kanonu değiştir
- `/dao status`: mevcut modu, kanon uzunluğunu ve yakalama istatistiklerini göster

---

## II. Kurulum

### Yöntem 1: DSH Desktop grafik kurulumu (önerilen)
**DSH Desktop (`v0.2.1-rc.2+`)** eklenti yönetim panelinde bu deponun GitHub adresini veya yerel bir dizin yolunu girin; otomatik olarak monte edilir (paket `dsh.bundle.patch` ve `dsh.client` bildirimlerini zaten içerir).

### Yöntem 2: DSH resmî CLI ile kurulum
```bash
# GitHub deposundan doğrudan kurulum
dsh plugin --profile web add git+https://github.com/Yikumasai/dsh-dao.git

# Veya yerel bir klondan kurulum
git clone https://github.com/Yikumasai/dsh-dao.git
cd dsh-dao
dsh plugin --profile web add .
```

Depo içindeki tek tık betiklerini de kullanabilirsiniz (`pnpm-workspace.yaml` içindeki `minimumReleaseAgeExclude` ayarını otomatik işler):
```bash
# macOS / Linux / Git Bash
bash scripts/install.sh

# Windows PowerShell
powershell -ExecutionPolicy Bypass -File scripts/install.ps1
```

### Kaldırma
```bash
dsh plugin --profile web remove dsh-dao
```

---

## III. HTTP Kontrol API'si (aynı kök `/plugins/dsh-dao/origin/*`)

| Uç nokta | Yöntem | Açıklama |
| :--- | :---: | :--- |
| `/plugins/dsh-dao/origin/ping` | `GET` | Eklenti durumu, sürüm, mevcut mod, kanon uzunluğu, yakalama sayısı |
| `/plugins/dsh-dao/origin/sig` | `GET` | Hafif durum parmak izi (titremesiz ön yüz yoklaması için) |
| `/plugins/dsh-dao/origin/mode` | `GET` / `POST` | Modu sorgula veya değiştir `{"mode": "invert" \| "passthrough"}` |
| `/plugins/dsh-dao/origin/canon` | `GET` / `POST` | Kanonu sorgula veya değiştir `{"canon": "laozi+yinfu" \| "laozi" \| "yinfu"}` |
| `/plugins/dsh-dao/origin/custom_sp` | `GET` / `POST` / `DELETE` | Özel System Promptu sorgula, kaydet veya sıfırla |
| `/plugins/dsh-dao/origin/preview` | `GET` | Son yakalanan `before` (orijinal SP) ile `after` (gerçekte iletilen SP) karşılaştırmasını al |
| `/plugins/dsh-dao/origin/tape` | `GET` | Son 16 yuvanın tam istek zaman dizisi bandını al (`?limit=16&fields=1`) |
| `/plugins/dsh-dao/origin/stream` | `GET` | SSE gerçek zamanlı olay akışı (`hello` / `turn` / `mode` / `canon` / `hb`) |
| `/plugins/dsh-dao/origin/view` | `GET` | Bağımsız HTML «Kaynağın Sûreti» tam ekran konsolu |

---
## Teşekkür

 - **[windsurf-assistant](https://github.com/dao-genesis/windsurf-assistant)**

--- 
## Lisans

[Apache-2.0](../../LICENSE)

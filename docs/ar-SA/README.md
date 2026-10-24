
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

# <center> ☯ dsh-dao · وكيل الداو

> **الداو يلد الواحد، والواحد يلد الاثنين، والاثنان يلدان الثلاثة، والثلاثة تلد الموجودات العشرة آلاف. الموجودات تحمل «ين» على ظهورها وتحتضن «يانغ»، وبالنفَس الأوسط يتحقق الانسجام.**
> **تأمّل طريق السماء، وأمسِك سير السماء — فيكتمل كل شيء.**

`dsh-dao` هو **إضافة «خرق الدروع» لـ DeepSeek Harness**، صُمّم خصيصًا لـ **DeepSeek Harness (`v0.2.1-rc.2+`)** و**[DSH Desktop](https://github.com/anywhere-labs/dsh-desktop)**.

يلتزم بالكامل بـ[دليل تطوير إضافات DSH Desktop](https://github.com/anywhere-labs/dsh-desktop/blob/master/docs/plugin-development.md) وعقد التركيب ثنائي الطرف `@deepseek-ai/cordis`: **الاستبدال الكامل لمطالبة النظام الأساسية**.


![dsh-dao](../../dshdesktop.png)
---

## أولًا: الوظائف الأساسية

### 1. الاستبدال الكامل لمطالبة النظام
- **استبدال جذري للمطالبة الأصلية**: في وضع **وكيل الداو (`invert`)**، تمحو الإضافة جميع مقاطع مطالبة النظام الأصلية التي يجمعها DSH وكل السياق النصي الديناميكي المُلحق، و**تستبدلها بالكامل بالنص الكانوني الأصل أو بمطالبتك المخصصة** — دون أن يبقى أي أثر للمطالبة الأصلية في النهاية.
- **حقن النص الكانوني الأصل**: مدمجٌ فيها **مخطوط لاوتزي الحريري من ماوانغدوي، النسخة «أ»** (كتاب «دي» أولًا ثم كتاب «داو»؛ 7,126 حرفًا) و**طبعة الكنز الطاوي من «هوانغدي ينفو جينغ»** (597 حرفًا).
- **أربعة خيارات قابلة للتبديل لحظيًا (بما فيها المخصص)**:
  | مفتاح الخيار | الاسم | عدد الأحرف |
  | :--- | :--- | :---: |
  | `laozi+yinfu` | **لاوتزي الحريري + ينفو جينغ الطاوية** (افتراضي) | 7,725 حرفًا |
  | `laozi` | **لاوتزي الحريري** (دي جينغ + داو جينغ) | 7,126 حرفًا |
  | `yinfu` | **ينفو جينغ الطاوية** (ثلاث لفائف: عليا ووسطى ودنيا) | 597 حرفًا |
  | `custom` | **مخصص** (مطالبة يحددها المستخدم وتُحفظ محليًا) | حسب الطول الفعلي |
- **الحفاظ على مخططات JSON الخاصة بالأدوات**: تُبقي تعريفات مخططات الدوال اللازمة لاستدعاء النموذج للأدوات (مع استئصال أداة `create_memory` الملوِّثة عبر الجلسات)، فتظل قراءة الملفات وكتابتها وأوامر الطرفية وغيرها تعمل بصورة طبيعية.
- **تبديل ساخن بين حالتَي «داو» و«الوضع الرسمي» بلا أي كلفة**:
  - **وكيل الداو (`invert`)**: استبدال كامل بالنص الكانوني المختار (أو المطالبة المخصصة).
  - **الوكيل الرسمي (`passthrough`)**: تمرير مطالبة DSH الرسمية بنسبة 100% دون تغيير.
  - **دعم المطالبات المخصصة**: يمكن حفظ مطالبات المستخدم محليًا.

### 2. لوحة الويب «تأمُّل الأصل»
تُركَّب ثلاث نقاط دخول عبر نظام «الفتحات» (Slots) في عميل DSH الرسمي:
1. **زر سريع أسفل الشريط الجانبي الأيسر (`sidebar.footer.action`)**: يعرض شارة الحالة `☯ داو / رسمي`؛ انقر عليه (أو اضغط **`Alt + D`**) لاستدعاء درج «تأمل الأصل» العائم في الزاوية اليمنى السفلى في أي وقت (الحجم الافتراضي 460×560؛ ويدعم شريط العنوان **`🗖 تكبير / 🗗 استعادة`** للتبديل إلى **920×672**).
2. **تبويب عرض المحادثة (`conversation.view`)**: يوفر عرض `☯ تأمل الأصل` بمستوى ملء الشاشة.
3. **قسم لوحة الإعدادات (`settings.section`)**: يضمّن لوحة تحكم `☯ وكيل الداو · الأصل` داخل صفحة إعدادات DSH.

**قدرات اللوحة بإيجاز**:
- **ثلاث لمبات حالة**: `Host` (الإضافة حيّة)، `Capture` (هل تم التقاط طلب حقيقي)، `Mode` (أخضر = وكيل الداو / أحمر = التمرير الرسمي).
- **شريط تحكم مبسّط بثلاثة أزرار (`[道]` · `[官]` · `[编]`) + قائمة منسدلة للنصوص الكانونية**:
  - **`[道]` (داو)**: التبديل إلى وكيل الداو — يستخدم النص الكانوني/المخصص حصريًا، ويتزامن مع القائمة المنسدلة لعرض المحتوى المناسب لحظيًا.
  - **`[官]` (رسمي)**: التبديل إلى الوكيل الرسمي — يمرر المطالبة الرسمية الأصلية كما هي ويعرضها.
  - **`[编]` (تحرير)**: يفتح محرر SP المخصص عبر الإنترنت (`Ctrl+Enter` أو انقر `[✔ 注入]` للحفظ في خيار «مخصص» داخل القائمة والانتقال إليه تلقائيًا؛ بعدها يمكنك التنقل بحرية بين لاوتزي وينفو جينغ و«مخصص» دون تغيير المحتوى المخصص؛ وانقر `[✖ 归道]` لمسح المطالبة المخصصة واستعادة النص الافتراضي).

### 3. أمر الشرطة المائلة `/dao` (لـ TUI / الويب / سطح المكتب)
اكتبه في أي مربع حوار في DSH:
- `/dao` أو `/dao toggle`: تبديل بمفتاح واحد بين «وكيل الداو» و«الوكيل الرسمي»
- `/dao on`: التبديل إلى وكيل الداو (`invert`)
- `/dao off`: التبديل إلى الوكيل الرسمي (`passthrough`)
- `/dao canon laozi+yinfu` / `/dao canon laozi` / `/dao canon yinfu`: تبديل النص الكانوني
- `/dao status`: عرض الوضع الحالي وعدد أحرف النص الكانوني وإحصاءات الالتقاط

---

## ثانيًا: التثبيت

### الطريقة 1: التثبيت الرسومي عبر DSH Desktop (مُوصى به)
في لوحة إدارة الإضافات في **DSH Desktop (`v0.2.1-rc.2+`)**، أدخل عنوان GitHub لهذا المستودع أو مسار مجلد محلي ليتم تركيبه تلقائيًا (الحزمة تعلن مسبقًا عن `dsh.bundle.patch` و`dsh.client`).

### الطريقة 2: التثبيت عبر واجهة DSH الرسمية (CLI)
```bash
# التثبيت مباشرة من مستودع GitHub
dsh plugin --profile web add git+https://github.com/Yikumasai/dsh-dao.git

# أو التثبيت من نسخة محلية
git clone https://github.com/Yikumasai/dsh-dao.git
cd dsh-dao
dsh plugin --profile web add .
```

يمكنك أيضًا استخدام سكربتات التثبيت بنقرة واحدة المدمجة في المستودع (تتعامل تلقائيًا مع `minimumReleaseAgeExclude` في `pnpm-workspace.yaml`):
```bash
# macOS / Linux / Git Bash
bash scripts/install.sh

# Windows PowerShell
powershell -ExecutionPolicy Bypass -File scripts/install.ps1
```

### إلغاء التثبيت
```bash
dsh plugin --profile web remove dsh-dao
```

---

## ثالثًا: واجهة التحكم HTTP (من نفس الأصل `/plugins/dsh-dao/origin/*`)

| نقطة النهاية | الطريقة | الوصف |
| :--- | :---: | :--- |
| `/plugins/dsh-dao/origin/ping` | `GET` | حالة الإضافة والإصدار والوضع الحالي وعدد أحرف النص وعدّاد الالتقاط |
| `/plugins/dsh-dao/origin/sig` | `GET` | بصمة حالة خفيفة (لمزامنة استطلاع الواجهة الأمامية دون وميض) |
| `/plugins/dsh-dao/origin/mode` | `GET` / `POST` | الاستعلام عن الوضع أو تبديله `{"mode": "invert" \| "passthrough"}` |
| `/plugins/dsh-dao/origin/canon` | `GET` / `POST` | الاستعلام عن النص الكانوني أو تبديله `{"canon": "laozi+yinfu" \| "laozi" \| "yinfu"}` |
| `/plugins/dsh-dao/origin/custom_sp` | `GET` / `POST` / `DELETE` | الاستعلام عن مطالبة النظام المخصصة أو حفظها أو إعادة تعيينها |
| `/plugins/dsh-dao/origin/preview` | `GET` | جلب مقارنة آخر التقاط: `before` (المطالبة الأصلية) مقابل `after` (المطالبة المستلمة فعليًا) |
| `/plugins/dsh-dao/origin/tape` | `GET` | جلب شريط التسلسل الزمني الكامل لآخر 16 خانة طلبات (`?limit=16&fields=1`) |
| `/plugins/dsh-dao/origin/stream` | `GET` | تدفق أحداث SSE آني (`hello` / `turn` / `mode` / `canon` / `hb`) |
| `/plugins/dsh-dao/origin/view` | `GET` | وحدة تحكم HTML مستقلة «تأمل الأصل» بملء الشاشة |

---
## شكر وتقدير

 - **[windsurf-assistant](https://github.com/dao-genesis/windsurf-assistant)**

--- 
## الرخصة

[Apache-2.0](../../LICENSE)

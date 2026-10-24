
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

# <center> ☯ dsh-dao · দাও এজেন্ট

> **দাও জন্ম দেয় একের; এক জন্ম দেয় দুইয়ের; দুই জন্ম দেয় তিনের; তিন জন্ম দেয় দশ সহস্র সত্তার। দশ সহস্র সত্তা য়িন-কে পৃষ্ঠে বহন করে, য়াং-কে আলিঙ্গন করে; মধ্যম নিঃশ্বাসেই মিলিত হয় সামঞ্জস্য।**
> **আকাশের পথ দেখো, আকাশের বিধান ধরে রাখো — সবই সিদ্ধ হলো।**

`dsh-dao` হলো **DeepSeek Harness (`v0.2.1-rc.2+`)** এবং **[DSH Desktop](https://github.com/anywhere-labs/dsh-desktop)**-এর জন্য তৈরি একটি **DeepSeek Harness «বর্মভেদী» প্লাগিন**।

এটি [DSH Desktop প্লাগিন ডেভেলপমেন্ট গাইড](https://github.com/anywhere-labs/dsh-desktop/blob/master/docs/plugin-development.md) এবং `@deepseek-ai/cordis` দ্বি-পক্ষ কম্পোজিশন চুক্তি পুরোপুরি অনুসরণ করে: **মূল সিস্টেম প্রম্পটের সম্পূর্ণ প্রতিস্থাপন**।


![dsh-dao](../../dshdesktop.png)
---

## ১. মূল বৈশিষ্ট্য

### 1. সিস্টেম প্রম্পটের সম্পূর্ণ প্রতিস্থাপন
- **মূল প্রম্পটের নিখুঁত প্রতিস্থাপন**: **দাও এজেন্ট (`invert`)** মোডে প্লাগিনটি DSH-এর সংযোজিত সব মূল সিস্টেম-প্রম্পট অংশ এবং যুক্ত ডাইনামিক টেক্সট কনটেক্সট পুরোপুরি মুছে ফেলে, এবং **ক্যাননিক্যাল সূত্র বা আপনার কাস্টম প্রম্পট দিয়ে সম্পূর্ণ প্রতিস্থাপন করে** — শেষে মূল প্রম্পটের কোনো অবশেষ থাকে না।
- **ক্যানন সূত্র ইনজেকশন**: অন্তর্নির্মিত **মাওয়াংদুই সিল্ক পাণ্ডুলিপি লাৎসু, এ সংস্করণ** (আগে দে জিং, পরে দাও জিং; ৭,১২৬ অক্ষর) এবং **দাওইস্ট ক্যানন সংস্করণ «হুয়াংদি ইনফু জিং»** (৫৯৭ অক্ষর)।
- **রিয়েল-টাইমে পরিবর্তনযোগ্য চারটি প্রিসেট (কাস্টমসহ)**:
  | প্রিসেট key | নাম | অক্ষর সংখ্যা |
  | :--- | :--- | :---: |
  | `laozi+yinfu` | **সিল্ক লাৎসু + দাওইস্ট ইনফু জিং** (ডিফল্ট) | ৭,৭২৫ |
  | `laozi` | **সিল্ক «লাৎসু»** (দে জিং + দাও জিং) | ৭,১২৬ |
  | `yinfu` | **দাওইস্ট «ইনফু জিং»** (উপর, মাঝ, নিচ — তিন খণ্ড) | ৫৯৭ |
  | `custom` | **কাস্টম** (স্থানীয়ভাবে সংরক্ষিত ব্যবহারকারী-নির্ধারিত প্রম্পট) | প্রকৃত সংখ্যা |
- **টুলের JSON Schema সংরক্ষিত**: মডেলের টুল কলের জন্য প্রয়োজনীয় ফাংশন Schema সংজ্ঞা রাখে (অধিবেশন-জুড়ে দূষণ সৃষ্টিকারী `create_memory` টুলটি বাদ দিয়ে), যাতে ফাইল পড়া/লেখা, টার্মিনাল কমান্ড ইত্যাদি স্বাভাবিকভাবে চলে।
- **দাও / সরকারি — দুই অবস্থার শূন্য-খরচের হট-সুইচ**:
  - **দাও এজেন্ট (`invert`)**: নির্বাচিত ক্যানন (বা কাস্টম প্রম্পট) দিয়ে সম্পূর্ণ প্রতিস্থাপন।
  - **সরকারি এজেন্ট (`passthrough`)**: সরকারি DSH প্রম্পট ১০০% অপরিবর্তিত পাস-থ্রু।
  - **কাস্টম প্রম্পট সমর্থন**: ব্যবহারকারী-নির্ধারিত প্রম্পট স্থানীয়ভাবে সংরক্ষণযোগ্য।

### 2. «উৎস-দর্শন» ওয়েব প্যানেল
DSH সরকারি ক্লায়েন্টের Slot ব্যাবস্থার মাধ্যমে তিনটি প্রবেশপথ মাউন্ট করা হয়:
1. **বাম সাইডবারের নিচের দ্রুত বোতাম (`sidebar.footer.action`)**: `☯ দাও / সরকারি` স্ট্যাটাস ব্যাজ দেখায়; ক্লিক করলে (বা **`Alt + D`** শর্টকাটে) যেকোনো সময় ডান-নিচে ভাসমান «উৎস-দর্শন» ড্রয়ার খোলে (ডিফল্ট 460×560; টাইটেলবারে **`🗖 বড় করুন / 🗗 ফেরত`** দিয়ে **920×672**-এ বদলানো যায়)।
2. **কথোপকথন ভিউ ট্যাব (`conversation.view`)**: পূর্ণ-স্ক্রিন মানের `☯ উৎস-দর্শন` ভিউ দেয়।
3. **সেটিংস প্যানেল সেকশন (`settings.section`)**: DSH সেটিংস পৃষ্ঠার ভিতরে `☯ দাও এজেন্ট · উৎস` নিয়ন্ত্রণ প্যানেল এম্বেড করে।

**প্যানেলের সামর্থ্য এক নজরে**:
- **তিনটি স্ট্যাটাস লাইট**: `Host` (প্লাগিন জীবিত), `Capture` (প্রকৃত রিকোয়েস্ট ধরা পড়েছে কি), `Mode` (সবুজ = দাও এজেন্ট / লাল = সরকারি পাস-থ্রু)।
- **মিনিমাল তিন-বোতাম কন্ট্রোল বার (`[道]` · `[官]` · `[编]`) + ক্যানন ড্রপডাউন**:
  - **`[道]` (দাও)**: দাও এজেন্টে যান — শুধু ক্যানন/কাস্টম প্রম্পট ব্যবহার করে এবং ড্রপডাউনের সাথে লাইভ-সিঙ্ক হয়ে সংশ্লিষ্ট কনটেন্ট দেখায়।
  - **`[官]` (সরকারি)**: সরকারি এজেন্টে যান — সরকারি মূল প্রম্পট অপরিবর্তিত পাস-থ্রু করে ও দেখায়।
  - **`[编]` (সম্পাদনা)**: অনলাইন কাস্টম SP এডিটর খোলে (`Ctrl+Enter` বা `[✔ 注入]` ক্লিকে ড্রপডাউনের «কাস্টম» অপশনে সেভ হয় এবং স্বয়ংক্রিয়ভাবে «কাস্টম»-এ চলে যায়; পরে লাৎসু, ইনফু জিং ও «কাস্টম»-এর মধ্যে ইচ্ছামতো যাতায়াত করলেও কাস্টম কনটেন্ট বদলায় না; `[✖ 归道]` ক্লিকে কাস্টম মুছে ডিফল্ট ক্যাননে ফেরা যায়)।

### 3. `/dao` স্ল্যাশ কমান্ড (TUI / Web / Desktop — সব জায়গায়)
যেকোনো DSH ডায়ালগে লিখুন:
- `/dao` বা `/dao toggle`: «দাও এজেন্ট» ও «সরকারি এজেন্ট»-এর মধ্যে এক-ক্লিক টগল
- `/dao on`: দাও এজেন্টে (`invert`) যান
- `/dao off`: সরকারি এজেন্টে (`passthrough`) যান
- `/dao canon laozi+yinfu` / `/dao canon laozi` / `/dao canon yinfu`: ক্যানন বদলান
- `/dao status`: বর্তমান মোড, ক্যাননের অক্ষর সংখ্যা ও ক্যাপচার পরিসংখ্যান দেখুন

---

## ২. ইনস্টলেশন

### পদ্ধতি ১: DSH Desktop গ্রাফিক্যাল ইনস্টল (সুপারিশকৃত)
**DSH Desktop (`v0.2.1-rc.2+`)**-এর প্লাগিন ম্যানেজমেন্ট প্যানেলে এই রিপোজিটরির GitHub ঠিকানা বা লোকাল ডিরেক্টরি পাথ দিলেই স্বয়ংক্রিয়ভাবে মাউন্ট হয়ে যায় (প্যাকেজে `dsh.bundle.patch` ও `dsh.client` আগেই ঘোষিত)।

### পদ্ধতি ২: DSH সরকারি CLI দিয়ে ইনস্টল
```bash
# GitHub রিপোজিটরি থেকে সরাসরি ইনস্টল
dsh plugin --profile web add git+https://github.com/Yikumasai/dsh-dao.git

# অথবা লোকাল ক্লোন থেকে ইনস্টল
git clone https://github.com/Yikumasai/dsh-dao.git
cd dsh-dao
dsh plugin --profile web add .
```

রিপোজিটরির অন্তর্নির্মিত এক-ক্লিক স্ক্রিপ্টও ব্যবহার করা যায় (`pnpm-workspace.yaml`-এর `minimumReleaseAgeExclude` স্বয়ংক্রিয়ভাবে সামলায়):
```bash
# macOS / Linux / Git Bash
bash scripts/install.sh

# Windows PowerShell
powershell -ExecutionPolicy Bypass -File scripts/install.ps1
```

### আনইনস্টল
```bash
dsh plugin --profile web remove dsh-dao
```

---

## ৩. HTTP কন্ট্রোল API (একই অরিজিন `/plugins/dsh-dao/origin/*`)

| এন্ডপয়েন্ট | মেথড | বিবরণ |
| :--- | :---: | :--- |
| `/plugins/dsh-dao/origin/ping` | `GET` | প্লাগিনের অবস্থা, সংস্করণ, বর্তমান মোড, ক্যাননের অক্ষর সংখ্যা, ক্যাপচার গণনা |
| `/plugins/dsh-dao/origin/sig` | `GET` | হালকা স্ট্যাটাস ফিঙ্গারপ্রিন্ট (ফ্রন্টএন্ড পোলিং-এ ঝিকমিক ছাড়া সারিবদ্ধকরণ) |
| `/plugins/dsh-dao/origin/mode` | `GET` / `POST` | মোড জিজ্ঞাসা বা পরিবর্তন `{"mode": "invert" \| "passthrough"}` |
| `/plugins/dsh-dao/origin/canon` | `GET` / `POST` | ক্যানন জিজ্ঞাসা বা পরিবর্তন `{"canon": "laozi+yinfu" \| "laozi" \| "yinfu"}` |
| `/plugins/dsh-dao/origin/custom_sp` | `GET` / `POST` / `DELETE` | কাস্টম System Prompt জিজ্ঞাসা, সংরক্ষণ বা রিসেট |
| `/plugins/dsh-dao/origin/preview` | `GET` | সর্বশেষ ক্যাপচারের `before` (মূল SP) ও `after` (প্রকৃত প্রেরিত SP) তুলনা পান |
| `/plugins/dsh-dao/origin/tape` | `GET` | সর্বশেষ ১৬ স্লটের পূর্ণ রিকোয়েস্ট টাইমিং টেপ পান (`?limit=16&fields=1`) |
| `/plugins/dsh-dao/origin/stream` | `GET` | SSE রিয়েল-টাইম ইভেন্ট স্ট্রিম (`hello` / `turn` / `mode` / `canon` / `hb`) |
| `/plugins/dsh-dao/origin/view` | `GET` | স্বতন্ত্র HTML «উৎস-দর্শন» পূর্ণ-স্ক্রিন কনসোল |

---
## কৃতজ্ঞতা

 - **[windsurf-assistant](https://github.com/dao-genesis/windsurf-assistant)**

--- 
## লাইসেন্স

[Apache-2.0](../../LICENSE)

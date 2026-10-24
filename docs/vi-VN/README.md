
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

# <center> ☯ dsh-dao · Đạo Agent

> **Đạo sinh Nhất, Nhất sinh Nhị, Nhị sinh Tam, Tam sinh vạn vật. Vạn vật phụ Âm mà ôm Dương, trung khí lấy làm hòa.**
> **Quan Thiên chi đạo, chấp Thiên chi hành — tất hĩ.**

`dsh-dao` là một **plugin «phá giáp» cho DeepSeek Harness**, được xây dựng cho **DeepSeek Harness (`v0.2.1-rc.2+`)** và **[DSH Desktop](https://github.com/anywhere-labs/dsh-desktop)**.

Plugin tuân thủ hoàn toàn [quy chuẩn phát triển plugin của DSH Desktop](https://github.com/anywhere-labs/dsh-desktop/blob/master/docs/plugin-development.md) và hợp đồng tổ hợp hai đầu `@deepseek-ai/cordis`: **thay thế hoàn toàn system prompt cốt lõi**.


![dsh-dao](../../dshdesktop.png)
---

## I. Tính năng cốt lõi

### 1. Thay thế hoàn toàn System Prompt
- **Thay thế triệt để prompt gốc**: ở chế độ **Đạo Agent (`invert`)**, plugin xóa sạch toàn bộ các đoạn system prompt gốc do DSH lắp ráp cùng mọi ngữ cảnh văn bản động được gắn thêm, và **thay thế hoàn toàn bằng kinh tạng nguyên bản hoặc prompt tùy chỉnh của bạn** — tuyệt đối không để sót prompt gốc ở cuối.
- **Bơm kinh tạng nguyên bản**: tích hợp sẵn **Lão Tử thư trên lụa Mã Vương Đôi, bản Giáp** (Đức Kinh trước, Đạo Kinh sau; 7.126 chữ) và **bản Đạo tạng «Hoàng Đế Âm Phù Kinh»** (597 chữ).
- **Bốn preset chuyển đổi theo thời gian thực (bao gồm tùy chỉnh)**:
  | Khóa preset | Tên | Số chữ |
  | :--- | :--- | :---: |
  | `laozi+yinfu` | **Lão Tử lụa + Âm Phù Kinh Đạo tạng** (mặc định) | 7.725 chữ |
  | `laozi` | **«Lão Tử» thư lụa** (Đức Kinh + Đạo Kinh) | 7.126 chữ |
  | `yinfu` | **«Âm Phù Kinh» Đạo tạng** (ba thiên Thượng, Trung, Hạ) | 597 chữ |
  | `custom` | **Tùy chỉnh** (prompt do người dùng định nghĩa, lưu cục bộ) | theo số chữ thực tế |
- **Giữ nguyên JSON Schema của công cụ**: giữ lại các định nghĩa Schema hàm cần thiết để mô hình gọi công cụ (đồng thời cắt bỏ công cụ gây ô nhiễm liên phiên `create_memory`), đảm bảo đọc/ghi tệp, lệnh terminal… hoạt động bình thường.
- **Chuyển đổi nóng hai trạng thái Đạo / Quan với chi phí bằng không**:
  - **Đạo Agent (`invert`)**: thay thế hoàn toàn bằng kinh tạng đã chọn (hoặc prompt tùy chỉnh).
  - **Quan Agent — chính thức (`passthrough`)**: truyền qua nguyên vẹn 100% prompt chính thức của DSH.
  - **Hỗ trợ prompt tùy chỉnh**: prompt do người dùng định nghĩa được lưu cục bộ.

### 2. Bảng Web «Bản Nguyên Quan Chiếu»
Gắn ba điểm vào thông qua hệ Slot của client chính thức DSH:
1. **Nút nhanh dưới cùng thanh bên trái (`sidebar.footer.action`)**: hiển thị huy hiệu trạng thái `☯ Đạo / Quan`; nhấp vào (hoặc phím tắt **`Alt + D`**) để mở ngăn kéo nổi «Bản Nguyên Quan Chiếu» ở góc dưới phải bất cứ lúc nào (mặc định 460×560; thanh tiêu đề hỗ trợ **`🗖 Phóng to / 🗗 Khôi phục`** chuyển sang **920×672**).
2. **Tab khung nhìn hội thoại (`conversation.view`)**: cung cấp khung nhìn `☯ Bản Nguyên Quan Chiếu` ở quy mô toàn màn hình.
3. **Phân vùng bảng cài đặt (`settings.section`)**: nhúng bảng điều khiển `☯ Đạo Agent · Bản Nguyên` vào trang cài đặt DSH.

**Tổng quan khả năng của bảng**:
- **Ba đèn trạng thái**: `Host` (plugin còn sống), `Capture` (đã bắt được request thật chưa), `Mode` (xanh lá = Đạo Agent / đỏ = truyền chính thức).
- **Thanh điều khiển tối giản ba phím (`[道]` · `[官]` · `[编]`) + menu thả xuống kinh tạng**:
  - **`[道]` (Đạo)**: chuyển sang Đạo Agent — chỉ dùng kinh tạng/prompt tùy chỉnh, đồng thời liên động theo thời gian thực với menu thả xuống để hiển thị nội dung tương ứng.
  - **`[官]` (Quan)**: chuyển sang Quan Agent — truyền nguyên vẹn và hiển thị prompt gốc chính thức.
  - **`[编]` (Biên)**: mở trình soạn thảo SP tùy chỉnh trực tuyến (`Ctrl+Enter` hoặc nhấp `[✔ 注入]` để lưu vào mục «Tùy chỉnh» của menu thả xuống và tự động nhảy tới «Tùy chỉnh»; sau đó có thể chuyển qua lại tự do giữa Lão Tử, Âm Phù Kinh và «Tùy chỉnh» mà không thay đổi nội dung tùy chỉnh; nhấp `[✖ 归道]` để xóa phần tùy chỉnh và khôi phục kinh tạng mặc định).

### 3. Lệnh gạch chéo `/dao` (dùng chung cho TUI / Web / Desktop)
Nhập trong bất kỳ hộp thoại DSH nào:
- `/dao` hoặc `/dao toggle`: chuyển đổi một chạm giữa «Đạo Agent» và «Quan Agent»
- `/dao on`: chuyển sang Đạo Agent (`invert`)
- `/dao off`: chuyển sang Quan Agent (`passthrough`)
- `/dao canon laozi+yinfu` / `/dao canon laozi` / `/dao canon yinfu`: chuyển kinh tạng
- `/dao status`: xem chế độ hiện tại, số chữ kinh tạng và thống kê bắt gói

---

## II. Cách cài đặt

### Cách 1: Cài đặt đồ họa qua DSH Desktop (khuyên dùng)
Trong bảng quản lý plugin của **DSH Desktop (`v0.2.1-rc.2+`)**, điền địa chỉ GitHub của repo này hoặc đường dẫn thư mục cục bộ để tự động gắn kết (gói đã khai báo sẵn `dsh.bundle.patch` và `dsh.client`).

### Cách 2: Cài qua DSH CLI chính thức
```bash
# Cài trực tiếp từ repo GitHub
dsh plugin --profile web add git+https://github.com/Yikumasai/dsh-dao.git

# Hoặc cài từ thư mục clone cục bộ
git clone https://github.com/Yikumasai/dsh-dao.git
cd dsh-dao
dsh plugin --profile web add .
```

Cũng có thể dùng script một chạm có sẵn trong repo (tự động xử lý `minimumReleaseAgeExclude` của `pnpm-workspace.yaml`):
```bash
# macOS / Linux / Git Bash
bash scripts/install.sh

# Windows PowerShell
powershell -ExecutionPolicy Bypass -File scripts/install.ps1
```

### Gỡ cài đặt
```bash
dsh plugin --profile web remove dsh-dao
```

---

## III. API điều khiển HTTP (cùng origin `/plugins/dsh-dao/origin/*`)

| Endpoint | Phương thức | Mô tả |
| :--- | :---: | :--- |
| `/plugins/dsh-dao/origin/ping` | `GET` | Trạng thái plugin, phiên bản, chế độ hiện tại, số chữ kinh tạng, số lần bắt gói |
| `/plugins/dsh-dao/origin/sig` | `GET` | Dấu vân tay trạng thái nhẹ (để frontend polling căn chỉnh không nhấp nháy) |
| `/plugins/dsh-dao/origin/mode` | `GET` / `POST` | Truy vấn hoặc chuyển chế độ `{"mode": "invert" \| "passthrough"}` |
| `/plugins/dsh-dao/origin/canon` | `GET` / `POST` | Truy vấn hoặc chuyển kinh tạng `{"canon": "laozi+yinfu" \| "laozi" \| "yinfu"}` |
| `/plugins/dsh-dao/origin/custom_sp` | `GET` / `POST` / `DELETE` | Truy vấn, lưu hoặc đặt lại System Prompt tùy chỉnh |
| `/plugins/dsh-dao/origin/preview` | `GET` | Lấy so sánh `before` (SP gốc) và `after` (SP thực nhận) của lần bắt gần nhất |
| `/plugins/dsh-dao/origin/tape` | `GET` | Lấy băng ghi trình tự thời gian đầy đủ của 16 slot request gần nhất (`?limit=16&fields=1`) |
| `/plugins/dsh-dao/origin/stream` | `GET` | Luồng sự kiện SSE thời gian thực (`hello` / `turn` / `mode` / `canon` / `hb`) |
| `/plugins/dsh-dao/origin/view` | `GET` | Console toàn màn hình HTML độc lập «Bản Nguyên Quan Chiếu» |

---
## Lời cảm ơn

 - **[windsurf-assistant](https://github.com/dao-genesis/windsurf-assistant)**

--- 
## Giấy phép

[Apache-2.0](../../LICENSE)

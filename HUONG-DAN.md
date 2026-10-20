# Một món quà cho em — hướng dẫn

## Thư mục

```
index.html        trang web (chỉ có khung, không cần sửa)
noi-dung.js       ★ chữ, ảnh, căn ảnh, lá bài — muốn đổi gì thì sửa file này
photo/            ★ 26 ảnh hai người 01.jpg … 26.jpg — thay ảnh ở đây
css/style.css     giao diện
js/book.js        cuốn sổ: trang, ảnh, lá bài, lật trang, phiếu cào
js/intro.js       mở đầu: tường hoa, phong bì, bướm
assets/hoa/       hoa thật nền trong (bó hoa, hoa ép, tường hoa)
assets/hoa-ve/    hoa màu nước vẽ sẵn cho tường hoa
assets/buom/      bướm tím / vàng / xanh
assets/nen/       nền: giấy gói trắng nhàu (bàn), giấy gói xanh nhàu (trang), da báo màu nước (trang lá bài)
```

## Xem thử

- Mở `index.html` bằng Chrome, Edge hoặc Safari (cần mạng để tải phông chữ).
- Thêm `#so` vào cuối đường dẫn (ví dụ `index.html#so`) để bỏ qua đoạn mở đầu, vào thẳng cuốn sổ.
- Điện thoại dọc: mỗi lần thấy 1 trang, vuốt hoặc bấm mũi tên để lật.
  Máy tính, máy tính bảng, điện thoại xoay ngang: thấy 2 trang.

## Sửa nội dung (`noi-dung.js`)

Mở bằng Notepad / VS Code, chỉ sửa chữ giữa hai dấu ngoặc kép `" "`, giữ nguyên dấu phẩy cuối dòng.

| mục | là gì |
|---|---|
| `nguoiNhan`, `kyTen` | tên người nhận, tên ký cuối thư |
| `bia` | 2 dòng chữ cắt dán trên bìa |
| `lanDau` | danh sách "Những lần đầu" (`true` = đã đánh dấu) |
| `phieuLon`, `phieuNho` | chữ hiện ra sau khi cào phiếu |
| `thu`, `loiKet` | các đoạn của lá thư |
| `laBai` | 9 lá bài trang 2, theo thứ tự trái → phải, trên → dưới, ví dụ `"K♥"`, `"Q♣"`, `"A♠"`, `"10♦"` |
| `laBaiXoe` | 2 lá xoè sau lá giữa (mặc định Át cơ, Át bích) |

## Ảnh

Đặt ảnh vào thư mục `photo/` tên `01.jpg` … `26.jpg` (jpg, jpeg, png, webp đều được). Ô nào thiếu ảnh sẽ hiện số.

| số | vị trí |
|---|---|
| 01–02 | bìa, 2 ảnh polaroid |
| 03–05 | trang 1: ảnh lớn, ảnh vuông, ảnh trong máy ảnh |
| 06–14 | trang 2: 9 lá bài (10 là lá giữa) |
| 15–18 | trang 3: dải ảnh photobooth |
| 19–23 | trang 4: ảnh dán cùng sticker |
| 24–25 | trang 5: "mini em", "mini anh" |
| 26 | trang 6: "tụi mình" trong trái tim |

**Căn ảnh cho đúng chủ thể** — mục `khungAnh`, mỗi ảnh một dòng `số: [x, y, phóng]`:

- `x`, `y`: điểm muốn giữ ở giữa khung, tính theo % trên ảnh gốc (`0` = trái/trên, `100` = phải/dưới).
- `phóng` (không bắt buộc): `1` là vừa khung, `1.5` là phóng to 1,5 lần quanh điểm đó.
- Ví dụ mặt nằm hơi cao bên phải ảnh 7: `7: [60, 30],` — người đứng nhỏ quá ở ảnh 20: `20: [40, 57, 1.8],`
- Đổi ảnh mới thì chỉnh lại dòng của ảnh đó (hoặc xoá dòng để ảnh tự căn giữa).

Ảnh to quá 1600px nên thu nhỏ trước khi chép vào để web tải nhanh.

## Hoa, bướm, nền

- Thay file trong `assets/` nhưng giữ đúng tên là xong. Ảnh hoa / bướm cần nền trong suốt (png hoặc webp).
- Bướm xoè cánh đập cánh bằng cách gập hai nửa cánh quanh thân; vị trí thân của từng con nằm trong
  danh sách `BUTTERFLIES` ở đầu `js/intro.js` — thay ảnh bướm khác thì có thể phải chỉnh `ax`, `ay`.
- Nền da báo của trang lá bài: `assets/nen/da-bao.webp` (ảnh lặp liền mạch).
- Giấy gói nhàu: `assets/nen/giay-trang.webp` (nền bàn và phong bì; ở chế độ tối được phủ tối lại)
  và `assets/nen/giay-xanh.webp` (các trang giấy xanh). Thay bằng ảnh giấy thật cũng được, giữ đúng tên.

## Gửi cho cô ấy

- **GitHub Pages**: commit và push cả thư mục này, bật Pages cho nhánh `main` (thư mục gốc).
- **Netlify Drop**: kéo cả thư mục vào trang app.netlify.com/drop rồi gửi link.
- Một số hình hoa là tranh của người khác, nên chỉ gửi link riêng cho cô ấy, đừng đăng công khai.

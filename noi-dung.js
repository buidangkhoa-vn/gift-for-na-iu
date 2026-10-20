/* =====================================================================
   NỘI DUNG MÓN QUÀ — muốn đổi chữ, ảnh, lá bài thì chỉ cần sửa file này.
   Chỉ sửa phần nằm giữa hai dấu ngoặc kép " ", giữ nguyên dấu phẩy cuối dòng.
   ===================================================================== */
window.NOI_DUNG = {
  nguoiNhan: "Em yêu",                 // tên / biệt danh người nhận (đầu lá thư)
  kyTen: "Anh",                        // tên ký cuối thư

  /* ---------- chữ trên các trang ---------- */
  bia: ["from me", "to you"],          // 2 dòng chữ cắt dán trên bìa
  tieuDe: "Tụi mình",
  trichDan1: "Ở cạnh em, ngày nào cũng thấy dễ thương.",
  trichDan2: "Tin vào điều kỳ diệu của những ngày bình thường.",
  veTuyen: "ANH → EM",
  veGhiChu: "Hạng ghế: thương nhất",
  lanDau: [                            // true = đã đánh dấu, false = chưa
    ["Lần đầu đi ăn cùng nhau", true],
    ["Lần đầu nắm tay", true],
    ["Lần đầu giận nhau rồi làm lành", true],
    ["Lần đầu đi chơi xa", true],
    ["Còn nhiều lần đầu nữa", false]
  ],
  miniEm: "mini em",
  miniAnh: "mini anh",
  tuiMinh: "tụi mình",
  phieuLon: "Anh thương em",           // chữ hiện ra sau khi cào phiếu
  phieuNho: "nhiều hơn hôm qua, ít hơn ngày mai",
  nhanTraiTim: "từ anh<br>gửi em",
  thu: [                               // lá thư: mỗi đoạn một dòng
    "Anh không giỏi nói mấy lời sến súa, nên anh làm cuốn sổ nhỏ này.",
    "Cảm ơn em đã đến, đã ở lại, và đã kiên nhẫn với anh cả những ngày anh vụng về nhất.",
    "Mong là sau này mình còn dán thêm thật nhiều trang nữa."
  ],
  loiKet: "Thương em nhiều,",

  /* ---------- lá bài ở trang 2 ----------
     9 lá theo thứ tự trái → phải, trên → dưới (ảnh 06 … 14). Lá thứ 5 là lá giữa.
     Chất: ♥ ♦ (đỏ)  ♠ ♣ (đen). Hai lá Át xoè sau lá giữa nằm ở laBaiXoe. */
  laBai: ["K♥", "Q♣", "K♥", "Q♠", "K♥", "Q♣", "K♥", "Q♣", "K♥"],
  laBaiXoe: ["A♥", "A♠"],

  /* ---------- ảnh ----------
     Đặt ảnh vào thư mục photo/ với tên 01.jpg … 26.jpg (jpg, jpeg, png, webp đều được).
     Muốn dùng tên khác: anhRieng: { 1: "photo/bia.jpg" } */
  thuMucAnh: "photo/",
  anhRieng: {},

  /* Căn ảnh theo chủ thể — số ảnh: [x%, y%, độ phóng]
     x, y = điểm muốn giữ ở giữa khung, đo trên ảnh gốc (0 = trái/trên, 100 = phải/dưới)
     độ phóng (không bắt buộc): 1 = vừa khung, 1.5 = phóng to 1,5 lần quanh điểm đó */
  khungAnh: {
    1: [52, 30],        2: [52, 58, 1.2],   3: [33, 45],        4: [50, 45],
    5: [55, 45, 1.12],  6: [58, 52, 1.25],  7: [50, 32],        8: [52, 40],
    9: [50, 62, 1.1],   10: [54, 50, 2.2],  11: [47, 50],       12: [50, 50, 1.4],
    13: [50, 50],       14: [50, 55],       15: [50, 55],       16: [45, 47],      
    17: [50, 50],       18: [50, 50, 1.3],  19: [50, 48, 1.15], 20: [40, 57, 1.8],
    21: [50, 55, 1.5],  22: [58, 50],       23: [55, 45],       24: [48, 50],
    25: [52, 52],       26: [45, 52, 1.15]
  }
};

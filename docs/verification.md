# Kiểm tra bản bàn giao

- `npm test`: 6 bài kiểm tra đạt; chọn bất kỳ ảnh nào cũng xem đủ 13 ảnh đúng một lần; mọi đường dẫn ảnh nguồn tồn tại; khung cảnh được thu phóng đồng đều và rèm giữ đúng các mốc cửa sổ trong cả chế độ dọc và ngang.
- `npm run build`: tạo bản tĩnh không cần dependency, API hoặc biến môi trường.
- Trình duyệt: đã đi hết 13 ảnh từ điểm bắt đầu là ảnh 9, sang video, nhấn Play, xem video phát hết và quan sát tự trở về màn mở đầu.
- Video: MP4 H.264/AAC phát thật trên trình duyệt, thời lượng khoảng 9,15 giây, không có lỗi phát.
- Bản build đã được mở ở `/dist/` và đi từ màn đầu đến trang ảnh, kiểm tra cách tải tài nguyên tương đối cho hosting dưới đường dẫn con.
- Đã kiểm tra giao diện ở viewport 1280×720, 390×844 và 375×667. Ảnh dọc giữ nguyên tỉ lệ; lời chúc dài không đè điều hướng trên hai kích thước điện thoại đã kiểm tra.
- Đã thử nhấn xem lại khi thư đang bay và mở lại hành trình thành công.
- Console không ghi nhận lỗi hoặc cảnh báo khi kiểm tra luồng trên bản build.

Các kiểm tra trình duyệt thực hiện trong trình duyệt xem trước hiện có. Chưa xuất bản một deployment công khai và chưa thử trên thiết bị iOS/Android thật.

## Phiên bản đồng nhất phong cách scene 1

- Lớp học là ảnh tạo mới; không còn tải SVG lớp học từ dự án cũ. Bản cuối đã giảm các vệt loang trên tường, bảng, sàn và đồ gỗ.
- Hoa, giấy, rèm voan và sách dùng bộ ảnh tạo riêng cùng phong cách. Các lớp chuyển động của cây/hoa dùng chính ảnh lớp học mới.
- Đã đọc thứ tự xếp lớp trên trình duyệt: `envelope-rear: 10`, `fan: 20`, `envelope-front: 30`. Nắp mở nằm trong lớp rear; hover ảnh không vượt lên thân túi thư.
- Đã quan sát 5 kiểu xuất hiện qua các ảnh 1–5: `drift`, `unfold`, `rise`, `reveal`, `settle`.
- Đã xem ảnh 13 với lời chúc dài ở 390×844 và 375×667: chữ ký vẫn nằm phía trên điều hướng.
- Bản mới đã đi đủ 13 ảnh từ điểm bắt đầu là ảnh 13 và chuyển sang trang video.
- Video của bản mới phát bình thường; khi kết thúc, thư thu về vị trí bàn mới và trình duyệt tự trở về trạng thái chờ mở màn, không có lỗi console.
- Ảnh chụp kiểm tra: `classroom-v2.jpg`, `envelope-v2.jpg`, `memory-v2.jpg`, `video-v2.jpg`.

## Sửa rèm, ảnh bị cắt và responsive

- Thanh rèm được đặt theo phối cảnh cạnh trên của cửa sổ. Thanh treo có lớp riêng, phần vải mới có chuyển động; cả hai thuộc cùng mặt phẳng với tranh lớp học.
- Đã bỏ vùng `clip-path` quanh xấp ảnh. Ảnh trong từng Polaroid dùng `contain` để giữ đủ ảnh gốc. Cả 5 tấm trong xấp nằm trong giới hạn khung ở 1024×768 và 390×844.
- Tất cả cảnh nằm trong một canvas thiết kế, được thu phóng đồng đều. Laptop/máy chiếu dùng 1600×900, điện thoại dọc dùng bố cục 900×1440. Tranh, chữ bảng, đồng hồ, rèm và nút thư cùng dùng mặt phẳng lớp học.
- Khi thay đổi giữa 1366×768, 1440×900, 1024×768 và 1920×1080, tọa độ chữ trên bảng so với tranh giữ ở x=57%, y=27% (sai số chỉ do làm tròn pixel).
- Đã xác nhận khung nằm trọn viewport và chữ ký nằm trên điều hướng ở 320×568, 375×667, 390×844, 844×390, 1024×768, 1366×768, 1440×900, 1920×1080.
- Đã đi qua cả 13 lời chúc trên điện thoại 320×568, không có lời chúc đè lên điều hướng.
- Nút Xem ngang và Trở về xem dọc hoạt động; chọn ảnh khi đang xoay và trở về dọc vẫn giữ nguyên nội dung.
- Bản build mới được kiểm tra trực tiếp qua URL Cloudflare đã bàn giao.
- Ảnh chụp mới: `window-responsive.jpg`, `gallery-responsive.jpg`, `gallery-phone.jpg`.

## Ghép rèm theo phối cảnh cửa sổ

- Thay phép nghiêng CSS đơn giản bằng phép chiếu phối cảnh qua bốn mốc trên tranh gốc. Hai đầu thanh treo khớp cạnh dưới của đà gỗ; hai mốc gấu rèm đi theo chiều sâu cửa sổ.
- Thanh treo và móc nối được vẽ riêng theo đúng độ dốc của đà. Chỉ phần vải chuyển động, giữ mép treo cố định.
- Bài kiểm tra mới xác nhận cả bốn điểm giữ đúng vị trí ở khung ngang và khung dọc. `npm test` hiện có 6 bài kiểm tra đạt.

# Gửi người gieo nắng · 20/11

Website tri ân thầy cô bằng HTML, CSS và JavaScript, với tranh màu nước được tạo riêng. Không cần tài khoản, API key, cơ sở dữ liệu hoặc thư viện JavaScript khi chạy web. Font, ảnh và video đều nằm trong dự án, không gọi CDN khi xem.

## Xem trên máy

Cần Node.js 20 trở lên. Trong thư mục dự án:

```sh
npm run dev
```

Mở **http://127.0.0.1:4173**. Không cần `npm install` vì dự án không có dependency. Có thể dùng `python -m http.server 4173` thay thế. Hãy chạy qua HTTP thay vì mở trực tiếp tệp HTML để trình duyệt tải JavaScript module và SVG đầy đủ.

```sh
npm test
npm run build
npm run preview
```

`dist/` là bản website hoàn chỉnh để deploy. `npm run preview` phục vụ bản build ở cùng cổng 4173; dừng máy chủ dev trước khi chạy preview.

## Vercel

1. Đưa thư mục dự án lên repository GitHub.
2. Import repository trong Vercel. Chọn framework **Other**.
3. Build command: `npm run build`. Output directory: `dist`. Không cần biến môi trường.
4. Deploy. Tệp `vercel.json` đã khai báo hai thiết lập này.

## GitHub Pages

1. Đưa source lên nhánh `main` của repository GitHub.
2. Vào **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Chạy workflow **Deploy to GitHub Pages** hoặc push commit lên `main`.
4. Workflow tạo `dist/` và xuất bản lên Pages. Xem URL trong kết quả job `deploy`.

Tất cả đường dẫn dùng dạng tương đối, hoạt động cả tại domain gốc và đường dẫn `/ten-repository/`. Không cần cấu hình base URL hay SPA rewrite. Nếu dùng nhánh khác `main`, sửa `branches` trong `.github/workflows/pages.yml`.

## Hành trình

1. **Mở màn:** rèm nhung màu nước, biểu ngữ 20/11 và hoa trắng; chạm vào sân khấu hoặc nhấn Enter để bắt đầu.
2. **Lớp học:** rèm kéo sang hai phía trong khoảng 2 giây; cây, rèm voan, hoa, bóng nắng và bụi sáng chuyển động. Nhấn thư trên bàn giáo viên.
3. **Phong thư:** thư bay lên theo đường cong; nhấn phong thư hoặc dấu sáp để mở nắp 3D.
4. **Xấp ảnh:** 5 ảnh thật xòe ra hình quạt; các nút số bên dưới cho phép chọn trực tiếp cả 13 ảnh. Chọn ảnh bất kỳ làm điểm bắt đầu.
5. **Ký ức:** ảnh được giữ nguyên tỉ lệ trong Polaroid, hoa nở quanh góc, lời chúc hiện từng dòng. Luân phiên 5 kiểu xuất hiện: bay chéo, lật mở nhẹ, trượt lên, lộ dần và xoay hạ xuống. “Ký ức tiếp theo” xem lần lượt các ảnh còn lại rồi vòng qua các ảnh trước điểm bắt đầu; mỗi hành trình xem đủ 13 ảnh, mỗi ảnh đúng một lần.
6. **Video và kết:** nhấn Play để xem phim. Khi phát hết, khung video thu về thư, nắp thư đóng, thư trở về bàn và rèm khép. Chạm lại để xem từ đầu. Có nút “Khép lá thư” nếu muốn kết thúc sớm.

Âm thanh mặc định tắt; nút loa bật các nốt nhạc nhẹ được tổng hợp trực tiếp. Nhạc nền tạm dừng khi phát video. Nút toàn màn hình phụ thuộc hỗ trợ trình duyệt. Nút vòng tròn mũi tên đưa về màn đầu ở bất kỳ cảnh nào. Hỗ trợ Tab/Enter, phím phải để sang ảnh và Escape để trở về xấp ảnh. Tôn trọng `prefers-reduced-motion` và tạm dừng chuyển động/âm thanh khi tab bị ẩn.

## Kích thước màn hình và xem ngang

Laptop và máy chiếu dùng khung cảnh 16:9 được thu phóng đồng đều, có khoảng trống bên ngoài khi tỉ lệ màn hình khác. Điện thoại dọc dùng bố cục dọc riêng. Tranh lớp học, chữ trên bảng, đồng hồ, rèm và phong thư cùng nằm trên một mặt phẳng tọa độ, giữ nguyên tương quan khi thay đổi kích thước cửa sổ.

Nút hình điện thoại xoay ở thanh trên mở chế độ **Xem ngang**. Trên điện thoại đang để dọc, toàn bộ khung cảnh được xoay 90 độ để có thể xem ngang; nút “Trở về xem dọc” thoát chế độ này. Cách này không cần quyền khóa hướng màn hình. Nếu xoay thiết bị thật sang ngang, khung cảnh tự thích ứng theo kích thước mới.

`src/viewport.js` tính kích thước khung cảnh; `src/responsive.css` định nghĩa hai bố cục. Ảnh trong xấp dùng `contain`, giữ toàn bộ ảnh gốc và chừa nền giấy khi tỉ lệ khác khung. Không còn vùng cắt quanh xấp ảnh; thân túi thư che tự nhiên phần đuôi ảnh đưa vào thư.

## Đổi lời chúc, ảnh và video

- Sửa `src/content.js`: mỗi phần tử `memories` gồm `src`, `title`, `caption` và `lines`. `caption` cũng được dùng làm mô tả ảnh. Các lời chúc hiện tại là nội dung mẫu để bạn cá nhân hóa, không phải trích dẫn của người trong ảnh.
- Sửa `dedication.signature` để đổi chữ ký chung. Tiêu đề màn đầu và tiêu đề trang nằm trong `index.html`.
- Ảnh hiển thị nằm trong `media/`, được tối ưu thành WebP từ đủ 13 ảnh gốc trong `sources/images/`. Ảnh gốc được giữ nguyên. Trang chi tiết dùng `object-fit: contain` để giữ toàn bộ ảnh, bao gồm các trang viết tay.
- Video nằm ở `media/ky-niem.mp4`; ảnh chờ là `media/video-poster.jpg`. Nếu đổi tên tệp, cập nhật các đường dẫn trong `index.html` và phần kiểm tra video của `scripts/build.mjs`. Video gốc MOV đã được chuyển sang H.264/AAC, có fast-start để phát trên các trình duyệt phổ biến.
- Chạy lại `npm run build` sau mỗi thay đổi rồi deploy.

## Tài nguyên và thiết kế

- `sources/scene/`: phác thảo luồng; `sources/template/`: tham chiếu theme; `sources/tem2/`: các mẫu scene chi tiết.
- `assets/curtain.webp`: chất liệu rèm từ mẫu `sources/tem2/s1.png`, tách thành hai lớp bằng CSS; biểu ngữ và hoa là các lớp độc lập.
- `assets/classroom-painting.webp`: lớp học được tạo mới theo phong cách màu nước và nét chì của màn đầu. Phiên bản cuối đã giảm phần loang màu, giữ tường và đồ gỗ có mảng màu đều. Không dùng tranh lớp học của dự án cũ.
- `assets/botanical-painting.webp`, `assets/paper-painting.webp`, `assets/sheer-painting.webp`, `assets/books-painting.webp`: bộ hoa, giấy, rèm voan và sách được tạo riêng theo cùng phong cách. Xem prompt và nguồn trong `docs/art-direction.md`.
- `src/watercolor.css`: giao diện thống nhất cho các cảnh; `src/motion.js`: các kiểu xuất hiện của ảnh.
- Phong thư có 3 lớp xếp chồng rõ ràng: mặt sau và nắp (dưới), ảnh (giữa), túi thư (trên). Ảnh khi hover vẫn nằm sau thân túi; phần ảnh thấp hơn miệng thư được che kín.
- Noto Sans được kế thừa từ dự án cũ; Lora và Dancing Script được đóng gói từ Google Fonts với giấy phép OFL trong `assets/fonts/`.

Thư mục `sources/`, các contact sheet và tài liệu phát triển không được đưa vào `dist/`. Bản deploy chỉ chứa website và tài nguyên thực sự sử dụng.

## Tự diễn hoạt

Mở nút **Tự diễn hoạt** ở góc dưới bên phải để chỉnh thời gian chờ trước khi nhấn, giữ hover, dừng xem ảnh và dừng xem tranh. Đơn vị là giây; thiết lập trước khi bắt đầu. Khi chạy, bảng điều khiển tự ẩn. Nhấn **Bắt đầu từ cảnh rèm** để chạy cả hành trình. Nhấn **Dừng**, phím Esc hoặc chạm vào trang để trở lại thao tác thủ công.

Diễn hoạt tự vào toàn màn hình khi bắt đầu bằng nút. Nếu mở link `?demo=1` và trình duyệt chặn Fullscreen API do chưa có thao tác người dùng, web vẫn tự chạy với cảnh phủ kín cửa sổ; nút **Vào toàn màn hình** cho phép chuyển sang toàn màn hình thật bằng một lần nhấn. Con trỏ hoa và các điều khiển vẫn hoạt động trong toàn màn hình.

Để mở link và chạy ngay mà không nhấn nút, thêm query vào địa chỉ local hoặc Cloudflare:

```text
http://localhost:4173/?demo=1&click=1.2&hover=0.9&photo=3&art=3
```

- `click`: thời gian chờ trước mỗi lần nhấn; `hover`: thời gian giữ hover trên ảnh và nút.
- `photo`: thời gian xem mỗi ảnh kỷ niệm; `art`: thời gian xem mỗi tranh phóng lớn.
- Hệ thống luôn chờ hiệu ứng chuyển cảnh, ảnh và chữ hoàn tất trước khi đi tiếp, kể cả khi đặt thời gian chờ bằng 0.
- Hover thumbnail: **1 → 3 → 5 → 4 → 2 → 1**, sau đó mở ảnh đầu tiên.
- Hover tranh: **1 → 6 → 8 → 3 → 4 → 7 → 2 → 5**. Sau đó hover và mở từng tranh theo **6 → 3 → 2 → 5 → 4 → 8 → 1 → 7**, hover nút đóng và thu tranh về trước khi mở tranh tiếp theo.
- Diễn hoạt gọi cùng các nút thật; CSS hover dùng chung cho chuột và con trỏ diễn hoạt. Thời gian chuyển cảnh không bị rút ngắn bởi cấu hình tốc độ nhấn.
- Con trỏ là bông hoa nhỏ 15px, bay giữa các mục tiêu theo đường cong Bézier có gia tốc mượt. Khi chờ hoặc hover, hoa vẫn lượn nhẹ quanh mục tiêu; cánh hoa 2–3px rơi chậm đi kèm. Các hạt được giới hạn số lượng và dọn khi dừng; chế độ giảm chuyển động tắt hạt và nhịp lượn.
- Khi diễn hoạt, nhạc nền và tiếng chuyển scene được tắt. Video cuối tự bật âm thanh. Nếu mở link tự chạy mà trình duyệt chặn video có tiếng, nhấn nút Phát để tiếp tục.
- Sau video, phần kết chạy chậm hơn, chờ lời cảm ơn rồi mới khép rèm. Hành trình dừng ở màn đầu sau một lượt.



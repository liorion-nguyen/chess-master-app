# 🧠 **BrainyChess – Ứng dụng học cờ vua thông minh**

> Học – Luyện tập – Thách đấu  
> Ứng dụng học cờ vua tương tác cho mọi lứa tuổi

## [DEMO - DRIVE LINK](https://drive.google.com/file/d/1azxoiTlM9Lv0U_rkweUYaxxzshCCcqIN/view?usp=sharing)
## [DOWNLOAD APK](https://drive.google.com/file/d/1yIup-KFJjwkK245lMng9-ZbI3AU6lynH/view?usp=sharing)

---

## 📸 Ảnh minh họa giao diện

![Ảnh tổng quan giao diện](https://res.cloudinary.com/dubmd1vq9/image/upload/v1752130146/16dbe284-975f-4d2c-99f3-960951dea018.png)

---

## 🧩 Tính năng chính

### 1. 📚 **Thư viện Bài học Cờ vua**
- Phân cấp bài học: Cơ bản, Trung cấp, Nâng cao
- Hiển thị nội dung học kèm hình ảnh minh họa
- Làm bài tập kéo-thả & lựa chọn nước đi đúng
- Trắc nghiệm sau bài học có chấm điểm & phản hồi

![Màn hình bài học](https://res.cloudinary.com/dubmd1vq9/image/upload/v1752130211/f99cdab8-e25c-4561-bc18-468866e94119.png)

---

### 2. 🤖 **Đấu với AI**
- Chọn cấp độ AI: Dễ – Trung bình – Khó
- Phản hồi chiến thuật sau trận đấu (tuỳ chọn)
- Lưu lại kết quả và cập nhật điểm tích lũy

![Đấu với AI](https://res.cloudinary.com/dks2uuwb6/image/upload/v1749379961/6_nnfmpf.png)

---

### 3. 🏆 **Thành tích & Gamification**
- Hệ thống huy hiệu khi đạt các cột mốc học tập
- Bảng xếp hạng theo tuần/tháng để tạo động lực

![Huy hiệu và BXH](https://res.cloudinary.com/dks2uuwb6/image/upload/v1749379961/7_yb1we1.png)

---

### 4. ⚙️ **Quản trị nội dung (Admin)**
- Quản lý bài học: thêm/sửa/xoá nội dung
- Quản lý quiz & thế cờ thực hành
- Quản lý người dùng: khoá/mở tài khoản, xem tiến trình


## 🏗️ Công nghệ phát triển

| Thành phần | Công nghệ |
|------------|-----------|
| Backend    | NestJS    |
| Database   | PostgreSQL |
| ORM        | Prisma    |
| Upload     | Cloudinary / S3 |
| Mobile     | Expo (Prebuild Workflow) |
| Realtime   | WebSocket (tuỳ chọn PvP tương lai) |

---

## 🚀 Khởi chạy dự án

### 📱 Mobile App (Expo)
```bash
npm install
npx expo start

# Student Deadline Tracker

Ứng dụng quản lý deadline bài tập dành cho sinh viên, được xây dựng bằng React, TypeScript và Redux Toolkit.

## 1. Công nghệ sử dụng

* React + TypeScript
* Vite
* Redux Toolkit
* React Redux
* JSON Server
* Vitest

## 2. Chức năng

1. Hiển thị danh sách bài tập.
2. Thêm bài tập mới.
3. Đánh dấu hoàn thành hoặc bỏ hoàn thành.
4. Xóa bài tập.
5. Lọc theo Tất cả, Chưa hoàn thành, Quá hạn và Đã hoàn thành.
6. Hiển thị số ngày còn lại hoặc quá hạn.
7. Lấy dữ liệu mẫu từ API khi khởi động.

Ngoài ra, ứng dụng có thống kê và nhóm bài tập theo môn học.

## 3. Kiến thức áp dụng

**TypeScript nâng cao:** Generic, Utility Types, Type Guard.

**React Design Pattern:** Custom Hook và Compound Component.

**Redux Toolkit:** Feature-based structure, typed hooks, createSlice, createAsyncThunk và createSelector.

## 4. Hướng dẫn cài đặt

```bash
npm install
```

Chạy JSON Server:

```bash
npm run server
```

Mở terminal thứ hai và chạy React:

```bash
npm run dev
```

Truy cập địa chỉ localhost do Vite cung cấp.

## 5. Kiểm thử

```bash
npm run test:run
```

## 6. Build

```bash
npm run build
```

## 7. Cấu trúc project

```text
src/
├── app/
├── components/
├── features/
│   └── deadlines/
├── hooks/
├── types/
└── utils/
```

## 8. Giới hạn hiện tại

Ứng dụng tải dữ liệu ban đầu từ JSON Server. Các thao tác thêm, xóa và hoàn thành được cập nhật trong Redux Store, chưa đồng bộ ngược lên API. Khi tải lại trang, dữ liệu mẫu sẽ được lấy lại từ server.

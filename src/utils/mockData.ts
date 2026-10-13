import type { Deadline, Priority } from "../features/deadlines/deadlineTypes";

const SUBJECTS = [
  "Lập trình Web nâng cao",
  "Cơ sở dữ liệu",
  "Hệ điều hành",
  "Cấu trúc dữ liệu và giải thuật",
  "Mạng máy tính",
  "Phân tích thiết kế hệ thống",
  "Kiến trúc máy tính",
  "Trí tuệ nhân tạo",
  "An toàn thông tin",
  "Phát triển ứng dụng di động",
];

const TASK_TEMPLATES = [
  "Bài tập thực hành số",
  "Báo cáo tiến độ nhóm",
  "Làm bài kiểm tra giữa kỳ",
  "Nộp đồ án môn học",
  "Bài tập về nhà chương",
  "Slide thuyết trình chuyên đề",
  "Kiểm tra trắc nghiệm trực tuyến",
  "Viết tài liệu thiết kế hệ thống",
  "Cài đặt thuật toán nâng cao",
  "Review mã nguồn dự án",
];

const PRIORITIES: Priority[] = ["low", "medium", "high"];

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function generateMockDeadlines(count = 10000): Deadline[] {
  const result: Deadline[] = new Array(count);
  const now = new Date();
  const nowTimestamp = now.getTime();

  for (let i = 0; i < count; i++) {
    const subject = SUBJECTS[i % SUBJECTS.length];
    const template = TASK_TEMPLATES[i % TASK_TEMPLATES.length];
    const priority = PRIORITIES[i % PRIORITIES.length];

    // Trải dài từ -20 ngày (quá hạn) đến +40 ngày (tương lai)
    const dayOffset = (i % 60) - 20;
    const dueDateObj = new Date(nowTimestamp + dayOffset * 86400000);
    const dueDate = formatDate(dueDateObj);

    // Ngày tạo từ -40 ngày đến -21 ngày
    const createdOffset = -40 + (i % 20);
    const createdDateObj = new Date(nowTimestamp + createdOffset * 86400000);
    const createdAt = formatDate(createdDateObj);

    const completed = i % 4 === 0; // Khoảng 25% đã hoàn thành

    result[i] = {
      id: `mock-${i + 1}`,
      subject,
      title: `${template} ${Math.floor(i / SUBJECTS.length) + 1}`,
      dueDate,
      priority,
      completed,
      createdAt,
    };
  }

  return result;
}

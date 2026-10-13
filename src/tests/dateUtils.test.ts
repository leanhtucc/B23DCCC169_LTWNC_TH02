import {
  isOverdue,
  calcDaysLeft,
  getDaysRemaining,
  getDeadlineLabel,
  getLocalDateString,
} from "../utils/dateUtils";
import type { Deadline } from "../features/deadlines/deadlineTypes";

describe("dateUtils Unit Tests", () => {
  const baseDeadline: Deadline = {
    id: "test-1",
    subject: "Lập trình Web nâng cao",
    title: "Bài tập 1",
    dueDate: "2026-10-10",
    priority: "high",
    completed: false,
    createdAt: "2026-10-01",
  };

  const fixedToday = new Date("2026-10-13T00:00:00Z");

  describe("isOverdue", () => {
    test("1. Trả về true khi dueDate nhỏ hơn ngày hiện tại và completed = false", () => {
      const overdueDeadline: Deadline = {
        ...baseDeadline,
        dueDate: "2026-10-10",
        completed: false,
      };
      expect(isOverdue(overdueDeadline, fixedToday)).toBe(true);
    });

    test("2. Trả về false khi bài tập đã được đánh dấu completed = true kể cả khi dueDate đã qua", () => {
      const completedDeadline: Deadline = {
        ...baseDeadline,
        dueDate: "2026-10-10",
        completed: true,
      };
      expect(isOverdue(completedDeadline, fixedToday)).toBe(false);
    });

    test("3. Trả về false khi dueDate ở tương lai hoặc bằng ngày hôm nay", () => {
      const futureDeadline: Deadline = {
        ...baseDeadline,
        dueDate: "2026-10-20",
        completed: false,
      };
      expect(isOverdue(futureDeadline, fixedToday)).toBe(false);

      const todayDeadline: Deadline = {
        ...baseDeadline,
        dueDate: "2026-10-13",
        completed: false,
      };
      expect(isOverdue(todayDeadline, fixedToday)).toBe(false);
    });
  });

  describe("calcDaysLeft / getDaysRemaining", () => {
    test("Tính chính xác số ngày còn lại (dương cho tương lai, âm cho quá hạn, 0 cho hôm nay)", () => {
      // Tương lai 7 ngày
      expect(calcDaysLeft("2026-10-20", fixedToday)).toBe(7);
      expect(getDaysRemaining("2026-10-20", fixedToday)).toBe(7);

      // Quá hạn 3 ngày (-3)
      expect(calcDaysLeft("2026-10-10", fixedToday)).toBe(-3);
      expect(getDaysRemaining("2026-10-10", fixedToday)).toBe(-3);

      // Hôm nay (0)
      expect(calcDaysLeft("2026-10-13", fixedToday)).toBe(0);
      expect(getDaysRemaining("2026-10-13", fixedToday)).toBe(0);
    });
  });

  describe("getDeadlineLabel & getLocalDateString", () => {
    test("getDeadlineLabel trả về chuỗi mô tả chính xác theo trạng thái bài tập", () => {
      expect(getDeadlineLabel(baseDeadline, fixedToday)).toBe("Quá hạn 3 ngày");

      const completedDeadline: Deadline = { ...baseDeadline, completed: true };
      expect(getDeadlineLabel(completedDeadline, fixedToday)).toBe("Đã hoàn thành");

      const futureDeadline: Deadline = { ...baseDeadline, dueDate: "2026-10-15" };
      expect(getDeadlineLabel(futureDeadline, fixedToday)).toBe("Còn 2 ngày");

      const todayDeadline: Deadline = { ...baseDeadline, dueDate: "2026-10-13" };
      expect(getDeadlineLabel(todayDeadline, fixedToday)).toBe("Hạn nộp hôm nay");
    });

    test("getLocalDateString format date thành chuỗi YYYY-MM-DD", () => {
      expect(getLocalDateString(fixedToday)).toMatch(/^2026-10-1[34]$/);
    });
  });
});

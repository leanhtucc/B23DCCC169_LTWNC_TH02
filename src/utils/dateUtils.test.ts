import {
  isOverdue,
  calcDaysLeft,
  getDaysRemaining,
  getDeadlineLabel,
  getLocalDateString,
} from "./dateUtils";
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

    test("2. Trả về false khi bài tập đã đánh dấu completed = true kể cả khi đã quá hạn", () => {
      const completedDeadline: Deadline = {
        ...baseDeadline,
        dueDate: "2026-10-10",
        completed: true,
      };
      expect(isOverdue(completedDeadline, fixedToday)).toBe(false);
    });

    test("Trả về false khi bài tập chưa đến hạn (tương lai)", () => {
      const futureDeadline: Deadline = {
        ...baseDeadline,
        dueDate: "2026-10-20",
        completed: false,
      };
      expect(isOverdue(futureDeadline, fixedToday)).toBe(false);
    });
  });

  describe("calcDaysLeft / getDaysRemaining", () => {
    test("3. Tính đúng số ngày còn lại với ngày tương lai, quá khứ, và biên hôm nay", () => {
      // Tương lai: 13/10 đến 18/10 -> 5 ngày
      expect(calcDaysLeft("2026-10-18", fixedToday)).toBe(5);
      expect(getDaysRemaining("2026-10-18", fixedToday)).toBe(5);

      // Trường hợp biên: Hôm nay 13/10 -> 0 ngày
      expect(calcDaysLeft("2026-10-13", fixedToday)).toBe(0);

      // Quá khứ: 10/10 so với 13/10 -> -3 ngày
      expect(calcDaysLeft("2026-10-10", fixedToday)).toBe(-3);
    });
  });

  describe("getDeadlineLabel & getLocalDateString", () => {
    test("Trả về nhãn tương ứng theo trạng thái và số ngày còn lại", () => {
      expect(
        getDeadlineLabel({ ...baseDeadline, completed: true }, fixedToday)
      ).toBe("Đã hoàn thành");

      expect(
        getDeadlineLabel({ ...baseDeadline, dueDate: "2026-10-18", completed: false }, fixedToday)
      ).toBe("Còn 5 ngày");

      expect(
        getDeadlineLabel({ ...baseDeadline, dueDate: "2026-10-13", completed: false }, fixedToday)
      ).toBe("Hạn nộp hôm nay");

      expect(
        getDeadlineLabel({ ...baseDeadline, dueDate: "2026-10-10", completed: false }, fixedToday)
      ).toBe("Quá hạn 3 ngày");
    });

    test("getLocalDateString format đúng YYYY-MM-DD", () => {
      expect(getLocalDateString(new Date(2026, 9, 13))).toBe("2026-10-13");
    });
  });
});

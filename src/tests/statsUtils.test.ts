import { calcStats } from "../utils/statsUtils";
import type { Deadline } from "../features/deadlines/deadlineTypes";

describe("statsUtils Unit Tests", () => {
  const fixedToday = new Date("2026-10-13T00:00:00Z");

  test("4.1. calcStats xử lý an toàn mảng rỗng", () => {
    const result = calcStats([], fixedToday);
    expect(result).toEqual({
      total: 0,
      pending: 0,
      overdue: 0,
      completed: 0,
      bySubject: {},
    });
  });

  test("4.2. calcStats tính chính xác tổng số, chưa hoàn thành, quá hạn, đã hoàn thành và theo môn", () => {
    const deadlines: Deadline[] = [
      {
        id: "1",
        subject: "Web",
        title: "Bài 1",
        dueDate: "2026-10-10", // Quá hạn
        priority: "high",
        completed: false,
        createdAt: "2026-10-01",
      },
      {
        id: "2",
        subject: "Web",
        title: "Bài 2",
        dueDate: "2026-10-20", // Chưa đến hạn, pending
        priority: "medium",
        completed: false,
        createdAt: "2026-10-01",
      },
      {
        id: "3",
        subject: "CSDL",
        title: "Bài 3",
        dueDate: "2026-10-05", // Quá hạn nhưng đã xong -> completed
        priority: "low",
        completed: true,
        createdAt: "2026-10-01",
      },
    ];

    const result = calcStats(deadlines, fixedToday);
    expect(result.total).toBe(3);
    expect(result.completed).toBe(1);
    expect(result.pending).toBe(2);
    expect(result.overdue).toBe(1);
    expect(result.bySubject["Web"]).toBe(2);
    expect(result.bySubject["CSDL"]).toBe(1);
  });
});

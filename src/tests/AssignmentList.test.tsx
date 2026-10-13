import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AssignmentList } from "../features/deadlines/AssignmentList";
import type { Deadline } from "../features/deadlines/deadlineTypes";

describe("AssignmentList Async & State Tests", () => {
  const mockDeadlines: Deadline[] = [
    {
      id: "list-1",
      subject: "Toán rời rạc",
      title: "Bài tập đồ thị",
      dueDate: "2026-10-25",
      priority: "medium",
      completed: false,
      createdAt: "2026-10-01",
    },
    {
      id: "list-2",
      subject: "Kiến trúc máy tính",
      title: "Thực hành MIPS",
      dueDate: "2026-10-28",
      priority: "high",
      completed: true,
      createdAt: "2026-10-01",
    },
  ];

  const fixedToday = new Date("2026-10-13T00:00:00Z");

  test("11. Khi API đang ở trạng thái pending/loading -> hiển thị 'Đang tải dữ liệu...'", () => {
    render(
      <AssignmentList
        deadlines={[]}
        today={fixedToday}
        status="loading"
        onToggle={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByText("Đang tải dữ liệu...")).toBeInTheDocument();
  });

  test("12. Khi API nạp dữ liệu thành công -> render danh sách bài tập tương ứng", () => {
    render(
      <AssignmentList
        deadlines={mockDeadlines}
        today={fixedToday}
        status="succeeded"
        onToggle={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByText("Bài tập đồ thị")).toBeInTheDocument();
    expect(screen.getByText("Thực hành MIPS")).toBeInTheDocument();
    expect(screen.getByText(/Hiển thị/i)).toBeInTheDocument();
  });

  test("13. Khi API trả về lỗi -> hiển thị thông báo lỗi và nút 'Thử lại'", async () => {
    const handleRetry = jest.fn();
    const user = userEvent.setup();

    render(
      <AssignmentList
        deadlines={[]}
        today={fixedToday}
        status="failed"
        error="Lỗi kết nối máy chủ HTTP 500"
        onToggle={jest.fn()}
        onDelete={jest.fn()}
        onRetry={handleRetry}
      />
    );

    expect(
      screen.getByText("Lỗi kết nối máy chủ HTTP 500")
    ).toBeInTheDocument();

    const retryBtn = screen.getByRole("button", { name: "Thử lại" });
    expect(retryBtn).toBeInTheDocument();

    await user.click(retryBtn);
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });
});

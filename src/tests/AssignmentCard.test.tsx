import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AssignmentCard } from "../features/deadlines/AssignmentCard";
import type { Deadline } from "../features/deadlines/deadlineTypes";
import { usePinStore } from "../stores/usePinStore";

describe("AssignmentCard Component Tests", () => {
  const mockDeadline: Deadline = {
    id: "card-1",
    subject: "Lập trình Web nâng cao",
    title: "Bài tập lớn React",
    dueDate: "2026-10-25",
    priority: "high",
    completed: false,
    createdAt: "2026-10-01",
  };

  const fixedToday = new Date("2026-10-13T00:00:00Z");

  beforeEach(() => {
    // Reset Zustand store
    usePinStore.setState({ pinnedIds: [] });
  });

  test("6. Hiển thị đầy đủ tiêu đề, tên môn học, hạn nộp và huy hiệu độ ưu tiên", () => {
    render(
      <AssignmentCard
        deadline={mockDeadline}
        today={fixedToday}
        onToggle={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByText("Bài tập lớn React")).toBeInTheDocument();
    expect(screen.getByText("Lập trình Web nâng cao")).toBeInTheDocument();
    expect(screen.getByText("Hạn nộp: 2026-10-25")).toBeInTheDocument();
    expect(screen.getByText("Cao")).toBeInTheDocument();
  });

  test("7. Người dùng click nút 'Hoàn thành' -> kích hoạt callback onToggle với đúng ID", async () => {
    const handleToggle = jest.fn();
    const user = userEvent.setup();

    render(
      <AssignmentCard
        deadline={mockDeadline}
        today={fixedToday}
        onToggle={handleToggle}
        onDelete={jest.fn()}
      />
    );

    const toggleBtn = screen.getByRole("button", { name: "Hoàn thành" });
    await user.click(toggleBtn);

    expect(handleToggle).toHaveBeenCalledTimes(1);
    expect(handleToggle).toHaveBeenCalledWith("card-1");
  });

  test("8. Người dùng click nút 'Ghim' -> kích hoạt hàm ghim của usePinStore", async () => {
    const user = userEvent.setup();

    render(
      <AssignmentCard
        deadline={mockDeadline}
        today={fixedToday}
        onToggle={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    const pinBtn = screen.getByRole("button", { name: /Ghim/i });
    await user.click(pinBtn);

    // Kiểm tra state của usePinStore được cập nhật
    expect(usePinStore.getState().pinnedIds).toContain("card-1");

    // Click lần 2 -> bỏ ghim
    await user.click(screen.getByRole("button", { name: /Bỏ ghim/i }));
    expect(usePinStore.getState().pinnedIds).not.toContain("card-1");
  });
});

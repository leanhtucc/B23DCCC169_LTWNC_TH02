import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DeadlineForm } from "../features/deadlines/DeadlineForm";

describe("DeadlineForm Component Tests", () => {
  test("9. Validate lỗi khi submit form với các trường bị bỏ trống", async () => {
    const handleSubmit = jest.fn();
    const user = userEvent.setup();

    render(<DeadlineForm onSubmit={handleSubmit} onCancel={jest.fn()} />);

    const submitBtn = screen.getByRole("button", { name: "Thêm bài tập" });
    await user.click(submitBtn);

    // Không gọi onSubmit vì có lỗi validate
    expect(handleSubmit).not.toHaveBeenCalled();

    // Hiển thị các thông báo lỗi tương ứng
    expect(
      screen.getByText("Vui lòng nhập tên môn học")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Vui lòng nhập tên bài tập")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Vui lòng chọn hạn nộp")
    ).toBeInTheDocument();
  });

  test("10. Người dùng nhập dữ liệu hợp lệ và click submit -> gọi onSubmit với dữ liệu chuẩn xác", async () => {
    const handleSubmit = jest.fn();
    const user = userEvent.setup();

    render(<DeadlineForm onSubmit={handleSubmit} onCancel={jest.fn()} />);

    // Nhập tên môn học
    const subjectInput = screen.getByLabelText("Môn học");
    await user.type(subjectInput, "Cơ sở dữ liệu");

    // Nhập tên bài tập
    const titleInput = screen.getByLabelText("Tên bài tập");
    await user.type(titleInput, "Thiết kế ERD");

    // Nhập hạn nộp
    const dateInput = screen.getByLabelText("Hạn nộp");
    await user.type(dateInput, "2026-10-30");

    // Chọn độ ưu tiên
    const prioritySelect = screen.getByLabelText("Độ ưu tiên");
    await user.selectOptions(prioritySelect, "high");

    // Submit form
    const submitBtn = screen.getByRole("button", { name: "Thêm bài tập" });
    await user.click(submitBtn);

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith({
      subject: "Cơ sở dữ liệu",
      title: "Thiết kế ERD",
      dueDate: "2026-10-30",
      priority: "high",
    });
  });
});

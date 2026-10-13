import deadlinesReducer, {
  addDeadline,
  toggleComplete,
  deleteDeadline,
  setFilter,
  bulkLoadDeadlines,
  clearDeadlines,
  fetchDeadlines,
} from "./deadlinesSlice";
import type { DeadlinesState, Deadline } from "./deadlineTypes";

describe("deadlinesSlice Unit Tests", () => {
  const initialState: DeadlinesState = {
    items: [
      {
        id: "d-1",
        subject: "Web",
        title: "BTH 1",
        dueDate: "2026-10-20",
        priority: "high",
        completed: false,
        createdAt: "2026-10-01",
      },
    ],
    status: "succeeded",
    error: null,
    filter: "all",
  };

  test("5.1. addDeadline: Thêm bài tập mới vào store", () => {
    const action = addDeadline({
      subject: "CSDL",
      title: "Bài tập SQL",
      dueDate: "2026-10-25",
      priority: "medium",
    });

    const state = deadlinesReducer(initialState, action);
    expect(state.items).toHaveLength(2);
    expect(state.items[1].title).toBe("Bài tập SQL");
    expect(state.items[1].completed).toBe(false);
    expect(state.items[1].id).toBeDefined();
  });

  test("5.2. toggleComplete: Đảo trạng thái hoàn thành của bài tập", () => {
    const action = toggleComplete("d-1");
    const state = deadlinesReducer(initialState, action);
    expect(state.items[0].completed).toBe(true);

    // Toggle lần 2 -> false
    const state2 = deadlinesReducer(state, action);
    expect(state2.items[0].completed).toBe(false);
  });

  test("5.3. deleteDeadline: Xóa bài tập theo ID", () => {
    const action = deleteDeadline("d-1");
    const state = deadlinesReducer(initialState, action);
    expect(state.items).toHaveLength(0);
  });

  test("5.4. bulkLoadDeadlines: Nạp danh sách bài tập hàng loạt", () => {
    const bulkData: Deadline[] = [
      {
        id: "bulk-1",
        subject: "AI",
        title: "Model training",
        dueDate: "2026-11-01",
        priority: "high",
        completed: false,
        createdAt: "2026-10-01",
      },
      {
        id: "bulk-2",
        subject: "OS",
        title: "Process scheduling",
        dueDate: "2026-11-05",
        priority: "low",
        completed: true,
        createdAt: "2026-10-01",
      },
    ];

    const action = bulkLoadDeadlines(bulkData);
    const state = deadlinesReducer(initialState, action);
    expect(state.items).toHaveLength(2);
    expect(state.items[0].id).toBe("bulk-1");
    expect(state.status).toBe("succeeded");
  });

  test("5.5. clearDeadlines & setFilter: Xóa sạch dữ liệu và thay đổi filter", () => {
    const clearState = deadlinesReducer(initialState, clearDeadlines());
    expect(clearState.items).toHaveLength(0);

    const filterState = deadlinesReducer(initialState, setFilter("pending"));
    expect(filterState.filter).toBe("pending");
  });

  test("5.6. fetchDeadlines extraReducers: pending, fulfilled, rejected", () => {
    const pendingState = deadlinesReducer(initialState, {
      type: fetchDeadlines.pending.type,
    });
    expect(pendingState.status).toBe("loading");
    expect(pendingState.error).toBeNull();

    const fulfilledState = deadlinesReducer(initialState, {
      type: fetchDeadlines.fulfilled.type,
      payload: [],
    });
    expect(fulfilledState.status).toBe("succeeded");
    expect(fulfilledState.items).toEqual([]);

    const rejectedState = deadlinesReducer(initialState, {
      type: fetchDeadlines.rejected.type,
      payload: "Lỗi mạng",
      error: { message: "Lỗi mạng" },
    });
    expect(rejectedState.status).toBe("failed");
    expect(rejectedState.error).toBe("Lỗi mạng");
  });
});

import { Suspense, lazy, useEffect, useState, useMemo, useCallback } from "react";

import { StatsSkeleton } from "./features/deadlines/StatsSkeleton";
import { DeadlineForm } from "./features/deadlines/DeadlineForm";
import { DeadlineFilter } from "./features/deadlines/DeadlineFilter";
import { AssignmentList } from "./features/deadlines/AssignmentList";
import { fetchDeadlines } from "./features/deadlines/deadlinesSlice";
import { useDeadlineManager } from "./hooks/useDeadlineManager";
import { useToday } from "./hooks/useToday";
import { useDebounce } from "./hooks/useDebounce";
import { generateMockDeadlines } from "./utils/mockData";
import type { CreateDeadlineInput } from "./features/deadlines/deadlineTypes";
import { useAppDispatch } from "./app/hoos";
import { useTheme } from "./context/ThemeContext";

// Lazy loading cho thống kê (Code Splitting)
const DeadlineStats = lazy(() => import("./features/deadlines/DeadlineStats"));

function App() {
  const dispatch = useAppDispatch();
  const today = useToday();
  const { theme, toggleTheme } = useTheme();

  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Debounce tìm kiếm 300ms
  const debouncedSearch = useDebounce(searchQuery, 300);

  const {
    deadlines,
    allDeadlines,
    filter,
    status,
    error,
    handleAdd,
    handleToggle,
    handleDelete,
    handleFilter,
    handleBulkLoad,
    handleClear,
  } = useDeadlineManager(today);

  useEffect(() => {
    if (status === "idle") {
      void dispatch(fetchDeadlines());
    }
  }, [dispatch, status]);

  // Bộ lọc tìm kiếm kết hợp memoization
  const visibleDeadlines = useMemo(() => {
    if (!debouncedSearch.trim()) {
      return deadlines;
    }
    const query = debouncedSearch.toLowerCase().trim();
    return deadlines.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.subject.toLowerCase().includes(query)
    );
  }, [deadlines, debouncedSearch]);

  const handleSubmit = useCallback(
    (data: CreateDeadlineInput) => {
      handleAdd(data);
      setShowForm(false);
    },
    [handleAdd]
  );

  const handleRetry = useCallback(() => {
    void dispatch(fetchDeadlines());
  }, [dispatch]);

  const handleStressTest = useCallback(() => {
    const mock = generateMockDeadlines(10000);
    handleBulkLoad(mock);
  }, [handleBulkLoad]);

  const handleResetData = useCallback(() => {
    handleClear();
    void dispatch(fetchDeadlines());
  }, [handleClear, dispatch]);

  return (
    <main className="dashboard">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div>
            <span className="app-label">STUDENT PRODUCTIVITY</span>
            <h1>Student Deadline Tracker</h1>
            <p>Quản lý bài tập và theo dõi deadline của bạn.</p>
          </div>

          <div className="header-actions">
            <button
              type="button"
              className="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label="Chuyển đổi giao diện sáng tối"
              title={`Chuyển sang chế độ ${theme === "light" ? "tối" : "sáng"}`}
            >
              {theme === "light" ? "🌙 Chế độ tối" : "☀️ Chế độ sáng"}
            </button>

            <button
              type="button"
              className="btn-primary"
              disabled={status !== "succeeded"}
              onClick={() => setShowForm((value) => !value)}
            >
              {showForm ? "Đóng form" : "+ Thêm bài tập"}
            </button>
          </div>
        </header>

        {/* Bảng điều khiển hiệu năng & Stress test */}
        <div className="stress-test-toolbar">
          <div className="toolbar-info">
            <span className="dataset-indicator">
              Hiện có: <strong>{allDeadlines.length.toLocaleString("vi-VN")}</strong> bài tập
            </span>
          </div>

          <div className="toolbar-actions">
            <button
              type="button"
              className="btn-stress-test"
              onClick={handleStressTest}
              title="Tạo ngay 10.000 bài tập mẫu để kiểm tra Virtualization và Debounce"
            >
              ⚡ Tạo 10.000 bài tập mẫu
            </button>

            <button
              type="button"
              className="btn-reset-data"
              onClick={handleResetData}
              title="Đặt lại dữ liệu về ban đầu"
            >
              🔄 Đặt lại dữ liệu
            </button>
          </div>
        </div>

        {showForm && status === "succeeded" && (
          <DeadlineForm
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        )}

        {/* Tải lười (React.lazy + Suspense) cho khối thống kê */}
        <Suspense fallback={<StatsSkeleton />}>
          <DeadlineStats deadlines={allDeadlines} today={today} />
        </Suspense>

        <section className="deadline-section">
          <div className="section-header">
            <div>
              <h2>Danh sách bài tập</h2>
              <p>Theo dõi và tìm kiếm các deadline quan trọng.</p>
            </div>
          </div>

          {/* Thanh tìm kiếm phản hồi tức thì với useDebounce */}
          <div className="search-box-wrapper">
            <input
              type="text"
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 Tìm kiếm bài tập theo tiêu đề hoặc môn học (Debounce 300ms)..."
              aria-label="Tìm kiếm bài tập"
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchQuery("")}
                title="Xóa tìm kiếm"
              >
                ✕
              </button>
            )}
          </div>

          <DeadlineFilter value={filter} onChange={handleFilter} />

          <AssignmentList
            deadlines={visibleDeadlines}
            today={today}
            status={status}
            error={error}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onRetry={handleRetry}
          />
        </section>
      </div>
    </main>
  );
}

export default App;
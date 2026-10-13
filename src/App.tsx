import { useEffect, useState } from "react";

import { DeadlineStats } from "./features/deadlines/DeadlineStats";
import { DeadlineForm } from "./features/deadlines/DeadlineForm";
import { DeadlineFilter } from "./features/deadlines/DeadlineFilter";
import { DeadlineGroup } from "./features/deadlines/DeadlineGroup";
import { fetchDeadlines } from "./features/deadlines/deadlinesSlice";
import { useDeadlineManager } from "./hooks/useDeadlineManager";
import { useToday } from "./hooks/useToday";
import type { CreateDeadlineInput } from "./features/deadlines/deadlineTypes";
import { useAppDispatch } from "./app/hoos";
import { useTheme } from "./context/ThemeContext";

function App() {
  const dispatch = useAppDispatch();
  const today = useToday();
  const { theme, toggleTheme } = useTheme();

  const [showForm, setShowForm] = useState(false);

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
  } = useDeadlineManager(today);

  useEffect(() => {
    if (status === "idle") {
      void dispatch(fetchDeadlines());
    }
  }, [dispatch, status]);

  const handleSubmit = (data: CreateDeadlineInput) => {
    handleAdd(data);
    setShowForm(false);
  };

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

        {showForm && status === "succeeded" && (
          <DeadlineForm
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        )}

        <DeadlineStats deadlines={allDeadlines} today={today} />

        <section className="deadline-section">
          <div className="section-header">
            <div>
              <h2>Danh sách bài tập</h2>
              <p>Theo dõi các deadline quan trọng.</p>
            </div>
          </div>

          <DeadlineFilter value={filter} onChange={handleFilter} />

          {status === "loading" && (
            <div className="status-message">Đang tải dữ liệu...</div>
          )}

          {status === "failed" && (
            <div className="error-message">
              <p>{error}</p>
              <button
                type="button"
                onClick={() => {
                  void dispatch(fetchDeadlines());
                }}
              >
                Thử lại
              </button>
            </div>
          )}

          {status === "succeeded" && (
            <DeadlineGroup
              deadlines={deadlines}
              today={today}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          )}
        </section>
      </div>
    </main>
  );
}

export default App;
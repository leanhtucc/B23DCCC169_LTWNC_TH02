import { useMemo, useState } from "react";
import type { Deadline } from "./deadlineTypes";
import { isOverdue } from "../../utils/dateUtils";

export interface DeadlineStatsProps {
  deadlines: Deadline[];
  today: Date;
}

export interface SubjectStat {
  subject: string;
  total: number;
  completed: number;
  pending: number;
  overdue: number;
}

import { StatsSkeleton } from "./StatsSkeleton";
export { StatsSkeleton };

export function DeadlineStats({ deadlines, today }: DeadlineStatsProps) {
  const [showSubjectBreakdown, setShowSubjectBreakdown] = useState(false);

  const stats = useMemo(() => {
    let pendingCount = 0;
    let overdueCount = 0;
    let completedCount = 0;
    const subjectMap: Record<string, SubjectStat> = {};

    for (let i = 0; i < deadlines.length; i++) {
      const item = deadlines[i];
      const overdue = isOverdue(item, today);

      if (item.completed) {
        completedCount++;
      } else {
        pendingCount++;
        if (overdue) {
          overdueCount++;
        }
      }

      if (!subjectMap[item.subject]) {
        subjectMap[item.subject] = {
          subject: item.subject,
          total: 0,
          completed: 0,
          pending: 0,
          overdue: 0,
        };
      }

      subjectMap[item.subject].total++;
      if (item.completed) {
        subjectMap[item.subject].completed++;
      } else {
        subjectMap[item.subject].pending++;
        if (overdue) {
          subjectMap[item.subject].overdue++;
        }
      }
    }

    const subjectStats = Object.values(subjectMap).sort(
      (a, b) => b.total - a.total
    );

    return {
      total: deadlines.length,
      pending: pendingCount,
      overdue: overdueCount,
      completed: completedCount,
      subjectStats,
    };
  }, [deadlines, today]);

  return (
    <section className="stats-section">
      <div className="stats-grid">
        <div className="stat-card">
          <span>Tổng bài tập</span>
          <strong>{stats.total.toLocaleString("vi-VN")}</strong>
        </div>

        <div className="stat-card">
          <span>Chưa hoàn thành</span>
          <strong>{stats.pending.toLocaleString("vi-VN")}</strong>
        </div>

        <div className="stat-card stat-danger">
          <span>Quá hạn</span>
          <strong>{stats.overdue.toLocaleString("vi-VN")}</strong>
        </div>

        <div className="stat-card stat-success">
          <span>Đã hoàn thành</span>
          <strong>{stats.completed.toLocaleString("vi-VN")}</strong>
        </div>
      </div>

      {stats.subjectStats.length > 0 && (
        <div className="subject-breakdown-wrapper">
          <button
            type="button"
            className="btn-toggle-stats"
            onClick={() => setShowSubjectBreakdown((prev) => !prev)}
          >
            {showSubjectBreakdown
              ? "▲ Thu gọn phân bổ theo môn học"
              : `▼ Xem phân bổ chi tiết theo ${stats.subjectStats.length} môn học`}
          </button>

          {showSubjectBreakdown && (
            <div className="subject-stats-table-wrapper">
              <table className="subject-stats-table">
                <thead>
                  <tr>
                    <th>Môn học</th>
                    <th>Tổng bài</th>
                    <th>Đã xong</th>
                    <th>Còn lại</th>
                    <th>Quá hạn</th>
                    <th>Tiến độ</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.subjectStats.map((item) => {
                    const percent =
                      item.total > 0
                        ? Math.round((item.completed / item.total) * 100)
                        : 0;
                    return (
                      <tr key={item.subject}>
                        <td><strong>{item.subject}</strong></td>
                        <td>{item.total}</td>
                        <td className="text-success">{item.completed}</td>
                        <td>{item.pending}</td>
                        <td className="text-danger">{item.overdue}</td>
                        <td>
                          <div className="progress-bar-container">
                            <div
                              className="progress-bar-fill"
                              style={{ width: `${percent}%` }}
                            />
                            <span>{percent}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default DeadlineStats;
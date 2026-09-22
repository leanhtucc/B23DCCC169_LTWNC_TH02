import { useMemo } from "react";

import type { Deadline } from "./deadlineTypes";

import { isOverdue } from "../../utils/dateUtils";

interface DeadlineStatsProps {
    deadlines: Deadline[];
    today: Date;
}

export function DeadlineStats({
    deadlines,
    today,
}: DeadlineStatsProps) {
    const stats = useMemo(() => {
        return {
            total: deadlines.length,

            pending: deadlines.filter(
                (item) => !item.completed
            ).length,

            overdue: deadlines.filter(
                (item) => isOverdue(item, today)
            ).length,

            completed: deadlines.filter(
                (item) => item.completed
            ).length,
        };
    }, [deadlines, today]);

    return (
        <section className="stats-grid">
            <div className="stat-card">
                <span>Tổng bài tập</span>
                <strong>{stats.total}</strong>
            </div>

            <div className="stat-card">
                <span>Chưa hoàn thành</span>
                <strong>{stats.pending}</strong>
            </div>

            <div className="stat-card stat-danger">
                <span>Quá hạn</span>
                <strong>{stats.overdue}</strong>
            </div>

            <div className="stat-card stat-success">
                <span>Đã hoàn thành</span>
                <strong>{stats.completed}</strong>
            </div>
        </section>
    );
}
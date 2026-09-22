import { useMemo } from "react";

import { Accordion } from "../../components/Accordion";

import { useDeadline } from "../../hooks/useDeadline";

import type { Deadline } from "./deadlineTypes";

interface DeadlineGroupProps {
    deadlines: Deadline[];
    today: Date;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}

interface DeadlineItemProps {
    deadline: Deadline;
    today: Date;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}

const priorityLabels = {
    low: "Thấp",
    medium: "Trung bình",
    high: "Cao",
};

function DeadlineItem({
    deadline,
    today,
    onToggle,
    onDelete,
}: DeadlineItemProps) {
    const {
        label,
        isOverdue,
    } = useDeadline(deadline, today);

    const handleDelete = () => {
        const confirmed = window.confirm(
            `Bạn có chắc muốn xóa "${deadline.title}"?`
        );

        if (confirmed) {
            onDelete(deadline.id);
        }
    };

    return (
        <article
            className={`deadline-item ${deadline.completed
                ? "deadline-completed"
                : ""
                }`}
        >
            <div className="deadline-item-info">
                <div className="deadline-title-row">
                    <h3>{deadline.title}</h3>

                    <span
                        className={`priority-badge priority-${deadline.priority}`}
                    >
                        {priorityLabels[deadline.priority]}
                    </span>
                </div>

                <p>
                    Hạn nộp: {deadline.dueDate}
                </p>

                <p
                    className={
                        isOverdue
                            ? "deadline-overdue"
                            : "deadline-label"
                    }
                >
                    {label}
                </p>
            </div>

            <div className="deadline-actions">
                <button
                    type="button"
                    onClick={() =>
                        onToggle(deadline.id)
                    }
                >
                    {deadline.completed
                        ? "Bỏ hoàn thành"
                        : "Hoàn thành"}
                </button>

                <button
                    type="button"
                    className="btn-delete"
                    onClick={handleDelete}
                >
                    Xóa
                </button>
            </div>
        </article>
    );
}

export function DeadlineGroup({
    deadlines,
    today,
    onToggle,
    onDelete,
}: DeadlineGroupProps) {
    const groupedDeadlines = useMemo(() => {
        const groups: Record<
            string,
            Deadline[]
        > = {};

        deadlines.forEach((deadline) => {
            const subject = deadline.subject;

            if (!groups[subject]) {
                groups[subject] = [];
            }

            groups[subject].push(deadline);
        });

        return groups;
    }, [deadlines]);

    const subjects = Object.keys(
        groupedDeadlines
    );

    if (subjects.length === 0) {
        return (
            <div className="empty-state">
                <h3>Không có bài tập</h3>

                <p>
                    Hãy thêm bài tập mới hoặc thay đổi
                    bộ lọc.
                </p>
            </div>
        );
    }

    return (
        <Accordion defaultValue={subjects[0]}>
            {subjects.map((subject) => (
                <Accordion.Item
                    key={subject}
                    value={subject}
                >
                    <Accordion.Trigger>
                        {subject} (
                        {groupedDeadlines[subject].length}
                        )
                    </Accordion.Trigger>

                    <Accordion.Content>
                        {groupedDeadlines[subject].map(
                            (deadline) => (
                                <DeadlineItem
                                    key={deadline.id}
                                    deadline={deadline}
                                    today={today}
                                    onToggle={onToggle}
                                    onDelete={onDelete}
                                />
                            )
                        )}
                    </Accordion.Content>
                </Accordion.Item>
            ))}
        </Accordion>
    );
}
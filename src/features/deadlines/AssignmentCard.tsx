import React, { memo } from "react";
import { useDeadline } from "../../hooks/useDeadline";
import { usePinStore } from "../../stores/usePinStore";
import type { Deadline } from "./deadlineTypes";

export interface AssignmentCardProps {
  deadline: Deadline;
  today: Date;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onPin?: (id: string) => void;
}

const priorityLabels = {
  low: "Thấp",
  medium: "Trung bình",
  high: "Cao",
};

export const AssignmentCard: React.FC<AssignmentCardProps> = memo(
  function AssignmentCard({ deadline, today, onToggle, onDelete, onPin }) {
    const { label, isOverdue } = useDeadline(deadline, today);
    const togglePin = usePinStore((state) => state.togglePin);
    const isPinned = usePinStore((state) => state.pinnedIds.includes(deadline.id));

    const handleDelete = () => {
      const confirmed = window.confirm(
        `Bạn có chắc muốn xóa "${deadline.title}"?`
      );

      if (confirmed) {
        onDelete(deadline.id);
      }
    };

    const handlePin = () => {
      togglePin(deadline.id);
      onPin?.(deadline.id);
    };

    return (
      <article
        className={`deadline-item ${
          deadline.completed ? "deadline-completed" : ""
        } ${isPinned ? "is-pinned" : ""}`}
        data-testid={`assignment-card-${deadline.id}`}
      >
        <div className="deadline-item-info">
          <div className="deadline-title-row">
            <h3>{deadline.title}</h3>

            <span className="deadline-subject-tag">{deadline.subject}</span>

            <span className={`priority-badge priority-${deadline.priority}`}>
              {priorityLabels[deadline.priority]}
            </span>

            {isPinned && (
              <span className="pin-badge" title="Bài tập được ghim lên đầu">
                📌 Đã ghim
              </span>
            )}
          </div>

          <p className="deadline-due-date">Hạn nộp: {deadline.dueDate}</p>

          <p className={isOverdue ? "deadline-overdue" : "deadline-label"}>
            {label}
          </p>
        </div>

        <div className="deadline-actions">
          <button
            type="button"
            className={`btn-pin ${isPinned ? "btn-pinned-active" : ""}`}
            onClick={handlePin}
            title={isPinned ? "Bỏ ghim bài tập" : "Ghim bài tập lên đầu"}
            aria-label={isPinned ? "Bỏ ghim" : "Ghim"}
          >
            📌 {isPinned ? "Bỏ ghim" : "Ghim"}
          </button>

          <button
            type="button"
            onClick={() => onToggle(deadline.id)}
            aria-label={deadline.completed ? "Bỏ hoàn thành" : "Hoàn thành"}
          >
            {deadline.completed ? "Bỏ hoàn thành" : "Hoàn thành"}
          </button>

          <button
            type="button"
            className="btn-delete"
            onClick={handleDelete}
            aria-label="Xóa"
          >
            Xóa
          </button>
        </div>
      </article>
    );
  }
);

AssignmentCard.displayName = "AssignmentCard";
export default AssignmentCard;

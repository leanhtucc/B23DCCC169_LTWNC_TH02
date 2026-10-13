import React, { useState, useCallback } from "react";
import { FixedSizeList, type ListChildComponentProps } from "react-window";
import type { Deadline, LoadingStatus } from "./deadlineTypes";
import { AssignmentCard } from "./AssignmentCard";
import { DeadlineGroup } from "./DeadlineGroup";

export interface AssignmentListProps {
  deadlines: Deadline[];
  today: Date;
  status?: LoadingStatus;
  error?: string | null;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onPin?: (id: string) => void;
  onRetry?: () => void;
}

const ITEM_HEIGHT = 135;
const LIST_HEIGHT = 600;

export const AssignmentList: React.FC<AssignmentListProps> = ({
  deadlines,
  today,
  status = "succeeded",
  error = null,
  onToggle,
  onDelete,
  onPin,
  onRetry,
}) => {
  // Tự động kích hoạt ảo hóa khi số lượng bài tập vượt quá ngưỡng lớn (vd: > 50 bài)
  const isLargeDataset = deadlines.length > 50;
  const [useVirtualization, setUseVirtualization] = useState<boolean>(() => {
    return isLargeDataset;
  });

  const isVirtualActive = isLargeDataset || useVirtualization;

  const Row = useCallback(
    ({ index, style }: ListChildComponentProps) => {
      const item = deadlines[index];
      if (!item) return null;

      return (
        <div style={style} className="virtual-row-container">
          <AssignmentCard
            deadline={item}
            today={today}
            onToggle={onToggle}
            onDelete={onDelete}
            onPin={onPin}
          />
        </div>
      );
    },
    [deadlines, today, onToggle, onDelete, onPin]
  );

  // Trạng thái Loading (phục vụ Async Test & UX)
  if (status === "loading") {
    return <div className="status-message">Đang tải dữ liệu...</div>;
  }

  // Trạng thái Failed (phục vụ Async Test & UX)
  if (status === "failed") {
    return (
      <div className="error-message">
        <p>{error ?? "Không thể tải dữ liệu"}</p>
        {onRetry && (
          <button type="button" onClick={onRetry}>
            Thử lại
          </button>
        )}
      </div>
    );
  }

  // Danh sách rỗng
  if (deadlines.length === 0) {
    return (
      <div className="empty-state">
        <h3>Không có bài tập</h3>
        <p>Hãy thêm bài tập mới hoặc thay đổi bộ lọc.</p>
      </div>
    );
  }

  return (
    <div className="assignment-list-container">
      <div className="list-controls-bar">
        <div className="list-stats-info">
          <span>
            Hiển thị <strong>{deadlines.length.toLocaleString("vi-VN")}</strong> bài tập
          </span>
          {isVirtualActive && (
            <span className="virtualization-badge" title="Đang render bằng react-window (60 FPS)">
              ⚡ Ảo hóa (Virtualization FixedSizeList) đang Bật
            </span>
          )}
        </div>

        {!isLargeDataset && (
          <button
            type="button"
            className="btn-toggle-view"
            onClick={() => setUseVirtualization((prev) => !prev)}
          >
            {useVirtualization ? "Chuyển sang Xem theo môn" : "Chuyển sang Xem ảo hóa"}
          </button>
        )}
      </div>

      {isVirtualActive ? (
        <div className="virtual-list-wrapper">
          <FixedSizeList
            height={Math.min(LIST_HEIGHT, deadlines.length * ITEM_HEIGHT)}
            itemCount={deadlines.length}
            itemSize={ITEM_HEIGHT}
            width="100%"
            className="virtual-scroll-viewport"
          >
            {Row}
          </FixedSizeList>
        </div>
      ) : (
        <DeadlineGroup
          deadlines={deadlines}
          today={today}
          onToggle={onToggle}
          onDelete={onDelete}
          onPin={onPin}
        />
      )}
    </div>
  );
};

export default AssignmentList;

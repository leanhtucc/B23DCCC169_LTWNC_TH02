import { useMemo } from "react";
import { Accordion } from "../../components/Accordion";
import { usePinStore } from "../../stores/usePinStore";
import { AssignmentCard } from "./AssignmentCard";
import type { Deadline } from "./deadlineTypes";

interface DeadlineGroupProps {
  deadlines: Deadline[];
  today: Date;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onPin?: (id: string) => void;
}

export function DeadlineGroup({
  deadlines,
  today,
  onToggle,
  onDelete,
  onPin,
}: DeadlineGroupProps) {
  const pinnedIds = usePinStore((state) => state.pinnedIds);

  const groupedDeadlines = useMemo(() => {
    const groups: Record<string, Deadline[]> = {};

    deadlines.forEach((deadline) => {
      const subject = deadline.subject;
      if (!groups[subject]) {
        groups[subject] = [];
      }
      groups[subject].push(deadline);
    });

    // Sắp xếp bài tập trong từng môn: bài ghim luôn lên đầu
    Object.keys(groups).forEach((subject) => {
      groups[subject].sort((a, b) => {
        const aPinned = pinnedIds.includes(a.id) ? 1 : 0;
        const bPinned = pinnedIds.includes(b.id) ? 1 : 0;
        if (aPinned !== bPinned) {
          return bPinned - aPinned;
        }
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
    });

    return groups;
  }, [deadlines, pinnedIds]);

  // Sắp xếp môn học: môn có bài ghim ưu tiên hiển thị trước
  const subjects = useMemo(() => {
    return Object.keys(groupedDeadlines).sort((a, b) => {
      const aHasPinned = groupedDeadlines[a].some((item) =>
        pinnedIds.includes(item.id)
      )
        ? 1
        : 0;
      const bHasPinned = groupedDeadlines[b].some((item) =>
        pinnedIds.includes(item.id)
      )
        ? 1
        : 0;
      if (aHasPinned !== bHasPinned) {
        return bHasPinned - aHasPinned;
      }
      return a.localeCompare(b);
    });
  }, [groupedDeadlines, pinnedIds]);

  if (subjects.length === 0) {
    return (
      <div className="empty-state">
        <h3>Không có bài tập</h3>
        <p>Hãy thêm bài tập mới hoặc thay đổi bộ lọc.</p>
      </div>
    );
  }

  return (
    <Accordion defaultValue={subjects[0]}>
      {subjects.map((subject) => {
        const subjectItems = groupedDeadlines[subject];
        const pinnedCount = subjectItems.filter((d) =>
          pinnedIds.includes(d.id)
        ).length;

        return (
          <Accordion.Item key={subject} value={subject}>
            <Accordion.Trigger>
              <span>
                {subject} ({subjectItems.length})
                {pinnedCount > 0 && (
                  <span className="subject-pinned-count">
                    {" "}• 📌 {pinnedCount} đã ghim
                  </span>
                )}
              </span>
            </Accordion.Trigger>

            <Accordion.Content>
              {subjectItems.map((deadline) => (
                <AssignmentCard
                  key={deadline.id}
                  deadline={deadline}
                  today={today}
                  onToggle={onToggle}
                  onDelete={onDelete}
                  onPin={onPin}
                />
              ))}
            </Accordion.Content>
          </Accordion.Item>
        );
      })}
    </Accordion>
  );
}
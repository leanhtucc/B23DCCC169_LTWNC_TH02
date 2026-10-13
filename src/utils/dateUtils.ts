import type { Deadline } from "../features/deadlines/deadlineTypes";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function toDayNumber(dateString: string): number {
  const [year, month, day] = dateString
    .split("-")
    .map(Number);

  return Math.floor(
    Date.UTC(year, month - 1, day) / MS_PER_DAY
  );
}


function getTodayDayNumber(now: Date): number {
  return Math.floor(
    Date.UTC(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ) / MS_PER_DAY
  );
}

export function getDaysRemaining(
  dueDate: string,
  now: Date = new Date()
): number {
  return (
    toDayNumber(dueDate) -
    getTodayDayNumber(now)
  );
}

export const calcDaysLeft = getDaysRemaining;

export function getLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function isOverdue(
  deadline: Deadline,
  now: Date = new Date()
): boolean {
  return (
    !deadline.completed &&
    getDaysRemaining(deadline.dueDate, now) < 0
  );
}

export function getDeadlineLabel(
  deadline: Deadline,
  now: Date = new Date()
): string {
  if (deadline.completed) {
    return "Đã hoàn thành";
  }

  const days = getDaysRemaining(
    deadline.dueDate,
    now
  );

  if (days > 0) {
    return `Còn ${days} ngày`;
  }

  if (days < 0) {
    return `Quá hạn ${Math.abs(days)} ngày`;
  }

  return "Hạn nộp hôm nay";
}
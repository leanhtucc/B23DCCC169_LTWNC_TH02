import type {
  Deadline,
  Priority,
} from "../features/deadlines/deadlineTypes";

export function isRecord(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

export function isPriority(
  value: unknown
): value is Priority {
  return (
    value === "low" ||
    value === "medium" ||
    value === "high"
  );
}

export function isDateString(
  value: unknown
): value is string {
  if (typeof value !== "string") {
    return false;
  }
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return false;
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function isDeadline(
  value: unknown
): value is Deadline {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    value.id.trim().length > 0 &&
    typeof value.subject === "string" &&
    value.subject.trim().length > 0 &&
    typeof value.title === "string" &&
    value.title.trim().length > 0 &&
    isDateString(value.dueDate) &&
    isPriority(value.priority) &&
    typeof value.completed === "boolean" &&
    isDateString(value.createdAt)
  );
}

export function isDeadlineArray(
  value: unknown
): value is Deadline[] {
  return (
    Array.isArray(value) &&
    value.every(isDeadline)
  );
}
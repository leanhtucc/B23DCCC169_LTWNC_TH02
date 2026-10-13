import type { Deadline } from "../features/deadlines/deadlineTypes";
import { isOverdue } from "./dateUtils";

export interface DeadlineStatsResult {
  total: number;
  pending: number;
  overdue: number;
  completed: number;
  bySubject: Record<string, number>;
}

export function calcStats(
  deadlines: Deadline[],
  now: Date = new Date()
): DeadlineStatsResult {
  const result: DeadlineStatsResult = {
    total: deadlines.length,
    pending: 0,
    overdue: 0,
    completed: 0,
    bySubject: {},
  };

  for (const item of deadlines) {
    if (item.completed) {
      result.completed++;
    } else {
      result.pending++;
      if (isOverdue(item, now)) {
        result.overdue++;
      }
    }

    result.bySubject[item.subject] =
      (result.bySubject[item.subject] || 0) + 1;
  }

  return result;
}

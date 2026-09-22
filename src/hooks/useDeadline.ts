import { useMemo } from "react";

import type { Deadline } from "../features/deadlines/deadlineTypes";

import {
  getDaysRemaining,
  getDeadlineLabel,
  isOverdue,
} from "../utils/dateUtils";

export function useDeadline(
  deadline: Deadline,
  today: Date
) {
  return useMemo(() => {
    return {
      daysRemaining: getDaysRemaining(
        deadline.dueDate,
        today
      ),

      label: getDeadlineLabel(deadline, today),

      isOverdue: isOverdue(deadline, today),

      isCompleted: deadline.completed,
    };
  }, [deadline, today]);
}
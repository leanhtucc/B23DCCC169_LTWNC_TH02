import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "../../app/store";

import { isOverdue } from "../../utils/dateUtils";

export const selectDeadlines = (
  state: RootState
) => state.deadlines.items;

export const selectDeadlineFilter = (
  state: RootState
) => state.deadlines.filter;

export const selectDeadlineStatus = (
  state: RootState
) => state.deadlines.status;

export const selectDeadlineError = (
  state: RootState
) => state.deadlines.error;

export const selectFilteredDeadlines = createSelector(
  [
    selectDeadlines,

    selectDeadlineFilter,

    (_state: RootState, today: Date) =>
      today.getTime(),
  ],

  (deadlines, filter, timestamp) => {
    const today = new Date(timestamp);

    switch (filter) {
      case "pending":
        return deadlines.filter(
          (item) => !item.completed
        );

      case "overdue":
        return deadlines.filter(
          (item) => isOverdue(item, today)
        );

      case "completed":
        return deadlines.filter(
          (item) => item.completed
        );

      case "all":
      default:
        return deadlines;
    }
  }
);
import { useCallback } from "react";

import type {
  CreateDeadlineInput,
  DeadlineFilter,
} from "../features/deadlines/deadlineTypes";

import {
  addDeadline,
  deleteDeadline,
  setFilter,
  toggleComplete,
} from "../features/deadlines/deadlinesSlice";

import {
  selectDeadlineError,
  selectDeadlineFilter,
  selectDeadlineStatus,
  selectDeadlines,
  selectFilteredDeadlines,
} from "../features/deadlines/deadlineSelectors";
import { useAppDispatch, useAppSelector } from "../app/hoos";

export function useDeadlineManager(today: Date) {
  const dispatch = useAppDispatch();

  const deadlines = useAppSelector((state) =>
    selectFilteredDeadlines(state, today)
  );

  const allDeadlines = useAppSelector(
    selectDeadlines
  );

  const filter = useAppSelector(
    selectDeadlineFilter
  );

  const status = useAppSelector(
    selectDeadlineStatus
  );

  const error = useAppSelector(
    selectDeadlineError
  );

  const handleAdd = useCallback(
    (data: CreateDeadlineInput) => {
      dispatch(addDeadline(data));
    },
    [dispatch]
  );

  const handleToggle = useCallback(
    (id: string) => {
      dispatch(toggleComplete(id));
    },
    [dispatch]
  );

  const handleDelete = useCallback(
    (id: string) => {
      dispatch(deleteDeadline(id));
    },
    [dispatch]
  );

  const handleFilter = useCallback(
    (value: DeadlineFilter) => {
      dispatch(setFilter(value));
    },
    [dispatch]
  );

  return {
    deadlines,
    allDeadlines,
    filter,
    status,
    error,
    handleAdd,
    handleToggle,
    handleDelete,
    handleFilter,
  };
}
import { useCallback, useMemo } from "react";

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
import { usePinStore } from "../stores/usePinStore";

export function useDeadlineManager(today: Date) {
  const dispatch = useAppDispatch();
  const pinnedIds = usePinStore((state) => state.pinnedIds);

  const rawDeadlines = useAppSelector((state) =>
    selectFilteredDeadlines(state, today)
  );

  const deadlines = useMemo(() => {
    return [...rawDeadlines].sort((a, b) => {
      const aPinned = pinnedIds.includes(a.id) ? 1 : 0;
      const bPinned = pinnedIds.includes(b.id) ? 1 : 0;
      if (aPinned !== bPinned) {
        return bPinned - aPinned;
      }
      return 0;
    });
  }, [rawDeadlines, pinnedIds]);

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
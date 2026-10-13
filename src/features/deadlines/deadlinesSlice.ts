import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type {
  CreateDeadlineInput,
  Deadline,
  DeadlineFilter,
  DeadlinesState,
} from "./deadlineTypes";

import { getDeadlines } from "./deadlinesApi";
import { getLocalDateString } from "../../utils/dateUtils";

export const fetchDeadlines = createAsyncThunk<
  Deadline[],
  void,
  { rejectValue: string }
>(
  "deadlines/fetchAll",

  async (_, { rejectWithValue }) => {
    try {
      return await getDeadlines();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Không thể tải danh sách bài tập";

      return rejectWithValue(message);
    }
  }
);

const initialState: DeadlinesState = {
  items: [],
  status: "idle",
  error: null,
  filter: "all",
};

const deadlinesSlice = createSlice({
  name: "deadlines",
  initialState,
  reducers: {
    addDeadline(
      state,
      action: PayloadAction<CreateDeadlineInput>
    ) {
      const newDeadline: Deadline = {
        ...action.payload,
        id: crypto.randomUUID(),
        completed: false,
        createdAt: getLocalDateString(new Date()),
      };
      state.items.push(newDeadline);
    },
    toggleComplete(
      state,
      action: PayloadAction<string>
    ) {
      const deadline = state.items.find(
        (item) => item.id === action.payload
      );

      if (deadline) {
        deadline.completed = !deadline.completed;
      }
    },
    deleteDeadline(
      state,
      action: PayloadAction<string>
    ) {
      state.items = state.items.filter(
        (item) => item.id !== action.payload
      );
    },
    setFilter(
      state,
      action: PayloadAction<DeadlineFilter>
    ) {
      state.filter = action.payload;
    },
    bulkLoadDeadlines(
      state,
      action: PayloadAction<Deadline[]>
    ) {
      state.items = action.payload;
      state.status = "succeeded";
      state.error = null;
    },
    clearDeadlines(state) {
      state.items = [];
      state.status = "succeeded";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeadlines.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(
        fetchDeadlines.fulfilled,
        (state, action) => {
          state.status = "succeeded";
          state.items = action.payload;
        }
      )

      .addCase(
        fetchDeadlines.rejected,
        (state, action) => {
          state.status = "failed";

          state.error =
            action.payload ??
            action.error.message ??
            "Lỗi không xác định";
        }
      );
  },
});

export const {
  addDeadline,
  toggleComplete,
  deleteDeadline,
  setFilter,
  bulkLoadDeadlines,
  clearDeadlines,
} = deadlinesSlice.actions;

export default deadlinesSlice.reducer;

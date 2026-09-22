import { configureStore } from "@reduxjs/toolkit";
import deadlinesReducer from "../features/deadlines/deadlinesSlice"

export const store = configureStore({
    reducer: {
        deadlines: deadlinesReducer,
    },
    devTools: true,
});

export type RootState = ReturnType<
    typeof store.getState
>;

export type AppDispatch = typeof store.dispatch;
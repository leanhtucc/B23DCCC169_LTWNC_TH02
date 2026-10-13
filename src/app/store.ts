import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import deadlinesReducer from "../features/deadlines/deadlinesSlice";

export const store = configureStore({
  reducer: {
    deadlines: deadlinesReducer,
  },
  middleware: (getDefaultMiddleware) => {
    const middlewares = getDefaultMiddleware();
    if (import.meta.env.DEV) {
      middlewares.push(logger);
    }
    return middlewares;
  },
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
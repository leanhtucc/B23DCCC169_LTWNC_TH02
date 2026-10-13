import { configureStore, type Middleware } from "@reduxjs/toolkit";
import reduxLogger from "redux-logger";
import deadlinesReducer from "../features/deadlines/deadlinesSlice";

// Xử lý an toàn tương thích giữa CommonJS & ESM trong môi trường Vite/Node
type ReduxLoggerModule = {
  logger?: Middleware;
  default?: Middleware;
  createLogger?: () => Middleware;
};

const rawLogger = reduxLogger as unknown as ReduxLoggerModule;

const loggerMiddleware: Middleware | null =
  typeof reduxLogger === "function"
    ? (reduxLogger as unknown as Middleware)
    : typeof rawLogger?.logger === "function"
    ? rawLogger.logger
    : typeof rawLogger?.default === "function"
    ? rawLogger.default
    : typeof rawLogger?.createLogger === "function"
    ? rawLogger.createLogger()
    : null;

export const store = configureStore({
  reducer: {
    deadlines: deadlinesReducer,
  },
  middleware: (getDefaultMiddleware) => {
    const middlewares = getDefaultMiddleware();
    if (import.meta.env.DEV && loggerMiddleware) {
      return middlewares.concat(loggerMiddleware);
    }
    return middlewares;
  },
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
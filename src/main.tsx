import { StrictMode } from "react";

import { createRoot } from "react-dom/client";

import { Provider } from "react-redux";

import { store } from "./app/store";

import App from "./App";

import "./index.css";

// Tìm phần tử root trong index.html
const root = document.getElementById("root");

if (!root) {
  throw new Error("Không tìm thấy phần tử root");
}

// Khởi chạy React
createRoot(root).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
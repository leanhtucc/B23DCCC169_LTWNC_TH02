import type { Deadline } from "./deadlineTypes";

import { isDeadlineArray } from "../../utils/typeGuards";

const API_URL = "http://localhost:3001/deadlines";

export async function getDeadlines(): Promise<Deadline[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(
      `Không thể tải bài tập. HTTP ${response.status}`
    );
  }

  const data: unknown = await response.json();

  if (!isDeadlineArray(data)) {
    throw new Error("Dữ liệu API không đúng định dạng");
  }

  return data;
}
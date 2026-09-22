export type Priority =
  | "low"
  | "medium"
  | "high";

export type DeadlineFilter =
  | "all"
  | "pending"
  | "overdue"
  | "completed";

export interface Deadline {
  id: string;
  subject: string;
  title: string;
  dueDate: string;
  priority: Priority;
  completed: boolean;
  createdAt: string;
}

export type CreateDeadlineInput = Omit<
  Deadline,
  "id" | "completed" | "createdAt"
>;

export type UpdateDeadlineInput = Partial<
  CreateDeadlineInput
>;

export type LoadingStatus =
  | "idle"
  | "loading"
  | "succeeded"
  | "failed";

export interface DeadlinesState {
  items: Deadline[];
  status: LoadingStatus;
  error: string | null;
  filter: DeadlineFilter;
}
export const FILTER_STATUS_OPTIONS = [
  { value: "", label: "Tat ca" },
  { value: "initial", label: "Initial" },
  { value: "doing", label: "Doing" },
  { value: "finish", label: "Finish" },
];

export const TASK_STATUS_OPTIONS = FILTER_STATUS_OPTIONS.filter((status) => status.value);

export const AUTH_STORAGE_KEYS = {
  token: "token",
  email: "userEmail",
  displayName: "displayName",
};

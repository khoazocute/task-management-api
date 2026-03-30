import { apiRequest } from "./apiClient";

export function getTasks(query) {
  const search = new URLSearchParams();

  if (query.keyword) search.set("keyword", query.keyword);
  if (query.status) search.set("status", query.status);
  if (query.page) search.set("page", String(query.page));

  return apiRequest(`/tasks?${search.toString()}`);
}

export function createTask(payload) {
  return apiRequest("/tasks/create", {
    method: "POST",
    body: payload,
  });
}

export function updateTask(taskId, payload) {
  return apiRequest(`/tasks/edit/${taskId}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteTask(taskId) {
  return apiRequest(`/tasks/delete/${taskId}`, {
    method: "DELETE",
  });
}

export function changeTaskStatus(taskId, status) {
  return apiRequest(`/tasks/change-status/${taskId}`, {
    method: "PATCH",
    body: { status },
  });
}

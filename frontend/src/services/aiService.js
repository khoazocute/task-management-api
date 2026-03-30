import { apiRequest } from "./apiClient";

export function sendAiMessage(payload) {
  return apiRequest("/ai/chat", {
    method: "POST",
    body: payload,
  });
}

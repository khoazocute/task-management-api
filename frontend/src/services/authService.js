import { apiRequest } from "./apiClient";
import { AUTH_STORAGE_KEYS } from "../utils/constants";

export async function login(credentials) {
  const result = await apiRequest("/users/login", {
    method: "POST",
    body: credentials,
  });

  const token = result.data?.token || "";
  const user = result.data?.user || null;

  localStorage.setItem(AUTH_STORAGE_KEYS.token, token);
  localStorage.setItem(AUTH_STORAGE_KEYS.email, credentials.email);
  localStorage.setItem(
    AUTH_STORAGE_KEYS.displayName,
    user?.fullName || credentials.email
  );

  return {
    ...result,
    token,
    user,
  };
}

export function register(payload) {
  return apiRequest("/users/register", {
    method: "POST",
    body: payload,
  });
}

export function forgotPassword(email) {
  return apiRequest("/users/forgot-password", {
    method: "POST",
    body: { email },
  });
}

export function resetPassword(payload) {
  return apiRequest("/users/reset-password", {
    method: "POST",
    body: payload,
  });
}

export function logout() {
  localStorage.removeItem(AUTH_STORAGE_KEYS.token);
  localStorage.removeItem(AUTH_STORAGE_KEYS.email);
  localStorage.removeItem(AUTH_STORAGE_KEYS.displayName);
}

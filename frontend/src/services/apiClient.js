// Day la dia chi goc cua backend.
// Neu co VITE_API_URL trong file .env thi frontend se dung gia tri do.
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

export function getApiBaseUrl() {
  return API_BASE_URL;
}

export async function apiRequest(path, options = {}) {
  // Ham dung chung de cac service goi backend bang cung mot cau truc.
  const requestOptions = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include",
  };

  if (options.body !== undefined) {
    requestOptions.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, requestOptions);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || "Request failed");
  }

  return data;
}

/* Thin fetch wrapper for the QueueSmart backend (server/). */

class ApiRequestError extends Error {
  constructor(message, fieldErrors) {
    super(message);
    this.fieldErrors = fieldErrors || {};
  }
}

async function request(path, { method = "GET", body, token } = {}) {
  const res = await fetch(`/api${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiRequestError(data.message || "Request failed.", data.errors);
  }

  return data;
}

export function registerUser({ email, password, role }) {
  return request("/auth/register", { method: "POST", body: { email, password, role } });
}

export function loginUser({ email, password }) {
  return request("/auth/login", { method: "POST", body: { email, password } });
}

export function fetchServices(token) {
  return request("/services", { token });
}

export function createService(token, payload) {
  return request("/services", { method: "POST", body: payload, token });
}

export function updateService(token, id, payload) {
  return request(`/services/${id}`, { method: "PUT", body: payload, token });
}

export function fetchNotifications(token) {
  return request("/notifications", { token });
}

export function markNotificationRead(token, id) {
  return request(`/notifications/${id}/read`, { method: "POST", token });
}

export function fetchHistory(token) {
  return request("/history", { token });
}

export { ApiRequestError };

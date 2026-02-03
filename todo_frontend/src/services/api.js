import { getApiBaseUrl } from "../config";

class ApiError extends Error {
  constructor({ status, message, details }) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

function buildUrl(path) {
  const base = getApiBaseUrl();
  if (!base) return "";
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

async function parseJsonSafely(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function request(path, options) {
  const url = buildUrl(path);
  if (!url) {
    throw new ApiError({
      message:
        "Backend URL is not configured. Set REACT_APP_API_BASE (preferred) or REACT_APP_BACKEND_URL.",
    });
  }

  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const body = await parseJsonSafely(res);
    throw new ApiError({
      status: res.status,
      message: `API request failed (${res.status})`,
      details: body,
    });
  }

  return parseJsonSafely(res);
}

// PUBLIC_INTERFACE
export const tasksApi = {
  /** Fetch all tasks. */
  async list() {
    const data = await request("/tasks", { method: "GET" });
    return Array.isArray(data) ? data : [];
  },

  /** Create a new task with a title. */
  async create(title) {
    return request("/tasks", {
      method: "POST",
      body: JSON.stringify({ title }),
    });
  },

  /** Patch a task title and/or completed status. */
  async update(id, patch) {
    return request(`/tasks/${encodeURIComponent(String(id))}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
  },

  /** Delete a task by id. */
  async remove(id) {
    return request(`/tasks/${encodeURIComponent(String(id))}`, {
      method: "DELETE",
    });
  },
};

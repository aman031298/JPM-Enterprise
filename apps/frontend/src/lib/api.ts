const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

function getAuthToken() {
  return typeof window !== "undefined" ? localStorage.getItem("jpm-auth-token") : null;
}

async function request<T>(path: string, init?: RequestInit) {
  const headers = new Headers(init?.headers);
  const token = getAuthToken();

  if (!(init?.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message ?? "Request failed");
  }

  if (response.status === 204) {
    return null as T;
  }

  const payload = (await response.json()) as ApiEnvelope<T>;
  return payload.data;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
  upload: <T>(path: string, body: FormData) =>
    request<T>(path, { method: "POST", body }),
  async download(path: string, filename: string) {
    const token = getAuthToken();
    const headers = new Headers();
    if (token) headers.set("Authorization", `Bearer ${token}`);

    const response = await fetch(`${API_URL}${path}`, { headers });
    if (!response.ok) {
      throw new Error("Export failed");
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }
};

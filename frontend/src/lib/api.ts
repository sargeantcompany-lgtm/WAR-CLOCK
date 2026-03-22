import type {
  AdminConflict,
  ConflictDetail,
  ConflictListItem,
  GlobalCounter,
} from "./types";

const PRODUCTION_API_BASE_URL =
  "https://superb-eagerness-production.up.railway.app/api";

function getApiBaseUrl() {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
    return PRODUCTION_API_BASE_URL;
  }

  return "http://localhost:8080/api";
}

export const API_BASE_URL = getApiBaseUrl();

type FetchOptions = RequestInit & {
  adminToken?: string;
};

async function request<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (options.adminToken) {
    headers.set("x-admin-token", options.adminToken);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response) {
    throw new Error("No response received from API");
  }

  const data = (await response.json().catch(() => null)) as
    | { error?: { message?: string } }
    | null;

  if (!response.ok) {
    throw new Error(data?.error?.message ?? "Request failed");
  }

  return data as T;
}

export const api = {
  getConflicts: async () =>
    request<{ conflicts: ConflictListItem[] }>("/conflicts"),

  getConflict: async (slug: string) =>
    request<{ conflict: ConflictDetail }>(`/conflicts/${slug}`),

  getGlobalCounter: async () => request<GlobalCounter>("/global-counter"),

  getAdminConflicts: async (adminToken: string) =>
    request<{ conflicts: AdminConflict[] }>("/admin/conflicts", { adminToken }),

  createConflict: async (adminToken: string, payload: Record<string, unknown>) =>
    request("/admin/conflicts", {
      method: "POST",
      adminToken,
      body: JSON.stringify(payload),
    }),

  createCasualty: async (
    adminToken: string,
    conflictId: number,
    payload: Record<string, unknown>,
  ) =>
    request(`/admin/conflicts/${conflictId}/casualties`, {
      method: "POST",
      adminToken,
      body: JSON.stringify(payload),
    }),

  createSource: async (
    adminToken: string,
    conflictId: number,
    payload: Record<string, unknown>,
  ) =>
    request(`/admin/conflicts/${conflictId}/sources`, {
      method: "POST",
      adminToken,
      body: JSON.stringify(payload),
    }),

  createSnapshot: async (
    adminToken: string,
    conflictId: number,
    payload: Record<string, unknown>,
  ) =>
    request(`/admin/conflicts/${conflictId}/snapshots`, {
      method: "POST",
      adminToken,
      body: JSON.stringify(payload),
    }),
};

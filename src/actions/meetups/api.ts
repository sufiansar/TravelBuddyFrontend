import { getSession } from "next-auth/react";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_API;

export async function makeApiCall<T>(
  endpoint: string,
  options: RequestInit = {},
  requireAuth = true
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (requireAuth) {
    const session = await getSession();
    if (session?.accessToken) {
      headers.Authorization = `Bearer ${session.accessToken}`;
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `API call failed: ${response.statusText}`
    );
  }

  return response.json();
}

export const api = {
  meetups: {
    getAll: (filters?: any, options?: any) =>
      makeApiCall(
        `/meetups?${new URLSearchParams({ ...filters, ...options }).toString()}`
      ),

    getSingle: (id: string) => makeApiCall(`/meetups/${id}`),

    create: (data: any) =>
      makeApiCall("/meetups", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    update: (id: string, data: any) =>
      makeApiCall(`/meetups/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      makeApiCall(`/meetups/${id}`, {
        method: "DELETE",
      }),

    join: (id: string) =>
      makeApiCall(`/meetups/${id}/join`, {
        method: "POST",
      }),

    leave: (id: string) =>
      makeApiCall(`/meetups/${id}/leave`, {
        method: "POST",
      }),

    getMembers: (id: string) => makeApiCall(`/meetups/${id}/members`),
  },
};

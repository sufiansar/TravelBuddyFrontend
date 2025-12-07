"use server";

import { getUserSession } from "@/helpers/userSession";
import { revalidateTag } from "next/cache";

const BASE_API =
  process.env.NEXT_PUBLIC_BASE_API || "http://localhost:5000/api";

// ============ PUBLIC API CALLS (No Authentication Required) ============

export const makePublicApiCall = async (
  url: string,
  options: RequestInit = {}
) => {
  try {
    const response = await fetch(`${BASE_API}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const data = await response.json();

    return {
      ok: response.ok,
      status: response.status,
      data,
      error: !response.ok ? data?.message : null,
    };
  } catch (error) {
    console.error("Public API call error:", error);
    return {
      ok: false,
      status: 500,
      data: null,
      error: "Network error or failed to fetch",
    };
  }
};

// ============ PRIVATE API CALLS (Authentication Required) ============

export const getAuthHeaders = async (includeContentType: boolean = true) => {
  const session = await getUserSession();

  if (!session?.user?.id) {
    throw new Error("You must be logged in to perform this action");
  }

  const headers: Record<string, string> = {};

  if (includeContentType) {
    headers["Content-Type"] = "application/json";
  }

  const accessToken = (session as { accessToken?: string }).accessToken;
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  return { headers, session };
};

export const makePrivateApiCall = async (
  url: string,
  options: RequestInit = {}
) => {
  try {
    const { headers, session } = await getAuthHeaders(
      !options.body || typeof options.body === "string"
    );

    const response = await fetch(`${BASE_API}${url}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    const data = await response.json();

    return {
      ok: response.ok,
      status: response.status,
      data,
      error: !response.ok ? data?.message : null,
      session,
    };
  } catch (error) {
    console.error("Private API call error:", error);
    return {
      ok: false,
      status: 500,
      data: null,
      error: "Network error or failed to fetch",
      session: null,
    };
  }
};

export const makeApiCall = async (url: string, options: RequestInit) => {
  const response = await fetch(url, options);
  const result = await response.json();

  return {
    ok: response.ok,
    status: response.status,
    data: result,
  };
};

export const processArrayField = async (
  field: string | null
): Promise<string[]> => {
  if (!field) return [];
  return field
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
};

export const revalidateCache = async (type: string) => {
  revalidateTag("api", type);
};

export const uploadImage = async (file: File): Promise<string | null> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${BASE_API}/upload`, {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const result = await res.json();
      return result?.data?.fileUrl || null;
    }

    return null;
  } catch {
    return null;
  }
};

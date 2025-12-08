"use server";

import { getUserSession } from "@/helpers/userSession";

const BASE_API =
  process.env.NEXT_PUBLIC_BASE_API || "http://localhost:5000/api";

interface ApiOptions extends RequestInit {
  params?: Record<string, string>;
}

export async function makeApiCall(
  endpoint: string,
  options: ApiOptions = {},
  requireAuth: boolean = false
) {
  const { params, ...fetchOptions } = options;

  let url = `${BASE_API}${endpoint}`;
  if (params) {
    const queryString = new URLSearchParams(params).toString();
    url += `?${queryString}`;
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (requireAuth) {
    const session = await getUserSession();

    const token = session?.accessToken;

    if (!token || token === "") {
      console.error("API Call Error: No token found in session", {
        hasSession: Boolean(session),
        sessionKeys: session ? Object.keys(session) : [],
        hasAccessToken: Boolean(session?.accessToken),
        accessTokenValue: session?.accessToken,
        fullSession: session,
      });
      throw new Error("jwt must be provided");
    }

    // Set both common casings and cookie since backend reads from cookie
    headers.Authorization = `Bearer ${token}`;
    headers.authorization = `Bearer ${token}`;
    headers.Cookie = `accessToken=${token}`;
    console.log(
      "Authorization header set:",
      headers.Authorization.substring(0, 30) + "..."
    );
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

export async function uploadFile(
  endpoint: string,
  formData: FormData,
  requireAuth: boolean = true
) {
  const url = `${BASE_API}${endpoint}`;
  const headers: Record<string, string> = {};

  if (requireAuth) {
    const session = await getUserSession();
    const token = session?.accessToken;

    if (!token) {
      console.error("Upload Error: No token found in session", {
        hasSession: Boolean(session),
        hasAccessToken: Boolean(session?.accessToken),
      });
      throw new Error("jwt must be provided");
    }

    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Upload failed" }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

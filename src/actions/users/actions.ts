"use server";

import { makeApiCall } from "@/actions/shared/apiClient";

export async function getMyProfile() {
  try {
    console.log("getMyProfile - Calling /auth/me endpoint");

    const result = await makeApiCall("/auth/me", {}, true);

    console.log("getMyProfile - API response:", {
      resultType: typeof result,
      resultKeys: Object.keys(result),
      fullResult: result,
    });

    const data = (result as any)?.data ?? result;
    const user = (data as any)?.user ?? data;

    console.log("getMyProfile - Extracted user:", {
      hasUser: Boolean(user),
      userKeys: user ? Object.keys(user) : [],
      user,
    });

    return { success: true, data: user };
  } catch (error: any) {
    console.error("getMyProfile - Error:", error.message);
    return { success: false, error: error.message };
  }
}

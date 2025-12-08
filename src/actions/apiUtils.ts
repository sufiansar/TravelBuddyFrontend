"use server";

import { makeApiCall, uploadFile } from "@/actions/shared/apiClient";

// Re-export for backward compatibility
export { makeApiCall, uploadFile };

/**
 * @deprecated Use makeApiCall from @/actions/shared/apiClient instead
 */
export const makePublicApiCall = async (
  url: string,
  options: RequestInit = {}
) => {
  try {
    return makeApiCall(url, options, false);
  } catch (error) {
    return {
      success: false,
      error: "Network error or failed to fetch",
    };
  }
};

/**
 * @deprecated Use makeApiCall from @/actions/shared/apiClient instead
 */
export const makePrivateApiCall = async (
  url: string,
  options: RequestInit = {}
) => {
  try {
    return makeApiCall(url, options, true);
  } catch (error) {
    return {
      success: false,
      error: "Network error or failed to fetch",
    };
  }
};

/**
 * Helper to parse comma-separated string into array
 */
export const processArrayField = async (
  field: string | null
): Promise<string[]> => {
  if (!field) return [];
  return field
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
};

/**
 * @deprecated Use uploadFile from @/actions/shared/apiClient instead
 */
export const uploadImage = async (file: File): Promise<string | null> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const result = await uploadFile("/upload", formData, false);
    return result?.fileUrl || null;
  } catch (error) {
    console.error("Upload error:", error);
    return null;
  }
};

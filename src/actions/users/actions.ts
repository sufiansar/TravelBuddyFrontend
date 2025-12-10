"use server";

import { makeApiCall } from "@/actions/shared/apiClient";
import { uploadFile } from "@/actions/shared/apiClient";
import { revalidatePath } from "next/cache";
import { PaginationParams, UpdateUserData } from "@/lib/types";

export async function getMyProfile() {
  try {
    const { getUserSession } = await import("@/helpers/userSession");
    const session = await getUserSession();
    const token = session?.accessToken;

    if (!token) {
      return { success: false, error: "UNAUTHENTICATED" };
    }

    const result = await makeApiCall(
      "/auth/me",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      true
    );

    const data = (result as any)?.data ?? result;
    const user = (data as any)?.user ?? data;

    return { success: true, data: user };
  } catch (error: any) {
    const msg = error?.message ?? "Unknown error";
    // Handle missing/expired token as expected unauthenticated state
    const isAuthError = /invalid|expired|unauthorized|token/i.test(msg);
    if (isAuthError) {
      return { success: false, error: "UNAUTHENTICATED" };
    }

    console.error("getMyProfile - Error:", msg);
    return { success: false, error: msg };
  }
}

// Update user profile
export async function updateUser(
  userId: string,
  data: UpdateUserData,
  profileImage?: File
) {
  try {
    console.log("updateUser - Updating user:", {
      userId,
      data,
      hasImage: !!profileImage,
    });

    const formData = new FormData();

    // Add all user data fields to FormData
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value as string);
        }
      }
    });

    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    const BASE_API = process.env.NEXT_PUBLIC_BASE_API;
    const { getUserSession } = await import("@/helpers/userSession");
    const session = await getUserSession();
    const token = session?.accessToken;

    if (!token) {
      throw new Error("Please sign in to continue");
    }

    const response = await fetch(`${BASE_API}/user/update-user/${userId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Update failed" }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    const result = await response.json();

    console.log("updateUser - API response:", result);

    revalidatePath("/users");
    revalidatePath(`/users/${userId}`);
    revalidatePath(`/profile/${userId}`);
    revalidatePath(`/users/public/${userId}`);
    revalidatePath(`/reviews/user/${userId}`);
    revalidatePath("/reviews");

    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    console.error("updateUser - Error:", error);
    return {
      success: false,
      error: error.message || "Failed to update user",
    };
  }
}

// Update user role (admin only)
export async function updateUserRole(
  userId: string,
  role: "USER" | "ADMIN" | "SUPER_ADMIN"
) {
  try {
    console.log("updateUserRole - Updating role for user:", userId, "to", role);

    const result = await makeApiCall(
      `/user/update-role/${userId}`,
      {
        method: "PATCH",
        body: JSON.stringify({ role }),
      },
      true
    );

    console.log("updateUserRole - API response:", result);

    revalidatePath("/admin/roles");
    revalidatePath("/users");
    revalidatePath(`/users/${userId}`);

    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    console.error("updateUserRole - Error:", error);
    return {
      success: false,
      error: error.message || "Failed to update user role",
    };
  }
}
// Get public profile
export async function getPublicProfile(id: string) {
  if (!id) {
    return { success: false, error: "Invalid user id" };
  }

  const attempts = [
    { path: `/user/public/${id}`, auth: false },
    { path: `/user/public/${id}`, auth: true },
    { path: `/users/public/${id}`, auth: false },
    { path: `/users/public/${id}`, auth: true },
    { path: `/user/${id}`, auth: true },
  ];

  for (const attempt of attempts) {
    try {
      const result = await makeApiCall(attempt.path, {}, attempt.auth);

      console.log(
        "getPublicProfile - API Response:",
        JSON.stringify(
          { pathTried: attempt.path, auth: attempt.auth, result },
          null,
          2
        )
      );

      const data = (result as any)?.data ?? result;
      // Some APIs wrap user in { user }, others return flat user
      const user = (data as any)?.user ?? data;

      // Ensure we always pass back consistent shape for pages expecting { user, ... }
      return {
        success: true,
        data: { user, ...((data as any) || {}) },
      };
    } catch (error: any) {
      console.error(
        "getPublicProfile - Attempt failed:",
        JSON.stringify({
          path: attempt.path,
          auth: attempt.auth,
          error: error.message,
        })
      );
    }
  }

  return {
    success: false,
    error: "Failed to fetch public profile",
  };
}
// Get single user
export async function getUserById(id: string) {
  try {
    // Fetch specific user by ID
    const result = await makeApiCall(`/user/${id}`, {}, true);

    console.log(
      "getUserById - Full API Response:",
      JSON.stringify(result, null, 2)
    );

    const data = (result as any)?.data ?? result;
    console.log("getUserById - Extracted data:", JSON.stringify(data, null, 2));

    const user = (data as any)?.user ?? data;
    console.log(
      "getUserById - Final user object:",
      JSON.stringify(user, null, 2)
    );

    if (!user || !user.id) {
      throw new Error("Invalid user data returned from API");
    }

    return {
      success: true,
      data: user,
    };
  } catch (error: any) {
    console.error("getUserById - Error:", error.message);
    console.error("getUserById - Error stack:", error.stack);
    return {
      success: false,
      error: error.message || "Failed to fetch user",
    };
  }
}
// Get all users (admin only)
export async function getAllUsers(params?: PaginationParams) {
  try {
    const result = await makeApiCall(
      "/user",
      {
        method: "GET",
        params: {
          page: (params?.page ?? 1).toString(),
          limit: (params?.limit ?? 10).toString(),
          sortBy: params?.sortBy ?? "",
          sortOrder: params?.sortOrder ?? "",
          searchTerm: params?.searchTerm ?? "",
          role: params?.role ?? "",
        },
      },
      true
    );

    return {
      success: true,
      data: result.data,
      meta: result.meta,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to fetch users",
    };
  }
}
// Delete user (admin only)
export async function deleteUser(userId: string) {
  try {
    await makeApiCall(`/user/delete-user/${userId}`, {
      method: "DELETE",
    });

    revalidatePath("/users");

    return {
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to delete user",
    };
  }
}
// Delete admin (admin/super admin only)
export async function deleteAdmin(userId: string) {
  try {
    await makeApiCall(`/user/delete-admin/${userId}`, {
      method: "DELETE",
    });

    revalidatePath("/users");

    return {
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to delete admin",
    };
  }
}

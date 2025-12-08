"use server";

import { makeApiCall } from "@/actions/shared/apiClient";
import { uploadFile } from "@/actions/shared/apiClient";
import { revalidatePath } from "next/cache";
import {
  User,
  PublicUserProfile,
  PaginatedResponse,
  PaginationParams,
  UpdateUserData,
} from "@/lib/types";

export async function getMyProfile() {
  try {
    const result = await makeApiCall("/auth/me", {}, true);

    const data = (result as any)?.data ?? result;
    const user = (data as any)?.user ?? data;

    return { success: true, data: user };
  } catch (error: any) {
    console.error("getMyProfile - Error:", error.message);
    return { success: false, error: error.message };
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

    // Add profile image if provided
    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    // Single request with both data and image
    const result = await uploadFile<User>(
      `/update-user/${userId}`,
      formData,
      true
    );

    console.log("updateUser - API response:", result);

    revalidatePath("/users");
    revalidatePath(`/users/${userId}`);
    revalidatePath(`/profile/${userId}`);
    revalidatePath(`/users/public/${userId}`);

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

    const result = await makeApiCall<User>(
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
  try {
    const result = await makeApiCall<PublicUserProfile>(
      `/user/public/${id}`,
      {}
    );

    console.log(
      "getPublicProfile - Full API Response:",
      JSON.stringify(result, null, 2)
    );

    const data = (result as any)?.data ?? result;
    console.log(
      "getPublicProfile - Extracted data:",
      JSON.stringify(data, null, 2)
    );

    return {
      success: true,
      data: data,
    };
  } catch (error: any) {
    console.error("getPublicProfile - Error:", error.message);
    return {
      success: false,
      error: error.message || "Failed to fetch public profile",
    };
  }
}
// Get single user
export async function getUserById(id: string) {
  try {
    // Try the standard endpoint first
    const result = await makeApiCall<User>(`/user/profile/${id}`, {}, true);

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
    const result = await makeApiCall<PaginatedResponse<User>>(
      "/user",
      {
        method: "GET",
        params: {
          page: params?.page || 1,
          limit: params?.limit || 10,
          sortBy: params?.sortBy,
          sortOrder: params?.sortOrder,
          searchTerm: params?.searchTerm,
          role: params?.role,
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

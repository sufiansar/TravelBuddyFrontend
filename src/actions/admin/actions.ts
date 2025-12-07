"use server";

import { makeApiCall } from "@/actions/shared/apiClient";
import { revalidatePath } from "next/cache";

export async function getAllUsers(params?: Record<string, string>) {
  try {
    const result = await makeApiCall("/admin/users", { params }, true);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function toggleUserStatus(userId: string, status: string) {
  try {
    const result = await makeApiCall(
      `/admin/users/${userId}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ status }),
      },
      true
    );
    revalidatePath("/admin/users");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAllTravelPlansAdmin(params?: Record<string, string>) {
  try {
    const result = await makeApiCall("/admin/travel-plans", { params }, true);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteTravelPlanAdmin(planId: string) {
  try {
    await makeApiCall(
      `/admin/travel-plans/${planId}`,
      { method: "DELETE" },
      true
    );
    revalidatePath("/admin/travel-plans");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAllPayments(params?: Record<string, string>) {
  try {
    const result = await makeApiCall("/admin/payments", { params }, true);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAllSubscriptions(params?: Record<string, string>) {
  try {
    const result = await makeApiCall("/admin/subscriptions", { params }, true);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getPlatformStats() {
  try {
    const result = await makeApiCall("/admin/stats", {}, true);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

"use server";

import { makeApiCall } from "@/actions/shared/apiClient";
import {
  AdminFilters,
  Payment,
  PlatformStats,
  Subscription,
  TravelPlan,
  User,
  UserStatus,
} from "@/types/admin.interface";
import { revalidatePath } from "next/cache";

export async function getAllUsers(filters: AdminFilters = {}) {
  try {
    const queryString = new URLSearchParams(
      filters as Record<string, string>
    ).toString();
    const url = `/admin/users${queryString ? `?${queryString}` : ""}`;
    const result = await makeApiCall(url, {}, true);

    return {
      success: true,
      data: result?.data?.data as User[],
      meta: result.meta,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function toggleUserStatus(userId: string, status: UserStatus) {
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
    return { success: true, data: result as User };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAllTravelPlans(filters: AdminFilters = {}) {
  try {
    const queryString = new URLSearchParams(
      filters as Record<string, string>
    ).toString();
    const url = `/admin/travel-plans${queryString ? `?${queryString}` : ""}`;
    const result = await makeApiCall(url, {}, true);

    return {
      success: true,
      data: result.data as TravelPlan[],
      meta: result.meta,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteTravelPlan(planId: string) {
  try {
    await makeApiCall(
      `/admin/travel-plans/${planId}`,
      { method: "DELETE" },
      true
    );

    revalidatePath("/admin/travel-plans");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAllPayments(filters: AdminFilters = {}) {
  try {
    const queryString = new URLSearchParams(
      filters as Record<string, string>
    ).toString();
    const url = `/admin/payments${queryString ? `?${queryString}` : ""}`;
    const result = await makeApiCall(url, {}, true);

    return {
      success: true,
      data: result?.data?.data as Payment[],
      meta: result.meta,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAllSubscriptions(filters: AdminFilters = {}) {
  try {
    const queryString = new URLSearchParams(
      filters as Record<string, string>
    ).toString();
    const url = `/admin/subscriptions${queryString ? `?${queryString}` : ""}`;
    const result = await makeApiCall(url, {}, true);

    return {
      success: true,
      data: result?.data?.data as Subscription[],
      meta: result.meta,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getPlatformStats() {
  try {
    const result = await makeApiCall("/admin/stats", {}, true);
    return { success: true, data: result as PlatformStats };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getRecentActivity(limit: number = 5) {
  try {
    const result = await makeApiCall(
      `/admin/activity?limit=${limit}`,
      {},
      true
    );
    return { success: true, data: result.data || [] };
  } catch (error: any) {
    console.error("getRecentActivity - Error:", error);
    return { success: false, error: error.message, data: [] };
  }
}

export async function getRevenueData(period: string = "12months") {
  try {
    const result = await makeApiCall(
      `/admin/revenue?period=${period}`,
      {},
      true
    );
    return { success: true, data: result.data || [] };
  } catch (error: any) {
    console.error("getRevenueData - Error:", error);
    return { success: false, error: error.message, data: [] };
  }
}

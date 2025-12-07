"use server";

import { makeApiCall } from "@/actions/shared/apiClient";
import type { IUser, TravelPlan } from "@/actions/shared/types";

export async function explorePlans(params?: Record<string, string>) {
  try {
    const result = await makeApiCall("/explore/plans", { params }, false);
    return { success: true, data: result as TravelPlan[] };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function exploreTravelers(params?: Record<string, string>) {
  try {
    const result = await makeApiCall("/explore/travelers", { params }, false);
    return { success: true, data: result as IUser[] };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

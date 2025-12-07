"use server";

import { makeApiCall } from "@/actions/shared/apiClient";
import { revalidatePath } from "next/cache";
import type { TravelPlan, JoinRequest } from "@/actions/shared/types";

export async function createTravelPlan(formData: FormData) {
  try {
    const data = {
      destination: formData.get("destination"),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
      minBudget: Number(formData.get("minBudget") || 0),
      maxBudget: Number(formData.get("maxBudget") || 0),
      travelType: formData.get("travelType") || "GROUP",
      description: formData.get("description"),
      isPublic: formData.get("isPublic") || "PUBLIC",
    };

    const result = await makeApiCall(
      "/travel-plans",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      true
    );

    revalidatePath("/travel-plans");
    revalidatePath("/dashboard");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAllTravelPlans(params?: Record<string, string>) {
  try {
    const result = await makeApiCall("/travelPlans", { params }, false);
    // API returns { data: [...], meta: { page, limit, total } } or just the data
    const plans = (result as any)?.data || result;
    return { success: true, data: plans as TravelPlan[] };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getSingleTravelPlan(id: string) {
  try {
    const result = await makeApiCall(`/travelPlans/${id}`, {}, false);
    return { success: true, data: result as TravelPlan };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateTravelPlan(id: string, formData: FormData) {
  try {
    const data = {
      title: formData.get("title"),
      destination: formData.get("destination"),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
      description: formData.get("description"),
      activities: formData
        .get("activities")
        ?.toString()
        .split(",")
        .map((a) => a.trim()),
      budget: Number(formData.get("budget")),
      maxTravelers: Number(formData.get("maxTravelers")),
    };

    const result = await makeApiCall(
      `/travelPlans/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
      true
    );

    revalidatePath("/travel-plans");
    revalidatePath(`/travel-plans/${id}`);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteTravelPlan(id: string) {
  try {
    await makeApiCall(`/travelPlans/${id}`, { method: "DELETE" }, true);
    revalidatePath("/travel-plans");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function requestToJoin(planId: string, message?: string) {
  try {
    const result = await makeApiCall(
      `/travelPlans/${planId}/request`,
      {
        method: "POST",
        body: JSON.stringify({ message }),
      },
      true
    );

    revalidatePath(`/travel-plans/${planId}`);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getRequestsForOwner(planId: string) {
  try {
    const result = await makeApiCall(
      `/travel-plans/${planId}/requests`,
      {},
      true
    );
    return { success: true, data: result as JoinRequest[] };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function respondToRequest(
  planId: string,
  requestId: string,
  status: "accepted" | "rejected"
) {
  try {
    const result = await makeApiCall(
      `/travelPlans/${planId}/requests/${requestId}/respond`,
      {
        method: "PATCH",
        body: JSON.stringify({ status }),
      },
      true
    );

    revalidatePath(`/travel-plans/${planId}`);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

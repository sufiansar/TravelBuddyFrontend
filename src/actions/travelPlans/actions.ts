"use server";

import { makeApiCall } from "@/actions/shared/apiClient";
import {
  CreateTravelPlanData,
  PaginatedResponse,
  PaginationParams,
  TravelPlan,
  TravelPlanRequest,
} from "@/types/travlePlan.interface";
import { revalidatePath } from "next/cache";

// Create travel plan
export async function createTravelPlan(data: CreateTravelPlanData) {
  try {
    const result = await makeApiCall(
      "/travelPlans/create-travel-plan",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      true
    );

    revalidatePath("/travel-plans");
    revalidatePath("/travel-plans/my");

    // Extract plan data from nested structure
    const planData = result?.data || result;

    return {
      success: true,
      data: planData,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to create travel plan",
    };
  }
}

// Get all travel plans (public)
export async function getAllTravelPlans(params?: PaginationParams) {
  try {
    const result = await makeApiCall("/travelPlans", {
      method: "GET",
      params: {
        page: String(params?.page || 1),
        limit: String(params?.limit || 10),
        ...(params?.sortBy && { sortBy: params.sortBy }),
        ...(params?.sortOrder && { sortOrder: params.sortOrder }),
        ...(params?.searchTerm && { searchTerm: params.searchTerm }),
        ...(params?.travelType && { travelType: params.travelType }),
        ...(params?.isPublic && { isPublic: params.isPublic }),
        ...(params?.minBudget && { minBudget: String(params.minBudget) }),
        ...(params?.maxBudget && { maxBudget: String(params.maxBudget) }),
      },
    });

    return {
      success: true,
      data: result?.data?.data,
      meta: result.meta,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to fetch travel plans",
    };
  }
}

// Get my travel plans
export async function getMyTravelPlans(params?: PaginationParams) {
  try {
    const result = await makeApiCall(
      "/travelPlans/my-plans",
      {
        method: "GET",
        params: {
          page: String(params?.page || 1),
          limit: String(params?.limit || 10),
          ...(params?.sortBy && { sortBy: params.sortBy }),
          ...(params?.sortOrder && { sortOrder: params.sortOrder }),
          ...(params?.searchTerm && { searchTerm: params.searchTerm }),
        },
      },
      true
    );

    // Extract data from nested structure
    const plansData = result?.data?.data || result?.data || result;

    return {
      success: true,
      data: plansData,
      meta: result.meta,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to fetch your travel plans",
    };
  }
}

// Get single travel plan
export async function getTravelPlan(id: string) {
  try {
    const result = await makeApiCall(`/travelPlans/${id}`, {});

    // Extract plan data from nested structure
    const planData = result?.data || result;

    return {
      success: true,
      data: planData,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to fetch travel plan",
    };
  }
}

// Update travel plan
export async function updateTravelPlan(
  id: string,
  data: Partial<CreateTravelPlanData>
) {
  try {
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
    revalidatePath("/travel-plans/my");

    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to update travel plan",
    };
  }
}

// Delete travel plan
export async function deleteTravelPlan(id: string) {
  try {
    await makeApiCall(
      `/travelPlans/${id}`,
      {
        method: "DELETE",
      },
      true
    );

    revalidatePath("/travel-plans");
    revalidatePath("/travel-plans/my");

    return {
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to delete travel plan",
    };
  }
}

// Request to join travel plan
export async function requestToJoin(travelPlanId: string, message?: string) {
  try {
    const result = await makeApiCall(
      `/travelPlans/${travelPlanId}/request`,
      {
        method: "POST",
        body: JSON.stringify({ message }),
      },
      true
    );

    revalidatePath(`/travelPlans/${travelPlanId}`);

    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to send join request",
    };
  }
}

// Get requests for travel plan (owner only)
export async function getTravelPlanRequests(travelPlanId: string) {
  try {
    const result = await makeApiCall(
      `/travelPlans/${travelPlanId}/requests`,
      {},
      true
    );

    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to fetch requests",
    };
  }
}

// Respond to join request
export async function respondToRequest(
  travelPlanId: string,
  requestId: string,
  action: "ACCEPTED" | "REJECTED" | "PENDING"
) {
  try {
    const result = await makeApiCall(
      `/travelPlans/${travelPlanId}/requests/${requestId}/respond`,
      {
        method: "POST",
        body: JSON.stringify({ action }),
      }
    );

    revalidatePath(`/travel-plans/${travelPlanId}`);
    revalidatePath(`/travel-plans/${travelPlanId}/requests`);

    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to respond to request",
    };
  }
}

// Get travel types for filter
export async function getTravelTypes() {
  try {
    // This would come from your backend or constants
    const travelTypes = [
      "Adventure",
      "Beach",
      "City Tour",
      "Cultural",
      "Hiking",
      "Road Trip",
      "Ski/Snowboard",
      "Backpacking",
      "Luxury",
      "Business",
      "Family",
      "Solo",
      "Couple",
      "Group",
      "Other",
    ];

    return {
      success: true,
      data: travelTypes,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to fetch travel types",
    };
  }
}

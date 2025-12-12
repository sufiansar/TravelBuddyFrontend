"use server";

import { makeApiCall } from "@/actions/shared/apiClient";
import { PaginatedResponse, PaginationParams } from "@/types/user.interface";
import { CreateReviewData, Review } from "@/types/review.types";
import { revalidatePath } from "next/cache";

export async function createReview(data: CreateReviewData) {
  try {
    // Get current user session to get reviewerId
    const userResult = await makeApiCall("/auth/me", {}, true);

    // Handle nested data structure from /auth/me
    let userId = null;
    if (userResult?.data?.id) {
      userId = userResult.data.id;
    } else if (userResult?.id) {
      userId = userResult.id;
    }

    if (!userId) {
      console.error("Failed to get user ID from session:", userResult);
      return {
        success: false,
        error: "You must be logged in to create a review",
      };
    }

    const payload = {
      rating: data.rating,
      comment: data.comment,
      receiverId: data.receiverId,
      reviewerId: userId,
      // Only include travelPlanId if it exists (backend expects null, not empty string)
      ...(data.travelPlanId && { travelPlanId: data.travelPlanId }),
    };

    const result = await makeApiCall(
      "/reviews",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      true
    );

    revalidatePath("/reviews");
    revalidatePath(`/reviews/user/${data.receiverId}`);
    revalidatePath(`/users/public/${data.receiverId}`);
    revalidatePath("/explore");
    if (data.travelPlanId) {
      revalidatePath(`/reviews/plan/${data.travelPlanId}`);
      revalidatePath(`/travel-plans/${data.travelPlanId}`);
    }

    return { success: true, data: result as Review };
  } catch (error: any) {
    console.error("Create review error:", error);
    return {
      success: false,
      error: error.message || "Failed to create review",
    };
  }
}

export async function getReviewById(id: string) {
  try {
    const result = await makeApiCall(`/reviews/${id}`, {}, true);
    return { success: true, data: result as Review };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getReviewsForPlan(
  planId: string,
  params?: PaginationParams
) {
  try {
    const queryParams = params
      ? Object.fromEntries(
          Object.entries(params).map(([key, value]) => [key, String(value)])
        )
      : undefined;
    const result = await makeApiCall(
      `/reviews/plan/${planId}`,
      {
        method: "GET",
        params: queryParams,
      },
      true
    );
    return { success: true, ...(result as PaginatedResponse<Review>) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getReviewsForUser(
  userId: string,
  params?: PaginationParams
) {
  try {
    const queryParams = params
      ? Object.fromEntries(
          Object.entries(params).map(([key, value]) => [key, String(value)])
        )
      : undefined;
    const result = await makeApiCall(
      `/reviews/user/${userId}`,
      {
        method: "GET",
        params: queryParams,
      },
      true
    );
    return { success: true, data: result.data as Review[], meta: result.meta };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAllReviews(params?: PaginationParams) {
  try {
    const queryParams = params
      ? Object.fromEntries(
          Object.entries(params).map(([key, value]) => [key, String(value)])
        )
      : undefined;
    const result = await makeApiCall(
      "/reviews",
      {
        method: "GET",
        params: queryParams,
      },
      true
    );

    // Handle nested response structure
    if (result?.data) {
      return { success: true, data: result.data, meta: result.meta };
    }
    return {
      success: true,
      data: result?.data || [],
      meta: result?.meta || { page: 1, limit: 10, totalPage: 1, total: 0 },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateReview(
  id: string,
  data: { rating?: number; comment?: string }
) {
  try {
    const result = await makeApiCall(
      `/reviews/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
      true
    );

    revalidatePath("/reviews");
    revalidatePath(`/reviews/${id}`);
    return { success: true, data: result as Review };
  } catch (error: any) {
    console.error("Update review error:", error);
    return {
      success: false,
      error: error.message || "Failed to update review",
    };
  }
}

export async function deleteReview(id: string) {
  try {
    await makeApiCall(`/reviews/${id}`, { method: "DELETE" }, true);

    revalidatePath("/reviews");
    return { success: true };
  } catch (error: any) {
    console.error("Delete review error:", error);
    return {
      success: false,
      error: error.message || "Failed to delete review",
    };
  }
}

// Helper function to get user's completed travel plans for review
export async function getUserCompletedTravelPlans() {
  try {
    const result = await makeApiCall("/travelPlans/my-plans", {}, true);

    let plans = [];
    if (result?.data?.data) {
      plans = result.data.data;
    } else if (result?.data) {
      plans = Array.isArray(result.data) ? result.data : [];
    } else if (Array.isArray(result)) {
      plans = result;
    }

    // Filter for completed plans (end date has passed)
    const now = new Date();
    const completedPlans = plans.filter((plan: any) => {
      if (!plan?.endDate) return false;
      const endDate = new Date(plan.endDate);
      return endDate < now;
    });

    return { success: true, data: completedPlans };
  } catch (error: any) {
    console.error("Get completed travel plans error:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch completed travel plans",
      data: [],
    };
  }
}

export async function getUsersForReview() {
  try {
    // Get all users that can be reviewed - use the correct endpoint
    const result = await makeApiCall(
      "/user",
      {
        method: "GET",
        params: {
          page: "1",
          limit: "100", // Get enough users for the dropdown
        },
      },
      true
    );

    // Handle nested data structure
    let users = [];
    if (result?.data?.data) {
      users = result.data.data;
    } else if (result?.data) {
      users = Array.isArray(result.data) ? result.data : [];
    } else if (Array.isArray(result)) {
      users = result;
    }

    console.log("Fetched users for review:", users.length, users);
    return { success: true, data: users };
  } catch (error: any) {
    console.error("Get reviewable users error:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch users",
      data: [],
    };
  }
}

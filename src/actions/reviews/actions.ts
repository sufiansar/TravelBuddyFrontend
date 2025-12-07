"use server";

import { makeApiCall } from "@/actions/shared/apiClient";
import { revalidatePath } from "next/cache";
import type { Review } from "@/actions/shared/types";

export async function createReview(formData: FormData) {
  try {
    const data = {
      plan: formData.get("plan"),
      reviewee: formData.get("reviewee"),
      rating: Number(formData.get("rating")),
      comment: formData.get("comment"),
    };

    const result = await makeApiCall(
      "/reviews",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      true
    );

    revalidatePath("/reviews");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAllReviews() {
  try {
    const result = await makeApiCall("/reviews", {}, true);
    return { success: true, data: result as Review[] };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getReviewsForPlan(planId: string) {
  try {
    const result = await makeApiCall(`/reviews/plan/${planId}`, {}, false);
    return { success: true, data: result as Review[] };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getReviewsForUser(userId: string) {
  try {
    const result = await makeApiCall(`/reviews/users/${userId}`, {}, false);
    return { success: true, data: result as Review[] };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getSingleReview(id: string) {
  try {
    const result = await makeApiCall(`/reviews/${id}`, {}, false);
    return { success: true, data: result as Review };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateReview(id: string, formData: FormData) {
  try {
    const data = {
      rating: Number(formData.get("rating")),
      comment: formData.get("comment"),
    };

    const result = await makeApiCall(
      `/reviews/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
      true
    );

    revalidatePath("/reviews");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteReview(id: string) {
  try {
    await makeApiCall(`/reviews/${id}`, { method: "DELETE" }, true);
    revalidatePath("/reviews");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

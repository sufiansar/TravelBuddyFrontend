"use server";

import { makeApiCall } from "@/actions/shared/apiClient";
import { revalidatePath } from "next/cache";

// Types
export interface TravelMatch {
  id: string;
  matchScore: number;
  travelPlanId: string;
  matchedUserId: string;
  createdAt: string;
  updatedAt: string;
  matchedUser: {
    id: string;
    email: string;
    fullName: string;
    avatar?: string;
    bio?: string;
    interests: string[];
  };
  travelPlan?: {
    id: string;
    destination: string;
    startDate: string;
    endDate: string;
    description?: string;
    budget?: number;
    user: {
      id: string;
      fullName: string;
      email: string;
    };
  };
}

export interface TravelPlan {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  description?: string;
  budget?: number;
  isPublic: "PUBLIC" | "PRIVATE";
  userId: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    fullName: string;
    email: string;
    interests: string[];
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sortBy?: "matchScore" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
}

// Server Actions
export async function generateMatches(travelPlanId: string) {
  try {
    const result = await makeApiCall(
      `/travelMatches/${travelPlanId}/matches/generate`,
      { method: "POST" },
      true
    );

    revalidatePath("/matches");
    revalidatePath(`/matches/${travelPlanId}`);

    // Handle the response data structure
    const matchesData = result?.data || result;
    return { success: true, data: matchesData as TravelMatch[] };
  } catch (error: any) {
    console.error("Generate matches error:", error);
    return {
      success: false,
      error: error.message || "Failed to generate matches",
    };
  }
}

export async function getAllMatches(params?: PaginationParams) {
  try {
    const result = await makeApiCall(
      "/travelMatches/",
      {
        method: "GET",
        params: params as any,
      },
      true
    );

    // Handle different response structures
    const matchesData = result?.data?.data || result?.data || [];
    const meta = result?.data?.meta || result?.meta;

    return {
      success: true,
      data: matchesData as TravelMatch[],
      meta: meta,
    };
  } catch (error: any) {
    console.error("Get all matches error:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch matches",
    };
  }
}

export async function getMatchesForPlan(travelPlanId: string) {
  try {
    const result = await makeApiCall(
      `/travelMatches/${travelPlanId}/matches`,
      {},
      true
    );
    const matchesData = result?.data || result;
    return { success: true, data: matchesData as TravelMatch[] };
  } catch (error: any) {
    console.error("Get plan matches error:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch plan matches",
    };
  }
}

export async function getMatchesForUser() {
  try {
    const result = await makeApiCall("/travelMatches/matches/me", {}, true);
    const matchesData = result?.data || result;
    return { success: true, data: matchesData as TravelMatch[] };
  } catch (error: any) {
    console.error("Get user matches error:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch your matches",
    };
  }
}

export async function deleteMatch(matchId: string) {
  try {
    await makeApiCall(
      `/travelMatches/matches/${matchId}`,
      { method: "DELETE" },
      true
    );

    revalidatePath("/matches");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getMyTravelPlans() {
  try {
    const result = await makeApiCall("/travelMatches/me", {}, true);
    return { success: true, data: result as TravelPlan[] };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getTravelPlan(planId: string) {
  try {
    const result = await makeApiCall(`/travelMatches/${planId}`, {}, true);
    return { success: true, data: result as TravelPlan };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

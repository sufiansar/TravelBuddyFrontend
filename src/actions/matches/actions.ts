"use server";

import { makeApiCall } from "@/actions/shared/apiClient";
import { revalidatePath } from "next/cache";
import type { Match } from "@/actions/shared/types";

export async function generateMatches(planId: string) {
  try {
    const result = await makeApiCall(
      `/travelMatches/${planId}/matches/generate`,
      { method: "POST" },
      true
    );

    revalidatePath("/dashboard");
    revalidatePath(`/travel-plans/${planId}`);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAllMatches() {
  try {
    const result = await makeApiCall("/travelMatches/matches/me", {}, true);
    return { success: true, data: result as Match[] };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getMatchesForPlan(planId: string) {
  try {
    const result = await makeApiCall(
      `/travelMatches/${planId}/matches`,
      {},
      true
    );
    return { success: true, data: result as Match[] };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getMatchesForUser() {
  try {
    const result = await makeApiCall("/travelMatches/matches/me", {}, true);
    return { success: true, data: result as Match[] };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteMatch(matchId: string) {
  try {
    await makeApiCall(
      `/travelMatches/matches/${matchId}`,
      { method: "DELETE" },
      true
    );
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

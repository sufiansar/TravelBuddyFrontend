"use server";

import { makeApiCall } from "@/actions/shared/apiClient";

import { revalidatePath } from "next/cache";

export async function createCheckoutSession(plan: "MONTHLY" | "YEARLY") {
  try {
    const result = await makeApiCall(
      "/payments/create-session",
      {
        method: "POST",
        body: JSON.stringify({ plan }),
      },
      true
    );

    return {
      success: true,
      data: result?.data as { url: string; sessionId: string },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function verifySession(sessionId: string) {
  try {
    const result = await makeApiCall(
      `/payments/verify-session/${sessionId}`,
      {},
      false
    );

    revalidatePath("/profile");
    revalidatePath("/payments");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getSubscriptionStatus() {
  try {
    const result = await makeApiCall("/subscriptions/me", {}, true);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getPaymentHistory() {
  try {
    const result = await makeApiCall("/payments/history", {}, true);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function cancelSubscription() {
  try {
    const result = await makeApiCall(
      "/subscriptions/cancel",
      { method: "POST" },
      true
    );

    revalidatePath("/profile");
    revalidatePath("/payments");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

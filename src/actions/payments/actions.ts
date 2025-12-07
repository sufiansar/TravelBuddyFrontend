"use server";

import { makeApiCall } from "@/actions/shared/apiClient";

export async function createPaymentSession(planType: string) {
  try {
    const result = await makeApiCall(
      "/payments/create-session",
      {
        method: "POST",
        body: JSON.stringify({ planType }),
      },
      true
    );

    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function verifyPaymentSession(sessionId: string) {
  try {
    const result = await makeApiCall(
      `/payments/verify-session/${sessionId}`,
      {},
      false
    );
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

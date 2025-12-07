"use server";

import { makeApiCall } from "@/actions/shared/apiClient";
import { revalidatePath } from "next/cache";
import type { IUser, Meetup } from "@/actions/shared/types";

export async function createMeetup(formData: FormData) {
  try {
    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      location: formData.get("location"),
      date: formData.get("date"),
      maxMembers: Number(formData.get("maxMembers")),
    };

    const result = await makeApiCall(
      "/meetups",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      true
    );

    revalidatePath("/meetups");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAllMeetups(params?: Record<string, string>) {
  try {
    const result = await makeApiCall("/meetups", { params }, false);
    return { success: true, data: result as Meetup[] };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getSingleMeetup(id: string) {
  try {
    const result = await makeApiCall(`/meetups/${id}`, {}, false);
    return { success: true, data: result as Meetup };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateMeetup(id: string, formData: FormData) {
  try {
    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      location: formData.get("location"),
      date: formData.get("date"),
      maxMembers: Number(formData.get("maxMembers")),
    };

    const result = await makeApiCall(
      `/meetups/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
      true
    );

    revalidatePath("/meetups");
    revalidatePath(`/meetups/${id}`);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteMeetup(id: string) {
  try {
    await makeApiCall(`/meetups/${id}`, { method: "DELETE" }, true);
    revalidatePath("/meetups");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function joinMeetup(id: string) {
  try {
    const result = await makeApiCall(
      `/meetups/${id}/join`,
      {
        method: "POST",
      },
      true
    );

    revalidatePath("/meetups");
    revalidatePath(`/meetups/${id}`);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function leaveMeetup(id: string) {
  try {
    const result = await makeApiCall(
      `/meetups/${id}/leave`,
      {
        method: "POST",
      },
      true
    );

    revalidatePath("/meetups");
    revalidatePath(`/meetups/${id}`);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getMeetupMembers(id: string) {
  try {
    const result = await makeApiCall(`/meetups/${id}/members`, {}, true);
    return { success: true, data: result as IUser[] };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

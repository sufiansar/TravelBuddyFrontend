"use server";

import { revalidatePath } from "next/cache";
import { api } from "./api";

export async function createMeetup(data: any) {
  try {
    console.log("createMeetup - Creating meetup with data:", data);

    const result = await api.meetups.create(data);

    console.log("createMeetup - API response:", result);

    revalidatePath("/meetups");
    revalidatePath("/dashboard/meetups");

    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    console.error("createMeetup - Error:", error);
    return {
      success: false,
      error: error.message || "Failed to create meetup",
    };
  }
}

export async function updateMeetup(id: string, data: any) {
  try {
    console.log("updateMeetup - Updating meetup:", id, "with data:", data);

    const result = await api.meetups.update(id, data);

    console.log("updateMeetup - API response:", result);

    revalidatePath("/meetups");
    revalidatePath("/dashboard/meetups");
    revalidatePath(`/meetups/${id}`);
    revalidatePath(`/dashboard/meetups/${id}`);

    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    console.error("updateMeetup - Error:", error);
    return {
      success: false,
      error: error.message || "Failed to update meetup",
    };
  }
}

export async function deleteMeetup(id: string) {
  try {
    console.log("deleteMeetup - Deleting meetup:", id);

    const result = await api.meetups.delete(id);

    console.log("deleteMeetup - API response:", result);

    revalidatePath("/meetups");
    revalidatePath("/dashboard/meetups");

    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    console.error("deleteMeetup - Error:", error);
    return {
      success: false,
      error: error.message || "Failed to delete meetup",
    };
  }
}

export async function joinMeetup(id: string) {
  try {
    console.log("joinMeetup - Joining meetup:", id);

    const result = await api.meetups.join(id);

    console.log("joinMeetup - API response:", result);

    revalidatePath("/meetups");
    revalidatePath("/dashboard/meetups");
    revalidatePath(`/meetups/${id}`);
    revalidatePath(`/dashboard/meetups/${id}`);

    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    console.error("joinMeetup - Error:", error);
    return {
      success: false,
      error: error.message || "Failed to join meetup",
    };
  }
}

export async function leaveMeetup(id: string) {
  try {
    console.log("leaveMeetup - Leaving meetup:", id);

    const result = await api.meetups.leave(id);

    console.log("leaveMeetup - API response:", result);

    revalidatePath("/meetups");
    revalidatePath("/dashboard/meetups");
    revalidatePath(`/meetups/${id}`);
    revalidatePath(`/dashboard/meetups/${id}`);

    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    console.error("leaveMeetup - Error:", error);
    return {
      success: false,
      error: error.message || "Failed to leave meetup",
    };
  }
}

type MeetupsGetAllResult = {
  data: any;
  meta?: {
    page: number;
    limit: number;
    total: number;
    [key: string]: any;
  };
  [key: string]: any;
};

export async function getAllMeetups(filters?: any, options?: any) {
  try {
    console.log(
      "getAllMeetups - Fetching meetups with filters:",
      filters,
      "options:",
      options
    );

    const result = (await api.meetups.getAll(
      filters,
      options
    )) as MeetupsGetAllResult;

    return {
      success: true,
      data: result?.data?.data,
      meta: result?.meta,
    };
  } catch (error: any) {
    console.error("getAllMeetups - Error:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch meetups",
      data: [],
      meta: { page: 1, limit: 10, total: 0 },
    };
  }
}

export async function getMeetup(id: string) {
  try {
    console.log("getMeetup - Fetching meetup:", id);

    const result = await api.meetups.getSingle(id);

    // Backend may wrap payload as { data: meetup }, so unwrap if present
    const data = (result as any)?.data ?? result;

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    console.error("getMeetup - Error:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch meetup",
      data: null,
    };
  }
}

type MeetupMembersResult = {
  data: any;
  [key: string]: any;
};

export async function getMeetupMembers(id: string) {
  try {
    console.log("getMeetupMembers - Fetching members for meetup:", id);

    const result = (await api.meetups.getMembers(id)) as MeetupMembersResult;

    return {
      success: true,
      data: result?.data,
    };
  } catch (error: any) {
    console.error("getMeetupMembers - Error:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch meetup members",
      data: [],
    };
  }
}

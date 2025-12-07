"use server";

import { makeApiCall, uploadFile } from "@/actions/shared/apiClient";
import { revalidatePath } from "next/cache";
import type { Post, Comment } from "@/actions/shared/types";

export async function createPost(formData: FormData) {
  try {
    const result = await uploadFile("/posts", formData, true);
    revalidatePath("/post");
    revalidatePath("/dashboard");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getPosts(params?: Record<string, string>) {
  try {
    const result = await makeApiCall("/posts/", { params }, false);
    return { success: true, data: result.data.data as Post[] };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getSinglePost(id: string) {
  try {
    const result = await makeApiCall(`/posts/${id}`, {}, false);
    return { success: true, data: result as Post };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function reactToPost(postId: string, type: string) {
  try {
    const result = await makeApiCall(
      `/posts/${postId}/react`,
      {
        method: "POST",
        body: JSON.stringify({ type }),
      },
      true
    );

    revalidatePath("/post");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function unreactToPost(postId: string) {
  try {
    await makeApiCall(`/posts/${postId}/unreact`, { method: "DELETE" }, true);
    revalidatePath("/post");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function savePost(postId: string) {
  try {
    const result = await makeApiCall(
      `/posts/${postId}/save`,
      {
        method: "POST",
      },
      true
    );

    revalidatePath("/post");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function unsavePost(postId: string) {
  try {
    await makeApiCall(`/posts/${postId}/unsave`, { method: "DELETE" }, true);
    revalidatePath("/post");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function sharePost(postId: string) {
  try {
    const result = await makeApiCall(
      `/posts/${postId}/share`,
      {
        method: "POST",
      },
      true
    );

    revalidatePath("/post");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getSavedPosts() {
  try {
    const result = await makeApiCall("/posts/saved/me", {}, true);
    return { success: true, data: result as Post[] };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createComment(postId: string, content: string) {
  try {
    const result = await makeApiCall(
      `/posts/${postId}/comment`,
      {
        method: "POST",
        body: JSON.stringify({ content }),
      },
      true
    );

    revalidatePath("/post");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getComments(postId: string) {
  try {
    const result = await makeApiCall(`/posts/${postId}/comments`, {}, false);
    return { success: true, data: result as Comment[] };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateComment(commentId: string, content: string) {
  try {
    const result = await makeApiCall(
      `/posts/comments/${commentId}`,
      {
        method: "PATCH",
        body: JSON.stringify({ content }),
      },
      true
    );

    revalidatePath("/post");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteComment(commentId: string) {
  try {
    await makeApiCall(
      `/posts/comments/${commentId}`,
      { method: "DELETE" },
      true
    );
    revalidatePath("/post");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

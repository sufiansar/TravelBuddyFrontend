"use server";

import { makeApiCall, uploadFile } from "@/actions/shared/apiClient";
import {
  PaginatedResponse,
  PaginationParams,
  Post,
  PostComment,
  CreatePostData,
} from "@/types/post.interface";
import { revalidatePath } from "next/cache";

// Get all posts
export async function getAllPosts(params?: PaginationParams) {
  try {
    const result = await makeApiCall("/posts", {
      method: "GET",
      params: {
        page: String(params?.page || 1),
        limit: String(params?.limit || 10),
        ...(params?.sortBy && { sortBy: params.sortBy }),
        ...(params?.sortOrder && { sortOrder: params.sortOrder }),
        ...(params?.searchTerm && { searchTerm: params.searchTerm }),
      },
    });

    console.log("getAllPosts - Full API Response:", result);

    // Handle different response structures
    const data = result?.data?.data || result?.data || result?.posts || [];
    const meta = result?.meta ||
      result?.pagination || {
        page: Number(params?.page || 1),
        limit: Number(params?.limit || 10),
        total: 0,
      };

    console.log("getAllPosts - Extracted data (first post):", data[0]);

    return {
      success: true,
      data,
      meta,
    };
  } catch (error: any) {
    console.error("getAllPosts error:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch posts",
      data: [],
      meta: { page: 1, limit: 10, total: 0 },
    };
  }
}

// Get single post
export async function getPostById(id: string) {
  try {
    const result = await makeApiCall(`/posts/${id}`, {});

    console.log("getPostById - Full API Response:", result);

    // Extract post data from nested response structure
    const post = result?.data ?? result;

    console.log("getPostById - Extracted post:", post);

    if (!post || !post.id) {
      throw new Error("Invalid post data returned from API");
    }

    return {
      success: true,
      data: post,
    };
  } catch (error: any) {
    console.error("getPostById error:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch post",
    };
  }
}

// Get my posts
export async function getMyPosts(params?: PaginationParams) {
  try {
    const result = await makeApiCall(
      "/posts/me",
      {
        method: "GET",
        params: {
          page: String(params?.page || 1),
          limit: String(params?.limit || 10),
          ...(params?.sortBy && { sortBy: params.sortBy }),
          ...(params?.sortOrder && { sortOrder: params.sortOrder }),
        },
      },
      true
    );

    const data = result?.data?.data || result?.data || result?.posts || [];
    const meta = result?.meta ||
      result?.pagination || {
        page: Number(params?.page || 1),
        limit: Number(params?.limit || 10),
        total: 0,
      };

    return {
      success: true,
      data,
      meta,
    };
  } catch (error: any) {
    console.error("getMyPosts error:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch your posts",
      data: [],
      meta: { page: 1, limit: 10, total: 0 },
    };
  }
}

// Get saved posts
export async function getSavedPosts() {
  try {
    const result = await makeApiCall("/posts/saved/me", {}, true);

    const posts = Array.isArray(result)
      ? result.map((item: { post: Post }) => item.post)
      : result?.data?.map((item: { post: Post }) => item.post) || [];

    return {
      success: true,
      data: posts,
    };
  } catch (error: any) {
    console.error("getSavedPosts error:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch saved posts",
      data: [],
    };
  }
}

// Create post
export async function createPost(data: CreatePostData) {
  try {
    const formData = new FormData();
    formData.append("content", data.content);

    if (data.images) {
      data.images.forEach((image: File) => {
        formData.append("images", image);
      });
    }

    const result = await uploadFile("/posts", formData, true);

    revalidatePath("/posts");
    revalidatePath("/posts/me");

    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    console.error("createPost error:", error);
    return {
      success: false,
      error: error.message || "Failed to create post",
    };
  }
}

// React to post
export async function reactToPost(
  postId: string,
  type: "LIKE" | "LOVE" | "HAHA" | "WOW" | "SAD" | "ANGRY"
) {
  try {
    const result = await makeApiCall(
      `/posts/${postId}/react`,
      {
        method: "POST",
        body: JSON.stringify({ type }),
      },
      true
    );

    revalidatePath("/posts");
    revalidatePath(`/posts/${postId}`);

    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to react to post",
    };
  }
}

// Remove reaction
export async function removeReaction(postId: string) {
  try {
    await makeApiCall(
      `/posts/${postId}/unreact`,
      {
        method: "DELETE",
      },
      true
    );

    revalidatePath("/posts");
    revalidatePath(`/posts/${postId}`);

    return {
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to remove reaction",
    };
  }
}

// Save post
export async function savePost(postId: string) {
  try {
    const result = await makeApiCall(
      `/posts/${postId}/save`,
      {
        method: "POST",
      },
      true
    );

    revalidatePath("/posts");
    revalidatePath("/posts/saved");

    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to save post",
    };
  }
}

// Unsave post
export async function unsavePost(postId: string) {
  try {
    await makeApiCall(
      `/posts/${postId}/unsave`,
      {
        method: "DELETE",
      },
      true
    );

    revalidatePath("/posts");
    revalidatePath("/posts/saved");

    return {
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to unsave post",
    };
  }
}

// Share post
export async function sharePost(postId: string, message?: string) {
  try {
    const result = await makeApiCall(
      `/posts/${postId}/share`,
      {
        method: "POST",
        body: JSON.stringify({ message }),
      },
      true
    );

    revalidatePath("/posts");
    revalidatePath(`/posts/${postId}`);

    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to share post",
    };
  }
}

// Get comments
export async function getPostComments(
  postId: string,
  params?: PaginationParams
) {
  try {
    const result = await makeApiCall(`/posts/${postId}/comments`, {
      method: "GET",
      params: {
        page: String(params?.page || 1),
        limit: String(params?.limit || 10),
        ...(params?.sortBy && { sortBy: params.sortBy }),
        ...(params?.sortOrder && { sortOrder: params.sortOrder }),
      },
    });

    // Handle different response structures for comments
    const data = result?.data?.data || result?.data || result?.comments || [];
    const meta = result?.meta ||
      result?.pagination || {
        page: Number(params?.page || 1),
        limit: Number(params?.limit || 10),
        total: 0,
      };

    return {
      success: true,
      data,
      meta,
    };
  } catch (error: any) {
    console.error("getPostComments error:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch comments",
      data: [],
      meta: { page: 1, limit: 10, total: 0 },
    };
  }
}

// Create comment
export async function createComment(postId: string, content: string) {
  try {
    console.log("createComment - Calling API with:", { postId, content });

    const result = await makeApiCall(
      `/posts/${postId}/comment`,
      {
        method: "POST",
        body: JSON.stringify({ content }),
      },
      true
    );

    console.log("createComment - API Response:", result);

    // Extract comment data from response
    const comment = result?.data ?? result;

    revalidatePath(`/posts/${postId}`);
    revalidatePath("/posts");

    return {
      success: true,
      data: comment,
    };
  } catch (error: any) {
    console.error("createComment error:", error);
    console.error("createComment error details:", {
      message: error.message,
      stack: error.stack,
    });
    return {
      success: false,
      error: error.message || "Failed to create comment",
    };
  }
}

// Update comment
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

    revalidatePath("/posts");
    revalidatePath("/posts/[id]");

    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to update comment",
    };
  }
}

// Delete comment
export async function deleteComment(commentId: string) {
  try {
    await makeApiCall(
      `/posts/comments/${commentId}`,
      {
        method: "DELETE",
      },
      true
    );

    revalidatePath("/posts");
    revalidatePath("/posts/[id]");

    return {
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to delete comment",
    };
  }
}

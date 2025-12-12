import { User } from "./user.interface";

export interface Post {
  id: string;
  content: string;
  images: string[];
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  reactions: PostReaction[];
  saves: PostSave[];
  shares: PostShare[];
  _count?: {
    comments?: number;
  };
}

export interface PostReaction {
  id: string;
  postId: string;
  userId: string;
  type: "LIKE" | "LOVE" | "HAHA" | "WOW" | "SAD" | "ANGRY";
  createdAt: string;
  user?: User;
}

export interface PostSave {
  id: string;
  postId: string;
  userId: string;
  createdAt: string;
  user?: User;
}

export interface PostShare {
  id: string;
  postId: string;
  userId: string;
  message?: string;
  createdAt: string;
  user?: User;
}

export interface PostComment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: User;
}

export interface CreatePostData {
  content: string;
  images?: File[];
}

export interface UpdatePostData {
  content?: string;
  images?: File[];
}

export interface CreateCommentData {
  content: string;
}

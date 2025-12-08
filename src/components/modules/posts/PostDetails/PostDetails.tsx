import { notFound } from "next/navigation";
import { getPostById, getPostComments } from "@/actions";
import { PostDetailsClient } from "./PostDetailsClient";

interface PostDetailsProps {
  postId: string;
}

export async function PostDetails({ postId }: PostDetailsProps) {
  const [postResult, commentsResult] = await Promise.all([
    getPostById(postId),
    getPostComments(postId),
  ]);

  if (!postResult.success || !postResult.data) {
    notFound();
  }

  const post = postResult.data;
  const comments = commentsResult.success ? commentsResult.data : [];

  return <PostDetailsClient post={post} comments={comments} postId={postId} />;
}

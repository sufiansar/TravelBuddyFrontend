"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { PostCard } from "@/components/modules/posts/PostCard";
import { CommentsSection } from "@/components/modules/posts/CommentsSection";
import { Post, PostComment } from "@/types/post.interface";

interface PostDetailsClientProps {
  post: Post;
  comments: PostComment[];
  postId: string;
}

export function PostDetailsClient({
  post,
  comments,
  postId,
}: PostDetailsClientProps) {
  const router = useRouter();

  const handleCommentsUpdate = () => {
    // Refresh the server component data
    router.refresh();
  };

  // Add comment count to post object
  const postWithCount = {
    ...post,
    _count: {
      ...post._count,
      comments: comments.length,
    },
  };

  return (
    <div className="space-y-6">
      <PostCard post={postWithCount} showActions={false} />

      <Card>
        <CardContent className="p-6">
          <CommentsSection
            postId={postId}
            comments={comments}
            onCommentsUpdate={handleCommentsUpdate}
          />
        </CardContent>
      </Card>
    </div>
  );
}

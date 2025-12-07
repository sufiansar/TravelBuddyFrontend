"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getPosts, reactToPost, savePost, createComment } from "@/actions";
import type { Post } from "@/actions/shared/types";
import { PostCard } from "@/components/modules/post-card";

export default function PostPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>(
    {}
  );

  useEffect(() => {
    const fetchPosts = async () => {
      const result = await getPosts();
      console.log(result.data);
      if (result.success && result.data) {
        setPosts(result.data);
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const handleReact = async (postId: string) => {
    const result = await reactToPost(postId, "like");
    if (result.success) {
      // Refresh posts
      const updated = await getPosts();
      if (updated.success && updated.data) setPosts(updated.data);
    }
  };

  const handleSave = async (postId: string) => {
    const result = await savePost(postId);
    if (result.success) {
      alert("Post saved!");
    }
  };

  const handleComment = async (postId: string) => {
    const content = commentInputs[postId];
    if (!content?.trim()) return;

    const result = await createComment(postId, content);
    if (result.success) {
      setCommentInputs({ ...commentInputs, [postId]: "" });
      // Refresh posts
      const updated = await getPosts();
      if (updated.success && updated.data) setPosts(updated.data);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-2xl mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Community Posts
          </h1>
          <p className="text-muted-foreground">
            Share your travel stories and experiences
          </p>
        </div>

        {/* Posts List */}
        {loading ? (
          <div className="text-center py-20 text-muted-foreground">
            Loading posts...
          </div>
        ) : posts.length === 0 ? (
          <Card className="border-border">
            <CardContent className="pt-8 text-center">
              <p className="text-muted-foreground">
                No posts yet. Be the first to share your travel story!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {posts?.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                commentValue={commentInputs[post._id] || ""}
                onCommentChange={(value) =>
                  setCommentInputs({ ...commentInputs, [post._id]: value })
                }
                onCommentSubmit={() => handleComment(post._id)}
                onReact={() => handleReact(post._id)}
                onSave={() => handleSave(post._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

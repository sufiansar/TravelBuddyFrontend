import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import Link from "next/link";
import { getSavedPosts } from "@/actions/post";
import { PostCard } from "@/components/modules/post/PostCard";

export async function SavedPostsList() {
  const result = await getSavedPosts();

  if (!result.success) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Error: {result.error}</p>
      </div>
    );
  }

  const posts = result.data || [];

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <Bookmark className="h-12 w-12 mx-auto text-muted-foreground" />
        <div>
          <h3 className="text-lg font-semibold">No saved posts</h3>
          <p className="text-muted-foreground">
            Posts you save will appear here
          </p>
          <Button className="mt-4" asChild>
            <Link href="/posts">Explore Posts</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

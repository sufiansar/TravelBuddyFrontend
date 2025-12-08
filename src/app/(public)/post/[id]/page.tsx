import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PostDetails } from "@/components/modules/posts/PostDetails/PostDetails";
import { PostDetailsSkeleton } from "@/components/modules/posts/PostDetails/PostDetailsSkeleton";

export default async function SinglePostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" asChild className="gap-2">
          <Link href="/posts">
            <ArrowLeft className="h-4 w-4" />
            Back to Feed
          </Link>
        </Button>
      </div>

      <Suspense fallback={<PostDetailsSkeleton />}>
        <PostDetails postId={id} />
      </Suspense>
    </div>
  );
}

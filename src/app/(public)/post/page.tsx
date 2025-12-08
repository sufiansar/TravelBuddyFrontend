import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PostsFeed } from "@/components/modules/posts/PostsFeed";
import { PostsFeedSkeleton } from "@/components/modules/posts/PostsFeedSkeleton";
import { PostsPageHeader } from "@/components/modules/posts/PostsPageHeader";

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <PostsPageHeader />

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Recent Posts</CardTitle>
              <CardDescription>
                Latest posts from the travel community
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Suspense fallback={<PostsFeedSkeleton />}>
            <PostsFeed searchParams={searchParams} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

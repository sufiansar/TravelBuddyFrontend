import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SavedPostsList } from "@/components/modules/post/SavedPostsList";
import { SavedPostsSkeleton } from "@/components/modules/post/SavedPostsSkeleton";

export default function SavedPostsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" asChild className="gap-2">
          <Link href="/posts">
            <ArrowLeft className="h-4 w-4" />
            Back to Feed
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Saved Posts</h1>
          <p className="text-muted-foreground">
            Posts you&apos;ve saved for later
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Saved Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<SavedPostsSkeleton />}>
            <SavedPostsList />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

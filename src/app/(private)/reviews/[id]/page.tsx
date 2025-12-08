import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { getReviewById } from "@/actions";
import { ReviewCard } from "@/components/modules/Review/ReviewCard";
import { ReviewsHeader } from "@/components/modules/Review/ReviewsHeader";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

async function SingleReviewContent({ reviewId }: { reviewId: string }) {
  const result = await getReviewById(reviewId);

  if (!result.success || !result.data) {
    notFound();
  }

  const review = result.data;

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(review.createdAt), "MMM d, yyyy")}</span>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/reviews/user/${review.receiverId}`}>
                All Reviews for {review.receiver?.fullName || "User"}
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ReviewCard review={review} showActions={true} />

          <div className="mt-6 pt-6 border-t space-y-4">
            <h3 className="font-semibold">Review Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Reviewed By</p>
                <p className="font-medium">
                  {review.reviewer?.fullName || "Anonymous"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Reviewed For</p>
                <p className="font-medium">
                  {review.receiver?.fullName || "User"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Travel Plan</p>
                <p className="font-medium">
                  {review.travelPlanId ? (
                    <Link
                      href={`/reviews/plan/${review.travelPlanId}`}
                      className="text-primary hover:underline"
                    >
                      View Plan
                    </Link>
                  ) : (
                    "Not associated with a plan"
                  )}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Last Updated</p>
                <p className="font-medium">
                  {format(
                    new Date(review.updatedAt),
                    "MMM d, yyyy 'at' h:mm a"
                  )}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default async function SingleReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="container mx-auto px-4 py-8">
      <ReviewsHeader
        title="Review Details"
        description="View and manage this review"
        showBackButton={true}
      />

      <Suspense
        fallback={
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-48 w-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        }
      >
        <SingleReviewContent reviewId={id} />
      </Suspense>
    </div>
  );
}

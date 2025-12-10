import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

import { Suspense } from "react";

import { ReviewForm } from "@/components/modules/Review/ReviewForm";
import { getUserCompletedTravelPlans, getUsersForReview } from "@/actions";
import { ReviewsHeader } from "@/components/modules/Review/ReviewsHeader";

async function ReviewFormContent() {
  const [usersResult, plansResult] = await Promise.all([
    getUsersForReview(),
    getUserCompletedTravelPlans(),
  ]);

  const users = usersResult.success ? usersResult.data || [] : [];
  const travelPlans = plansResult.success ? plansResult.data || [] : [];

  console.log("Users fetched:", users.length);
  console.log("Travel plans fetched:", travelPlans.length);

  return (
    <div className="space-y-4">
      {!usersResult.success && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load users: {usersResult.error}
          </AlertDescription>
        </Alert>
      )}

      {usersResult.success && users.length === 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No users available to review at the moment.
          </AlertDescription>
        </Alert>
      )}

      {!plansResult.success && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load travel plans: {plansResult.error}
          </AlertDescription>
        </Alert>
      )}

      {plansResult.success && travelPlans.length === 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You have no completed travel plans yet. Reviews can optionally be
            linked to completed trips, or you can review any user directly.
          </AlertDescription>
        </Alert>
      )}

      <ReviewForm users={users} travelPlans={travelPlans} />
    </div>
  );
}

export default async function CreateReviewPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ReviewsHeader
        title="Write a Review"
        description="Share your experience with fellow travelers or review a completed travel plan"
        showBackButton={true}
      />

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Create Review</CardTitle>
          <CardDescription>
            You can review any user you've traveled with, or optionally link
            your review to a completed travel plan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<ReviewFormSkeleton />}>
            <ReviewFormContent />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

function ReviewFormSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-10 w-32" />
    </div>
  );
}

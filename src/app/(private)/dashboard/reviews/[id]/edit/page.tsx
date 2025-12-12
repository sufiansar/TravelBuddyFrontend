import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  getReviewById,
  getUsersForReview,
  getUserCompletedTravelPlans,
} from "@/actions";
import { ReviewForm } from "@/components/modules/Review/ReviewForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/helpers/authOptions";

export default async function EditReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const [reviewResult, usersResult, plansResult] = await Promise.all([
    getReviewById(id),
    getUsersForReview(),
    getUserCompletedTravelPlans(),
  ]);

  if (!reviewResult.success || !reviewResult.data) {
    notFound();
  }

  const review = reviewResult.data;

  // Check if user owns this review
  if (review.reviewerId !== session.user.id) {
    redirect("/dashboard/reviews");
  }

  const users = usersResult.success ? usersResult.data : [];
  const travelPlans = plansResult.success ? plansResult.data : [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="gap-2">
          <Link href={`/dashboard/reviews/${id}`}>
            <ArrowLeft className="h-4 w-4" />
            Back to Review
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Review</CardTitle>
        </CardHeader>
        <CardContent>
          <ReviewForm
            reviewToEdit={review}
            users={users}
            travelPlans={travelPlans}
            receiverId={review.receiverId}
            travelPlanId={review.travelPlanId || undefined}
          />
        </CardContent>
      </Card>
    </div>
  );
}

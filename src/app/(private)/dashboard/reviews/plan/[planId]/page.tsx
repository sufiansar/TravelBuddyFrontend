import { getReviewsForPlan } from "@/actions";
import { RatingStars } from "@/components/modules/Review/RatingStars";
import { ReviewsLayout } from "@/components/modules/Review/ReviewsLayout";
import { ReviewsList } from "@/components/modules/Review/ReviewsList";
import { Button } from "@/components/ui/button";
import { PaginationParams } from "@/types/user.interface";
import Link from "next/link";

async function PlanReviewsContent({
  planId,
  searchParams,
}: {
  planId: string;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const filters: PaginationParams = {
    page: Number(params.page) || 1,
    limit: Number(params.limit) || 10,
    sortBy: params.sortBy as string,
    sortOrder: (params.sortOrder === "asc" || params.sortOrder === "desc"
      ? params.sortOrder
      : undefined) as "asc" | "desc" | undefined,
  };

  const result = await getReviewsForPlan(planId, filters);

  if (!result.success) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Error: {result.error}</p>
      </div>
    );
  }

  const reviews = result.success && "data" in result ? result.data : [];
  const meta =
    result.success && "meta" in result
      ? result.meta
      : {
          page: 1,
          limit: 10,
          totalPage: 1,
          total: 0,
          averageRating: null,
        };

  const averageRatingContent = meta.averageRating !== null && (
    <div className="mb-6 p-4 bg-muted rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Overall Rating</h3>
          <div className="flex items-center gap-2 mt-1">
            <RatingStars
              rating={meta.averageRating ?? 0}
              size="lg"
              showNumber
            />
            <span className="text-sm text-muted-foreground">
              ({meta.total} reviews)
            </span>
          </div>
        </div>
        <Button asChild>
          <Link href={`/reviews/create?planId=${planId}`}>Write a Review</Link>
        </Button>
      </div>
    </div>
  );

  return (
    <ReviewsList
      reviews={reviews}
      meta={meta}
      additionalContent={averageRatingContent}
      emptyState={{
        title: "No reviews yet",
        description: "Be the first to review this travel plan",
        action: {
          label: "Write a Review",
          href: `/reviews/create?planId=${planId}`,
        },
      }}
    />
  );
}

export default async function PlanReviewsPage({
  params,
  searchParams,
}: {
  params: Promise<{ planId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { planId } = await params;

  return (
    <ReviewsLayout
      headerProps={{
        title: "Travel Plan Reviews",
        description: `Reviews for travel plan #${planId}`,
        showBackButton: true,
      }}
    >
      <PlanReviewsContent planId={planId} searchParams={searchParams} />
    </ReviewsLayout>
  );
}

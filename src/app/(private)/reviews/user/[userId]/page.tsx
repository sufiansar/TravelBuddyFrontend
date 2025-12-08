import { getReviewsForUser } from "@/actions";
import { ReviewsLayout } from "@/components/modules/Review/ReviewsLayout";
import { ReviewsList } from "@/components/modules/Review/ReviewsList";
import { PaginationParams } from "@/types/review.types";

async function UserReviewsContent({
  userId,
  searchParams,
}: {
  userId: string;
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

  const result = await getReviewsForUser(userId, filters);

  if (!result.success) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Error: {result.error}</p>
      </div>
    );
  }

  const reviews = result.data || [];
  const meta = result.meta || {
    page: 1,
    limit: 10,
    totalPage: 1,
    total: 0,
  };

  return (
    <ReviewsList
      reviews={reviews}
      meta={meta}
      emptyState={{
        title: "No reviews yet",
        description: "This user doesn't have any reviews yet",
        action: {
          label: "Write a Review",
          href: `/reviews/create?receiverId=${userId}`,
        },
      }}
    />
  );
}

export default async function UserReviewsPage({
  params,
  searchParams,
}: {
  params: Promise<{ userId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { userId } = await params;

  return (
    <ReviewsLayout
      headerProps={{
        title: "User Reviews",
        description: `Reviews received by user #${userId}`,
        showBackButton: true,
        showCreateButton: true,
        createButtonHref: `/reviews/create?receiverId=${userId}`,
        createButtonLabel: "Write a Review",
      }}
    >
      <UserReviewsContent userId={userId} searchParams={searchParams} />
    </ReviewsLayout>
  );
}

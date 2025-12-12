import { getAllReviews } from "@/actions";
import { ReviewsLayout } from "@/components/modules/Review/ReviewsLayout";
import { ReviewsList } from "@/components/modules/Review/ReviewsList";
import { PaginationParams } from "@/types/review.types";

async function AllReviewsContent({
  searchParams,
}: {
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

  const result = await getAllReviews(filters);
  console.log(result);

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
        };

  return (
    <ReviewsList
      reviews={reviews}
      meta={meta}
      showActions={true}
      emptyState={{
        title: "No reviews found",
        description: "There are no reviews in the system yet",
        action: {
          label: "Write First Review",
          href: "/reviews/create",
        },
      }}
    />
  );
}

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <ReviewsLayout
      headerProps={{
        title: "Reviews",
        description: "Read and manage user reviews",
        showCreateButton: true,
        createButtonHref: "/reviews/create",
        createButtonLabel: "Write a Review",
      }}
    >
      <AllReviewsContent searchParams={searchParams} />
    </ReviewsLayout>
  );
}

import React from "react";
import { AdminReviewsClient } from "@/components/modules/Admin/AdminReviewsClient";
import { getAllReviews } from "@/actions";

// Mark this page as dynamic since it uses server session
export const dynamic = "force-dynamic";

interface ReviewsPageProps {
  searchParams?: {
    page?: string;
    limit?: string;
    searchTerm?: string;
    sortBy?: string;
    sortOrder?: string;
    minRating?: string;
  };
}

export default async function AdminReviewsPage({
  searchParams,
}: ReviewsPageProps) {
  const params = await searchParams;

  const filters = {
    page: Number(params?.page) || 1,
    limit: Number(params?.limit) || 10,
    searchTerm: params?.searchTerm || undefined,
    sortBy: params?.sortBy || "createdAt",
    sortOrder: (params?.sortOrder || "desc") as "asc" | "desc",
    minRating: params?.minRating ? parseInt(params.minRating) : undefined,
  };

  const result = await getAllReviews(filters);

  return (
    <AdminReviewsClient
      reviews={result.success ? result.data || [] : []}
      meta={result.success ? result.meta : { total: 0, page: 1, limit: 10 }}
      filters={filters}
    />
  );
}

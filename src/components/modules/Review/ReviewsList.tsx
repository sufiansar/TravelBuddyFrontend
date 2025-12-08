import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Review } from "@/types/review.types";

import { MessageSquare } from "lucide-react";
import { ReviewsEmptyState } from "./ReviewsEmptyState";
import { ReviewCard } from "./ReviewCard";

interface ReviewsListProps {
  reviews: Review[];
  meta: {
    page: number;
    limit: number;
    totalPage: number;
    total: number;
    averageRating?: number | null;
  };
  showActions?: boolean;
  emptyState?: {
    icon?: React.ReactNode;
    title: string;
    description: string;
    action?: {
      label: string;
      href: string;
    };
  };
  additionalContent?: React.ReactNode;
}

export function ReviewsList({
  reviews,
  meta,
  showActions = false,
  emptyState,
  additionalContent,
}: ReviewsListProps) {
  if (reviews.length === 0) {
    return (
      <ReviewsEmptyState
        icon={
          emptyState?.icon || (
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground" />
          )
        }
        title={emptyState?.title || "No reviews found"}
        description={emptyState?.description || "There are no reviews yet"}
        action={emptyState?.action}
      />
    );
  }

  return (
    <>
      {additionalContent}

      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            showActions={showActions}
          />
        ))}
      </div>

      {meta.totalPage > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={meta.page > 1 ? `?page=${meta.page - 1}` : undefined}
                className={
                  meta.page === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

            {Array.from({ length: Math.min(5, meta.totalPage) }, (_, i) => {
              let pageNum;
              if (meta.totalPage <= 5) {
                pageNum = i + 1;
              } else if (meta.page <= 3) {
                pageNum = i + 1;
              } else if (meta.page >= meta.totalPage - 2) {
                pageNum = meta.totalPage - 4 + i;
              } else {
                pageNum = meta.page - 2 + i;
              }

              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    href={`?page=${pageNum}`}
                    isActive={meta.page === pageNum}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            {meta.totalPage > 5 && meta.page < meta.totalPage - 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationNext
                href={
                  meta.page < meta.totalPage
                    ? `?page=${meta.page + 1}`
                    : undefined
                }
                className={
                  meta.page === meta.totalPage
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
}

export function ReviewsListSkeleton({
  showHeader = false,
}: {
  showHeader?: boolean;
}) {
  return (
    <div className="space-y-6">
      {showHeader && <Skeleton className="h-20 w-full" />}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    </div>
  );
}

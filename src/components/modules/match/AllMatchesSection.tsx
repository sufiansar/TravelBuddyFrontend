import { Suspense } from "react";
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { MapPin } from "lucide-react";

import { MatchCard } from "@/components/modules/match/MatchCard";
import { getAllMatches, PaginationParams } from "@/actions/matches/actions";

interface AllMatchesSectionProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function AllMatchesSection({
  searchParams,
}: AllMatchesSectionProps) {
  const params = await searchParams;

  const filters: PaginationParams = {
    page: Number(params.page) || 1,
    limit: Number(params.limit) || 10,
    searchTerm: params.searchTerm as string,
    sortBy: params.sortBy as "matchScore" | "createdAt" | "updatedAt",
    sortOrder: params.sortOrder as "asc" | "desc",
  };

  const result = await getAllMatches(filters);

  if (!result.success) {
    return (
      <div className="text-center py-12">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {result.error || "Failed to load matches"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const matches = result.data || [];
  const meta = result.meta;

  if (matches.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <MapPin className="h-12 w-12 mx-auto text-muted-foreground" />
        <div>
          <h3 className="text-lg font-semibold">No matches found</h3>
          <p className="text-muted-foreground">
            {filters.searchTerm
              ? "Try adjusting your search filters"
              : "No matches available yet"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {matches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>

      {meta && meta.totalPages > 1 && (
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

            {Array.from({ length: Math.min(5, meta.totalPages) }, (_, i) => {
              let pageNum;
              if (meta.totalPages <= 5) {
                pageNum = i + 1;
              } else if (meta.page <= 3) {
                pageNum = i + 1;
              } else if (meta.page >= meta.totalPages - 2) {
                pageNum = meta.totalPages - 4 + i;
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

            {meta.totalPages > 5 && meta.page < meta.totalPages - 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationNext
                href={
                  meta.page < meta.totalPages
                    ? `?page=${meta.page + 1}`
                    : undefined
                }
                className={
                  meta.page === meta.totalPages
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

export function AllMatchesSectionSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-full" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    </div>
  );
}

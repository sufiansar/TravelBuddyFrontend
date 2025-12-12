"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter } from "lucide-react";
import { ReviewFilters } from "@/components/modules/Admin/ReviewFilters";
import { ReviewTable } from "@/components/modules/Admin/ReviewTable";
import { ReviewExportButton } from "@/components/modules/Admin/ReviewExportButton";
import { useRouter, useSearchParams } from "next/navigation";

interface AdminReviewsClientProps {
  reviews: any[];
  meta: any;
  filters: any;
}

export function AdminReviewsClient({
  reviews,
  meta,
  filters,
}: AdminReviewsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (newFilters: any) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.set(key, String(value));
      }
    });
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reviews</h1>
          <p className="text-muted-foreground">
            Manage all user reviews and ratings
          </p>
        </div>
        <div className="flex gap-2">
          <ReviewExportButton reviews={reviews} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ReviewFilters
            onFilterChange={handleFilterChange}
            currentFilters={filters}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Reviews ({meta?.total || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <ReviewTable
            reviews={reviews}
            meta={meta}
            currentFilters={filters}
            onFiltersChange={handleFilterChange}
          />
        </CardContent>
      </Card>
    </div>
  );
}

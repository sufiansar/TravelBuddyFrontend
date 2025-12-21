"use client";

import { Review } from "@/types/review.types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { Pagination } from "@/components/Shared/Pagination";

interface ReviewTableProps {
  reviews: Review[];
  meta?: {
    page: number;
    limit: number;
    totalPage: number;
    total: number;
  };
  currentFilters: any;
  onFiltersChange: (filters: any) => void;
}

export function ReviewTable({
  reviews,
  meta,
  currentFilters,
  onFiltersChange,
}: ReviewTableProps) {
  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "bg-green-100 text-green-800";
    if (rating >= 3) return "bg-blue-100 text-blue-800";
    if (rating >= 2) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams();
    if (currentFilters) {
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value && key !== "page" && key !== "limit") {
          params.set(key, String(value));
        }
      });
    }
    params.set("page", page.toString());
    window.history.pushState(null, "", `?${params.toString()}`);
    onFiltersChange({ ...currentFilters, page });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reviewer</TableHead>
              <TableHead>Receiver</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Travel Plan</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews && reviews.length > 0 ? (
              reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={review.reviewer?.profileImage}
                          alt={review.reviewer?.fullName}
                        />
                        <AvatarFallback>
                          {review.reviewer?.fullName?.charAt(0) || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-sm">
                        <p className="font-medium">
                          {review.reviewer?.fullName || "Unknown"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          @{review.reviewer?.username || "N/A"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={review.receiver?.profileImage}
                          alt={review.receiver?.fullName}
                        />
                        <AvatarFallback>
                          {review.receiver?.fullName?.charAt(0) || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-sm">
                        <p className="font-medium">
                          {review.receiver?.fullName || "Unknown"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`gap-1 ${getRatingColor(review.rating)}`}>
                      <Star className="w-3 h-3 fill-current" />
                      {review.rating}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm max-w-xs truncate">
                      {review.comment || "No comment"}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">
                      {review.travelPlan?.destination || "No plan"}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">
                      {format(new Date(review.createdAt), "MMM dd, yyyy")}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link href={`/admin/reviews/${review.id}`}>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <p className="text-muted-foreground">No reviews found</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {meta && meta.totalPage > 1 && (
        <Pagination
          currentPage={meta.page}
          totalPages={meta.totalPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}

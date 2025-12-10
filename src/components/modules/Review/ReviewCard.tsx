"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  MoreVertical,
  Edit,
  Trash2,
  Calendar,
  User,
  MapPin,
} from "lucide-react";
import { format } from "date-fns";

import { RatingStars } from "./RatingStars";

import { toast } from "sonner";
import Link from "next/link";
import { Review } from "@/types/review.types";
import { deleteReview } from "@/actions";

interface ReviewCardProps {
  review: Review;
  showActions?: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (review: Review) => void;
}

export function ReviewCard({
  review,
  showActions = false,
  onDelete,
  onEdit,
}: ReviewCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteReview(review.id);
      if (result.success) {
        toast.success("Review deleted successfully");
        onDelete?.(review.id);
      } else {
        toast.error(result.error || "Failed to delete review");
      }
      setIsDeleteDialogOpen(false);
    });
  };

  return (
    <>
      <Card className="hover:shadow-sm transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={review.reviewer?.profileImage} />
                <AvatarFallback>
                  {review.reviewer?.fullName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">
                    {review.reviewer?.fullName || "Anonymous"}
                  </h4>
                  <Badge variant="outline" className="text-xs">
                    @{review.reviewer?.username || "user"}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 mt-1">
                  <RatingStars rating={review.rating} showNumber />
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(review.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
              </div>
            </div>

            {showActions && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onEdit && (
                    <DropdownMenuItem onClick={() => onEdit(review)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-gray-700 whitespace-pre-wrap">{review.comment}</p>

          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-3">
            {review.receiver && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Review for:{" "}
                  <Link
                    href={`/reviews/user/${review.receiver.id}`}
                    className="font-medium hover:underline"
                  >
                    {review.receiver.fullName}
                  </Link>
                </span>
              </div>
            )}

            {review.travelPlan && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {review.travelPlan.destination} •{" "}
                  <Link
                    href={`/travel-plans/${review.travelPlan.id}`}
                    className="font-medium hover:underline"
                  >
                    View Plan
                  </Link>
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this review? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

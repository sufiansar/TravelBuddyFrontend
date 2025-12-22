import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { getReviewById } from "@/actions/reviews/actions";
import { notFound } from "next/navigation";

// Mark this page as dynamic since it uses server session
export const dynamic = "force-dynamic";

interface ReviewDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ReviewDetailPage({
  params,
}: ReviewDetailPageProps) {
  const { id } = await params;

  const result = await getReviewById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const review = result.data;

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "bg-green-100 text-green-800";
    if (rating >= 3) return "bg-blue-100 text-blue-800";
    if (rating >= 2) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="space-y-6 p-6">
      <Link href="/admin/reviews">
        <Button variant="outline" className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Reviews
        </Button>
      </Link>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Review Details */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>Review Details</CardTitle>
                <Badge className={`gap-1 ${getRatingColor(review.rating)}`}>
                  <Star className="w-4 h-4 fill-current" />
                  {review.rating} / 5
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Reviewer Info */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  From
                </h3>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                  <Avatar>
                    <AvatarImage
                      src={review.reviewer?.profileImage}
                      alt={review.reviewer?.fullName}
                    />
                    <AvatarFallback>
                      {review.reviewer?.fullName?.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{review.reviewer?.fullName}</p>
                    <p className="text-sm text-muted-foreground">
                      @{review.reviewer?.username}
                    </p>
                  </div>
                </div>
              </div>

              {/* Receiver Info */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  To
                </h3>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                  <Avatar>
                    <AvatarImage
                      src={review.receiver?.profileImage}
                      alt={review.receiver?.fullName}
                    />
                    <AvatarFallback>
                      {review.receiver?.fullName?.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{review.receiver?.fullName}</p>
                    <p className="text-sm text-muted-foreground">
                      @{review.receiver?.username}
                    </p>
                  </div>
                </div>
              </div>

              {/* Travel Plan Info */}
              {review.travelPlan && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    Travel Plan
                  </h3>
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="font-medium">{review.travelPlan.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {review.travelPlan.destination}
                    </p>
                    {review.travelPlan.startDate &&
                      review.travelPlan.endDate && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(
                            new Date(review.travelPlan.startDate),
                            "MMM dd, yyyy"
                          )}{" "}
                          -{" "}
                          {format(
                            new Date(review.travelPlan.endDate),
                            "MMM dd, yyyy"
                          )}
                        </p>
                      )}
                  </div>
                </div>
              )}

              {/* Review Comment */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Comment
                </h3>
                <p className="text-sm leading-relaxed p-3 rounded-lg bg-muted">
                  {review.comment || "No comment provided"}
                </p>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Created</p>
                  <p className="text-sm font-medium">
                    {review.createdAt
                      ? format(new Date(review.createdAt), "PPP p")
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Last Updated
                  </p>
                  <p className="text-sm font-medium">
                    {review.updatedAt
                      ? format(new Date(review.updatedAt), "PPP p")
                      : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="destructive" className="w-full gap-2">
                <Trash2 className="w-4 h-4" />
                Delete Review
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

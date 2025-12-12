"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ThumbsUp, User } from "lucide-react";
import { format } from "date-fns";
import { getReviewsForUser } from "@/actions";
import { Review } from "@/types/review.types";
import Link from "next/link";

interface UserReviewsSectionProps {
  userId: string;
  userName: string;
}

export function UserReviewsSection({
  userId,
  userName,
}: UserReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState<number | null>(null);

  useEffect(() => {
    loadReviews();
  }, [userId]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const result = await getReviewsForUser(userId, { page: 1, limit: 10 });
      if (result.success && result.data) {
        const reviewData = Array.isArray(result.data) ? result.data : [];
        setReviews(reviewData);

        // Calculate average rating
        if (reviewData.length > 0) {
          const total = reviewData.reduce(
            (sum: number, review: any) => sum + (review.rating || 0),
            0
          );
          setAverageRating(total / reviewData.length);
        }
      }
    } catch (error) {
      console.error("Failed to load reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Star className="h-5 w-5" />
            Reviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading reviews...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      {averageRating && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Rating Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">
                  {averageRating.toFixed(1)}
                </div>
                <div className="flex justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(averageRating)
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                </p>
              </div>

              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = reviews.filter(
                    (r: any) => (r.rating || 0) === rating
                  ).length;
                  const percentage =
                    reviews.length > 0 ? (count / reviews.length) * 100 : 0;

                  return (
                    <div key={rating} className="flex items-center gap-2">
                      <span className="text-sm w-8">{rating}★</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-12 text-right">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Star className="h-5 w-5" />
            Reviews for {userName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <div className="text-center py-8">
              <Star className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground mb-2">No reviews yet</p>
              <p className="text-sm text-muted-foreground">
                {userName} hasn't received any reviews yet
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review: any) => (
                <div
                  key={review.id}
                  className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <Link href={`/users/public/${review.reviewer?.id || ""}`}>
                      <Avatar className="h-10 w-10 cursor-pointer hover:ring-2 ring-primary">
                        <AvatarImage src={review.reviewer?.profileImage} />
                        <AvatarFallback>
                          {review.reviewer?.fullName?.charAt(0) || (
                            <User className="h-5 w-5" />
                          )}
                        </AvatarFallback>
                      </Avatar>
                    </Link>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/users/public/${review.reviewer?.id || ""}`}
                            className="font-semibold hover:underline"
                          >
                            {review.reviewer?.fullName || "Anonymous"}
                          </Link>
                          {review.reviewer?.verifiedBadge && (
                            <Badge variant="secondary" className="text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(review.createdAt), "MMM d, yyyy")}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < (review.rating || 0)
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>

                      {review.comment && (
                        <p className="text-sm mb-2 whitespace-pre-wrap">
                          {review.comment}
                        </p>
                      )}

                      {review.travelPlan && (
                        <Link
                          href={`/travel-plans/${review.travelPlan.id}`}
                          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          Related to: {review.travelPlan.title} (
                          {review.travelPlan.destination})
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

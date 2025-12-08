"use client";

import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showNumber?: boolean;
  className?: string;
}

export function RatingStars({
  rating,
  maxRating = 5,
  size = "md",
  showNumber = false,
  className,
}: RatingStarsProps) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={`full-${i}`}
          className={cn(sizeClasses[size], "fill-yellow-400 text-yellow-400")}
        />
      ))}

      {hasHalfStar && (
        <div className="relative">
          <Star className={cn(sizeClasses[size], "text-gray-300")} />
          <StarHalf
            className={cn(
              sizeClasses[size],
              "fill-yellow-400 text-yellow-400 absolute inset-0"
            )}
          />
        </div>
      )}

      {[...Array(emptyStars)].map((_, i) => (
        <Star
          key={`empty-${i}`}
          className={cn(sizeClasses[size], "text-gray-300")}
        />
      ))}

      {showNumber && (
        <span className="ml-2 text-sm font-medium text-gray-700">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

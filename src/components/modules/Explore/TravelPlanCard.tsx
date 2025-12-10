"use client";

import { Calendar, MapPin, Users, DollarSign } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { TravelPlan } from "@/types/explore.interface";

interface TravelPlanCardProps {
  plan: TravelPlan;
}

export function TravelPlanCard({ plan }: TravelPlanCardProps) {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  const formatBudget = (min: number, max: number) => {
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1">{plan.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {plan.destination}
              </span>
            </div>
          </div>
          <Badge variant="outline" className="capitalize">
            {plan.travelType.toLowerCase().replace("_", " ")}
          </Badge>
        </div>

        {/* Dates */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm">
              {formatDate(plan.startDate)} - {formatDate(plan.endDate)}
            </span>
          </div>
        </div>

        {/* Budget */}
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium">
            {formatBudget(plan.minBudget, plan.maxBudget)}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
          {plan.description}
        </p>

        {/* User Info */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={plan.user.profileImage || ""} />
              <AvatarFallback>
                {plan.user.fullName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">
                  {plan.user.fullName}
                </span>
                {plan.user.verifiedBadge && (
                  <Badge variant="outline" className="h-4 px-1 text-[10px]">
                    ✓
                  </Badge>
                )}
              </div>
              <span className="text-xs text-gray-500">
                @{plan.user.username}
              </span>
            </div>
          </div>
          <Button size="sm" variant="outline" asChild>
            <Link href={`/travel-plans/${plan.id}`}>View Plan</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

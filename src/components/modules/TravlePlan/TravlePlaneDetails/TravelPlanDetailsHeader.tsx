"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Globe, User } from "lucide-react";
import Link from "next/link";
import { JoinRequestModal } from "@/components/modules/TravlePlan/JoinRequestModal";

interface TravelPlanDetailsHeaderProps {
  plan: any;
  isOwner: boolean;
}

export function TravelPlanDetailsHeader({
  plan,
  isOwner,
}: TravelPlanDetailsHeaderProps) {
  return (
    <div className="flex justify-between items-start">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="h-5 w-5 text-primary" />
          <h1 className="text-3xl font-bold">{plan.destination}</h1>
        </div>
        <div className="flex items-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Created by {plan.user?.fullName || "Unknown"}</span>
          </div>
          <Badge variant={plan.isPublic === "PUBLIC" ? "default" : "secondary"}>
            <Globe className="h-3 w-3 mr-1" />
            {plan.isPublic}
          </Badge>
        </div>
      </div>
      <div className="flex gap-2">
        {isOwner ? (
          <Button size="sm" variant="outline" asChild>
            <Link href={`/dashboard/travel-plans/${plan.id}/requests`}>
              View Requests ({plan.requests?.length || 0})
            </Link>
          </Button>
        ) : (
          plan.isPublic === "PUBLIC" && (
            <JoinRequestModal
              open={false}
              onOpenChange={() => {}}
              travelPlanId={plan.id}
              travelPlanDestination={plan.destination}
            />
          )
        )}
      </div>
    </div>
  );
}

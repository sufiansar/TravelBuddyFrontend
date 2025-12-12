"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, HandHeart } from "lucide-react";
import Link from "next/link";
import { JoinRequestModal } from "@/components/modules/TravlePlan/JoinRequestModal";

interface TravelPlanDetailsActionsProps {
  plan: any;
  isOwner: boolean;
}

export function TravelPlanDetailsActions({
  plan,
  isOwner,
}: TravelPlanDetailsActionsProps) {
  const [joinOpen, setJoinOpen] = useState(false);
  const isPublic = plan?.isPublic === "PUBLIC";

  return (
    <div className="flex flex-wrap gap-3">
      {isOwner && (
        <Button variant="outline" asChild>
          <Link href={`/dashboard/travel-plans/${plan.id}/requests`}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Manage Join Requests ({plan.requests?.length || 0})
          </Link>
        </Button>
      )}

      {!isOwner && isPublic && (
        <>
          <Button onClick={() => setJoinOpen(true)}>
            <HandHeart className="mr-2 h-4 w-4" />
            Request to Join
          </Button>
          <JoinRequestModal
            open={joinOpen}
            onOpenChange={setJoinOpen}
            travelPlanId={plan.id}
            travelPlanDestination={plan.destination}
          />
        </>
      )}

      {isPublic && (
        <Button asChild variant="secondary">
          <Link href={`/dashboard/reviews/plan/${plan.id}`}>
            <MessageSquare className="mr-2 h-4 w-4" />
            View Reviews ({plan.reviews?.length || 0})
          </Link>
        </Button>
      )}
    </div>
  );
}

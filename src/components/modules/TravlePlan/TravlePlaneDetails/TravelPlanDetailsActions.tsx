import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import Link from "next/link";

interface TravelPlanDetailsActionsProps {
  plan: any;
  isOwner: boolean;
}

export function TravelPlanDetailsActions({
  plan,
  isOwner,
}: TravelPlanDetailsActionsProps) {
  return (
    <div className="flex gap-4">
      {isOwner && (
        <Button variant="outline" asChild>
          <Link href={`/travel-plans/${plan.id}/requests`}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Manage Join Requests ({plan.requests?.length || 0})
          </Link>
        </Button>
      )}
      {plan.isPublic === "PUBLIC" && (
        <Button asChild>
          <Link href={`/reviews/plan/${plan.id}`}>
            <MessageSquare className="mr-2 h-4 w-4" />
            View Reviews ({plan.reviews?.length || 0})
          </Link>
        </Button>
      )}
    </div>
  );
}

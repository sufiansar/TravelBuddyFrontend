import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Globe,
  User,
  Clock,
  MessageSquare,
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { getTravelPlan } from "@/actions";
import { JoinRequestModal } from "@/components/modules/TravlePlan/JoinRequestModal";
import { TravelPlanDetailsHeader } from "./TravelPlanDetailsHeader";
import { TravelPlanDetailsGrid } from "./TravelPlanDetailsGrid";
import { TravelPlanDetailsStats } from "./TravelPlanDetailsStats";
import { TravelPlanDetailsActions } from "./TravelPlanDetailsActions";

interface TravelPlanDetailsProps {
  planId: string;
}

// Safe date parsing utility
const parseDate = (dateValue: any): Date => {
  if (dateValue instanceof Date) return dateValue;
  if (typeof dateValue === "string") return new Date(dateValue);
  return new Date();
};

export async function TravelPlanDetails({ planId }: TravelPlanDetailsProps) {
  const [planResult, session] = await Promise.all([
    getTravelPlan(planId),
    getServerSession(),
  ]);

  if (!planResult.success || !planResult.data) {
    notFound();
  }

  const plan = planResult.data;
  const isOwner = session?.user?.id === plan.userId;

  const startDate = parseDate(plan.startDate);
  const endDate = parseDate(plan.endDate);
  const createdAt = parseDate(plan.createdAt);
  const duration = differenceInDays(endDate, startDate) + 1;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Header */}
            <TravelPlanDetailsHeader plan={plan} isOwner={isOwner} />

            {/* Details Grid */}
            <TravelPlanDetailsGrid
              startDate={startDate}
              endDate={endDate}
              duration={duration}
              travelType={plan.travelType}
              minBudget={plan.minBudget}
              maxBudget={plan.maxBudget}
            />

            {/* Description */}
            {plan.description && (
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {plan.description}
                </p>
              </div>
            )}

            {/* Stats */}
            <TravelPlanDetailsStats
              matchesCount={plan.matches?.length || 0}
              requestsCount={plan.requests?.length || 0}
              reviewsCount={plan.reviews?.length || 0}
            />

            {/* Created Info */}
            <div className="pt-4 border-t text-sm text-muted-foreground">
              Created {format(createdAt, "MMM d, yyyy 'at' h:mm a")}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Related Actions */}
      <TravelPlanDetailsActions plan={plan} isOwner={isOwner} />
    </div>
  );
}

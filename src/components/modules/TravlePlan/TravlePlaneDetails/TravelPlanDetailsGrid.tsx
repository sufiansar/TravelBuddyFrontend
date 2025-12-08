import { Badge } from "@/components/ui/badge";
import { Calendar, Users, DollarSign, Clock } from "lucide-react";
import { format } from "date-fns";

interface TravelPlanDetailsGridProps {
  startDate: Date;
  endDate: Date;
  duration: number;
  travelType: string;
  minBudget?: number;
  maxBudget?: number;
}

export function TravelPlanDetailsGrid({
  startDate,
  endDate,
  duration,
  travelType,
  minBudget,
  maxBudget,
}: TravelPlanDetailsGridProps) {
  return (
    <>
      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Start Date</span>
          </div>
          <p className="font-semibold">{format(startDate, "MMM d, yyyy")}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>End Date</span>
          </div>
          <p className="font-semibold">{format(endDate, "MMM d, yyyy")}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Duration</span>
          </div>
          <p className="font-semibold">{duration} days</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>Travel Type</span>
          </div>
          <Badge variant="outline" className="font-semibold">
            {travelType}
          </Badge>
        </div>
      </div>

      {/* Budget */}
      {(minBudget || maxBudget) && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            <span>Budget Range</span>
          </div>
          <p className="font-semibold text-lg">
            {minBudget && maxBudget
              ? `$${minBudget} - $${maxBudget}`
              : minBudget
              ? `From $${minBudget}`
              : `Up to $${maxBudget}`}
          </p>
        </div>
      )}
    </>
  );
}

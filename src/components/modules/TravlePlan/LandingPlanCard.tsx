import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight } from "lucide-react";

interface TravelPlanCardProps {
  plan: any;
  showViewButton?: boolean;
  linkPrefix?: string;
}

const LandingTravelPlanCard = ({
  plan,
  showViewButton = true,
  linkPrefix = "/dashboard/travel-plans",
}: TravelPlanCardProps) => {
  console.log(plan);
  return (
    <Card className="border-border hover:shadow-lg transition-shadow overflow-hidden">
      <div className="relative h-48 md:h-56 bg-linear-to-r from-primary/80 to-primary/60">
        {plan.imageUrl && (
          <Image
            src={plan.imageUrl}
            alt={plan.destination}
            fill
            className="object-cover"
            sizes="100vw"
          />
        )}
      </div>

      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-foreground line-clamp-1">
            {plan.destination}
          </h3>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{plan.destination}</span>
          </div>
        </div>

        <div className="space-y-1 text-sm text-muted-foreground">
          <p>
            📅{" "}
            {new Date(plan.startDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}{" "}
            -{" "}
            {new Date(plan.endDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
          <p>✈️ {plan.travelType}</p>
          <p>
            💰 ${plan.minBudget} – ${plan.maxBudget}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Badge
            variant={plan.isPublic === "PUBLIC" ? "default" : "secondary"}
            className="capitalize"
          >
            {plan.isPublic}
          </Badge>

          {showViewButton && (
            <Link href={`${linkPrefix}/${plan.id || plan._id}`}>
              <Button variant="ghost" size="sm">
                View
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
};

export default LandingTravelPlanCard;

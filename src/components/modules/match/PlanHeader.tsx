import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, MapPin, DollarSign, Globe } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { getTravelPlan } from "@/actions";
import { Skeleton } from "@/components/ui/skeleton";

export async function PlanHeader({ planId }: { planId: string }) {
  const result = await getTravelPlan(planId);
  if (!result.success || !result.data) {
    notFound();
  }

  const plan = result.data;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Link href="/matches">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Matches
                </Button>
              </Link>
            </div>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <MapPin className="h-6 w-6" />
              {plan.destination}
            </CardTitle>
            <CardDescription className="mt-2 space-y-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(new Date(plan.startDate), "MMM d, yyyy")} -{" "}
                    {format(new Date(plan.endDate), "MMM d, yyyy")}
                  </span>
                </div>
                {plan.budget && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span>${plan.budget.toLocaleString()}</span>
                  </div>
                )}
                <Badge
                  variant={plan.isPublic === "PUBLIC" ? "default" : "secondary"}
                >
                  <Globe className="h-3 w-3 mr-1" />
                  {plan.isPublic}
                </Badge>
              </div>
              {plan.description && (
                <p className="mt-2 text-base">{plan.description}</p>
              )}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

export function PlanHeaderSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </CardHeader>
    </Card>
  );
}

import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { TravelPlanRequestsSkeleton } from "@/components/modules/TravlePlan/TravlePlanRequest/TravelPlanRequestsSkeleton";
import { TravelPlanRequests } from "@/components/modules/TravlePlan/TravlePlanRequest/TravelPlanRequests";

export default async function TravelPlanRequestsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" asChild className="gap-2">
          <Link href={`/travel-plans/${id}`}>
            <ArrowLeft className="h-4 w-4" />
            Back to Plan
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Manage Join Requests</h1>
          <p className="text-muted-foreground">
            Review and respond to requests from travelers who want to join your
            plan
          </p>
        </div>
      </div>

      <Suspense fallback={<TravelPlanRequestsSkeleton />}>
        <TravelPlanRequests planId={id} />
      </Suspense>
    </div>
  );
}

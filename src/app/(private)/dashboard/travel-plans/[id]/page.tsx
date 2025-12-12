import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { TravelPlanDetailsSkeleton } from "@/components/modules/TravlePlan/TravlePlaneDetails/TravelPlanDetailsSkeleton";
import { TravelPlanDetails } from "@/components/modules/TravlePlan/TravlePlaneDetails/TravelPlanDetails";

export default async function TravelPlanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" asChild className="gap-2">
          <Link href="/travel-plans">
            <ArrowLeft className="h-4 w-4" />
            Back to Plans
          </Link>
        </Button>
      </div>

      <Suspense fallback={<TravelPlanDetailsSkeleton />}>
        <TravelPlanDetails planId={id} />
      </Suspense>
    </div>
  );
}

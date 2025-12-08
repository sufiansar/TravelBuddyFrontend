import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PlanHeader,
  PlanHeaderSkeleton,
} from "@/components/modules/match/PlanHeader";
import { PlanMatchesClient } from "@/components/modules/match/PlanMatchesClient";
import {
  MatchesList,
  MatchesListSkeleton,
} from "@/components/modules/match/MatchesList";

export default async function PlanMatchesPage({
  params,
}: {
  params: Promise<{ planId: string }>;
}) {
  const { planId } = await params;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <Suspense fallback={<PlanHeaderSkeleton />}>
          <PlanHeader planId={planId} />
        </Suspense>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Generated Matches</CardTitle>
                <CardDescription>
                  Travel companions matched with this plan
                </CardDescription>
              </div>
              <PlanMatchesClient planId={planId} />
            </div>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<MatchesListSkeleton />}>
              <MatchesList planId={planId} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

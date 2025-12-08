import type { ITravelPlanResponse } from "@/actions";
import { MatchesClient } from "@/components/modules/match/MatchesClient";

interface MatchesHeaderProps {
  travelPlans: ITravelPlanResponse[];
}

export function MatchesHeader({ travelPlans }: MatchesHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Travel Matches</h1>
        <p className="text-muted-foreground mt-2">
          Connect with fellow travelers who share your interests and travel
          plans
        </p>
      </div>

      <MatchesClient travelPlans={travelPlans} />
    </div>
  );
}

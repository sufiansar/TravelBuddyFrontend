import { Users } from "lucide-react";
import { getMatchesForPlan } from "@/actions";
import { MatchCard } from "@/components/modules/match/MatchCard";
import { Skeleton } from "@/components/ui/skeleton";

export async function MatchesList({ planId }: { planId: string }) {
  const result = await getMatchesForPlan(planId);
  if (!result.success) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Error: {result.error}</p>
      </div>
    );
  }

  const matches = result.data || [];

  if (matches.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <Users className="h-12 w-12 mx-auto text-muted-foreground" />
        <div>
          <h3 className="text-lg font-semibold">No matches found</h3>
          <p className="text-muted-foreground">
            Generate matches for this travel plan to find potential companions
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  );
}

export function MatchesListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-48 w-full" />
      ))}
    </div>
  );
}

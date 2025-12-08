import { Skeleton } from "@/components/ui/skeleton";
import { Users, AlertCircle } from "lucide-react";

import { MatchCard } from "@/components/modules/match/MatchCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getMatchesForUser, TravelMatch } from "@/actions/matches/actions";

export async function MyMatchesSection() {
  const result = await getMatchesForUser();

  if (!result.success) {
    return (
      <div className="text-center py-12">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {result.error || "Failed to load your matches"}
          </AlertDescription>
        </Alert>
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
            Generate matches for your travel plans to find potential companions
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {matches.map((match: TravelMatch) => (
        <MatchCard key={match.id} match={match} showPlanDetails />
      ))}
    </div>
  );
}

export function MyMatchesSectionSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-48 w-full" />
      ))}
    </div>
  );
}

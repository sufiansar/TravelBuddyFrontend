interface TravelPlanDetailsStatsProps {
  matchesCount: number;
  requestsCount: number;
  reviewsCount: number;
}

export function TravelPlanDetailsStats({
  matchesCount,
  requestsCount,
  reviewsCount,
}: TravelPlanDetailsStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
      <div className="text-center p-4 bg-muted rounded-lg">
        <div className="text-2xl font-bold">{matchesCount}</div>
        <div className="text-sm text-muted-foreground">Matches</div>
      </div>
      <div className="text-center p-4 bg-muted rounded-lg">
        <div className="text-2xl font-bold">{requestsCount}</div>
        <div className="text-sm text-muted-foreground">Join Requests</div>
      </div>
      <div className="text-center p-4 bg-muted rounded-lg">
        <div className="text-2xl font-bold">{reviewsCount}</div>
        <div className="text-sm text-muted-foreground">Reviews</div>
      </div>
    </div>
  );
}

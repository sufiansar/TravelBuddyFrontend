import { Skeleton } from "@/components/ui/skeleton";

export function TravelPlansListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-64 w-full" />
      ))}
    </div>
  );
}

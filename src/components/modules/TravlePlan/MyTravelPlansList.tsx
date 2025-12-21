import { Button } from "@/components/ui/button";
import { MapPin, Plus } from "lucide-react";
import Link from "next/link";
import { getMyTravelPlans } from "@/actions";
import { TravelPlanCard } from "@/components/modules/TravlePlan/TravelPlanCard";
import { TravelPlansPagination } from "./TravelPlansPagination";

interface MyTravelPlansListProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function MyTravelPlansList({
  searchParams,
}: MyTravelPlansListProps) {
  const params = await searchParams;

  const filters = {
    page: Number(params.page) || 1,
    limit: Number(params.limit) || 10,
    sortBy: params.sortBy as string,
    sortOrder:
      params.sortOrder === "asc" || params.sortOrder === "desc"
        ? (params.sortOrder as "asc" | "desc")
        : undefined,
    searchTerm: params.searchTerm as string,
  };

  const result = await getMyTravelPlans(filters);

  if (!result.success) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Error: {result.error}</p>
      </div>
    );
  }

  const plans = result.data || [];
  const meta = result.meta || {
    page: 1,
    limit: 10,
    total: 0,
  };

  if (plans.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <MapPin className="h-12 w-12 mx-auto text-muted-foreground" />
        <div>
          <h3 className="text-lg font-semibold">No travel plans yet</h3>
          <p className="text-muted-foreground">
            Create your first travel plan to start your adventure
          </p>
          <Button className="mt-4" asChild>
            <Link href="/dashboard/travel-plans/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Travel Plan
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {plans.map((plan: any) => (
          <TravelPlanCard key={plan.id} plan={plan} showActions />
        ))}
      </div>
      {meta.total > meta.limit && (
        <TravelPlansPagination
          meta={meta}
          onPageChange={(page) => {
            const url = new URL(window.location.href);
            url.searchParams.set("page", String(page));
            window.history.pushState({}, "", url);
          }}
        />
      )}
    </>
  );
}

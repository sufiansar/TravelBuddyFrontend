import { getAllTravelPlans, getTravelTypes } from "@/actions";
import { Button } from "@/components/ui/button";
import { MapPin, Plus } from "lucide-react";
import Link from "next/link";
import { TravelPlanCard } from "./TravelPlanCard";
// import { TravelPlansPagination } from "./TravelPlansPagination";
import { TravelPlan } from "@/types/travlePlan.interface";
import { TravelPlansPagination } from "./TravelPlansPagination";
// Import the TravelPlan type

interface TravelPlansListProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function TravelPlansList({ searchParams }: TravelPlansListProps) {
  const params = await searchParams;

  const filters = {
    page: Number(params.page) || 1,
    limit: Number(params.limit) || 10,
    sortBy: params.sortBy as string,
    sortOrder: params.sortOrder as "asc" | "desc" | undefined,
    searchTerm: params.searchTerm as string,
    travelType: params.travelType as string,
    isPublic: params.isPublic as "PUBLIC" | "PRIVATE",
    minBudget: params.minBudget ? Number(params.minBudget) : undefined,
    maxBudget: params.maxBudget ? Number(params.maxBudget) : undefined,
  };

  const [plansResult, typesResult] = await Promise.all([
    getAllTravelPlans(),
    getTravelTypes(),
  ]);

  if (!plansResult.success) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Error: {plansResult.error}</p>
      </div>
    );
  }

  const plans = plansResult.data || [];
  const meta = plansResult.meta || {
    page: 1,
    limit: 10,
    total: 0,
  };

  const travelTypes = typesResult.success ? typesResult.data : [];

  if (plans.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <MapPin className="h-12 w-12 mx-auto text-muted-foreground" />
        <div>
          <h3 className="text-lg font-semibold">No travel plans found</h3>
          <p className="text-muted-foreground">
            {filters.searchTerm
              ? "Try adjusting your search filters"
              : "No travel plans available yet"}
          </p>
          <Button className="mt-4" asChild>
            <Link href="/dashboard/travel-plans/create">
              <Plus className="mr-2 h-4 w-4" />
              Create First Plan
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {plans.map((plan: TravelPlan) => (
          <TravelPlanCard key={plan.id} plan={plan} />
        ))}
      </div>

      {meta.total > meta.limit && (
        <TravelPlansPagination meta={meta} onPageChange={() => {}} />
      )}
    </>
  );
}

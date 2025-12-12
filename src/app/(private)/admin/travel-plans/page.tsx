import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Filter, Plus } from "lucide-react";
import { getAllTravelPlans } from "@/actions";

// Mark this page as dynamic since it uses server session
export const dynamic = "force-dynamic";
import { TravelPlanTable } from "@/components/modules/Admin/TravelPlanTable";
import { TravelPlanFilters } from "@/components/modules/Admin/TravleFilter";

interface TravelPlansPageProps {
  searchParams?: {
    destination?: string;
    travelType?: string;
    isPublic?: string;
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}

export default async function AdminTravelPlansPage({
  searchParams,
}: TravelPlansPageProps) {
  const filters = {
    destination: searchParams?.destination,
    travelType: searchParams?.travelType,
    isPublic: searchParams?.isPublic,
    page: searchParams?.page ? parseInt(searchParams.page) : 1,
    limit: searchParams?.limit ? parseInt(searchParams.limit) : 10,
    sortBy: searchParams?.sortBy,
    sortOrder: searchParams?.sortOrder as "asc" | "desc",
  };

  const result = await getAllTravelPlans(filters as any);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Travel Plans</h1>
          <p className="text-gray-600">
            Manage all travel plans created by users
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>All Travel Plans</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <TravelPlanFilters initialFilters={filters} />

          {result.success ? (
            <TravelPlanTable
              plans={result.data || []}
              meta={result.meta}
              currentFilters={filters}
            />
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-500">
                Failed to load travel plans: {result.error}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { TravelPlanFilters } from "@/components/modules/TravlePlan/TravelPlanFilters";
import { TravelPlansListSkeleton } from "@/components/modules/TravlePlan/TravelPlansListSkeleton";
import { TravelPlansList } from "@/components/modules/TravlePlan/TravelPlansList";

export default async function TravelPlansPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Travel Plans</h1>
          <p className="text-muted-foreground mt-2">
            Discover and join travel plans from fellow adventurers
          </p>
        </div>
        <Button asChild>
          <Link href="/travel-plans/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Plan
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>All Travel Plans</CardTitle>
              <CardDescription>
                Browse through available travel plans and find your next
                adventure
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <TravelPlanFilters travelTypes={[]} showAdvanced />

          <Suspense fallback={<TravelPlansListSkeleton />}>
            <TravelPlansList searchParams={searchParams} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

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
import { MyTravelPlansList } from "@/components/modules/TravlePlan/MyTravelPlansList";
import { TravelPlansListSkeleton } from "@/components/modules/TravlePlan/TravelPlansListSkeleton";
import { TravelType } from "@/types/admin.interface";

export default function MyTravelPlansPage({
  searchParams,
  travelTypes,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  travelTypes: TravelType[];
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Travel Plans</h1>
          <p className="text-muted-foreground mt-2">
            Manage and view all your travel plans in one place
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/travel-plans/create">
            <Plus className="mr-2 h-4 w-4" />
            Create New Plan
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Your Travel Plans</CardTitle>
              <CardDescription>All travel plans created by you</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <TravelPlanFilters travelTypes={travelTypes} />

          <Suspense fallback={<TravelPlansListSkeleton />}>
            <MyTravelPlansList searchParams={searchParams} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

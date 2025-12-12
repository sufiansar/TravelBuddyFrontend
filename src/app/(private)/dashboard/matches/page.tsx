import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, MapPin } from "lucide-react";
import { getMyTravelPlans, type ITravelPlanResponse } from "@/actions";
import { MatchesFilter } from "@/components/modules/match/MatchesFilter";
import {
  MyMatchesSection,
  MyMatchesSectionSkeleton,
} from "@/components/modules/match/MyMatchesSection";
import {
  AllMatchesSection,
  AllMatchesSectionSkeleton,
} from "@/components/modules/match/AllMatchesSection";
import { MatchesHeader } from "@/components/modules/match/MatchesHeader";

// Import components from local folder

export default async function MatchesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [travelPlansResult] = await Promise.all([getMyTravelPlans({})]);

  const travelPlans: ITravelPlanResponse[] =
    travelPlansResult.success && travelPlansResult.data
      ? travelPlansResult.data
      : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <MatchesHeader travelPlans={travelPlans} />

      <Tabs defaultValue="my-matches" className="space-y-6">
        <TabsList className="grid w-full md:w-auto grid-cols-2">
          <TabsTrigger value="my-matches" className="gap-2">
            <Users className="h-4 w-4" />
            My Matches
          </TabsTrigger>
          <TabsTrigger value="all-matches" className="gap-2">
            <MapPin className="h-4 w-4" />
            All Matches
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-matches" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>People Matched With Your Plans</CardTitle>
              <CardDescription>
                Travelers who have overlapping plans with your destinations and
                dates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<MyMatchesSectionSkeleton />}>
                <MyMatchesSection />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all-matches" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>All Travel Matches</CardTitle>
                  <CardDescription>
                    Browse and search through all travel matches in the system
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <MatchesFilter />
              <Suspense fallback={<AllMatchesSectionSkeleton />}>
                <AllMatchesSection searchParams={searchParams} />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

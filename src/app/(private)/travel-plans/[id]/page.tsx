import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { getSingleTravelPlan } from "@/actions/travelPlans/actions";
import { getMatchesForPlan } from "@/actions/matches/actions";
import { getUserSession } from "@/helpers/userSession";
import { TravelPlanMatches } from "@/components/modules/TravelPlanMatches";
import { Calendar, DollarSign, MapPin, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default async function TravelPlanDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getUserSession();
  const [planResult, matchesResult] = await Promise.all([
    getSingleTravelPlan(params.id),
    getMatchesForPlan(params.id),
  ]);

  if (!planResult.success || !planResult.data) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Plan not found
        </h2>
        <p className="text-muted-foreground mb-6">
          The travel plan you're looking for doesn't exist or has been removed.
        </p>
        <Link href="/travel-plans">
          <Button>Back to Travel Plans</Button>
        </Link>
      </div>
    );
  }

  const plan = planResult.data as any;
  const matches = matchesResult.success ? matchesResult.data : [];
  const isOwner = session?.user?.id === plan.userId;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <Link href="/travel-plans">
        <Button variant="outline" className="mb-6">
          ← Back to Plans
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-border">
            <CardContent className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold mb-2 text-foreground">
                    {plan.destination}
                  </h1>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(plan.startDate).toLocaleDateString()} -{" "}
                        {new Date(plan.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                {isOwner && (
                  <Link href={`/travel-plans/${params.id}/edit`}>
                    <Button variant="outline" size="sm">
                      Edit Plan
                    </Button>
                  </Link>
                )}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-sm">Budget</span>
                  </div>
                  <p className="text-lg font-semibold text-foreground">
                    ${plan.minBudget} - ${plan.maxBudget}
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">Travel Type</span>
                  </div>
                  <p className="text-lg font-semibold text-foreground">
                    {plan.travelType}
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">Visibility</span>
                  </div>
                  <Badge
                    variant={
                      plan.isPublic === "PUBLIC" ? "default" : "secondary"
                    }
                  >
                    {plan.isPublic}
                  </Badge>
                </div>
              </div>

              {/* Description */}
              {plan.description && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-3 text-foreground">
                    About This Trip
                  </h3>
                  <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                    {plan.description}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              {!isOwner && (
                <div className="border-t border-border pt-6 flex gap-3">
                  <Button className="flex-1">Request to Join</Button>
                  <Button variant="outline" className="flex-1">
                    Save Plan
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Matches Section */}
          <TravelPlanMatches
            planId={params.id}
            matches={matches as any}
            isOwner={isOwner}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Host Info */}
          <Card className="border border-border">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-foreground">
                Trip Host
              </h3>
              <div className="flex items-center gap-3 mb-4">
                {plan.user?.profileImage ? (
                  <Image
                    src={plan.user.profileImage}
                    alt={plan.user.fullName}
                    width={56}
                    height={56}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-foreground font-semibold">
                    {plan.user?.fullName?.slice(0, 2)?.toUpperCase() || "U"}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-foreground">
                    {plan.user?.fullName}
                  </p>
                  {plan.user?.currentLocation && (
                    <p className="text-sm text-muted-foreground">
                      {plan.user.currentLocation}
                    </p>
                  )}
                </div>
              </div>
              <Link href={`/profile/${plan.userId}`}>
                <Button variant="outline" className="w-full">
                  View Profile
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* User Interests */}
          {plan.user?.interests && plan.user.interests.length > 0 && (
            <Card className="border border-border">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3 text-foreground">
                  Host's Interests
                </h3>
                <div className="flex flex-wrap gap-2">
                  {plan.user.interests.map((interest: string) => (
                    <Badge key={interest} variant="outline">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

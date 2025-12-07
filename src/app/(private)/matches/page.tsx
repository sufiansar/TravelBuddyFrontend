import { getMatchesForUser } from "@/actions/matches/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { MapPin, Calendar, Users, Star } from "lucide-react";

export default async function MatchesPage() {
  const result = await getMatchesForUser();
  const matches = result.success ? result.data : [];

  if (!matches || matches.length === 0) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-foreground">
          Your Matches
        </h1>
        <Card className="border border-border">
          <CardContent className="p-12 text-center">
            <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2 text-foreground">
              No Matches Yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Create a travel plan to start finding potential travel buddies!
            </p>
            <Link href="/travel-plans/add">
              <Button>Create Travel Plan</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-foreground">Your Matches</h1>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {matches.length} {matches.length === 1 ? "Match" : "Matches"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {matches.map((match: any) => (
          <Card
            key={match.id}
            className="border border-border hover:shadow-lg transition"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={match.matchedUser?.profileImage}
                      alt={match.matchedUser?.fullName}
                    />
                    <AvatarFallback>
                      {match.matchedUser?.fullName
                        ?.slice(0, 2)
                        ?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg text-foreground">
                      {match.matchedUser?.fullName}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {match.matchedUser?.currentLocation || "Location not set"}
                    </p>
                  </div>
                </div>
                <Badge className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  {match.matchScore || 0}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Travel Plan Info */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-foreground">
                    {match.travelPlan?.destination}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(match.travelPlan?.startDate).toLocaleDateString()}{" "}
                    - {new Date(match.travelPlan?.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* User Interests */}
              {match.matchedUser?.interests &&
                match.matchedUser.interests.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2 text-foreground">
                      Interests
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {match.matchedUser.interests
                        .slice(0, 3)
                        .map((interest: string) => (
                          <Badge
                            key={interest}
                            variant="outline"
                            className="text-xs"
                          >
                            {interest}
                          </Badge>
                        ))}
                      {match.matchedUser.interests.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{match.matchedUser.interests.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Link
                  href={`/profile/${match.matchedUser?.id}`}
                  className="flex-1"
                >
                  <Button variant="outline" className="w-full">
                    View Profile
                  </Button>
                </Link>
                <Link
                  href={`/travel-plans/${match.travelPlanId}`}
                  className="flex-1"
                >
                  <Button className="w-full">View Plan</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

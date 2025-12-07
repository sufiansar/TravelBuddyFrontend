"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Sparkles, Star, Loader2, Users } from "lucide-react";
import { generateMatches } from "@/actions/matches/actions";
import { useRouter } from "next/navigation";

interface Match {
  id: string;
  matchScore: number;
  matchedUser: {
    id: string;
    fullName: string;
    profileImage?: string;
    currentLocation?: string;
    interests?: string[];
    verifiedBadge?: boolean;
  };
}

interface TravelPlanMatchesProps {
  planId: string;
  matches: Match[];
  isOwner: boolean;
}

export function TravelPlanMatches({
  planId,
  matches,
  isOwner,
}: TravelPlanMatchesProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerateMatches = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await generateMatches(planId);
      if (result.success) {
        router.refresh();
      } else {
        setError(result.error || "Failed to generate matches");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2 text-foreground">
            <Users className="h-5 w-5 text-primary" />
            Potential Travel Buddies
          </CardTitle>
          {isOwner && (
            <Button
              onClick={handleGenerateMatches}
              disabled={loading}
              size="sm"
              variant="outline"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Find Matches
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {error && (
          <div className="bg-destructive/10 border border-destructive/50 text-destructive px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {!matches || matches.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">
              {isOwner
                ? "No matches found yet. Click 'Find Matches' to discover potential travel buddies!"
                : "No matches available for this plan."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.slice(0, 3).map((match) => (
              <div
                key={match.id}
                className="flex items-start gap-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition"
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={match.matchedUser?.profileImage}
                    alt={match.matchedUser?.fullName}
                  />
                  <AvatarFallback>
                    {match.matchedUser?.fullName?.slice(0, 2)?.toUpperCase() ||
                      "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Link
                      href={`/profile/${match.matchedUser?.id}`}
                      className="font-semibold text-foreground hover:text-primary transition truncate"
                    >
                      {match.matchedUser?.fullName}
                    </Link>
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1 text-xs"
                    >
                      <Star className="h-3 w-3" />
                      {match.matchScore}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {match.matchedUser?.currentLocation || "Location not set"}
                  </p>
                  {match.matchedUser?.interests &&
                    match.matchedUser.interests.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {match.matchedUser.interests
                          .slice(0, 3)
                          .map((interest) => (
                            <Badge
                              key={interest}
                              variant="outline"
                              className="text-xs"
                            >
                              {interest}
                            </Badge>
                          ))}
                      </div>
                    )}
                </div>

                <Link href={`/profile/${match.matchedUser?.id}`}>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </Link>
              </div>
            ))}

            {matches.length > 3 && (
              <div className="text-center pt-2">
                <Link href="/matches">
                  <Button variant="link" className="text-primary">
                    View all {matches.length} matches →
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

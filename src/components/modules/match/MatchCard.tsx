"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, MapPin, Users, X, MessageSquare, User } from "lucide-react";
import { format } from "date-fns";

import { useTransition } from "react";
import { toast } from "sonner";
import { deleteMatch, TravelMatch } from "@/actions/matches/actions";

interface MatchCardProps {
  match: TravelMatch;
  showPlanDetails?: boolean;
}

export function MatchCard({ match, showPlanDetails = false }: MatchCardProps) {
  const [isPending, startTransition] = useTransition();

  const getMatchQuality = (score: number) => {
    if (score >= 80) return { label: "Excellent", variant: "default" as const };
    if (score >= 60) return { label: "Good", variant: "secondary" as const };
    if (score >= 40) return { label: "Fair", variant: "outline" as const };
    return { label: "Poor", variant: "destructive" as const };
  };

  const quality = getMatchQuality(match.matchScore);

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this match?")) return;

    startTransition(async () => {
      const result = await deleteMatch(match.id);
      if (result.success) {
        toast.success("Match deleted successfully");
      } else {
        toast.error(result.error || "Failed to delete match");
      }
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-primary/10">
              <AvatarImage src={match.matchedUser.avatar} />
              <AvatarFallback className="bg-primary/10">
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">
                {match.matchedUser.fullName}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {match.matchedUser.email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={quality.variant} className="font-semibold">
              {quality.label}
            </Badge>
            <Badge variant="outline" className="font-semibold">
              Score: {match.matchScore}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={isPending}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {match.matchedUser.bio && (
          <p className="text-sm text-muted-foreground">
            {match.matchedUser.bio}
          </p>
        )}

        {match.matchedUser.interests &&
          match.matchedUser.interests.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Users className="h-4 w-4" />
                <span>Common Interests</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {match.matchedUser.interests.map((interest) => (
                  <Badge key={interest} variant="secondary" className="text-xs">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          )}

        {showPlanDetails && match.travelPlan && (
          <div className="space-y-3 pt-3 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="font-medium">
                  {match.travelPlan.destination}
                </span>
              </div>
              {match.travelPlan.budget && (
                <Badge variant="outline">
                  ${match.travelPlan.budget.toLocaleString()}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              <span>
                {format(new Date(match.travelPlan.startDate), "MMM d")} -{" "}
                {format(new Date(match.travelPlan.endDate), "MMM d, yyyy")}
              </span>
            </div>

            {match.travelPlan.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {match.travelPlan.description}
              </p>
            )}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button size="sm" variant="outline" className="flex-1 gap-2">
            <User className="h-4 w-4" />
            View Profile
          </Button>
          <Button size="sm" className="flex-1 gap-2">
            <MessageSquare className="h-4 w-4" />
            Connect
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Globe, Clock } from "lucide-react";
import { format, isPast, isFuture } from "date-fns";
import { getAllTravelPlans } from "@/actions";
import Link from "next/link";

interface TravelHistoryProps {
  userId: string;
  userName: string;
}

interface TravelPlan {
  id: string;
  title: string;
  description?: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelType: string;
  budget?: number;
  activities?: string[];
  user: {
    id: string;
    fullName: string;
  };
}

export function TravelHistory({ userId, userName }: TravelHistoryProps) {
  const [plans, setPlans] = useState<TravelPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");

  useEffect(() => {
    loadPlans();
  }, [userId]);

  const loadPlans = async () => {
    setLoading(true);
    try {
      const result = await getAllTravelPlans();
      if (result.success && result.data) {
        const allPlans = Array.isArray(result.data)
          ? result.data
          : result.data.data || [];
        // Filter plans by user
        const userPlans = allPlans.filter(
          (plan: TravelPlan) => plan.user.id === userId
        );
        setPlans(userPlans);
      }
    } catch (error) {
      console.error("Failed to load travel plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredPlans = () => {
    const now = new Date();

    switch (filter) {
      case "upcoming":
        return plans.filter((plan) => isFuture(new Date(plan.startDate)));
      case "past":
        return plans.filter((plan) => isPast(new Date(plan.endDate)));
      default:
        return plans;
    }
  };

  const filteredPlans = getFilteredPlans();
  const upcomingCount = plans.filter((plan) =>
    isFuture(new Date(plan.startDate))
  ).length;
  const pastCount = plans.filter((plan) =>
    isPast(new Date(plan.endDate))
  ).length;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Travel History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading travel plans...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-primary">
              {plans.length}
            </div>
            <div className="text-sm text-muted-foreground">Total Trips</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-green-600">
              {upcomingCount}
            </div>
            <div className="text-sm text-muted-foreground">Upcoming</div>
          </CardContent>
        </Card>
        <Card className="hidden md:block">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-gray-600">{pastCount}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
      </div>

      {/* Travel Plans */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Travel Plans
            </CardTitle>

            <div className="flex gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
              >
                All ({plans.length})
              </Button>
              <Button
                variant={filter === "upcoming" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("upcoming")}
              >
                Upcoming ({upcomingCount})
              </Button>
              <Button
                variant={filter === "past" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("past")}
              >
                Past ({pastCount})
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredPlans.length === 0 ? (
            <div className="text-center py-8">
              <Globe className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground mb-2">
                No {filter !== "all" ? filter : ""} travel plans
              </p>
              <p className="text-sm text-muted-foreground">
                {userName} hasn't created any {filter !== "all" ? filter : ""}{" "}
                travel plans yet
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPlans.map((plan) => {
                const isPastTrip = isPast(new Date(plan.endDate));
                const isUpcoming = isFuture(new Date(plan.startDate));

                return (
                  <Link
                    key={plan.id}
                    href={`/travel-plans/${plan.id}`}
                    className="block"
                  >
                    <div className="p-4 border rounded-lg hover:bg-accent transition-colors">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-2 mb-2">
                            <h4 className="font-semibold line-clamp-1">
                              {plan.title}
                            </h4>
                            {isUpcoming && (
                              <Badge variant="default" className="shrink-0">
                                Upcoming
                              </Badge>
                            )}
                            {isPastTrip && (
                              <Badge variant="secondary" className="shrink-0">
                                Completed
                              </Badge>
                            )}
                          </div>

                          {plan.description && (
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {plan.description}
                            </p>
                          )}

                          <div className="flex flex-wrap gap-3 text-sm">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>{plan.destination}</span>
                            </div>

                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {format(new Date(plan.startDate), "MMM d")} -{" "}
                                {format(new Date(plan.endDate), "MMM d, yyyy")}
                              </span>
                            </div>

                            {plan.travelType && (
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span className="capitalize">
                                  {plan.travelType}
                                </span>
                              </div>
                            )}
                          </div>

                          {plan.activities && plan.activities.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {plan.activities
                                .slice(0, 3)
                                .map((activity, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {activity}
                                  </Badge>
                                ))}
                              {plan.activities.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{plan.activities.length - 3} more
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>

                        {plan.budget && (
                          <div className="text-right shrink-0">
                            <div className="text-sm text-muted-foreground">
                              Budget
                            </div>
                            <div className="font-semibold">${plan.budget}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

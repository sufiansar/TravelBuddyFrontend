"use server";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { MapPin, Users, Calendar, Heart, ArrowRight, Plus } from "lucide-react";
import { getMyProfile } from "@/actions";
import { getAllTravelPlans } from "@/actions/travelPlans/actions";

const DashboardHome = async () => {
  const [profileResult, plansResult] = await Promise.all([
    getMyProfile(),
    getAllTravelPlans(),
  ]);

  const userProfile = profileResult.success ? profileResult.data : null;

  let travelPlans: any[] = [];
  if (plansResult.success && plansResult.data) {
    travelPlans = Array.isArray(plansResult.data)
      ? plansResult.data
      : (plansResult.data as any).data || [];
  }

  const activePlans = travelPlans.length;
  const destinationCount = new Set(
    travelPlans.map((plan: any) => plan.destination)
  ).size;

  const pendingRequests = travelPlans.reduce(
    (sum: number, plan: any) =>
      sum +
      (plan.requests?.filter((r: any) => r.status === "PENDING").length || 0),
    0
  );

  const stats = [
    {
      label: "Active Plans",
      value: activePlans.toString(),
      icon: Calendar,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      label: "Pending Requests",
      value: pendingRequests.toString(),
      icon: Users,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950",
    },
    {
      label: "Destinations",
      value: destinationCount.toString(),
      icon: MapPin,
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-950",
    },
    {
      label: "Travel Type",
      value: travelPlans[0]?.travelType || "Mixed",
      icon: Heart,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-950",
    },
  ];

  const recentPlans =
    travelPlans && travelPlans.length > 0 ? travelPlans.slice(0, 3) : [];

  const quickActions = [
    {
      label: "Create Travel Plan",
      href: "/dashboard/travel-plans/create",
      icon: Plus,
    },
    { label: "Browse Travelers", href: "/explore", icon: Users },
    { label: "View All Plans", href: "/dashboard/travel-plans", icon: MapPin },
    { label: "Profile Settings", href: "/users/me/edit", icon: Users },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground">
          Welcome to Your Dashboard
        </h1>
        <p className="text-lg text-muted-foreground">
          Plan your next adventure and connect with fellow travelers
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className="p-6 border-border hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-foreground mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.bgColor} p-4 rounded-lg`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link key={index} href={action.href}>
                <Card className="p-6 border-border hover:shadow-lg hover:bg-muted transition-all cursor-pointer h-full">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">
                      {action.label}
                    </span>
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Travel Plans */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Recent Plans</h2>
          <Link href="/travel-plans">
            <Button variant="outline" size="sm">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentPlans && recentPlans.length > 0 ? (
            recentPlans.map((plan: any) => (
              <Card
                key={plan._id || plan.id}
                className="border-border hover:shadow-lg transition-shadow overflow-hidden"
              >
                {/* Card Header with Background */}
                <div className="h-32 bg-linear-to-r from-primary/80 to-primary/60"></div>

                {/* Card Content */}
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-foreground">
                      {plan.title}
                    </h3>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{plan.destination}</span>
                    </div>
                  </div>

                  {/* Plan Details */}
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      📅{" "}
                      {new Date(plan.startDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      -{" "}
                      {new Date(plan.endDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <p>
                      💰 ${plan.minBudget} - ${plan.maxBudget}
                    </p>
                    <p>✈️ {plan.travelType}</p>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <Badge
                      variant={
                        plan.isPublic === "PUBLIC" ? "default" : "secondary"
                      }
                      className="capitalize"
                    >
                      {plan.isPublic || "PUBLIC"}
                    </Badge>
                    <Link href={`/travel-plans/${plan._id || plan.id}`}>
                      <Button variant="ghost" size="sm">
                        View
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="col-span-full p-12 text-center border-border">
              <div className="space-y-4">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    No Travel Plans Yet
                  </h3>
                  <p className="text-muted-foreground">
                    Create your first travel plan to get started!
                  </p>
                </div>
                <Link href="/travel-plans/create">
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Travel Plan
                  </Button>
                </Link>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <Card className="border-border bg-linear-to-r from-primary/10 to-primary/5 p-8">
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-foreground">
            Ready for Your Next Adventure?
          </h3>
          <p className="text-muted-foreground max-w-2xl">
            Create a new travel plan, connect with fellow travelers, or explore
            popular destinations.
          </p>
          <div className="flex gap-4 pt-2">
            <Link href="/travel-plans/create">
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Create Travel Plan
              </Button>
            </Link>
            <Link href="/explore">
              <Button variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Explore Travelers
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DashboardHome;

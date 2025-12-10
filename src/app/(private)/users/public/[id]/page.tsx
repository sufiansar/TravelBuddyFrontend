import { notFound } from "next/navigation";

import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, Globe, Star, Award } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { getPublicProfile } from "@/actions";

interface PublicProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: PublicProfilePageProps): Promise<Metadata> {
  const { id } = await params;
  if (!id) {
    return { title: "Profile Not Found | TravelBuddy" };
  }

  const result = await getPublicProfile(id);

  const profile = result.success ? (result.data as any) : null;
  const user = profile?.user ?? profile;

  if (!result.success || !user) {
    return {
      title: "Profile Not Found | TravelBuddy",
    };
  }

  return {
    title: `${user.fullName} | TravelBuddy`,
    description: user.bio || `Public profile of ${user.fullName}`,
  };
}

export default async function PublicProfilePage({
  params,
}: PublicProfilePageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const result = await getPublicProfile(id);

  const profile = result.success ? (result.data as any) : null;
  const user = profile?.user ?? profile;

  if (!result.success || !user) {
    return (
      <div className="container mx-auto py-6 space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/explore">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Explore
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold">Profile not available</h1>
        </div>
        <p className="text-muted-foreground">
          We couldn’t load this traveler right now. Please try again later or
          check the link.
        </p>
        {result.error && (
          <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded p-2">
            {result.error}
          </p>
        )}
      </div>
    );
  }

  const upcomingPlans = profile?.upcomingPlans ?? [];
  const recentReviews = profile?.recentReviews ?? [];
  const averageRating = profile?.averageRating ?? null;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Public Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <Avatar className="h-32 w-32 border-4 border-background">
                  <AvatarImage src={user.profileImage} />
                  <AvatarFallback className="text-2xl">
                    {user.fullName?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold">{user.fullName}</h1>
                      {user.verifiedBadge && (
                        <Badge variant="secondary" className="gap-1">
                          <Award className="h-3 w-3" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    {user.username && (
                      <p className="text-muted-foreground">@{user.username}</p>
                    )}
                  </div>

                  {user.bio && (
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {user.bio}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-4 text-sm">
                    {user.currentLocation && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{user.currentLocation}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Member since{" "}
                        {format(new Date(user.createdAt), "MMM yyyy")}
                      </span>
                    </div>
                    {averageRating && (
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span>{averageRating.toFixed(1)} rating</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interests & Countries */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {user.interests && user.interests.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Interests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {user.interests.map((interest: any, index: any) => (
                      <Badge key={index} variant="secondary">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {user.visitedCountries && user.visitedCountries.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Visited Countries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {user.visitedCountries.map(
                      (country: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {country}
                        </Badge>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Upcoming Travel Plans */}
          {upcomingPlans.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Upcoming Travel Plans
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingPlans.map((plan: any) => (
                    <div
                      key={plan.id}
                      className="p-4 border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{plan.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(plan.startDate), "MMM d")} -{" "}
                            {format(new Date(plan.endDate), "MMM d, yyyy")}
                          </p>
                        </div>
                        <Badge variant="outline">{plan.destination}</Badge>
                      </div>
                      {plan.description && (
                        <p className="mt-2 text-sm line-clamp-2">
                          {plan.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Reviews */}
          {recentReviews.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Recent Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentReviews.map((review: any) => (
                    <div key={review.id} className="p-4 border rounded-lg">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={review.reviewer.profileImage} />
                          <AvatarFallback>
                            {review.reviewer.fullName?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">
                                {review.reviewer.fullName}
                              </h4>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating
                                        ? "text-yellow-500 fill-yellow-500"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {format(
                                new Date(review.createdAt),
                                "MMM d, yyyy"
                              )}
                            </span>
                          </div>
                          {review.comment && (
                            <p className="mt-2 text-sm">{review.comment}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Rating Summary */}
          {averageRating && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">
                    {averageRating.toFixed(1)}
                  </div>
                  <div className="flex justify-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(averageRating)
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Based on {recentReviews.length} reviews
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">
                    {upcomingPlans.length}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Upcoming Trips
                  </div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">
                    {recentReviews.length}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Recent Reviews
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact/Share Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Connect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="outline">
                Send Message
              </Button>
              <Button className="w-full" variant="outline">
                Request to Travel Together
              </Button>
              <Button className="w-full" variant="outline">
                Share Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

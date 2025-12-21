import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getTravelers, getTravelPlans } from "@/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import type { Traveler, TravelPlan } from "@/types/explore.interface";
import LandingTravelPlanCard from "@/components/modules/TravlePlan/LandingPlanCard";

export default async function Home() {
  // Fetch real data with error handling
  let topTravelers: Traveler[] = [];
  let recentPlans: TravelPlan[] = [];

  try {
    const travelersData = await getTravelers();
    topTravelers = travelersData?.data || [];
    console.log(topTravelers);
  } catch (error) {
    console.error("Failed to fetch travelers:", error);
  }

  try {
    const plansData = await getTravelPlans({}, { page: 1, limit: 8 });
    recentPlans = plansData?.data || [];
    console.log(plansData);
  } catch (error) {
    console.error("Failed to fetch travel plans:", error);
  }

  // Extract unique destinations from plans
  const destinations = Array.from(
    new Set(recentPlans.map((plan) => plan.destination).filter(Boolean))
  ).slice(0, 8);

  console.log(destinations);
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.15),transparent_35%),radial-gradient(circle_at_80%_10%,hsl(var(--accent)/0.15),transparent_35%)]" />
        <div className="absolute inset-0 bg-linear-to-b from-background via-background/70 to-background" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
            TravelBuddy
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            Travel better with people who match your vibe
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover verified travelers, align itineraries, and turn solo plans
            into shared adventures. Safe, simple, and tailored to how you like
            to move.
          </p>
          <div className="flex justify-center flex-wrap gap-4">
            <Link href="/register">
              <Button size="lg" className="px-6">
                Get started
              </Button>
            </Link>
            <Link href="/explore">
              <Button
                size="lg"
                variant="outline"
                className="px-6 border-border"
              >
                Explore travelers
              </Button>
            </Link>
          </div>
          <div className="flex justify-center gap-3 text-xs text-muted-foreground">
            <span>Verified profiles</span>
            <span>•</span>
            <span>Interest-based matching</span>
            <span>•</span>
            <span>Secure messaging</span>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          How it works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              title: "Sign up",
              text: "Create your profile, add your interests, and verify your identity.",
            },
            {
              step: "02",
              title: "Share plans",
              text: "Post upcoming trips, dates, and preferences to attract matches.",
            },
            {
              step: "03",
              title: "Match & go",
              text: "Connect with travelers headed your way and plan together securely.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-3"
            >
              <div className="text-sm font-semibold text-primary">
                {item.step}
              </div>
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Top Destinations Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-card border border-border rounded-2xl shadow-sm p-8 space-y-8">
          <div className="flex flex-col gap-3 text-center">
            <h2 className="text-3xl md:text-4xl font-bold">
              Popular destinations
            </h2>
            <p className="text-muted-foreground">
              Tap a destination to find travelers heading there soon.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {destinations.length > 0
              ? destinations.map((destination) => (
                  <Link
                    key={destination}
                    href={`/explore?destination=${destination}`}
                    className="group"
                  >
                    <div className="relative overflow-hidden rounded-xl border border-border bg-muted/60 dark:bg-muted/40 p-5 transition hover:-translate-y-1 hover:shadow-lg">
                      <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-accent/10 opacity-60" />
                      <div className="relative space-y-1">
                        <h3 className="text-lg font-semibold">{destination}</h3>
                        <p className="text-sm text-muted-foreground">
                          Join travelers here
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              : [
                  "Thailand",
                  "Japan",
                  "Italy",
                  "France",
                  "Spain",
                  "Australia",
                  "Canada",
                  "New Zealand",
                ].map((destination) => (
                  <Link
                    key={destination}
                    href={`/explore?destination=${destination}`}
                    className="group"
                  >
                    <div className="relative overflow-hidden rounded-xl border border-border bg-muted/60 dark:bg-muted/40 p-5 transition hover:-translate-y-1 hover:shadow-lg">
                      <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-accent/10 opacity-60" />
                      <div className="relative space-y-1">
                        <h3 className="text-lg font-semibold">{destination}</h3>
                        <p className="text-sm text-muted-foreground">
                          Join travelers here
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
          </div>
        </div>
      </section>

      {/* Featured Travelers Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold">
            Top-rated travelers
          </h2>
          <p className="text-muted-foreground text-lg">
            Meet verified travelers with excellent community ratings
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topTravelers.length > 0
            ? topTravelers.slice(0, 6).map((traveler) => (
                <div
                  key={traveler.id}
                  className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="w-16 h-16 ring-2 ring-primary/10">
                      <AvatarImage src={traveler.profileImage || ""} />
                      <AvatarFallback className="text-lg font-semibold bg-linear-to-br from-primary/20 to-primary/10">
                        {traveler.fullName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold mb-1 truncate">
                        {traveler.fullName}
                      </h3>
                      {traveler.currentLocation && (
                        <p className="text-xs text-muted-foreground truncate">
                          📍 {traveler.currentLocation}
                        </p>
                      )}
                      {traveler.averageRating && (
                        <div className="flex items-center gap-1 mt-2">
                          <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                          <span className="text-sm font-semibold">
                            {traveler.averageRating.toFixed(1)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            / 5.0
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {traveler.bio && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {traveler.bio}
                    </p>
                  )}

                  <div className="space-y-3">
                    {traveler.interests && traveler.interests.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {traveler.interests.slice(0, 3).map((interest, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="text-xs font-medium"
                          >
                            {interest}
                          </Badge>
                        ))}
                        {traveler.interests.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{traveler.interests.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                      <span>
                        🗺️ {traveler.visitedCountries?.length || 0} countries
                      </span>
                      <span>
                        ✈️ {traveler.upcomingPlansCount || 0} upcoming
                      </span>
                    </div>

                    <Link
                      href={`/dashboard/users/public/${traveler.id}`}
                      className="block"
                    >
                      <Button className="w-full" size="sm">
                        View profile
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            : [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-primary/20 grid place-items-center text-primary font-semibold text-lg">
                      T{i}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1">Traveler {i}</h3>
                      <p className="text-xs text-muted-foreground">📍 Europe</p>
                      <div className="flex items-center gap-1 mt-2">
                        <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                        <span className="text-sm font-semibold">4.9</span>
                        <span className="text-xs text-muted-foreground">
                          / 5.0
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Passionate explorer seeking adventure companions
                  </p>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant="secondary" className="text-xs">
                        Adventure
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Culture
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Food
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                      <span>🗺️ 15 countries</span>
                      <span>✈️ 3 upcoming</span>
                    </div>
                    <Link href="/explore" className="block">
                      <Button className="w-full" size="sm">
                        View profile
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/explore">
            <Button variant="outline" size="lg">
              View all travelers
            </Button>
          </Link>
        </div>
      </section>

      {/* Recent Travel Plans Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col gap-3 text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            Recent travel plans
          </h2>
          <p className="text-muted-foreground">
            Explore upcoming trips and join travelers heading your way.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentPlans.length > 0 ? (
            recentPlans
              .slice(0, 6)
              .map((plan) => (
                <LandingTravelPlanCard
                  key={plan.id}
                  plan={plan}
                  linkPrefix="/dashboard/travel-plans"
                  showViewButton
                />
              ))
          ) : (
            <div className="col-span-full text-center text-muted-foreground">
              No travel plans available right now.
            </div>
          )}
        </div>

        <div className="text-center mt-10">
          <Link href="/dashboard/travel-plans">
            <Button variant="outline" size="lg">
              Explore all plans
            </Button>
          </Link>
        </div>
      </section>

      {/* Travel Categories Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Travel categories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            "ADVENTURE",
            "BEACH",
            "FRIENDS",
            "CITY_TOUR",
            "CULTURAL",
            "HIKING",
            "ROAD_TRIP",
            "AND_MORE",
          ].map((category) => (
            <div
              key={category}
              className="rounded-xl border border-border bg-card/80 p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <h3 className="font-semibold">{category}</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Explore travelers
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Why TravelBuddy?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Verified travelers",
              body: "Secure community with verified profiles and transparent ratings.",
            },
            {
              title: "Smart matching",
              body: "Interests, dates, and destinations inform who you see first.",
            },
            {
              title: "Peace of mind",
              body: "Messaging, reviews, and reporting keep trips safer for everyone.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-border bg-card p-6 shadow-sm"
            >
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Success stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Md. Abu Sufian",
                text: "Found amazing travel buddies for my Southeast Asia trip!",
              },
              {
                name: "Sufian",
                text: "Planning with strangers felt safe and exciting.",
              },
              {
                name: "Osman Ghani",
                text: "Met people I still travel with regularly.",
              },
            ].map((testimonial) => (
              <div
                key={testimonial.name}
                className="bg-card border border-border rounded-xl p-6 shadow-sm"
              >
                <p className="text-muted-foreground mb-4 italic">
                  “{testimonial.text}”
                </p>
                <p className="font-semibold">— {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-linear-to-r from-primary/15 via-primary/10 to-accent/10 border border-border rounded-2xl shadow-sm p-10 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to start your adventure?
          </h2>
          <p className="text-muted-foreground text-lg">
            Join thousands of travelers finding their perfect companions.
          </p>
          <Link href="/login">
            <Button size="lg" className="px-8">
              Login Now
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
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
            {[
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
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Top-rated travelers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-xl p-6 shadow-sm text-center space-y-3 hover:-translate-y-1 transition"
            >
              <div className="w-16 h-16 rounded-full bg-primary/20 mx-auto grid place-items-center text-primary font-semibold">
                {"T" + i}
              </div>
              <h3 className="text-xl font-semibold">Traveler {i}</h3>
              <p className="text-amber-500 text-sm">⭐ 4.9/5 (128 reviews)</p>
              <p className="text-muted-foreground text-sm">
                Passionate explorer from Europe
              </p>
              <Link href={`/profile/${i}`}>
                <Button className="w-full">View profile</Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Travel Categories Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Travel categories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            "Adventure",
            "Food Tours",
            "Photography",
            "Hiking",
            "Beach Relaxation",
            "Cultural",
            "Budget Travel",
            "Luxury",
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
                name: "Sarah J.",
                text: "Found amazing travel buddies for my Southeast Asia trip!",
              },
              {
                name: "Mike T.",
                text: "Planning with strangers felt safe and exciting.",
              },
              {
                name: "Emma L.",
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
          <Link href="/register">
            <Button size="lg" className="px-8">
              Sign up now
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}

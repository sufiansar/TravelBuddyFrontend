"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { useState } from "react";
import {
  Check,
  Sparkles,
  Crown,
  Globe,
  Users,
  MapPin,
  MessageSquare,
  Star,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createCheckoutSession } from "@/actions";
import { toast } from "sonner";

export default function PackagesPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (planType: string) => {
    setLoading(planType);
    try {
      const result = await createCheckoutSession(
        planType as "MONTHLY" | "YEARLY"
      );
      console.log("Package", result.data);
      if (result.success && result.data?.url) {
        window.location.href = result.data.url;
        toast.success("Redirecting to payment...");
      } else {
        toast.error(result.error || "Failed to create checkout session");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("An error occurred");
    } finally {
      setLoading(null);
    }
  };

  const packages = [
    {
      id: "FREE",
      name: "Explorer",
      price: "$0",
      period: "/month",
      originalPrice: null,
      features: [
        { text: "View up to 10 traveler profiles", icon: Users },
        { text: "Create 1 travel plan", icon: MapPin },
        { text: "Basic messaging", icon: MessageSquare },
        { text: "Basic search filters", icon: Globe },
      ],
      ctaText: "Get Started",
      ctaVariant: "outline" as const,
      disabled: false,
    },
    {
      id: "MONTHLY",
      name: "Adventure",
      price: "$19.99",
      period: "/month",
      originalPrice: "$24.99",
      popular: true,
      features: [
        { text: "Unlimited traveler profiles", icon: Users },
        { text: "Create up to 5 travel plans", icon: MapPin },
        { text: "Unlimited messaging", icon: MessageSquare },
        { text: "Advanced search filters", icon: Globe },
        { text: "Verified badge", icon: Star },
        { text: "Priority support", icon: Zap },
      ],
      ctaText: "Start Adventure",
      ctaVariant: "default" as const,
      disabled: false,
    },
    {
      id: "YEARLY",
      name: "Premium",
      price: "$199.99",
      period: "/year",
      originalPrice: "$299.88",
      bestValue: true,
      features: [
        { text: "Everything in Adventure", icon: Check },
        { text: "Unlimited travel plans", icon: MapPin },
        { text: "Featured profile", icon: Star },
        { text: "Advanced analytics", icon: Zap },
        { text: "Custom filters", icon: Globe },
        { text: "24/7 priority support", icon: Zap },
        { text: "Save 33% annually", icon: Sparkles },
      ],
      ctaText: "Go Premium",
      ctaVariant: "default" as const,
      disabled: false,
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-gray-50 dark:to-gray-900 py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Find Your Perfect Travel Plan
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Choose the subscription that matches your travel style. All plans
            include our core features with no hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {packages.map((pkg) => (
            <Card
              key={pkg.id}
              className={cn(
                "relative h-full flex flex-col transition-all duration-300 hover:shadow-xl",
                pkg.popular && "border-2 border-primary shadow-lg",
                pkg.bestValue && "border-2 border-amber-500 shadow-lg"
              )}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="px-4 py-1.5 text-sm font-semibold bg-linear-to-r from-primary to-blue-600 text-white">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              {pkg.bestValue && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="px-4 py-1.5 text-sm font-semibold bg-linear-to-r from-amber-500 to-orange-500 text-white">
                    <Crown className="h-3 w-3 mr-1" />
                    Best Value
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-foreground">
                  {pkg.name}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Perfect for{" "}
                  {pkg.name === "Explorer"
                    ? "getting started"
                    : pkg.name === "Adventure"
                    ? "frequent travelers"
                    : "serious adventurers"}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1">
                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-4xl md:text-5xl font-bold text-foreground">
                      {pkg.price}
                    </span>
                    <span className="text-lg text-muted-foreground">
                      {pkg.period}
                    </span>
                  </div>

                  {pkg.originalPrice && (
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm line-through text-muted-foreground">
                        {pkg.originalPrice}
                      </span>
                      {pkg.id === "YEARLY" && (
                        <Badge
                          variant="outline"
                          className="text-xs text-green-600 border-green-200"
                        >
                          Save 33%
                        </Badge>
                      )}
                    </div>
                  )}

                  {pkg.id === "YEARLY" && (
                    <p className="text-sm text-muted-foreground mt-2">
                      ${(199.99 / 12).toFixed(2)} per month
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                    What's included:
                  </h4>
                  <ul className="space-y-3">
                    {pkg.features.map((feature, idx) => {
                      const Icon = feature.icon;
                      return (
                        <li key={idx} className="flex items-start gap-3">
                          <Icon className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span className="text-sm md:text-base text-foreground">
                            {feature.text}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </CardContent>

              <CardFooter className="pt-6">
                <Button
                  className="w-full"
                  size="lg"
                  variant={pkg.ctaVariant}
                  disabled={pkg.disabled || loading === pkg.id}
                  onClick={() => handleSubscribe(pkg.id)}
                >
                  {loading === pkg.id ? (
                    <>
                      <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    pkg.ctaText
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Additional Info Section */}
        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center p-6 rounded-lg border bg-card">
            <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Secure Payments</h3>
            <p className="text-sm text-muted-foreground">
              All payments are processed securely through Stripe with 256-bit
              encryption.
            </p>
          </div>

          <div className="text-center p-6 rounded-lg border bg-card">
            <div className="h-12 w-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">30-Day Guarantee</h3>
            <p className="text-sm text-muted-foreground">
              Not satisfied? Get a full refund within 30 days of purchase.
            </p>
          </div>

          <div className="text-center p-6 rounded-lg border bg-card">
            <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="h-6 w-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Cancel Anytime</h3>
            <p className="text-sm text-muted-foreground">
              No long-term contracts. Cancel your subscription anytime.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 md:mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "Can I switch between plans?",
                a: "Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll get immediate access to new features. When downgrading, changes take effect at the end of your billing cycle.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards (Visa, Mastercard, American Express, Discover) through our secure Stripe payment processor. We also support PayPal for certain regions.",
              },
              {
                q: "Is there a free trial?",
                a: "We offer a 14-day free trial for our Adventure and Premium plans. No credit card required to start your free trial.",
              },
              {
                q: "Can I get a refund?",
                a: "Yes, we offer a 30-day money-back guarantee. If you're not satisfied with our service, contact our support team for a full refund.",
              },
            ].map((faq, idx) => (
              <div key={idx} className="p-6 rounded-lg border bg-card">
                <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
                <p className="text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

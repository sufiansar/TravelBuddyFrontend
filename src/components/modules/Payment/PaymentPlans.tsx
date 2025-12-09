// src/components/payment/PaymentPlans.tsx
"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Crown } from "lucide-react";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { loadStripe } from "@stripe/stripe-js";
import { PaymentPlan, Plan, Subscription } from "@/types/payment.interface";
import { createCheckoutSession } from "@/actions";
import { toast } from "sonner";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || ""
);

const plans: PaymentPlan[] = [
  {
    id: "MONTHLY",
    name: "Monthly Pro",
    description: "Perfect for regular travelers",
    price: 5000, // $50.00
    interval: "month",
    features: [
      "Unlimited travel plans",
      "Premium templates",
      "Collaboration tools",
      "Priority support",
      "Verified badge",
      "Basic analytics",
    ],
  },
  {
    id: "YEARLY",
    name: "Yearly Pro",
    description: "Best value for frequent travelers",
    price: 50000, // $500.00
    interval: "year",
    features: [
      "Everything in Monthly",
      "2 months free",
      "Advanced analytics",
      "Early feature access",
      "Custom travel reports",
      "Dedicated account manager",
    ],
    popular: true,
    savings: "Save 16%",
  },
];

interface PaymentPlansProps {
  currentSubscription?: Subscription | null;
}

export function PaymentPlans({ currentSubscription }: PaymentPlansProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<Plan | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan>(
    currentSubscription?.plan || "MONTHLY"
  );

  const formatPrice = (price: number) => {
    const dollars = price / 100;
    return dollars.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    });
  };

  const handleSubscribe = async (plan: Plan) => {
    try {
      setLoading(plan);

      // If user has an active subscription, redirect to manage subscription
      if (currentSubscription?.isActive) {
        router.push("/payments/subscription");
        return;
      }

      const result = await createCheckoutSession(plan);
      console.log(result);
      toast.success("Redirecting to payment...");

      if (!result.success) {
        throw new Error(result.error || "Failed to create checkout session");
      }

      // Redirect to Stripe checkout
      if (result.data?.url) {
        window.location.href = result.data.url;
      }
    } catch (error) {
      console.error("Failed to create checkout session:", error);
      alert(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {plans.map((plan) => {
        const isCurrentPlan =
          currentSubscription?.plan === plan.id &&
          currentSubscription?.isActive;
        const isPopular = plan.popular;
        const isYearly = plan.id === "YEARLY";
        const monthlyEquivalent = isYearly
          ? plan.price / 12 / 100
          : plan.price / 100;

        return (
          <Card
            key={plan.id}
            className={cn(
              "relative transition-all hover:shadow-lg",
              isPopular && "border-primary shadow-md",
              isCurrentPlan && "border-green-500"
            )}
          >
            {isPopular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="gap-1 bg-linear-to-r from-amber-500 to-orange-500 text-white">
                  <Sparkles className="h-3 w-3" />
                  Most Popular
                </Badge>
              </div>
            )}

            {isCurrentPlan && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="gap-1 bg-green-600 text-white">
                  <Check className="h-3 w-3" />
                  Current Plan
                </Badge>
              </div>
            )}

            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {plan.name}
                    {isYearly && <Crown className="h-5 w-5 text-amber-500" />}
                  </CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </div>
                {isYearly && plan.savings && (
                  <Badge
                    variant="outline"
                    className="text-green-600 border-green-200"
                  >
                    {plan.savings}
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">
                    {formatPrice(plan.price)}
                  </span>
                  <span className="text-gray-500">/{plan.interval}</span>
                </div>

                {isYearly && (
                  <p className="text-sm text-gray-600">
                    {formatPrice(monthlyEquivalent)} per month
                  </p>
                )}

                {plan.savings && (
                  <p className="text-sm text-green-600 font-medium">
                    {plan.savings} compared to monthly billing
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-sm">What's included:</h4>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>

            <CardFooter>
              <Button
                className="w-full"
                size="lg"
                variant={isPopular ? "default" : "outline"}
                disabled={loading === plan.id || isCurrentPlan}
                onClick={() => handleSubscribe(plan.id)}
              >
                {loading === plan.id ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Processing...
                  </>
                ) : isCurrentPlan ? (
                  "Current Plan"
                ) : currentSubscription?.isActive ? (
                  "Change Plan"
                ) : (
                  "Subscribe Now"
                )}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { createPaymentSession } from "@/actions";
import { useState } from "react";

export default function PackagesPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (planType: string) => {
    setLoading(planType);
    try {
      const result = await createPaymentSession(planType);
      if (result.success && result.data?.url) {
        window.location.href = result.data.url;
      } else {
        alert("Failed to create payment session");
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
      name: "Explorer",
      price: "$9.99",
      period: "/month",
      features: [
        "View up to 10 traveler profiles",
        "Create 1 travel plan",
        "Message other travelers",
        "Basic search filters",
      ],
    },
    {
      name: "Adventure",
      price: "$19.99",
      period: "/month",
      popular: true,
      features: [
        "Unlimited traveler profiles",
        "Create up to 5 travel plans",
        "Unlimited messaging",
        "Advanced search filters",
        "Verified badge",
        "Priority support",
      ],
    },
    {
      name: "Premium",
      price: "$29.99",
      period: "/month",
      features: [
        "Everything in Adventure",
        "Unlimited travel plans",
        "Featured profile",
        "Advanced analytics",
        "Custom filters",
        "24/7 priority support",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-4 text-foreground">
          Our Subscription Plans
        </h1>
        <p className="text-center text-muted-foreground mb-12">
          Choose the perfect plan for your travel adventures
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className={`rounded-lg shadow-lg p-8 bg-card border ${
                pkg.popular ? "border-2 border-primary" : "border-border"
              }`}
            >
              {pkg.popular && (
                <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full inline-block mb-4 text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <h2 className="text-2xl font-bold mb-2 text-foreground">
                {pkg.name}
              </h2>
              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">
                  {pkg.price}
                </span>
                <span className="text-muted-foreground">{pkg.period}</span>
              </div>

              <Button className="w-full mb-8">Choose Plan</Button>

              <ul className="space-y-4">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-primary mr-3">✓</span>
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getAllTravelPlans, deleteTravelPlan } from "@/actions";
import type { TravelPlan } from "@/actions/shared/types";

export default function TravelPlansPage() {
  const [plans, setPlans] = useState<TravelPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user's travel plans
    const fetchPlans = async () => {
      try {
        const result = await getAllTravelPlans();
        if (result.success && result.data) {
          setPlans(result.data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching travel plans:", error);
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this plan?")) {
      const result = await deleteTravelPlan(id);
      if (result.success) {
        setPlans(plans.filter((plan) => plan._id !== id));
      }
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-foreground">My Travel Plans</h1>
        <Link href="/travel-plans/add">
          <Button>+ Create New Plan</Button>
        </Link>
      </div>

      {plans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <div
              key={plan._id}
              className="bg-card rounded-lg shadow-lg hover:shadow-xl transition overflow-hidden border border-border"
            >
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">
                  {plan.title} - {plan.destination}
                </h2>
                <p className="text-muted-foreground mb-4">
                  {new Date(plan.startDate).toLocaleDateString()} to{" "}
                  {new Date(plan.endDate).toLocaleDateString()}
                </p>

                <p className="text-foreground mb-4">{plan.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div>
                    <p className="text-gray-600">Budget</p>
                    <p className="font-semibold">${plan.budget}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Travelers</p>
                    <p className="font-semibold">
                      {plan.currentTravelers}/{plan.maxTravelers}
                    </p>
                  </div>
                </div>

                <div className="space-x-2">
                  <Link href={`/travel-plans/${plan._id}`}>
                    <Button variant="outline">View</Button>
                  </Link>
                  <Link href={`/travel-plans/${plan._id}/edit`}>
                    <Button variant="outline">Edit</Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => handleDelete(plan._id)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <p className="text-gray-600 text-lg mb-4">
            You haven't created any travel plans yet.
          </p>
          <Link href="/travel-plans/add">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Create Your First Plan
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { exploreTravelers, explorePlans } from "@/actions";
import type { IUser, TravelPlan } from "@/actions/shared/types";

export default function ExplorePage() {
  const [destination, setDestination] = useState("");
  const [searchType, setSearchType] = useState<"travelers" | "plans">(
    "travelers"
  );
  const [travelers, setTravelers] = useState<IUser[]>([]);
  const [plans, setPlans] = useState<TravelPlan[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (destination) params.destination = destination;

      if (searchType === "travelers") {
        const result = await exploreTravelers(params);
        if (result.success && result.data) {
          setTravelers(result.data);
          setPlans([]);
        }
      } else {
        const result = await explorePlans(params);
        if (result.success && result.data) {
          setPlans(result.data);
          setTravelers([]);
        }
      }
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-center mb-12 text-foreground">
          Explore Travelers
        </h1>

        {/* Search Filters */}
        <div className="bg-card rounded-lg shadow-lg p-8 mb-12 border border-border">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                Destination
              </label>
              <Input
                placeholder="Where are they traveling?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                Search Type
              </label>
              <select
                value={searchType}
                onChange={(e) =>
                  setSearchType(e.target.value as "travelers" | "plans")
                }
                className="w-full border border-border bg-background text-foreground rounded-md px-3 py-2"
              >
                <option value="travelers">Search Travelers</option>
                <option value="plans">Search Travel Plans</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={handleSearch}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {loading ? "Searching..." : "Search"}
              </Button>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-10">
            <p className="text-lg text-foreground">Searching...</p>
          </div>
        ) : searchType === "travelers" && travelers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {travelers.map((traveler) => (
              <div
                key={traveler.id}
                className="bg-card rounded-lg shadow-lg hover:shadow-xl transition p-6 border border-border"
              >
                <div className="flex items-center mb-4">
                  {traveler.profileImage ? (
                    <img
                      src={traveler.profileImage}
                      alt={traveler.fullName}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-muted"></div>
                  )}
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-foreground">
                      {traveler.fullName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {traveler.email}
                    </p>
                  </div>
                </div>

                {traveler.bio && (
                  <p className="text-muted-foreground mb-4">{traveler.bio}</p>
                )}

                {traveler.interests && traveler.interests.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2 text-foreground">
                      Interests:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {traveler.interests.map((interest: string) => (
                        <span
                          key={interest}
                          className="bg-muted text-foreground text-xs px-2 py-1 rounded border border-border"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <Link href={`/profile/${traveler.id}`}>
                  <Button className="w-full">View Profile</Button>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              No travelers found. Try adjusting your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

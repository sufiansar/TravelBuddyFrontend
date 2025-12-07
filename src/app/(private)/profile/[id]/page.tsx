"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  bio?: string;
  profileImage?: string;
  currentLocation?: string;
  visitedCountries?: string[];
  travelInterests?: string[];
  rating: number;
  reviewCount: number;
}

export default function PublicProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user profile
    const fetchProfile = async () => {
      try {
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [params.id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!profile) return <div className="p-8 text-center">Profile not found</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link href="/explore">
        <Button variant="outline" className="mb-6">
          ← Back to Explore
        </Button>
      </Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-linear-to-r from-blue-400 to-blue-600 h-32"></div>

        <div className="px-8 pb-8">
          {/* Profile Photo and Info */}
          <div className="flex flex-col md:flex-row gap-8 -mt-16 mb-8">
            <div>
              {profile.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt={profile.fullName}
                  className="w-40 h-40 rounded-lg object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-40 h-40 rounded-lg bg-blue-400 border-4 border-white shadow-lg"></div>
              )}
            </div>

            <div className="flex-1 pt-8">
              <h2 className="text-3xl font-bold mb-2">{profile.fullName}</h2>

              <div className="flex items-center gap-2 mb-4">
                <span className="text-yellow-500">⭐ {profile.rating}/5</span>
                <span className="text-gray-600">
                  ({profile.reviewCount} reviews)
                </span>
              </div>

              {profile.currentLocation && (
                <p className="text-gray-700 mb-4">
                  📍 {profile.currentLocation}
                </p>
              )}

              <div className="flex gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Connect
                </Button>
                <Button variant="outline">Message</Button>
                <Button variant="outline">View Plans</Button>
              </div>
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-3">About</h3>
              <p className="text-gray-700">{profile.bio}</p>
            </div>
          )}

          {/* Travel Interests */}
          {profile.travelInterests && profile.travelInterests.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-3">Travel Interests</h3>
              <div className="flex flex-wrap gap-2">
                {profile.travelInterests.map((interest) => (
                  <span
                    key={interest}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Visited Countries */}
          {profile.visitedCountries && profile.visitedCountries.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-3">Visited Countries</h3>
              <div className="flex flex-wrap gap-2">
                {profile.visitedCountries.map((country) => (
                  <span
                    key={country}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full"
                  >
                    {country}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
        <h3 className="text-2xl font-bold mb-6">Recent Reviews</h3>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-b pb-6">
              <div className="flex justify-between items-start mb-2">
                <p className="font-semibold">Review from Traveler {i}</p>
                <span className="text-yellow-500">⭐ 5/5</span>
              </div>
              <p className="text-gray-700">
                Great travel companion! Very organized and friendly.
              </p>
              <p className="text-sm text-gray-500 mt-2">2 months ago</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

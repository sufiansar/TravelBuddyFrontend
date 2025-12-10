"use client";

import {
  MapPin,
  Globe,
  Star,
  Calendar,
  Users,
  CheckCircle,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Traveler } from "@/types/explore.interface";

interface TravelerCardProps {
  traveler: Traveler;
}

export function TravelerCard({ traveler }: TravelerCardProps) {
  const hasId = Boolean(traveler.id);

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <Avatar className="h-12 w-12 border shadow-sm">
            <AvatarImage src={traveler.profileImage || ""} />
            <AvatarFallback className="text-base">
              {traveler.fullName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 min-w-0">
              <h3 className="font-semibold text-base truncate">
                {traveler.fullName}
              </h3>
              {traveler.verifiedBadge && (
                <Badge
                  variant="outline"
                  className="h-5 w-5 p-0 flex items-center justify-center shrink-0 border-blue-200 bg-blue-50 text-blue-500"
                  title="Verified traveler"
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                </Badge>
              )}
            </div>
            <p className="text-gray-500 text-sm truncate">
              @{traveler.username}
            </p>
            {traveler.currentLocation && (
              <div className="flex items-center gap-1 mt-2">
                <MapPin className="h-3 w-3 text-gray-400" />
                <span className="text-xs text-gray-600">
                  {traveler.currentLocation}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Bio */}
        {traveler.bio && (
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
            {traveler.bio}
          </p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <div>
              <p className="font-semibold">{traveler.upcomingPlansCount}</p>
              <p className="text-xs text-gray-500">Upcoming Plans</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            <div>
              <p className="font-semibold">
                {traveler.averageRating?.toFixed(1) || "N/A"}
              </p>
              <p className="text-xs text-gray-500">Avg Rating</p>
            </div>
          </div>
          <div className="flex items-center gap-2 col-span-2">
            <Globe className="h-4 w-4 text-green-500" />
            <div>
              <p className="font-semibold">
                {traveler.visitedCountries?.length || 0}
              </p>
              <p className="text-xs text-gray-500">Countries Visited</p>
            </div>
          </div>
        </div>

        {/* Interests */}
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Interests</h4>
          <div className="flex flex-wrap gap-1">
            {traveler.interests?.slice(0, 3).map((interest) => (
              <Badge key={interest} variant="secondary" className="text-xs">
                {interest}
              </Badge>
            ))}
            {traveler.interests?.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{traveler.interests.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            size="sm"
            className="flex-1"
            asChild={hasId}
            disabled={!hasId}
          >
            {hasId ? (
              <Link href={`/users/public/${traveler.id}`}>View Profile</Link>
            ) : (
              "View Profile"
            )}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 sm:flex-none"
            asChild={hasId}
            disabled={!hasId}
          >
            {hasId ? (
              <Link href={`/matches/users/public/${traveler.id}`}>Connect</Link>
            ) : (
              "Connect"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

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
    <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
      <CardContent className="p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="h-16 w-16 border-2 shadow-md ring-2 ring-offset-2 ring-primary/10">
            <AvatarImage src={traveler.profileImage || ""} />
            <AvatarFallback className="text-lg font-semibold bg-linear-to-br from-primary/20 to-primary/10">
              {traveler.fullName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="font-bold text-lg">{traveler.fullName}</h3>
              {traveler.verifiedBadge && (
                <Badge
                  variant="outline"
                  className="h-5 px-2 flex items-center gap-1 shrink-0 border-blue-400 bg-blue-50 text-blue-600"
                  title="Verified traveler"
                >
                  <CheckCircle className="h-3.5 w-3.5 fill-blue-500" />
                  <span className="text-xs font-medium">Verified</span>
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-sm mb-2">
              @{traveler.username}
            </p>
            {traveler.currentLocation && (
              <div className="flex items-center gap-1.5 bg-muted/50 rounded-md px-2 py-1 w-fit">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-medium text-foreground">
                  {traveler.currentLocation}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Bio */}
        {traveler.bio && (
          <div className="mb-4 bg-muted/30 rounded-lg p-3">
            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
              {traveler.bio}
            </p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="flex flex-col items-center justify-center bg-linear-to-br from-primary/5 to-primary/10 rounded-lg p-3 border border-primary/10">
            <Users className="h-5 w-5 text-primary mb-1" />
            <p className="font-bold text-lg">{traveler.upcomingPlansCount}</p>
            <p className="text-xs text-muted-foreground text-center">Plans</p>
          </div>
          <div className="flex flex-col items-center justify-center bg-linear-to-br from-yellow-50 to-yellow-100/50 rounded-lg p-3 border border-yellow-200">
            <Star className="h-5 w-5 text-yellow-600 mb-1 fill-yellow-500" />
            <p className="font-bold text-lg">
              {traveler.averageRating?.toFixed(1) || "N/A"}
            </p>
            <p className="text-xs text-muted-foreground text-center">Rating</p>
          </div>
          <div className="flex flex-col items-center justify-center bg-linear-to-br from-green-50 to-green-100/50 rounded-lg p-3 border border-green-200">
            <Globe className="h-5 w-5 text-green-600 mb-1" />
            <p className="font-bold text-lg">
              {traveler.visitedCountries?.length || 0}
            </p>
            <p className="text-xs text-muted-foreground text-center">
              Countries
            </p>
          </div>
        </div>

        {/* Interests */}
        {traveler.interests && traveler.interests.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Interests
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {traveler.interests?.slice(0, 4).map((interest) => (
                <Badge
                  key={interest}
                  variant="secondary"
                  className="text-xs py-1 px-2 font-medium hover:bg-secondary/80 transition-colors"
                >
                  {interest}
                </Badge>
              ))}
              {traveler.interests?.length > 4 && (
                <Badge
                  variant="outline"
                  className="text-xs py-1 px-2 font-medium border-dashed"
                >
                  +{traveler.interests.length - 4}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Actions - push to bottom */}
        <div className="mt-auto pt-4 border-t grid grid-cols-2 gap-2">
          <Button
            size="default"
            className="w-full font-semibold"
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
            size="default"
            variant="outline"
            className="w-full font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
            asChild={hasId}
            disabled={!hasId}
          >
            {hasId ? (
              <Link href={`/users/public/${traveler.id}`}>Connect</Link>
            ) : (
              "Connect"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

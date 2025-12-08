import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, MapPin, Users, User } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { Meetup } from "@/types/meetup";

interface MeetupCardProps {
  meetup: Meetup;
  showActions?: boolean;
  onJoin?: (id: string) => void;
  onLeave?: (id: string) => void;
  userId?: string;
  isHost?: boolean;
}

export function MeetupCard({
  meetup,
  showActions = true,
  onJoin,
  onLeave,
  userId,
  isHost,
}: MeetupCardProps) {
  const isParticipant = meetup.participants.some((p) => p.user.id === userId);
  const isFull =
    meetup.maxPeople && meetup.participants.length >= meetup.maxPeople;
  const availableSpots = meetup.maxPeople
    ? meetup.maxPeople - meetup.participants.length
    : null;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold">{meetup.title}</h3>
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={meetup.host.profileImage}
                  alt={meetup.host.fullName}
                />
                <AvatarFallback>
                  {meetup.host.fullName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span>Hosted by {meetup.host.fullName}</span>
            </div>
          </div>
          <Badge variant={isFull ? "destructive" : "default"}>
            {isFull
              ? "Full"
              : `${meetup.participants.length}${
                  meetup.maxPeople ? `/${meetup.maxPeople}` : ""
                }`}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4 line-clamp-2">{meetup.description}</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span>{format(new Date(meetup.date), "PPP p")}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span>{meetup.location}</span>
          </div>
          {availableSpots !== null && availableSpots > 0 && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span>{availableSpots} spots available</span>
            </div>
          )}
        </div>
      </CardContent>
      {showActions && (
        <CardFooter className="flex justify-between">
          <Link href={`/meetups/${meetup.id}`}>
            <Button variant="outline">View Details</Button>
          </Link>
          <div className="flex gap-2">
            {isHost ? (
              <>
                <Link href={`/meetups/${meetup.id}/edit`}>
                  <Button variant="secondary">Edit</Button>
                </Link>
                <Button
                  variant="destructive"
                  onClick={() => onJoin && onJoin(meetup.id)}
                >
                  Delete
                </Button>
              </>
            ) : isParticipant ? (
              <Button
                variant="destructive"
                onClick={() => onLeave && onLeave(meetup.id)}
                disabled={isHost}
              >
                Leave
              </Button>
            ) : (
              <Button
                onClick={() => onJoin && onJoin(meetup.id)}
                disabled={isFull || isHost}
              >
                Join Meetup
              </Button>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}

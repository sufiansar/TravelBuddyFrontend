"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar,
  MapPin,
  Users,
  User,
  Edit,
  Trash2,
  ArrowLeft,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

import { Meetup } from "@/types/meetup";
import { deleteMeetup, getMeetup, joinMeetup, leaveMeetup } from "@/actions";
import { toast } from "sonner";
import { MeetupMembers } from "@/components/modules/MeetUp/MeetupMembers";

export default function MeetupDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [meetup, setMeetup] = useState<Meetup | null>(null);
  const [loading, setLoading] = useState(true);
  const [isHost, setIsHost] = useState(false);
  const [isParticipant, setIsParticipant] = useState(false);
  const [isFull, setIsFull] = useState(false);

  const fetchMeetup = async () => {
    setLoading(true);
    try {
      const result: any = await getMeetup(params.id as string);
      if (result.success && result.data) {
        setMeetup(result.data);
        const userId = session?.user?.id;

        setIsHost(result.data.host.id === userId);
        setIsParticipant(
          result.data.participants.some((p: any) => p.user.id === userId)
        );
        setIsFull(
          result.data.maxPeople !== null &&
            result.data.participants.length >= result.data.maxPeople
        );
      } else {
        toast.error(result.error || "Failed to load meetup");
        router.push("/meetups");
      }
    } catch (error) {
      toast.error("Failed to load meetup");
      router.push("/meetups");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id && session) {
      fetchMeetup();
    }
  }, [params.id, session]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this meetup?")) return;

    try {
      const result = await deleteMeetup(params.id as string);
      if (result.success) {
        toast.success("Meetup deleted successfully!");
        router.push("/meetups");
      } else {
        toast.error(result.error || "Failed to delete meetup");
      }
    } catch (error) {
      toast.error("Failed to delete meetup");
    }
  };

  const handleJoin = async () => {
    try {
      const result = await joinMeetup(params.id as string);
      if (result.success) {
        toast.success("Successfully joined the meetup!");
        fetchMeetup();
      } else {
        toast.error(result.error || "Failed to join meetup");
      }
    } catch (error) {
      toast.error("Failed to join meetup");
    }
  };

  const handleLeave = async () => {
    try {
      const result = await leaveMeetup(params.id as string);
      if (result.success) {
        toast.success("Successfully left the meetup!");
        fetchMeetup();
      } else {
        toast.error(result.error || "Failed to leave meetup");
      }
    } catch (error) {
      toast.error("Failed to leave meetup");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!meetup) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/meetups">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Meetups
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-3xl mb-2">
                    {meetup.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={meetup.host.profileImage}
                        alt={meetup.host.fullName}
                      />
                      <AvatarFallback>
                        {meetup.host.fullName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-gray-600">
                      Hosted by {meetup.host.fullName}
                    </span>
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
            <CardContent className="space-y-6">
              <p className="text-gray-700">{meetup.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-semibold">Date & Time</p>
                    <p>{format(new Date(meetup.date), "PPP p")}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="font-semibold">Location</p>
                    <p>{meetup.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-semibold">Participants</p>
                    <p>
                      {meetup.participants.length}
                      {meetup.maxPeople && ` / ${meetup.maxPeople}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="font-semibold">Status</p>
                    <Badge variant={isParticipant ? "default" : "outline"}>
                      {isParticipant ? (
                        <span className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" /> Joined
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <XCircle className="h-3 w-3" /> Not Joined
                        </span>
                      )}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                {isHost ? (
                  <>
                    <Link href={`/meetups/${meetup.id}/edit`}>
                      <Button>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Meetup
                      </Button>
                    </Link>
                    <Button variant="destructive" onClick={handleDelete}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Meetup
                    </Button>
                  </>
                ) : isParticipant ? (
                  <Button variant="destructive" onClick={handleLeave}>
                    Leave Meetup
                  </Button>
                ) : (
                  <Button onClick={handleJoin} disabled={isFull}>
                    Join Meetup
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <MeetupMembers meetupId={meetup.id} />
        </div>
      </div>
    </div>
  );
}

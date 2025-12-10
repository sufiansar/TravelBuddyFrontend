"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Users,
  Search,
  Filter,
  MoreVertical,
  Trash2,
  Edit,
  Eye,
} from "lucide-react";

import { format } from "date-fns";
import Link from "next/link";

import { deleteMeetup, getAllMeetups } from "@/actions";
import { toast } from "sonner";
import { Meetup } from "@/types/meetup.interface";

export default function AdminMeetupsPage() {
  const [meetups, setMeetups] = useState<Meetup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "upcoming" | "past">(
    "all"
  );

  useEffect(() => {
    fetchMeetups();
  }, []);

  const fetchMeetups = async () => {
    setLoading(true);
    try {
      const result = await getAllMeetups();

      if (result.success) {
        setMeetups(result.data);
      } else {
        toast.error("Failed to load meetups");
      }
    } catch (error) {
      toast.error("An error occurred while fetching meetups");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMeetup = async (meetupId: string) => {
    if (!confirm("Are you sure you want to delete this meetup?")) return;

    try {
      const result = await deleteMeetup(meetupId);
      if (result.success) {
        toast.success("Meetup deleted successfully");
        fetchMeetups();
      } else {
        toast.error("Failed to delete meetup");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the meetup");
    }
  };

  const filteredMeetups = meetups.filter((meetup) => {
    // Search filter
    const matchesSearch =
      meetup.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meetup.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meetup.host.fullName.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const meetupDate = new Date(meetup.date);
    const now = new Date();
    let matchesStatus = true;

    if (filterStatus === "upcoming") {
      matchesStatus = meetupDate > now;
    } else if (filterStatus === "past") {
      matchesStatus = meetupDate < now;
    }

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Manage Meetups</h1>
        <p className="text-gray-600">Admin panel for managing all meetups</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle>All Meetups ({filteredMeetups?.length})</CardTitle>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search meetups..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as any)}
                      className="px-3 py-2 border rounded-md text-sm"
                    >
                      <option value="all">All</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="past">Past</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="h-20 bg-gray-200 rounded animate-pulse"
                    ></div>
                  ))}
                </div>
              ) : filteredMeetups?.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No meetups found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredMeetups?.map((meetup) => {
                    const meetupDate = new Date(meetup.date);
                    const now = new Date();
                    const isPast = meetupDate < now;

                    return (
                      <div
                        key={meetup.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <div className="hidden sm:block">
                            <div className="text-center border rounded-lg p-2 min-w-20">
                              <div className="text-sm font-semibold">
                                {format(meetupDate, "MMM")}
                              </div>
                              <div className="text-2xl font-bold">
                                {format(meetupDate, "d")}
                              </div>
                              <div className="text-xs text-gray-500">
                                {format(meetupDate, "EEE")}
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{meetup.title}</h3>
                              <Badge variant={isPast ? "outline" : "default"}>
                                {isPast ? "Past" : "Upcoming"}
                              </Badge>
                            </div>
                            <div className="space-y-1 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-3 w-3" />
                                <span>{meetup.location}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="h-3 w-3" />
                                <span>
                                  {meetup.participants.length}
                                  {meetup.maxPeople &&
                                    ` / ${meetup.maxPeople}`}{" "}
                                  participants
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs">
                                  Host: {meetup.host.fullName}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link href={`/meetups/${meetup.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteMeetup(meetup.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-3xl font-bold">{meetups?.length}</div>
                  <div className="text-gray-600">Total Meetups</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-3xl font-bold text-green-600">
                    {
                      meetups.filter((m) => new Date(m.date) > new Date())
                        .length
                    }
                  </div>
                  <div className="text-gray-600">Upcoming</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">
                    {
                      meetups.filter((m) => new Date(m.date) < new Date())
                        .length
                    }
                  </div>
                  <div className="text-gray-600">Past</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

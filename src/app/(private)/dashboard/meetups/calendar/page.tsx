"use client";

import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { format, isSameDay } from "date-fns";
import { Calendar as CalendarIcon, MapPin, Users } from "lucide-react";

import { getAllMeetups } from "@/actions";
import { toast } from "sonner";
import { Meetup } from "@/types/meetup.interface";

export default function MeetupCalendarPage() {
  const [meetups, setMeetups] = useState<Meetup[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMeetups();
  }, []);

  const fetchMeetups = async () => {
    setLoading(true);
    try {
      const result = await getAllMeetups({}, {});
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

  const getMeetupsForDate = (date: Date) => {
    return meetups.filter((meetup) => isSameDay(new Date(meetup.date), date));
  };

  const dayMeetups = getMeetupsForDate(selectedDate);

  const calendarEvents = meetups.reduce((acc, meetup) => {
    const date = format(new Date(meetup.date), "yyyy-MM-dd");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(meetup);
    return acc;
  }, {} as Record<string, Meetup[]>);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Meetup Calendar</h1>
        <p className="text-gray-600">View all your meetups in calendar view</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Meetups on {format(selectedDate, "PPP")}</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="h-20 bg-gray-200 rounded animate-pulse"
                    ></div>
                  ))}
                </div>
              ) : dayMeetups.length === 0 ? (
                <div className="text-center py-6">
                  <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">
                    No meetups scheduled for this day
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {dayMeetups.map((meetup) => (
                    <div
                      key={meetup.id}
                      className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <h3 className="font-semibold mb-2">{meetup.title}</h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          <span>{meetup.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-3 w-3" />
                          <span>{meetup.participants.length} participants</span>
                        </div>
                        <Badge variant="outline" className="mt-2">
                          {format(new Date(meetup.date), "h:mm a")}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

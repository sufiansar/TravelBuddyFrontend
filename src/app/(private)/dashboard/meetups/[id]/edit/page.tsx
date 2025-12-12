"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { getMeetup, updateMeetup } from "@/actions";
import { toast } from "sonner";
import { MeetupForm } from "@/components/modules/MeetUp/MeetupForm";

export default function EditMeetupPage() {
  const params = useParams();
  const router = useRouter();

  const [meetup, setMeetup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchMeetup();
  }, [params.id]);

  const fetchMeetup = async () => {
    try {
      const result = await getMeetup(params.id as string);
      if (result.success && result.data) {
        setMeetup(result.data);
      } else {
        toast.error("Meetup not found");

        router.push("/meetups");
      }
    } catch (error) {
      toast.error("Failed to fetch meetup");
      router.push("/meetups");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const result = await updateMeetup(params.id as string, data);
      if (result.success) {
        toast.success("Meetup updated successfully");
        router.push(`/meetups/${params.id}`);
      } else {
        toast.error("Failed to update meetup");
      }
    } catch (error) {
      toast.error("An error occurred while updating the meetup");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!meetup) return null;

  const initialData = {
    title: meetup.title,
    location: meetup.location,
    date: format(new Date(meetup.date), "yyyy-MM-dd'T'HH:mm"),
    description: meetup.description,
    maxPeople: meetup.maxPeople?.toString() || "",
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Edit Meetup</h1>
      <MeetupForm
        onSubmit={handleSubmit}
        initialData={initialData}
        isSubmitting={isSubmitting}
        submitText="Update Meetup"
      />
    </div>
  );
}

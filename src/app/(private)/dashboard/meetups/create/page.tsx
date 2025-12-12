"use client";

import React from "react";

import { useRouter } from "next/navigation";
import { createMeetup } from "@/actions";
import { toast } from "sonner";
import { MeetupForm } from "@/components/modules/MeetUp/MeetupForm";

export default function CreateMeetupPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const result: any = await createMeetup(data);
      if (result.success) {
        toast.success("Meetup created successfully!");
        router.push(`/dashboard/meetups/${result?.data?.id}`);
      } else {
        toast.error(result.error || "Failed to create meetup");
      }
    } catch (error) {
      toast.error("Failed to create meetup");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Create New Meetup</h1>
      <MeetupForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitText="Create Meetup"
      />
    </div>
  );
}

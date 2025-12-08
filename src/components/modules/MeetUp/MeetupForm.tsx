"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MeetupFormData,
  meetupSchema,
} from "@/components/zod/meetUp.validation";

interface MeetupFormProps {
  onSubmit: (data: MeetupFormData) => Promise<void>;
  initialData?: Partial<MeetupFormData>;
  isSubmitting?: boolean;
  submitText?: string;
}

export function MeetupForm({
  onSubmit,
  initialData,
  isSubmitting = false,
  submitText = "Create Meetup",
}: MeetupFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MeetupFormData>({
    resolver: zodResolver(meetupSchema),
    defaultValues: initialData,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{submitText}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter meetup title"
              {...register("title")}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              placeholder="Enter meetup location"
              {...register("location")}
              className={errors.location ? "border-red-500" : ""}
            />
            {errors.location && (
              <p className="text-sm text-red-500">{errors.location.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date and Time *</Label>
            <Input
              id="date"
              type="datetime-local"
              {...register("date")}
              className={errors.date ? "border-red-500" : ""}
            />
            {errors.date && (
              <p className="text-sm text-red-500">{errors.date.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Enter meetup description"
              rows={4}
              {...register("description")}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxPeople">Maximum Participants (Optional)</Label>
            <Input
              id="maxPeople"
              type="number"
              min="1"
              placeholder="Leave empty for unlimited"
              {...register("maxPeople")}
            />
            <p className="text-sm text-gray-500">
              Leave empty if there's no limit on participants
            </p>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Submitting..." : submitText}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

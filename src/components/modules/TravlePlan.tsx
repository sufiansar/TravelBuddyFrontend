"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createTravelPlan } from "@/actions";

type FormState = {
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  maxTravelers: string;
  description: string;
  activities: string;
};

interface TravelPlanFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function TravelPlanForm({ onSuccess, onCancel }: TravelPlanFormProps) {
  const [form, setForm] = useState<FormState>({
    title: "",
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    maxTravelers: "5",
    description: "",
    activities: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => fd.append(key, value));

      const result = await createTravelPlan(fd);
      if (!result.success) {
        setError(result.error || "Failed to create travel plan");
        return;
      }

      onSuccess?.();
      setForm({
        title: "",
        destination: "",
        startDate: "",
        endDate: "",
        budget: "",
        maxTravelers: "5",
        description: "",
        activities: "",
      });
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Title *</label>
          <Input
            name="title"
            placeholder="Summer Europe Adventure"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Destination *
          </label>
          <Input
            name="destination"
            placeholder="Thailand, Paris, Tokyo"
            value={form.destination}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Start Date *
          </label>
          <Input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            End Date *
          </label>
          <Input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Budget *
          </label>
          <Input
            name="budget"
            placeholder="$1000 - $2000"
            value={form.budget}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Max Travelers *
          </label>
          <Input
            name="maxTravelers"
            type="number"
            min={1}
            value={form.maxTravelers}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Activities
        </label>
        <Input
          name="activities"
          placeholder="hiking, food tours, photography"
          value={form.activities}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Description
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Tell others about your trip..."
          rows={5}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <div className="flex items-center gap-2 justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Create Plan"}
        </Button>
      </div>
    </form>
  );
}

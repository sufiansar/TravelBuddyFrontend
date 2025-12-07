"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTravelPlan } from "@/actions";

export default function AddTravelPlanPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    minBudget: "",
    maxBudget: "",
    travelType: "GROUP",
    description: "",
    isPublic: "PUBLIC",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formDataObj = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataObj.append(key, value);
      });

      const result = await createTravelPlan(formDataObj);

      if (result.success) {
        router.push("/travel-plans");
      } else {
        setError(result.error || "Failed to create travel plan");
      }
    } catch (error) {
      console.error("Error creating travel plan:", error);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-foreground">
        Create New Travel Plan
      </h1>

      {error && (
        <div className="bg-destructive/10 border border-destructive/50 text-destructive px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-card dark:bg-card rounded-lg shadow-lg p-8 border border-border"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">
              Destination *
            </label>
            <Input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              placeholder="e.g., Thailand, Paris, Tokyo"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">
              Travel Type *
            </label>
            <select
              name="travelType"
              value={formData.travelType}
              onChange={handleChange}
              className="w-full border border-input rounded-md px-3 py-2 bg-background text-foreground"
              required
            >
              <option value="SOLO">Solo</option>
              <option value="GROUP">Group</option>
              <option value="FAMILY">Family</option>
              <option value="COUPLE">Couple</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">
              Start Date *
            </label>
            <Input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">
              End Date *
            </label>
            <Input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">
              Min Budget *
            </label>
            <Input
              type="number"
              name="minBudget"
              value={formData.minBudget}
              onChange={handleChange}
              placeholder="e.g., 1000"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">
              Max Budget *
            </label>
            <Input
              type="number"
              name="maxBudget"
              value={formData.maxBudget}
              onChange={handleChange}
              placeholder="e.g., 2000"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">
              Visibility *
            </label>
            <select
              name="isPublic"
              value={formData.isPublic}
              onChange={handleChange}
              className="w-full border border-input rounded-md px-3 py-2 bg-background text-foreground"
              required
            >
              <option value="PUBLIC">Public</option>
              <option value="PRIVATE">Private</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-foreground">
            Description
          </label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Tell others about your trip..."
            rows={6}
          />
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
          >
            {loading ? "Creating..." : "Create Plan"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

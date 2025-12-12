"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EditTravelPlanPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    travelType: "Solo",
    description: "",
    interests: "",
  });

  const [loading, setLoading] = useState(false);

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

    try {
      // Call API to update travel plan
      console.log("Updating travel plan:", formData);

      router.push("/travel-plans");
    } catch (error) {
      console.error("Error updating travel plan:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-foreground">
        Edit Travel Plan
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-card rounded-lg shadow-lg p-8 border border-border"
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
            >
              <option value="Solo">Solo</option>
              <option value="Friends">Friends</option>
              <option value="Family">Family</option>
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
              Budget *
            </label>
            <Input
              type="text"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              placeholder="e.g., $1000 - $2000"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">
              Interests
            </label>
            <Input
              type="text"
              name="interests"
              value={formData.interests}
              onChange={handleChange}
              placeholder="e.g., hiking, food tours, photography"
            />
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
            {loading ? "Updating..." : "Update Plan"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

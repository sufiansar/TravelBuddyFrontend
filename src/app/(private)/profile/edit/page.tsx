"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EditProfilePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    bio: "",
    currentLocation: "",
    travelInterests: "",
    visitedCountries: "",
    profileImage: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Handle file upload
      console.log("File selected:", file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call API to update profile
      console.log("Updating profile:", formData);

      router.push("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Edit Profile</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-card rounded-lg shadow-lg p-8 border border-border"
      >
        {/* Profile Image */}
        <div className="mb-8">
          <label className="block text-sm font-medium mb-2 text-foreground">
            Profile Image
          </label>
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center bg-muted/50">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="profile-image"
            />
            <label htmlFor="profile-image" className="cursor-pointer">
              <p className="text-foreground">
                Click to upload or drag and drop
              </p>
              <p className="text-sm text-muted-foreground">
                PNG, JPG, GIF up to 10MB
              </p>
            </label>
          </div>
        </div>

        {/* Full Name */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-foreground">
            Full Name *
          </label>
          <Input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Your full name"
            required
          />
        </div>

        {/* Bio */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-foreground">
            Bio / About
          </label>
          <Textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell others about yourself and your travel style..."
            rows={4}
          />
        </div>

        {/* Current Location */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-foreground">
            Current Location
          </label>
          <Input
            type="text"
            name="currentLocation"
            value={formData.currentLocation}
            onChange={handleChange}
            placeholder="e.g., New York, USA"
          />
        </div>

        {/* Travel Interests */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-foreground">
            Travel Interests
          </label>
          <Input
            type="text"
            name="travelInterests"
            value={formData.travelInterests}
            onChange={handleChange}
            placeholder="e.g., hiking, food tours, photography (comma separated)"
          />
        </div>

        {/* Visited Countries */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-foreground">
            Visited Countries
          </label>
          <Input
            type="text"
            name="visitedCountries"
            value={formData.visitedCountries}
            onChange={handleChange}
            placeholder="e.g., Thailand, Japan, Italy (comma separated)"
          />
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

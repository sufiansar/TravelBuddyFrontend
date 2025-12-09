// src/components/admin/TravelPlanFilters.tsx
"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, X } from "lucide-react";
import { TravelType } from "@/types/admin.interface";

interface TravelPlanFiltersProps {
  initialFilters?: Record<string, any>;
}

export function TravelPlanFilters({ initialFilters }: TravelPlanFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    destination: searchParams.get("destination") || "",
    travelType: searchParams.get("travelType") || "",
    isPublic: searchParams.get("isPublic") || "",
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.set("page", "1");
    router.push(`/admin/travel-plans?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({
      destination: "",
      travelType: "",
      isPublic: "",
    });
    router.push("/admin/travel-plans");
  };

  const hasFilters = Object.values(filters).some((value) => value);

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search by destination..."
              value={filters.destination}
              onChange={(e) =>
                handleFilterChange("destination", e.target.value)
              }
              className="pl-9"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-600 hidden sm:inline">
            Filters:
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Select
          value={filters.travelType || "all"}
          onValueChange={(value) =>
            handleFilterChange("travelType", value === "all" ? "" : value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All Travel Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {Object.values(TravelType).map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.isPublic || "all"}
          onValueChange={(value) =>
            handleFilterChange("isPublic", value === "all" ? "" : value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All Visibility" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="true">Public Only</SelectItem>
            <SelectItem value="false">Private Only</SelectItem>
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button variant="outline" onClick={clearFilters} className="gap-2">
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}

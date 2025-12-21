"use client";

import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebouncedCallback } from "use-debounce";
import { TravelType } from "@/types/admin.interface";

interface TravelPlanFiltersProps {
  travelTypes?: TravelType[];
  onChange?: (filters: any) => void;
}

export function TravelPlanFilters({
  travelTypes = Object.values(TravelType),
  onChange,
}: TravelPlanFiltersProps) {
  const [filters, setFilters] = useState<any>({
    searchTerm: "",
    travelType: undefined,
    isPublic: undefined,
  });

  // Debounced search
  const debouncedSearch = useDebouncedCallback((value: string) => {
    const newFilters = { ...filters, searchTerm: value };
    setFilters(newFilters);
    onChange?.(newFilters);
  }, 300);

  const handleChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onChange?.(newFilters);
  };

  const handleReset = () => {
    const reset = {
      searchTerm: "",
      travelType: undefined,
      isPublic: undefined,
    };
    setFilters(reset);
    onChange?.(reset);
  };

  return (
    <div className="flex flex-wrap gap-4 items-center mb-4">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search destinations..."
          value={filters.searchTerm}
          onChange={(e) => debouncedSearch(e.target.value)}
          className="pl-9 w-full"
        />
      </div>

      {/* Travel Type */}
      <Select
        value={filters.travelType ?? "none"}
        onValueChange={(v) =>
          handleChange("travelType", v === "none" ? undefined : v)
        }
      >
        <SelectTrigger className="w-[140px] flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">All Types</SelectItem>
          {travelTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type.replace("_", " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Public/Private */}
      <Select
        value={filters.isPublic ?? "none"}
        onValueChange={(v) =>
          handleChange("isPublic", v === "none" ? undefined : v)
        }
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">All</SelectItem>
          <SelectItem value="PUBLIC">Public</SelectItem>
          <SelectItem value="PRIVATE">Private</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" onClick={handleReset}>
        Reset
      </Button>
    </div>
  );
}

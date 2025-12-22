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
    startDate: undefined,
    endDate: undefined,
    minBudget: undefined,
    maxBudget: undefined,
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
      startDate: undefined,
      endDate: undefined,
      minBudget: undefined,
      maxBudget: undefined,
    };
    setFilters(reset);
    onChange?.(reset);
  };

  return (
    <div className="space-y-4 mb-4">
      <div className="flex flex-wrap gap-4 items-center">
        {/* Search */}
        {/* <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search destinations or travel type..."
            value={filters.searchTerm}
            onChange={(e) => debouncedSearch(e.target.value)}
            className="pl-9 w-full"
          />
        </div> */}

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

        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
      </div>

      {/* Date and Budget Filters */}
      {/* <div className="flex flex-wrap gap-4 items-center">
        <Input
          type="date"
          placeholder="Start Date"
          value={filters.startDate || ""}
          onChange={(e) =>
            handleChange("startDate", e.target.value || undefined)
          }
          className="w-40"
        />
        <Input
          type="date"
          placeholder="End Date"
          value={filters.endDate || ""}
          onChange={(e) => handleChange("endDate", e.target.value || undefined)}
          className="w-40"
        />
        <Input
          type="number"
          placeholder="Min Budget"
          value={filters.minBudget || ""}
          onChange={(e) =>
            handleChange(
              "minBudget",
              e.target.value ? parseInt(e.target.value) : undefined
            )
          }
          className="w-[130px]"
        />
        <Input
          type="number"
          placeholder="Max Budget"
          value={filters.maxBudget || ""}
          onChange={(e) =>
            handleChange(
              "maxBudget",
              e.target.value ? parseInt(e.target.value) : undefined
            )
          }
          className="w-[130px]"
        />
      </div> */}
    </div>
  );
}

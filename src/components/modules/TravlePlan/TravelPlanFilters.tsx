"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, DollarSign, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useDebouncedCallback } from "use-debounce";
import { useState } from "react";

interface TravelPlanFiltersProps {
  travelTypes: string[];
  showAdvanced?: boolean;
}

export function TravelPlanFilters({
  travelTypes = [],
  showAdvanced = false,
}: TravelPlanFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [budgetRange, setBudgetRange] = useState<[number, number]>([0, 10000]);

  const updateSearchParams = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handleSearch = useDebouncedCallback((value: string) => {
    updateSearchParams("searchTerm", value);
  }, 300);

  const handleBudgetChange = (value: number[]) => {
    setBudgetRange([value[0], value[1]]);
    const params = new URLSearchParams(searchParams.toString());
    params.set("minBudget", value[0].toString());
    params.set("maxBudget", value[1].toString());
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handleReset = () => {
    router.push("/travel-plans");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search destinations..."
            defaultValue={searchParams.get("searchTerm") || ""}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2">
          <Select
            defaultValue={searchParams.get("travelType") || "none"}
            onValueChange={(value) =>
              updateSearchParams(
                "travelType",
                value === "none" ? undefined : value
              )
            }
          >
            <SelectTrigger className="w-[140px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="All Types" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">All Types</SelectItem>
              {travelTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            defaultValue={searchParams.get("isPublic") || "none"}
            onValueChange={(value) =>
              updateSearchParams(
                "isPublic",
                value === "none" ? undefined : value
              )
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

          <Select
            defaultValue={searchParams.get("sortBy") || "createdAt"}
            onValueChange={(value) => updateSearchParams("sortBy", value)}
          >
            <SelectTrigger className="w-[140px]">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <SelectValue placeholder="Sort by" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Date Created</SelectItem>
              <SelectItem value="startDate">Start Date</SelectItem>
              <SelectItem value="destination">Destination</SelectItem>
            </SelectContent>
          </Select>

          <Select
            defaultValue={searchParams.get("sortOrder") || "desc"}
            onValueChange={(value) => updateSearchParams("sortOrder", value)}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Descending</SelectItem>
              <SelectItem value="asc">Ascending</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}

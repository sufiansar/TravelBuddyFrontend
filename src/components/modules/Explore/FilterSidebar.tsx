"use client";

import { useState } from "react";
import {
  Filter,
  X,
  Calendar,
  MapPin,
  Tag,
  DollarSign,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ExploreFilters,
  interests,
  travelTypes,
} from "@/types/explore.interface";

interface FilterSidebarProps {
  activeTab: "plans" | "travelers";
  filters: ExploreFilters;
  onFilterChange: (filters: ExploreFilters) => void;
  onReset: () => void;
}

export function FilterSidebar({
  activeTab,
  filters,
  onFilterChange,
  onReset,
}: FilterSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleInputChange = (key: keyof ExploreFilters, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const handleInterestToggle = (interest: string) => {
    const currentInterests = filters.interests || [];
    const newInterests = currentInterests.includes(interest)
      ? currentInterests.filter((i) => i !== interest)
      : [...currentInterests, interest];
    handleInputChange("interests", newInterests);
  };

  const clearFilter = (key: keyof ExploreFilters) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    onFilterChange(newFilters);
  };

  const activeFiltersCount = Object.keys(filters).length;

  return (
    <>
      {/* Backdrop overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Filter Toggle */}
      <div className="lg:hidden fixed bottom-6 right-6 z-30">
        <Button
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg relative"
          onClick={() => setIsOpen(true)}
        >
          <Filter className="h-5 w-5" />
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`
          fixed lg:sticky top-0 lg:top-0 h-screen lg:h-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          w-full sm:w-80 lg:w-full bg-white dark:bg-gray-900 border-r
          border-gray-200 dark:border-gray-800 z-40
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:relative lg:z-auto
          pt-16 lg:pt-0
        `}
      >
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Filters</h2>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFiltersCount}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                className="text-sm hidden sm:inline-flex"
              >
                Reset
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <ScrollArea className="h-[calc(100vh-200px)] lg:h-[calc(100vh-250px)] pr-4">
            <div className="space-y-4 sm:space-y-6">
              {/* Search Term */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Search
                </Label>
                <Input
                  placeholder="Search destination or travel type..."
                  value={filters.searchTerm || ""}
                  onChange={(e) =>
                    handleInputChange("searchTerm", e.target.value)
                  }
                />
              </div>

              {/* Dates */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Dates
                </Label>
                <div className="space-y-2">
                  <Input
                    type="date"
                    placeholder="Start Date"
                    value={filters.startDate || ""}
                    onChange={(e) =>
                      handleInputChange("startDate", e.target.value)
                    }
                  />
                  <Input
                    type="date"
                    placeholder="End Date"
                    value={filters.endDate || ""}
                    onChange={(e) =>
                      handleInputChange("endDate", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Travel Type (only for plans) */}
              {activeTab === "plans" && (
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Travel Type
                  </Label>
                  <Select
                    value={filters.travelType || "all"}
                    onValueChange={(value) =>
                      handleInputChange(
                        "travelType",
                        value === "all" ? "" : value
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Type</SelectItem>
                      {travelTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.replace("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
              <h3 className="text-sm font-medium mb-2">Active Filters</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(filters).map(([key, value]) => {
                  if (!value || (Array.isArray(value) && value.length === 0))
                    return null;

                  let displayValue = value;
                  if (key === "travelType") {
                    displayValue = String(value).replace("_", " ");
                  } else if (Array.isArray(value)) {
                    displayValue = value.join(", ");
                  }

                  return (
                    <Badge
                      key={key}
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <span className="text-xs">
                        {key}: {displayValue}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-3 w-3 p-0 ml-1"
                        onClick={() => clearFilter(key as keyof ExploreFilters)}
                      >
                        <X className="h-2 w-2" />
                      </Button>
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { useState } from "react";

interface ReviewFiltersProps {
  onFilterChange: (filters: any) => void;
  currentFilters: any;
}

export function ReviewFilters({
  onFilterChange,
  currentFilters,
}: ReviewFiltersProps) {
  const [searchTerm, setSearchTerm] = useState(
    currentFilters?.searchTerm || ""
  );
  const [sortBy, setSortBy] = useState(currentFilters?.sortBy || "createdAt");
  const [sortOrder, setSortOrder] = useState(
    currentFilters?.sortOrder || "desc"
  );
  const [minRating, setMinRating] = useState(
    currentFilters?.minRating || "all"
  );

  const handleApplyFilters = () => {
    onFilterChange({
      searchTerm: searchTerm || undefined,
      sortBy,
      sortOrder: sortOrder as "asc" | "desc",
      minRating: minRating !== "all" ? parseInt(minRating) : undefined,
      page: 1,
    });
  };

  const handleReset = () => {
    setSearchTerm("");
    setSortBy("createdAt");
    setSortOrder("desc");
    setMinRating("all");
    onFilterChange({
      sortBy: "createdAt",
      sortOrder: "desc",
      page: 1,
    });
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-4">
        <div className="flex-1">
          <label className="text-sm font-medium">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by reviewer, receiver, or comment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="w-full md:w-48">
          <label className="text-sm font-medium">Minimum Rating</label>
          <Select value={minRating} onValueChange={setMinRating}>
            <SelectTrigger>
              <SelectValue placeholder="All ratings" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All ratings</SelectItem>
              <SelectItem value="1">1+ stars</SelectItem>
              <SelectItem value="2">2+ stars</SelectItem>
              <SelectItem value="3">3+ stars</SelectItem>
              <SelectItem value="4">4+ stars</SelectItem>
              <SelectItem value="5">5 stars only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-40">
          <label className="text-sm font-medium">Sort By</label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Date Created</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="updatedAt">Last Updated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-40">
          <label className="text-sm font-medium">Order</label>
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Newest</SelectItem>
              <SelectItem value="asc">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleApplyFilters} className="gap-2">
          <Filter className="w-4 h-4" />
          Apply Filters
        </Button>
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </div>
  );
}

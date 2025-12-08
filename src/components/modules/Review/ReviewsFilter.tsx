"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, ArrowUpDown } from "lucide-react";
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

interface ReviewsFilterProps {
  showUserFilter?: boolean;
  showPlanFilter?: boolean;
}

export function ReviewsFilter({
  showUserFilter = false,
  showPlanFilter = false,
}: ReviewsFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

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
    updateSearchParams("search", value);
  }, 300);

  const handleReset = () => {
    router.push(window.location.pathname);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reviews..."
            defaultValue={searchParams.get("search") || ""}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2">
          <Select
            defaultValue={searchParams.get("sortBy") || "createdAt"}
            onValueChange={(value) => updateSearchParams("sortBy", value)}
          >
            <SelectTrigger className="w-[140px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Sort by" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Date Created</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="updatedAt">Last Updated</SelectItem>
            </SelectContent>
          </Select>

          <Select
            defaultValue={searchParams.get("sortOrder") || "desc"}
            onValueChange={(value) => updateSearchParams("sortOrder", value)}
          >
            <SelectTrigger className="w-[120px]">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Descending</SelectItem>
              <SelectItem value="asc">Ascending</SelectItem>
            </SelectContent>
          </Select>

          <Select
            defaultValue={searchParams.get("limit") || "10"}
            onValueChange={(value) => updateSearchParams("limit", value)}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 per page</SelectItem>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="20">20 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
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

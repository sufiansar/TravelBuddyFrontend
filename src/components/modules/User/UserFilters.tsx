"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, User as UserIcon, Shield } from "lucide-react";
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

interface UserFiltersProps {
  showRoleFilter?: boolean;
}

export function UserFilters({ showRoleFilter = true }: UserFiltersProps) {
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
    updateSearchParams("searchTerm", value);
  }, 300);

  const handleReset = () => {
    router.push("/users");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name or email..."
            defaultValue={searchParams.get("searchTerm") || ""}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2">
          {showRoleFilter && (
            <Select
              defaultValue={searchParams.get("role") || ""}
              onValueChange={(value) =>
                updateSearchParams("role", value || undefined)
              }
            >
              <SelectTrigger className="w-[140px]">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <SelectValue placeholder="All Roles" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Roles</SelectItem>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          )}

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
              <SelectItem value="fullName">Name</SelectItem>
              <SelectItem value="email">Email</SelectItem>
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

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
import { UserRole, UserStatus } from "@/types/admin.interface";
// Adjust the import path as needed

interface UserFiltersProps {
  initialFilters?: Record<string, any>;
}

export function UserFilters({ initialFilters }: UserFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    searchTerm: searchParams.get("searchTerm") || "",
    role: searchParams.get("role") || "",
    userStatus: searchParams.get("userStatus") || "",
    verifiedBadge: searchParams.get("verifiedBadge") || "",
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
    router.push(`/admin/users?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: "",
      role: "",
      userStatus: "",
      verifiedBadge: "",
    });
    router.push("/admin/users");
  };

  const hasFilters = Object.values(filters).some((value) => value);

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search users by name, email, or username..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
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

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <Select
          value={filters.role || "all"}
          onValueChange={(value) =>
            handleFilterChange("role", value === "all" ? "" : value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {Object.values(UserRole).map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.userStatus || "all"}
          onValueChange={(value) =>
            handleFilterChange("userStatus", value === "all" ? "" : value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {Object.values(UserStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.verifiedBadge || "all"}
          onValueChange={(value) =>
            handleFilterChange("verifiedBadge", value === "all" ? "" : value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Verification" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="true">Verified Only</SelectItem>
            <SelectItem value="false">Not Verified</SelectItem>
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

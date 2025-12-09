// src/components/admin/SubscriptionFilters.tsx
"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, X } from "lucide-react";
import { SubscriptionPlan } from "@/types/admin.interface";

interface SubscriptionFiltersProps {
  initialFilters?: Record<string, any>;
}

export function SubscriptionFilters({
  initialFilters,
}: SubscriptionFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    plan: searchParams.get("plan") || "",
    isActive: searchParams.get("isActive") || "",
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
    router.push(`/admin/subscriptions?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({ plan: "", isActive: "" });
    router.push("/admin/subscriptions");
  };

  const hasFilters = Object.values(filters).some((value) => value);

  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-600">Filters</span>
        </div>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          value={filters.plan || "all"}
          onValueChange={(value) =>
            handleFilterChange("plan", value === "all" ? "" : value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All Plans" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Plans</SelectItem>
            {Object.values(SubscriptionPlan).map((plan) => (
              <SelectItem key={plan} value={plan}>
                {plan}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.isActive || "all"}
          onValueChange={(value) =>
            handleFilterChange("isActive", value === "all" ? "" : value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="true">Active Only</SelectItem>
            <SelectItem value="false">Inactive Only</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

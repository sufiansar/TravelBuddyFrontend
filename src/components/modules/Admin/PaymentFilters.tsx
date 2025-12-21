// src/components/admin/PaymentFilters.tsx
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

import { Search, Filter, X, Calendar } from "lucide-react";

import { format } from "date-fns";
import { PaymentStatus } from "@/types/admin.interface";

interface PaymentFiltersProps {
  initialFilters?: Record<string, any>;
}

export function PaymentFilters({ initialFilters }: PaymentFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    searchTerm: searchParams.get("searchTerm") || "",
    status: searchParams.get("status") || "",
    userId: searchParams.get("userId") || "",
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
    minAmount: searchParams.get("minAmount") || "",
    maxAmount: searchParams.get("maxAmount") || "",
    paymentMethod: searchParams.get("paymentMethod") || "",
  });

  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: filters.startDate ? new Date(filters.startDate) : undefined,
    to: filters.endDate ? new Date(filters.endDate) : undefined,
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    updateURL(newFilters);
  };

  const handleDateRangeChange = (range: { from?: Date; to?: Date }) => {
    setDateRange(range as any);

    const newFilters = {
      ...filters,
      startDate: range.from ? format(range.from, "yyyy-MM-dd") : "",
      endDate: range.to ? format(range.to, "yyyy-MM-dd") : "",
    };
    setFilters(newFilters);

    updateURL(newFilters);
  };

  const updateURL = (newFilters: typeof filters) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== "") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    params.set("page", "1");
    router.push(`/admin/payments?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: "",
      status: "",
      userId: "",
      startDate: "",
      endDate: "",
      minAmount: "",
      maxAmount: "",
      paymentMethod: "",
    });
    setDateRange({ from: undefined, to: undefined });
    router.push("/admin/payments");
  };

  const hasFilters = Object.values(filters).some((value) => value);

  return (
    <div className="space-y-4 mx-auto mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search by transaction ID, user name or email..."
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Select
          value={filters.status || "all"}
          onValueChange={(value) =>
            handleFilterChange("status", value === "all" ? "" : value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {Object.values(PaymentStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="User ID"
          value={filters.userId}
          onChange={(e) => handleFilterChange("userId", e.target.value)}
        />

        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Date Range</span>
          </div>
          <Input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange("startDate", e.target.value)}
            placeholder="Start date"
            className="mb-2"
          />
          <Input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange("endDate", e.target.value)}
            placeholder="End date"
          />
        </div>
      </div>

      {hasFilters && (
        <div className="pt-4 border-t">
          <div className="flex flex-wrap gap-2">
            {filters.status && (
              <Badge variant="secondary" className="gap-1">
                Status: {filters.status}
                <button
                  onClick={() => handleFilterChange("status", "")}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {filters.userId && (
              <Badge variant="secondary" className="gap-1">
                User ID: {filters.userId.slice(0, 8)}...
                <button
                  onClick={() => handleFilterChange("userId", "")}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {(filters.startDate || filters.endDate) && (
              <Badge variant="secondary" className="gap-1">
                Date: {filters.startDate || "Start"} -{" "}
                {filters.endDate || "End"}
                <button
                  onClick={() => {
                    handleFilterChange("startDate", "");
                    handleFilterChange("endDate", "");
                  }}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Badge component
const Badge = ({
  variant = "secondary",
  className = "",
  children,
  ...props
}: {
  variant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}) => {
  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive:
      "bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline:
      "text-foreground border border-input hover:bg-accent hover:text-accent-foreground",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

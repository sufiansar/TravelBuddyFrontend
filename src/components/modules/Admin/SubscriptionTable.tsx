// src/components/admin/SubscriptionTable.tsx
"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  RefreshCw,
  CreditCard,
  CheckCircle,
  XCircle,
} from "lucide-react";

import { format } from "date-fns";

import { Subscription, SubscriptionPlan } from "@/types/admin.interface";

import { Pagination } from "@/components/Shared/Pagination";
import { useRouter } from "next/navigation";

interface SubscriptionTableProps {
  subscriptions: Subscription[];
  meta?: {
    page: number;
    limit: number;
    totalPage: number;
    total: number;
  };
  currentFilters?: Record<string, any>;
}

export function SubscriptionTable({
  subscriptions,
  meta,
  currentFilters,
}: SubscriptionTableProps) {
  const router = useRouter();
  const getPlanColor = (plan: SubscriptionPlan) => {
    switch (plan) {
      case SubscriptionPlan.MONTHLY:
        return "bg-green-100 text-green-800";
      case SubscriptionPlan.YEARLY:
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPlanPrice = (plan: SubscriptionPlan) => {
    switch (plan) {
      case SubscriptionPlan.YEARLY:
        return "$199.99/yr";
      case SubscriptionPlan.MONTHLY:
        return "$19.99/mo";

      default:
        return "Free";
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Next Billing</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No subscriptions found.
                </TableCell>
              </TableRow>
            ) : (
              subscriptions.map((subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {subscription.user.fullName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {subscription.user.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={getPlanColor(subscription.plan)}
                    >
                      {subscription.plan}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {getPlanPrice(subscription.plan)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {subscription.isActive ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800"
                        >
                          Active
                        </Badge>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-500" />
                        <Badge
                          variant="secondary"
                          className="bg-red-100 text-red-800"
                        >
                          Inactive
                        </Badge>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {format(new Date(subscription.startDate), "MMM d, yyyy")}{" "}
                      - {format(new Date(subscription.endDate), "MMM d, yyyy")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {subscription.isActive ? (
                        format(new Date(subscription.endDate), "MMM d, yyyy")
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <CreditCard className="mr-2 h-4 w-4" />
                          Update Payment
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Renew Subscription
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <XCircle className="mr-2 h-4 w-4" />
                          Cancel Subscription
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {meta && meta.totalPage > 1 && (
        <Pagination
          currentPage={meta.page as number}
          totalPages={meta.totalPage as number}
          onPageChange={(page: number) => {
            const params = new URLSearchParams();
            if (currentFilters) {
              Object.entries(currentFilters).forEach(([key, value]) => {
                if (value && key !== "page" && key !== "limit") {
                  params.set(key, String(value));
                }
              });
            }
            params.set("page", page.toString());
            router.push(`?${params.toString()}`);
          }}
        />
      )}
    </div>
  );
}

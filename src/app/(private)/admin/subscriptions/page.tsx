import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Filter } from "lucide-react";
import { getAllSubscriptions } from "@/actions/admin/actions";

// Mark this page as dynamic since it uses server session
export const dynamic = "force-dynamic";
import { SubscriptionFilters } from "@/components/modules/Admin/SubscriptionFilters";
import { SubscriptionTable } from "@/components/modules/Admin/SubscriptionTable";

interface SubscriptionsPageProps {
  searchParams?: {
    plan?: string;
    isActive?: string;
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}

export default async function AdminSubscriptionsPage({
  searchParams,
}: SubscriptionsPageProps) {
  const filters = {
    plan: searchParams?.plan,
    isActive: searchParams?.isActive,
    page: searchParams?.page ? parseInt(searchParams.page) : 1,
    limit: searchParams?.limit ? parseInt(searchParams.limit) : 10,
    sortBy: searchParams?.sortBy,
    sortOrder: searchParams?.sortOrder as "asc" | "desc",
  };

  const result = await getAllSubscriptions(filters as any);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Subscription Management
          </h1>
          <p className="text-gray-600">Manage user subscriptions and plans</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>All Subscriptions</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <SubscriptionFilters initialFilters={filters} />

          {result.success ? (
            <SubscriptionTable
              subscriptions={result.data || []}
              meta={result.meta}
              currentFilters={filters}
            />
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-500">
                Failed to load subscriptions: {result.error}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

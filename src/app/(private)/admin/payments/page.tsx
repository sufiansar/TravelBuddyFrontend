import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Filter } from "lucide-react";
import { getAllPayments } from "@/actions/admin/actions";

// Mark this page as dynamic since it uses server session
export const dynamic = "force-dynamic";
import { PaymentTable } from "@/components/modules/Admin/PaymentTable";
import { PaymentFilters } from "@/components/modules/Admin/PaymentFilters";

interface PaymentsPageProps {
  searchParams?: {
    status?: string;
    userId?: string;
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}

export default async function AdminPaymentsPage({
  searchParams,
}: PaymentsPageProps) {
  const filters = {
    status: searchParams?.status,
    userId: searchParams?.userId,
    page: searchParams?.page ? parseInt(searchParams.page) : 1,
    limit: searchParams?.limit ? parseInt(searchParams.limit) : 10,
    sortBy: searchParams?.sortBy,
    sortOrder: searchParams?.sortOrder as "asc" | "desc",
  };

  const result = await getAllPayments(filters as any);
  console.log(result);

  return (
    <div className="space-y-6 mx-auto 7xl:px-0 px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Payment Management
          </h1>
          <p className="text-gray-600">
            View and manage all payment transactions
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>All Payments</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <PaymentFilters initialFilters={filters} />

          {result.success ? (
            <PaymentTable
              payments={result.data || []}
              meta={result.meta}
              currentFilters={filters}
            />
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-500">
                Failed to load payments: {result.error}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

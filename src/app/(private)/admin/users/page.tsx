import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Filter, Plus } from "lucide-react";

import { UserFilters } from "@/components/modules/Admin/UserFilters";
import { UserTable } from "@/components/modules/Admin/UserTable";
import { getAllUsers } from "@/actions/admin/actions";

interface UsersPageProps {
  searchParams?: {
    searchTerm?: string;
    role?: string;
    userStatus?: string;
    verifiedBadge?: string;
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}

export default async function AdminUsersPage({ searchParams }: UsersPageProps) {
  const filters = {
    searchTerm: searchParams?.searchTerm,
    role: searchParams?.role,
    userStatus: searchParams?.userStatus,
    verifiedBadge: searchParams?.verifiedBadge,
    page: searchParams?.page ? parseInt(searchParams.page) : 1,
    limit: searchParams?.limit ? parseInt(searchParams.limit) : 10,
    sortBy: searchParams?.sortBy,
    sortOrder: searchParams?.sortOrder as "asc" | "desc",
  };

  const result = await getAllUsers(filters as any);
  console.log(result.data);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-gray-600">
            Manage platform users, roles, and status
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>All Users</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <UserFilters initialFilters={filters} />

          {result.success ? (
            <UserTable
              users={result.data || []}
              meta={result.meta}
              currentFilters={filters}
            />
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-500">
                Failed to load users: {result.error}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

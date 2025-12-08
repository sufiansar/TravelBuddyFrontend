import { Suspense } from "react";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";

import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getAllUsers } from "@/actions";
import { UserFilters } from "@/components/modules/User/UserFilters";
import { UserCard } from "@/components/modules/User/UserCard";

export const metadata: Metadata = {
  title: "Users | TravelBuddy",
  description: "Manage users and administrators",
};

interface UsersPageProps {
  searchParams: {
    page?: string;
    limit?: string;
    searchTerm?: string;
    role?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}

async function UsersContent({ searchParams }: UsersPageProps) {
  const page = parseInt(searchParams.page || "1");
  const limit = parseInt(searchParams.limit || "10");

  const result = await getAllUsers({
    page,
    limit,
    searchTerm: searchParams.searchTerm,
    role: searchParams.role as any,
    sortBy: searchParams.sortBy,
    sortOrder: searchParams.sortOrder as "asc" | "desc",
  });

  if (!result.success) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-semibold">Error Loading Users</h3>
          <p className="text-muted-foreground">{result.error}</p>
        </div>
      </div>
    );
  }

  const { data: users, meta } = result;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage users and administrators ({meta?.total || 0} total)
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/create-user">
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Link>
        </Button>
      </div>

      <UserFilters showRoleFilter={true} />

      {users.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-center border-2 border-dashed rounded-lg">
          <div className="p-8">
            <h3 className="text-lg font-semibold mb-2">No users found</h3>
            <p className="text-muted-foreground">
              {searchParams.searchTerm
                ? `No users match "${searchParams.searchTerm}"`
                : "There are no users in the system yet."}
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user: any) => (
              <UserCard
                key={user.id}
                user={user}
                showActions={true}
                isAdminView={true}
              />
            ))}
          </div>

          {meta && meta.total > meta.limit && (
            <div className="flex justify-center pt-6">
              <Pagination>
                <PaginationContent>
                  {Array.from({
                    length: Math.ceil(meta.total / meta.limit),
                  }).map((_, i) => (
                    <PaginationItem key={i + 1}>
                      <Link
                        href={`?page=${i + 1}${
                          searchParams.searchTerm
                            ? `&searchTerm=${searchParams.searchTerm}`
                            : ""
                        }${
                          searchParams.role ? `&role=${searchParams.role}` : ""
                        }`}
                      >
                        <PaginationLink isActive={meta.page === i + 1}>
                          {i + 1}
                        </PaginationLink>
                      </Link>
                    </PaginationItem>
                  ))}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function UsersPage(props: UsersPageProps) {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <Suspense fallback={<UsersLoadingSkeleton />}>
        <UsersContent {...props} />
      </Suspense>
    </div>
  );
}

function UsersLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}

import { Suspense } from "react";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";

import { Metadata } from "next";

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

  const params = {
    page,
    limit,
    ...(searchParams.searchTerm ? { searchTerm: searchParams.searchTerm } : {}),
    ...(searchParams.role ? { role: searchParams.role as any } : {}),
    ...(searchParams.sortBy ? { sortBy: searchParams.sortBy } : {}),
    ...(searchParams.sortOrder
      ? { sortOrder: searchParams.sortOrder as any }
      : {}),
  };

  const result = await getAllUsers(params);

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
      </div>

      <UserFilters showRoleFilter={true} />

      {(Array.isArray(users) ? users.length : users?.data?.length || 0) ===
      0 ? (
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
            {(Array.isArray(users) ? users : users?.data || []).map(
              (user: any) => (
                <UserCard
                  key={user.id}
                  user={user}
                  showActions={true}
                  isAdminView={true}
                />
              )
            )}
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
                        href={`?page=${i + 1}&limit=${meta.limit}${
                          searchParams.searchTerm
                            ? `&searchTerm=${searchParams.searchTerm}`
                            : ""
                        }${
                          searchParams.role ? `&role=${searchParams.role}` : ""
                        }${
                          searchParams.sortBy
                            ? `&sortBy=${searchParams.sortBy}`
                            : ""
                        }${
                          searchParams.sortOrder
                            ? `&sortOrder=${searchParams.sortOrder}`
                            : ""
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

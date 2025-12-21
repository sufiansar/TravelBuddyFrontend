"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { MoreHorizontal, Eye, Edit, Ban, CheckCircle } from "lucide-react";

import { format } from "date-fns";
// import { Pagination } from "@/components/ui/pagination";

import { useRouter } from "next/navigation";
import { AdminUser, UserStatus } from "@/types/admin.interface";
import { toggleUserStatus } from "@/actions/admin/actions";
import { Pagination } from "@/components/Shared/Pagination";

interface UserTableProps {
  users: AdminUser[];
  meta?: {
    page: number;
    limit: number;
    totalPage: number;
    total: number;
  };
  currentFilters?: Record<string, any>;
}

export function UserTable({ users, meta, currentFilters }: UserTableProps) {
  const router = useRouter();
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  const handleStatusToggle = async (
    userId: string,
    currentStatus: UserStatus
  ) => {
    try {
      setLoadingUserId(userId);
      const newStatus =
        currentStatus === UserStatus.ACTIVE
          ? UserStatus.BANNED
          : UserStatus.ACTIVE;

      const result = await toggleUserStatus(userId, newStatus);

      if (result.success) {
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to toggle user status:", error);
    } finally {
      setLoadingUserId(null);
    }
  };

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case UserStatus.ACTIVE:
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case UserStatus.BANNED:
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case UserStatus.INACTIVE:
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "bg-purple-100 text-purple-800";
      case "ADMIN":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.profileImage} />
                        <AvatarFallback>
                          {user.fullName?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.fullName}</div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={getRoleColor(user.role)}
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={getStatusColor(user.userStatus)}
                    >
                      {user.userStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.verifiedBadge ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {format(new Date(user.createdAt), "MMM d, yyyy")}
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
                        <DropdownMenuItem
                          onClick={() => router.push(`/admin/users/${user.id}`)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.push(`/admin/users/${user.id}`)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusToggle(user.id, user.userStatus)
                          }
                          disabled={
                            loadingUserId === user.id ||
                            user.role === "SUPER_ADMIN"
                          }
                        >
                          <Ban className="mr-2 h-4 w-4" />
                          {user.userStatus === UserStatus.ACTIVE
                            ? "Ban User"
                            : "Activate User"}
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

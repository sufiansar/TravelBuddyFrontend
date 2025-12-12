"use client";

// Mark this page as dynamic since it uses server session
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Shield } from "lucide-react";
import { RoleUpdateModal } from "@/components/modules/User/RoleUpdateModal";
import { getAllUsers as getAllUsersAdmin } from "@/actions/admin/actions";
import { User } from "@/lib/types";

export default function ManageRolesPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const result = await getAllUsersAdmin();
      console.log("ManageRolesPage - getAllUsers result:", result);
      if (result.success) {
        setUsers(result?.data as any);
      }
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleUpdate = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleRefresh = () => {
    loadUsers();
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "bg-red-600 hover:bg-red-700";
      case "ADMIN":
        return "bg-blue-600 hover:bg-blue-700";
      case "USER":
        return "bg-gray-600 hover:bg-gray-700";
      default:
        return "bg-gray-600 hover:bg-gray-700";
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Shield className="h-8 w-8" />
          Manage User Roles
        </h1>
        <p className="text-muted-foreground">
          Update user roles and permissions
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Users</CardTitle>
          <Button onClick={handleRefresh} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Refresh"
            )}
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : users.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No users found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Current Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.fullName}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          className={`${getRoleBadgeColor(
                            user.role
                          )} text-white`}
                        >
                          {user.role.replace(/_/g, " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.userStatus === "ACTIVE"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {user.userStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRoleUpdate(user)}
                        >
                          Update Role
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedUser && (
        <RoleUpdateModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          userId={selectedUser.id}
          currentRole={selectedUser.role}
          userName={selectedUser.fullName}
          onSuccess={handleRefresh}
        />
      )}
    </div>
  );
}

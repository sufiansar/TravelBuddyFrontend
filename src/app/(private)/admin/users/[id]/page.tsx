import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mark this page as dynamic since it uses server session
export const dynamic = "force-dynamic";
import {
  ArrowLeft,
  Mail,
  MapPin,
  Calendar,
  ShieldCheck,
  Ban,
  MessageSquare,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

import { getAllUsers } from "@/actions/admin/actions";
import UserEditForm from "@/components/modules/Admin/UserEditForm";

interface UserDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params;
  const result = await getAllUsers();
  const users = result.success ? result.data || [] : [];
  const user = users.find((u: any) => u.id === id);

  if (!user) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500 mb-4">User not found</p>
        <Link href="/admin/users">
          <Button variant="outline">Back to Users</Button>
        </Link>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/users">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">User Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - User Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src={user.profileImage} alt={user.fullName} />
                  <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold">{user.fullName}</h2>
                <p className="text-gray-600 text-sm mt-1">@{user.username}</p>

                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  <Badge>
                    {user.role === "ADMIN"
                      ? "Admin"
                      : user.role === "SUPER_ADMIN"
                      ? "Super Admin"
                      : "User"}
                  </Badge>
                  {user.verifiedBadge && (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800"
                    >
                      <ShieldCheck className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  <Badge
                    variant={
                      user.userStatus === "ACTIVE" ? "default" : "destructive"
                    }
                    className={
                      user.userStatus === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {user.userStatus}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3 border-t pt-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-600">Email</p>
                    <p className="text-sm font-medium">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-600">Joined</p>
                    <p className="text-sm font-medium">
                      {format(new Date(user.createdAt), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Stats */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base">Account Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-2 bg-foreground-50 rounded">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Verification</span>
                </div>
                <span className="font-semibold">
                  {user.verifiedBadge ? "Verified" : "Unverified"}
                </span>
              </div>

              <div className="flex justify-between items-center p-2 bg-foreground-50 rounded">
                <div className="flex items-center gap-2">
                  <Ban className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Status</span>
                </div>
                <span className="font-semibold">{user.userStatus}</span>
              </div>

              <div className="flex justify-between items-center p-2 bg-foreground-50 rounded">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Role</span>
                </div>
                <span className="font-semibold">{user.role}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Edit Form */}
        <div className="lg:col-span-2">
          <UserEditForm user={user} />
        </div>
      </div>
    </div>
  );
}

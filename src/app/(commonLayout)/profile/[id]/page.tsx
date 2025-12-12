import { notFound, redirect } from "next/navigation";
import {
  getMyProfile,
  getUserById,
  getPublicProfile,
} from "@/actions/users/actions";
import { Metadata } from "next";
import { UserProfile } from "@/components/modules/User/UserProfile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings, Shield } from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth";

import { Badge } from "@/components/ui/badge";
import { authOptions } from "@/helpers/authOptions";

interface ProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const isCurrentUser = session?.user?.id === id;

  if (isCurrentUser) {
    return {
      title: "My Profile | TravelBuddy",
    };
  }

  const result = await getPublicProfile(id);

  if (!result.success) {
    return {
      title: "Profile Not Found | TravelBuddy",
    };
  }

  const user = (result.data as any)?.user || result.data;

  return {
    title: `${user.fullName} | TravelBuddy`,
    description: `Profile of ${user.fullName}`,
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const isCurrentUser = session.user.id === id;
  let user;

  if (isCurrentUser) {
    const result = await getMyProfile();
    if (!result.success) {
      redirect("/login");
    }
    user = result.data;
  } else {
    console.log("ProfilePage - Fetching user with ID:", id);

    const publicResult = await getPublicProfile(id);
    console.log(
      "ProfilePage - getPublicProfile result:",
      JSON.stringify(publicResult, null, 2)
    );

    if (!publicResult.success) {
      console.log("ProfilePage - User not found, showing 404");
      notFound();
    }

    const publicData = publicResult.data as any;
    user = publicData?.user || publicData;

    console.log("ProfilePage - Extracted user:", JSON.stringify(user, null, 2));

    if (!user || !user.id) {
      console.error("ProfilePage - Invalid user data structure");
      notFound();
    }

    if (!user.email) {
      user.email = user.username || "N/A";
    }
    if (!user.role) {
      user.role = "USER";
    }
    if (!user.updatedAt) {
      user.updatedAt = user.createdAt;
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">
                {isCurrentUser ? "My Profile" : "Profile"}
              </h1>
              {isCurrentUser && (
                <Badge variant="secondary" className="gap-1">
                  <Shield className="h-3 w-3" />
                  {session.user.role}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">
              {isCurrentUser
                ? "Manage your profile and settings"
                : `Viewing ${user.fullName}'s profile`}
            </p>
          </div>
        </div>

        {isCurrentUser && (
          <Button variant="outline" asChild>
            <Link href="/settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <UserProfile user={user} showEditButton={isCurrentUser} />
        </div>

        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href={`/users/public/${user.id}`}>
                  View Public Profile
                </Link>
              </Button>
              {isCurrentUser && (
                <>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href={`/users/${user.id}/edit`}>Edit Profile</Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href="/trips/new">Create New Trip</Link>
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Account Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Email Verified</span>
                <Badge variant={user.email ? "default" : "destructive"}>
                  {user.email ? "Verified" : "Pending"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Profile Complete</span>
                <Badge
                  variant={
                    user.bio && user.currentLocation ? "default" : "secondary"
                  }
                >
                  {user.bio && user.currentLocation ? "Complete" : "Incomplete"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Member Since</span>
                <span className="text-sm font-medium">
                  {new Date(user.createdAt).getFullYear()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          {isCurrentUser && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Privacy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Control who can see your profile information
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    asChild
                  >
                    <Link href="/settings/privacy">
                      Manage Privacy Settings
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

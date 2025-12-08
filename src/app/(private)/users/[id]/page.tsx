import { notFound } from "next/navigation";

import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, Mail, Globe } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { getUserById } from "@/actions";
import { UserProfile } from "@/components/modules/User/UserProfile";

interface UserDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: UserDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const result = await getUserById(id);

  if (!result.success) {
    return {
      title: "User Not Found | TravelBuddy",
    };
  }

  return {
    title: `${result.data.fullName} | TravelBuddy`,
    description: `Profile of ${result.data.fullName}`,
  };
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params;
  const result = await getUserById(id);

  if (!result.success) {
    notFound();
  }

  const user = result.data;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/users">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UserProfile user={user} showEditButton={true} />
        </div>

        <div className="space-y-6">
          {/* User Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Email:</span>
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Joined:</span>
                  <span>{format(new Date(user.createdAt), "PPP")}</span>
                </div>
                {user.currentLocation && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Location:</span>
                    <span>{user.currentLocation}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href={`/users/public/${user.id}`}>
                  <Globe className="mr-2 h-4 w-4" />
                  View Public Profile
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href={`/users/${user.id}/edit`}>Edit Profile</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Statistics Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">
                    {user.interests?.length || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Interests</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">
                    {user.visitedCountries?.length || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Countries</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

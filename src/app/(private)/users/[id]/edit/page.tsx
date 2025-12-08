import { notFound, redirect } from "next/navigation";

import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { getUserById, getMyProfile } from "@/actions";
import { authOptions } from "@/helpers/authOptions";
import { ProfileForm } from "@/components/modules/User/ProfileForm";

interface EditUserPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: EditUserPageProps): Promise<Metadata> {
  const { id } = await params;
  const result = await getUserById(id);

  if (!result.success) {
    return {
      title: "User Not Found | TravelBuddy",
    };
  }

  return {
    title: `Edit ${result.data.fullName} | TravelBuddy`,
  };
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  // Check permissions
  const isCurrentUser = session?.user?.id === id;
  const isAdmin =
    session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN";

  if (!isCurrentUser && !isAdmin) {
    redirect("/unauthorized");
  }

  // For current user, use getMyProfile for accurate data
  // For other users (admin viewing), use getUserById
  let result;
  if (isCurrentUser) {
    result = await getMyProfile();
  } else {
    result = await getUserById(id);
  }

  if (!result.success) {
    notFound();
  }

  const user = result.data;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/users/${user.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Profile
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Profile</h1>
            <p className="text-muted-foreground">
              Update your profile information
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <ProfileForm user={user} />
      </div>
    </div>
  );
}

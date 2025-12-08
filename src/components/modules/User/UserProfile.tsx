"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User as UserIcon,
  Mail,
  Calendar,
  MapPin,
  Globe,
  Award,
  Edit,
  Shield,
} from "lucide-react";
import { format } from "date-fns";
import { User } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface UserProfileProps {
  user: User;
  isPublic?: boolean;
  showEditButton?: boolean;
}

export function UserProfile({
  user,
  isPublic = false,
  showEditButton = true,
}: UserProfileProps) {
  const router = useRouter();
  const { data: session } = useSession();

  const isCurrentUser = session?.user?.id === user.id;
  const canEdit =
    isCurrentUser ||
    session?.user?.role === "ADMIN" ||
    session?.user?.role === "SUPER_ADMIN";

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return (
          <Badge variant="destructive" className="gap-1">
            <Shield className="h-3 w-3" />
            Super Admin
          </Badge>
        );
      case "ADMIN":
        return (
          <Badge variant="default" className="gap-1">
            <Shield className="h-3 w-3" />
            Admin
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="gap-1">
            <UserIcon className="h-3 w-3" />
            User
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="h-32 w-32 border-4 border-background">
              <AvatarImage src={user.profileImage} />
              <AvatarFallback className="text-2xl">
                {user.fullName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">{user.fullName}</h1>
                    {user.verifiedBadge && (
                      <Badge variant="secondary" className="gap-1">
                        <Award className="h-3 w-3" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    {user.email && user.email !== "N/A" && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>{user.email}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Joined {format(new Date(user.createdAt), "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getRoleBadge(user.role)}
                  {showEditButton && canEdit && !isPublic && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/users/${user.id}/edit`)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>

              {user.bio && (
                <p className="text-gray-700 whitespace-pre-wrap">{user.bio}</p>
              )}

              {user.currentLocation && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{user.currentLocation}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interests & Visited Countries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Interests */}
        {user.interests && user.interests.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Interests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest, index) => (
                  <Badge key={index} variant="secondary">
                    {interest}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Visited Countries */}
        {user.visitedCountries && user.visitedCountries.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Visited Countries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {user.visitedCountries.map((country, index) => (
                  <Badge key={index} variant="outline">
                    {country}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

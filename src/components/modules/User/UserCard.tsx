"use client";

import { useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MoreVertical,
  User as UserIcon,
  Mail,
  Calendar,
  Shield,
  Edit,
  Trash2,
  MapPin,
  Globe,
} from "lucide-react";
import { format } from "date-fns";
import { User } from "@/lib/types";
import { RoleUpdateModal } from "./RoleUpdateModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { deleteAdmin, deleteUser } from "@/actions";

interface UserCardProps {
  user: User;
  showActions?: boolean;
  isAdminView?: boolean;
  onUpdate?: () => void;
}

export function UserCard({
  user,
  showActions = false,
  isAdminView = false,
  onUpdate,
}: UserCardProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const currentUserId = session?.user?.id;
  const isCurrentUser = currentUserId === user.id;
  const isSuperAdmin = session?.user?.role === "SUPER_ADMIN";
  const isAdmin = session?.user?.role === "ADMIN";

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

  const handleViewProfile = () => {
    if (isAdminView) {
      router.push(`/users/${user.id}`);
    } else {
      router.push(`/profile/${user.id}`);
    }
  };

  const handleViewPublicProfile = () => {
    router.push(`/users/public/${user.id}`);
  };

  const handleDelete = () => {
    startTransition(async () => {
      if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
        if (!isSuperAdmin && !isAdmin) {
          toast.error("Only admins can delete admins");
          return;
        }

        if (user.role === "SUPER_ADMIN" && !isSuperAdmin) {
          toast.error("Only super admin can delete super admin");
          return;
        }

        const result = await deleteAdmin(user.id);
        if (result.success) {
          toast.success("Admin deleted successfully");
          onUpdate?.();
        } else {
          toast.error(result.error || "Failed to delete admin");
        }
      } else {
        const result = await deleteUser(user.id);
        if (result.success) {
          toast.success("User deleted successfully");
          onUpdate?.();
        } else {
          toast.error(result.error || "Failed to delete user");
        }
      }
      setIsDeleteDialogOpen(false);
    });
  };

  const canEditRole =
    isAdminView && (isSuperAdmin || (isAdmin && user.role !== "SUPER_ADMIN"));
  const canDelete =
    !isCurrentUser &&
    (isSuperAdmin ||
      (isAdmin && user.role === "USER") ||
      (!isAdminView && currentUserId === user.id));

  return (
    <>
      <Card className="hover:shadow-sm transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.profileImage} />
                <AvatarFallback>
                  {user.fullName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{user.fullName}</h3>
                  {user.verifiedBadge && (
                    <Badge variant="secondary" className="text-xs">
                      ✓ Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  <span>{user.email}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getRoleBadge(user.role)}
              {showActions && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleViewProfile}>
                      <UserIcon className="mr-2 h-4 w-4" />
                      View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleViewPublicProfile}>
                      <Globe className="mr-2 h-4 w-4" />
                      View Public Profile
                    </DropdownMenuItem>
                    {canEditRole && (
                      <DropdownMenuItem
                        onClick={() => setIsRoleModalOpen(true)}
                      >
                        <Shield className="mr-2 h-4 w-4" />
                        Change Role
                      </DropdownMenuItem>
                    )}
                    {canDelete && (
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => setIsDeleteDialogOpen(true)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {user.bio && (
            <p className="text-sm text-gray-700 line-clamp-2">{user.bio}</p>
          )}

          <div className="flex flex-wrap gap-2">
            {user.currentLocation && (
              <div className="flex items-center gap-1 text-sm">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <span>{user.currentLocation}</span>
              </div>
            )}

            {user.interests && user.interests.length > 0 && (
              <div className="text-sm">
                <span className="text-muted-foreground">Interests: </span>
                <span className="font-medium">
                  {user.interests.slice(0, 3).join(", ")}
                  {user.interests.length > 3 &&
                    ` +${user.interests.length - 3}`}
                </span>
              </div>
            )}
          </div>

          {user.visitedCountries && user.visitedCountries.length > 0 && (
            <div className="text-sm">
              <span className="text-muted-foreground">Visited: </span>
              <span className="font-medium">
                {user.visitedCountries.slice(0, 3).join(", ")}
                {user.visitedCountries.length > 3 &&
                  ` +${user.visitedCountries.length - 3}`}
              </span>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between pt-3 border-t text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            <span>
              Joined {format(new Date(user.createdAt), "MMM d, yyyy")}
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={handleViewProfile}>
            View Details
          </Button>
        </CardFooter>
      </Card>

      {canEditRole && (
        <RoleUpdateModal
          open={isRoleModalOpen}
          onOpenChange={setIsRoleModalOpen}
          userId={user.id}
          currentRole={user.role}
          userName={user.fullName}
          onSuccess={onUpdate}
        />
      )}

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {user.role === "USER" ? "Delete User" : "Delete Admin"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {user.fullName}?
              {user.role !== "USER" &&
                " This admin will lose all admin privileges."}
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

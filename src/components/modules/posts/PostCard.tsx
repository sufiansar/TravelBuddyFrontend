"use client";

import { useState } from "react";
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
  MessageCircle,
  Share2,
  Bookmark,
  Calendar,
  BadgeCheck,
} from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import { useTransition } from "react";
import { toast } from "sonner";

import { PostActions } from "./PostActions";
import { ReactionsDisplay } from "./ReactionsDisplay";
import Link from "next/link";
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
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Post } from "@/types/post.interface";
import { deletePost } from "@/actions";

const BASE_API = process.env.NEXT_PUBLIC_BASE_API || "";

const resolveImageUrl = (url?: string) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return BASE_API ? `${BASE_API}${url.startsWith("/") ? "" : "/"}${url}` : url;
};

interface PostCardProps {
  post: Post;
  showActions?: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (post: Post) => void;
  compact?: boolean;
}

export function PostCard({
  post,
  showActions = true,
  onDelete,
  onEdit,
  compact = false,
}: PostCardProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(
    post.saves?.some((save) => save.userId === "current-user-id") || false
  );

  const isOwnPost = session?.user?.id === post.user.id;

  const handleViewPost = () => {
    router.push(`/post/${post.id}`);
  };

  const handleViewProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/profile/${post.user.id}`);
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(post);
    } else {
      router.push(`/post/${post.id}/edit`);
    }
  };

  const handleDelete = async () => {
    startTransition(async () => {
      const result = await deletePost(post.id);
      if (result.success) {
        toast.success("Post deleted successfully");
        setDeleteDialogOpen(false);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete post");
      }
    });
  };

  if (compact) {
    return (
      <Card
        className="hover:shadow-sm transition-shadow cursor-pointer"
        onClick={handleViewPost}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={resolveImageUrl(post.user.profileImage)} />
              <AvatarFallback>{post.user.fullName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div>
                <button
                  onClick={handleViewProfile}
                  className="font-semibold hover:underline flex items-center gap-1"
                >
                  {post.user.fullName}
                  {(post.user as any)?.verifiedBadge && (
                    <BadgeCheck className="h-4 w-4 text-blue-500" />
                  )}
                </button>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(post.createdAt), "MMM d, yyyy")}
                </p>
              </div>
              <p className="line-clamp-2">{post.content}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={resolveImageUrl(post.user?.profileImage)} />
              <AvatarFallback>
                {post.user?.fullName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <button
                onClick={handleViewProfile}
                className="font-semibold hover:underline text-left flex items-center gap-1"
              >
                {post.user?.fullName || "Unknown User"}
                {(post.user as any)?.verifiedBadge && (
                  <BadgeCheck className="h-4 w-4 text-blue-500" />
                )}
              </button>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>
                  {format(new Date(post.createdAt), "MMM d, yyyy 'at' h:mm a")}
                </span>
              </div>
            </div>
          </div>
          {showActions && isOwnPost && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="whitespace-pre-wrap">{post.content}</p>

        {post.images && post.images.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {post.images.slice(0, 4).map((image, index) => (
              <div
                key={index}
                className="relative w-full h-64 sm:h-56 md:h-64 rounded-lg overflow-hidden"
              >
                <Image
                  src={resolveImageUrl(image)}
                  alt={`Post image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
                  priority={index === 0}
                />
                {index === 3 && post.images.length > 4 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      +{post.images.length - 4}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <ReactionsDisplay
          reactions={post.reactions}
          postId={post.id}
          userReaction={post.reactions.find(
            (r) => r.userId === "current-user-id"
          )}
        />
      </CardContent>

      <CardFooter className="flex flex-col pt-4 border-t">
        <div className="flex justify-between w-full mb-3">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{post.reactions?.length || 0} reactions</span>
            <span>{post._count?.comments || 0} comments</span>
            <span>{post.shares?.length || 0} shares</span>
          </div>
          {post.saves?.length > 0 && (
            <Badge variant="outline" className="gap-1">
              <Bookmark className="h-3 w-3" />
              {post.saves.length}
            </Badge>
          )}
        </div>

        <PostActions
          postId={post.id}
          isSaved={isSaved}
          onSaveToggle={() => setIsSaved(!isSaved)}
          commentCount={post._count?.comments || 0}
          onCommentClick={handleViewPost}
        />
      </CardFooter>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

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
} from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";

import { PostActions } from "./PostActions";
import { ReactionsDisplay } from "./ReactionsDisplay";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Post } from "@/types/post.interface";

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
  const [isSaved, setIsSaved] = useState(
    post.saves?.some((save) => save.userId === "current-user-id") || false
  );

  const handleViewPost = () => {
    router.push(`/post/${post.id}`);
  };

  const handleViewProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/profile/${post.user.id}`);
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
              <AvatarImage src={post.user.profileImage} />
              <AvatarFallback>{post.user.fullName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div>
                <button
                  onClick={handleViewProfile}
                  className="font-semibold hover:underline"
                >
                  {post.user.fullName}
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
              <AvatarImage src={post.user?.profileImage} />
              <AvatarFallback>
                {post.user?.fullName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <button
                onClick={handleViewProfile}
                className="font-semibold hover:underline text-left"
              >
                {post.user?.fullName || "Unknown User"}
              </button>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>
                  {format(new Date(post.createdAt), "MMM d, yyyy 'at' h:mm a")}
                </span>
              </div>
            </div>
          </div>
          {showActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit?.(post)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => onDelete?.(post.id)}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {post.images.slice(0, 4).map((image, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-lg overflow-hidden"
              >
                <Image
                  src={image}
                  alt={`Post image ${index + 1}`}
                  fill
                  className="object-cover"
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
    </Card>
  );
}

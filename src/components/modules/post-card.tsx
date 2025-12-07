"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import {
  BadgeCheck,
  Bookmark,
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react";

import type { Post } from "@/actions/shared/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserChip } from "@/components/modules/user-chip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PostCardProps {
  post: Post;
  commentValue: string;
  onCommentChange: (value: string) => void;
  onCommentSubmit: () => void;
  onReact: () => void;
  onSave: () => void;
}

export function PostCard({
  post,
  commentValue,
  onCommentChange,
  onCommentSubmit,
  onReact,
  onSave,
}: PostCardProps) {
  const hasImages = post.images && post.images.length > 0;
  const commentCount = post.comments?.length || 0;
  const reactionCount = post.reactions?.length || 0;
  const shareCount = post.shares || 0;

  const gridCols = useMemo(() => {
    if (!hasImages) return "";
    return post.images.length === 1 ? "grid-cols-1" : "grid-cols-2";
  }, [hasImages, post.images]);

  return (
    <Card className="border-border overflow-hidden hover:shadow-md transition">
      <CardHeader className="pb-3">
        <UserChip user={post.user} href={`/profile/${post.user?.id ?? ""}`} />
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-foreground wrap-break-word">{post.content}</p>

        {hasImages && (
          <div className={`grid gap-2 ${gridCols}`}>
            {post.images.map((img, idx) => (
              <div key={idx} className="relative w-full h-48">
                <Image
                  src={img}
                  alt={`Post image ${idx + 1}`}
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2 border-t border-border pt-3 -mx-6 px-6">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 justify-start gap-2"
            onClick={onReact}
          >
            <Heart className="h-4 w-4" />
            <span className="text-xs">{reactionCount}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 justify-start gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs">{commentCount}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 justify-start gap-2"
            onClick={onSave}
          >
            <Bookmark className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 justify-start gap-2"
          >
            <Share2 className="h-4 w-4" />
            <span className="text-xs">{shareCount}</span>
          </Button>
        </div>

        <div className="-mx-6 px-6 pb-2 text-sm">
          <Link
            href={`/profile/${post?.user?.id ?? ""}`}
            className="text-primary hover:text-primary/80 font-semibold"
          >
            View {post?.user?.fullName?.split(" ")[0] || "user"}'s profile &
            posts
          </Link>
        </div>

        <div className="flex gap-2 pt-2">
          <Input
            type="text"
            placeholder="Write a comment..."
            value={commentValue}
            onChange={(e) => onCommentChange(e.target.value)}
            className="flex-1"
          />
          <Button size="sm" onClick={onCommentSubmit}>
            Post
          </Button>
        </div>

        {commentCount > 0 && (
          <div className="space-y-3 pt-3 border-t border-border">
            {post.comments.map((comment) => (
              <div key={comment._id} className="flex gap-3">
                <Link href={`/profile/${comment.user.id}`} className="shrink-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={comment.user.profileImage || undefined}
                      alt={comment.user.fullName}
                    />
                    <AvatarFallback>
                      {comment.user.fullName?.slice(0, 2)?.toUpperCase() ||
                        "US"}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex-1 bg-muted rounded-lg p-3">
                  <Link
                    href={`/profile/${comment.user.id}`}
                    className="font-semibold text-sm hover:underline flex items-center gap-1"
                  >
                    {comment.user.fullName}
                    {comment.user.verifiedBadge && (
                      <BadgeCheck
                        className="h-4 w-4 text-primary"
                        aria-label="Verified"
                      />
                    )}
                  </Link>
                  <p className="text-sm text-foreground">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

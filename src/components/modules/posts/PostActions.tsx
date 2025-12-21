"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  BookmarkCheck,
  Smile,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { toast } from "sonner";
import { useSession } from "next-auth/react";
import {
  reactToPost,
  removeReaction,
  savePost,
  sharePost,
  unsavePost,
} from "@/actions";

interface PostActionsProps {
  postId: string;
  isSaved?: boolean;
  onSaveToggle?: () => void;
  commentCount?: number;
  onCommentClick?: () => void;
  userReaction?: any;
}

const reactionTypes = [
  { type: "LIKE", label: "Like", emoji: "👍", color: "text-blue-500" },
  { type: "LOVE", label: "Love", emoji: "❤️", color: "text-red-500" },
  { type: "WOW", label: "Wow", emoji: "😮", color: "text-yellow-500" },
  { type: "SAD", label: "Sad", emoji: "😢", color: "text-yellow-500" },
  { type: "ANGRY", label: "Angry", emoji: "😠", color: "text-red-500" },
];

export function PostActions({
  postId,
  isSaved = false,
  onSaveToggle,
  commentCount = 0,
  onCommentClick,
  userReaction,
}: PostActionsProps) {
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();
  const [reactionPopoverOpen, setReactionPopoverOpen] = useState(false);

  const handleReact = (type: string) => {
    if (!session) {
      toast.error("Please login to react");
      return;
    }

    startTransition(async () => {
      if (userReaction?.type === type) {
        const result = await removeReaction(postId);
        if (result.success) {
          toast.success("Reaction removed");
        } else {
          toast.error(result.error || "Failed to remove reaction");
        }
      } else {
        const result = await reactToPost(postId, type as any);
        if (result.success) {
          toast.success("Reacted to post");
        } else {
          toast.error(result.error || "Failed to react");
        }
      }
      setReactionPopoverOpen(false);
    });
  };

  // const handleSave = () => {
  //   if (!session) {
  //     toast.error("Please login to save posts");
  //     return;
  //   }

  //   startTransition(async () => {
  //     if (isSaved) {
  //       const result = await unsavePost(postId);
  //       if (result.success) {
  //         toast.success("Post unsaved");
  //         onSaveToggle?.();
  //       } else {
  //         toast.error(result.error || "Failed to unsave post");
  //       }
  //     } else {
  //       const result = await savePost(postId);
  //       if (result.success) {
  //         toast.success("Post saved");
  //         onSaveToggle?.();
  //       } else {
  //         toast.error(result.error || "Failed to save post");
  //       }
  //     }
  //   });
  // };

  // const handleShare = () => {
  //   if (!session) {
  //     toast.error("Please login to share posts");
  //     return;
  //   }

  //   startTransition(async () => {
  //     const result = await sharePost(postId);
  //     if (result.success) {
  //       toast.success("Post shared");
  //     } else {
  //       toast.error(result.error || "Failed to share post");
  //     }
  //   });
  // };

  const currentReaction = userReaction
    ? reactionTypes.find((r) => r.type === userReaction.type)
    : null;

  return (
    <div className="grid grid-cols-4 gap-1">
      {/* Reaction Button */}
      <Popover open={reactionPopoverOpen} onOpenChange={setReactionPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 justify-start gap-2"
            disabled={isPending}
          >
            {currentReaction ? (
              <>
                <span className={currentReaction.color}>
                  {currentReaction.emoji}
                </span>
                <span>{currentReaction.label}</span>
              </>
            ) : (
              <>
                <Heart className="h-4 w-4" />
                <span>Like</span>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="start">
          <div className="flex gap-2">
            {reactionTypes.map((reaction) => (
              <button
                key={reaction.type}
                onClick={() => handleReact(reaction.type)}
                className="hover:scale-110 transition-transform text-2xl"
                title={reaction.label}
                disabled={isPending}
              >
                {reaction.emoji}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Comment Button */}
      <Button
        variant="ghost"
        size="sm"
        className="flex-1 justify-start gap-2"
        onClick={onCommentClick}
        disabled={isPending}
      >
        <MessageCircle className="h-4 w-4" />
        <span>Comment</span>
        {commentCount > 0 && (
          <span className="ml-auto text-xs text-muted-foreground">
            {commentCount}
          </span>
        )}
      </Button>

      {/* Share Button */}
      {/* <Button
        variant="ghost"
        size="sm"
        className="flex-1 justify-start gap-2"
        onClick={handleShare}
        disabled={isPending}
      >
        <Share2 className="h-4 w-4" />
        <span>Share</span>
      </Button> */}

      {/* Save Button */}
      {/* <Button
        variant="ghost"
        size="sm"
        className="flex-1 justify-start gap-2"
        onClick={handleSave}
        disabled={isPending}
      >
        {isSaved ? (
          <BookmarkCheck className="h-4 w-4 text-primary" />
        ) : (
          <Bookmark className="h-4 w-4" />
        )}
        <span>Save</span>
      </Button> */}
    </div>
  );
}

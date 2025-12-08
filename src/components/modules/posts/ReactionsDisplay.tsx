"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PostReaction } from "@/types/post.interface";
import { Heart, ThumbsUp, Laugh, Angry, Star, Frown } from "lucide-react";

interface ReactionsDisplayProps {
  reactions: PostReaction[];
  postId: string;
  userReaction?: PostReaction;
}

const reactionIcons = {
  LIKE: { icon: ThumbsUp, color: "text-blue-500", label: "Like" },
  LOVE: { icon: Heart, color: "text-red-500", label: "Love" },
  HAHA: { icon: Laugh, color: "text-yellow-500", label: "Haha" },
  WOW: { icon: Star, color: "text-yellow-500", label: "Wow" },
  SAD: { icon: Frown, color: "text-yellow-500", label: "Sad" },
  ANGRY: { icon: Angry, color: "text-red-500", label: "Angry" },
};

export function ReactionsDisplay({
  reactions,
  postId,
  userReaction,
}: ReactionsDisplayProps) {
  if (reactions.length === 0) return null;

  // Count reactions by type
  const reactionCounts = reactions.reduce((acc, reaction) => {
    acc[reaction.type] = (acc[reaction.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Get top 3 reaction types
  const topReactions = Object.entries(reactionCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([type]) => type);

  const totalReactions = reactions.length;

  const getTooltipContent = () => {
    const grouped = reactions.reduce((acc, reaction) => {
      if (!acc[reaction.type]) {
        acc[reaction.type] = [];
      }
      acc[reaction.type].push(reaction.user?.fullName || "User");
      return acc;
    }, {} as Record<string, string[]>);

    return Object.entries(grouped)
      .map(([type, users]) => {
        const config = reactionIcons[type as keyof typeof reactionIcons];
        const iconLabel = config?.label || type;
        return `${iconLabel}: ${users.slice(0, 3).join(", ")}${
          users.length > 3 ? ` and ${users.length - 3} more` : ""
        }`;
      })
      .join("\n");
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1 text-muted-foreground hover:text-foreground"
          >
            <div className="flex -space-x-2">
              {topReactions.map((type, index) => {
                const config =
                  reactionIcons[type as keyof typeof reactionIcons];
                const Icon = config?.icon || Heart;
                return (
                  <div
                    key={type}
                    className={`rounded-full bg-background border-2 border-background ${
                      config?.color || "text-gray-500"
                    }`}
                    style={{ zIndex: 3 - index }}
                  >
                    <Icon className="h-3 w-3" />
                  </div>
                );
              })}
            </div>
            <span className="text-sm">{totalReactions}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm whitespace-pre-line">
          {getTooltipContent()}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

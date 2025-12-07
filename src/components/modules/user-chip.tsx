"use client";

import Link from "next/link";
import { BadgeCheck } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { cn } from "@/lib/utils";
import { IUser } from "@/actions";

interface UserChipProps {
  user?: IUser;
  href?: string;
  size?: "sm" | "md";
  className?: string;
}

const sizes = {
  sm: { avatar: "h-8 w-8", name: "text-sm" },
  md: { avatar: "h-10 w-10", name: "text-sm" },
};

export function UserChip({
  user,
  href,
  size = "md",
  className,
}: UserChipProps) {
  const initials = user?.fullName?.slice(0, 2)?.toUpperCase() || "US";
  const content = (
    <div className={cn("flex items-center gap-2", className)}>
      <Avatar className={sizes[size].avatar}>
        <AvatarImage
          src={user?.profileImage || undefined}
          alt={user?.fullName || "User avatar"}
        />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p
          className={cn(
            "font-semibold text-foreground flex items-center gap-1 truncate",
            sizes[size].name
          )}
        >
          {user?.fullName || "Traveler"}
          {user?.verifiedBadge && (
            <BadgeCheck
              className="h-4 w-4 text-primary"
              aria-label="Verified"
            />
          )}
        </p>
        {user?.email && (
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center gap-2">
        {content}
      </Link>
    );
  }

  return content;
}

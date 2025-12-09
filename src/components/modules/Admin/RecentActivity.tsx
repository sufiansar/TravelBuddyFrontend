// src/components/admin/RecentActivity.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  UserPlus,
  CreditCard,
  MapPin,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { getRecentActivity } from "@/actions/admin/actions";
import { formatDistanceToNow } from "date-fns";

interface Activity {
  id: string;
  user: {
    fullName: string;
    email: string;
    profileImage?: string;
  };
  action: string;
  type: string;
  createdAt: string;
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const result = await getRecentActivity(5);
      if (result.success && result.data) {
        setActivities(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "user":
      case "registration":
        return { Icon: UserPlus, color: "text-blue-600 bg-blue-100" };
      case "subscription":
      case "upgrade":
        return { Icon: CreditCard, color: "text-green-600 bg-green-100" };
      case "travel":
      case "travelplan":
        return { Icon: MapPin, color: "text-purple-600 bg-purple-100" };
      case "payment":
        return { Icon: CheckCircle, color: "text-emerald-600 bg-emerald-100" };
      case "warning":
      case "suspended":
        return { Icon: AlertCircle, color: "text-amber-600 bg-amber-100" };
      default:
        return { Icon: CheckCircle, color: "text-gray-600 bg-gray-100" };
    }
  };

  const getActionText = (activity: Activity) => {
    return `${activity.user.fullName} ${activity.action}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const { Icon, color } = getActivityIcon(activity.type);
        const timeAgo = formatDistanceToNow(new Date(activity.createdAt), {
          addSuffix: true,
        });

        return (
          <div key={activity.id} className="flex items-start gap-3">
            <div className="relative">
              <Avatar className="h-8 w-8">
                <AvatarImage src={activity.user.profileImage} />
                <AvatarFallback>
                  {activity.user.fullName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div
                className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full flex items-center justify-center ${color}`}
              >
                <Icon className="h-2.5 w-2.5" />
              </div>
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">{getActionText(activity)}</p>
              <div className="flex items-center gap-2">
                <p className="text-xs text-gray-500">{timeAgo}</p>
                <Badge variant="outline" className="text-xs">
                  {activity.type}
                </Badge>
              </div>
            </div>
          </div>
        );
      })}

      <div className="pt-4 border-t">
        <button className="text-sm text-primary hover:underline w-full text-center">
          View all activity
        </button>
      </div>
    </div>
  );
}

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Download,
  Filter,
  RefreshCw,
  Calendar,
  User,
  Activity,
} from "lucide-react";
import { getRecentActivity } from "@/actions/admin/actions";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mark this page as dynamic since it uses getServerSession via getUserSession
export const dynamic = "force-dynamic";

interface ActivityLogsPageProps {
  searchParams?: {
    type?: string;
    period?: string;
    limit?: string;
  };
}

const activityTypes = [
  { value: "user", label: "User Activity", color: "bg-blue-100 text-blue-800" },
  {
    value: "subscription",
    label: "Subscription",
    color: "bg-green-100 text-green-800",
  },
  {
    value: "travel_plan",
    label: "Travel Plan",
    color: "bg-purple-100 text-purple-800",
  },
  {
    value: "payment",
    label: "Payment",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "meetup",
    label: "Meetup",
    color: "bg-pink-100 text-pink-800",
  },
  { value: "report", label: "Report", color: "bg-red-100 text-red-800" },
];

const getActivityIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "user":
      return "👤";
    case "subscription":
      return "💳";
    case "travel_plan":
      return "🗺️";
    case "payment":
      return "💰";
    case "meetup":
      return "🤝";
    case "report":
      return "🚩";
    default:
      return "📋";
  }
};

export default async function ActivityLogsPage({
  searchParams,
}: ActivityLogsPageProps) {
  const limit = searchParams?.limit ? parseInt(searchParams.limit) : 50;
  const type = searchParams?.type;
  const period = searchParams?.period || "24h";

  const result = await getRecentActivity(limit);
  const activities = result.success ? result.data || [] : [];

  // Filter by type if specified
  const filteredActivities = type
    ? activities.filter(
        (a: any) => a.type?.toLowerCase() === type.toLowerCase()
      )
    : activities;

  // Group by date
  const groupedByDate = filteredActivities.reduce((acc: any, activity: any) => {
    const date = format(new Date(activity.createdAt), "MMM dd, yyyy");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(activity);
    return acc;
  }, {});

  const activityTypeInfo = (typeStr: string) => {
    return (
      activityTypes.find((t) => t.value === typeStr.toLowerCase()) || {
        value: typeStr,
        label: typeStr,
        color: "bg-gray-100 text-gray-800",
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activity Logs</h1>
          <p className="text-gray-600">
            Monitor all platform activity and events
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Activity Type
              </label>
              <Select defaultValue={type || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All types</SelectItem>
                  {activityTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Time Period
              </label>
              <Select defaultValue={period}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">Last 1 hour</SelectItem>
                  <SelectItem value="24h">Last 24 hours</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activities ({filteredActivities.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredActivities.length === 0 ? (
            <div className="py-12 text-center">
              <Activity className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No activities found</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedByDate).map(
                ([date, dayActivities]: [string, any]) => (
                  <div key={date}>
                    <div className="flex items-center gap-3 mb-4">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <h3 className="font-semibold text-sm text-gray-600">
                        {date}
                      </h3>
                      <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    <div className="space-y-3">
                      {dayActivities.map((activity: any, idx: number) => {
                        const typeInfo = activityTypeInfo(activity.type);
                        return (
                          <div
                            key={idx}
                            className="flex gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <div className="shrink-0">
                              <div className="text-2xl">
                                {getActivityIcon(activity.type)}
                              </div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
                                <div className="flex items-center gap-2">
                                  <Badge className={typeInfo.color}>
                                    {typeInfo.label}
                                  </Badge>
                                  {activity.user && (
                                    <span className="text-sm text-gray-600 flex items-center gap-1">
                                      <User className="h-3 w-3" />
                                      {activity.user.fullName}
                                    </span>
                                  )}
                                </div>
                                <span className="text-xs text-gray-500">
                                  {format(
                                    new Date(activity.createdAt),
                                    "HH:mm:ss"
                                  )}
                                </span>
                              </div>

                              <p className="text-sm text-gray-700">
                                {activity.message}
                              </p>

                              {activity.details && (
                                <div className="mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                                  {JSON.stringify(activity.details).substring(
                                    0,
                                    150
                                  )}
                                  ...
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

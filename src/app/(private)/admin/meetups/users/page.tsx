"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Search,
  Filter,
  Calendar,
  User,
  Mail,
  Loader2,
  RefreshCw,
  ChevronDown,
  ExternalLink,
} from "lucide-react";

import { format } from "date-fns";
import { getAllMeetups } from "@/actions";
import { toast } from "sonner";

interface UserActivity {
  id: string;
  name: string;
  email: string;
  role: string;
  hostedMeetups: number;
  joinedMeetups: number;
  totalParticipants: number;
  lastActivity: Date;
  meetups: Array<{
    id: string;
    title: string;
    date: Date;
    role: "host" | "participant";
    participants: number;
  }>;
}

export default function MeetupUsersPage() {
  const [users, setUsers] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const result = await getAllMeetups();
      console.log("MeetupUsersPage - getAllMeetups result:", result);

      if (result.success) {
        const userData = processMeetupData(result.data || []);
        console.log("MeetupUsersPage - processed userData:", userData);
        setUsers(userData);
      } else {
        console.error("MeetupUsersPage - Failed to load:", result.error);
        toast.error(result.error || "Failed to load user data");
      }
    } catch (error: any) {
      console.error("MeetupUsersPage - Error:", error);
      toast.error("An error occurred while fetching user data");
    } finally {
      setLoading(false);
    }
  };

  const processMeetupData = (meetups: any[]): UserActivity[] => {
    const userMap = new Map<string, UserActivity>();

    meetups.forEach((meetup) => {
      const host = meetup.host;
      if (!userMap.has(host.id)) {
        userMap.set(host.id, {
          id: host.id,
          name: host.fullName,
          email: host.email || "No email",
          role: host.role || "user",
          hostedMeetups: 0,
          joinedMeetups: 0,
          totalParticipants: 0,
          lastActivity: new Date(meetup.date),
          meetups: [],
        });
      }

      const hostData = userMap.get(host.id)!;
      hostData.hostedMeetups += 1;
      hostData.totalParticipants += meetup.participants.length;
      hostData.meetups.push({
        id: meetup.id,
        title: meetup.title,
        date: new Date(meetup.date),
        role: "host",
        participants: meetup.participants.length,
      });

      // Update last activity if newer
      const meetupDate = new Date(meetup.date);
      if (meetupDate > hostData.lastActivity) {
        hostData.lastActivity = meetupDate;
      }

      // Process participants
      meetup.participants.forEach((participant: any) => {
        const user = participant.user;
        if (user.id === host.id) return; // Skip host

        if (!userMap.has(user.id)) {
          userMap.set(user.id, {
            id: user.id,
            name: user.fullName,
            email: user.email || "No email",
            role: user.role || "user",
            hostedMeetups: 0,
            joinedMeetups: 0,
            totalParticipants: 0,
            lastActivity: new Date(participant.joinedAt),
            meetups: [],
          });
        }

        const userData = userMap.get(user.id)!;
        userData.joinedMeetups += 1;
        userData.totalParticipants += 1; // Count themselves as participant
        userData.meetups.push({
          id: meetup.id,
          title: meetup.title,
          date: new Date(meetup.date),
          role: "participant",
          participants: meetup.participants.length,
        });

        // Update last activity
        const joinedDate = new Date(participant.joinedAt);
        if (joinedDate > userData.lastActivity) {
          userData.lastActivity = joinedDate;
        }
      });
    });

    return Array.from(userMap.values()).sort(
      (a, b) =>
        b.hostedMeetups + b.joinedMeetups - (a.hostedMeetups + a.joinedMeetups)
    );
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      filterRole === "all" ||
      (filterRole === "host" && user.hostedMeetups > 0) ||
      (filterRole === "active" &&
        user.hostedMeetups + user.joinedMeetups >= 3) ||
      (filterRole === "inactive" &&
        user.hostedMeetups + user.joinedMeetups === 0);

    return matchesSearch && matchesRole;
  });

  const stats = {
    totalUsers: users.length,
    activeHosts: users.filter((u) => u.hostedMeetups > 0).length,
    activeParticipants: users.filter((u) => u.joinedMeetups > 0).length,
    inactiveUsers: users.filter(
      (u) => u.hostedMeetups === 0 && u.joinedMeetups === 0
    ).length,
  };

  const getUserRoleBadge = (user: UserActivity) => {
    if (user.hostedMeetups > 0) {
      return (
        <Badge variant="default" className="bg-purple-100 text-purple-800">
          Host
        </Badge>
      );
    } else if (user.joinedMeetups > 0) {
      return <Badge variant="secondary">Participant</Badge>;
    } else {
      return <Badge variant="outline">Inactive</Badge>;
    }
  };

  const getUserActivityLevel = (user: UserActivity) => {
    const totalMeetups = user.hostedMeetups + user.joinedMeetups;
    if (totalMeetups >= 5) return "Very Active";
    if (totalMeetups >= 3) return "Active";
    if (totalMeetups >= 1) return "Occasional";
    return "Inactive";
  };

  const getActivityColor = (level: string) => {
    switch (level) {
      case "Very Active":
        return "bg-green-100 text-green-800";
      case "Active":
        return "bg-blue-100 text-blue-800";
      case "Occasional":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading user data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Meetup User Management</h1>
            <p className="text-gray-600">
              Manage users based on meetup participation
            </p>
          </div>
          <Button onClick={fetchUserData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold">{stats.totalUsers}</div>
              <p className="text-gray-600">Total Users</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold">{stats.activeHosts}</div>
              <p className="text-gray-600">Active Hosts</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold">
                {stats.activeParticipants}
              </div>
              <p className="text-gray-600">Active Participants</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold">{stats.inactiveUsers}</div>
              <p className="text-gray-600">Inactive Users</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Users</option>
                <option value="host">Hosts Only</option>
                <option value="active">Active Users</option>
                <option value="inactive">Inactive Users</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No users found</h3>
              <p className="text-gray-600">
                {searchTerm
                  ? "Try a different search term"
                  : "No user data available"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => {
                const activityLevel = getUserActivityLevel(user);
                const totalMeetups = user.hostedMeetups + user.joinedMeetups;

                return (
                  <div
                    key={user.id}
                    className="p-6 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{user.name}</h3>
                            {getUserRoleBadge(user)}
                            <Badge className={getActivityColor(activityLevel)}>
                              {activityLevel}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <Mail className="h-3 w-3" />
                            <span>{user.email}</span>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                Last active:{" "}
                                {format(user.lastActivity, "MMM d, yyyy")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div className="p-2 border rounded">
                            <div className="font-semibold">
                              {user.hostedMeetups}
                            </div>
                            <div className="text-xs text-gray-500">Hosted</div>
                          </div>
                          <div className="p-2 border rounded">
                            <div className="font-semibold">
                              {user.joinedMeetups}
                            </div>
                            <div className="text-xs text-gray-500">Joined</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* User Meetups */}
                    {user.meetups.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">Recent Meetups</h4>
                          <span className="text-sm text-gray-500">
                            Total: {totalMeetups} meetups
                          </span>
                        </div>
                        <div className="space-y-2">
                          {user.meetups.slice(0, 3).map((meetup, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 text-sm border rounded"
                            >
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {meetup.role}
                                </Badge>
                                <span className="font-medium truncate">
                                  {meetup.title}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-gray-500">
                                <span>{format(meetup.date, "MMM d")}</span>
                                <span>{meetup.participants} participants</span>
                              </div>
                            </div>
                          ))}
                          {user.meetups.length > 3 && (
                            <div className="text-center">
                              <Button variant="ghost" size="sm">
                                <ChevronDown className="h-4 w-4 mr-2" />
                                Show {user.meetups.length - 3} more
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Export Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Export User Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => {
                const csvData = users.map((user) => ({
                  Name: user.name,
                  Email: user.email,
                  Role: user.role,
                  "Hosted Meetups": user.hostedMeetups,
                  "Joined Meetups": user.joinedMeetups,
                  "Total Activities": user.hostedMeetups + user.joinedMeetups,
                  "Last Activity": format(user.lastActivity, "yyyy-MM-dd"),
                }));

                const csvContent = [
                  Object.keys(csvData[0]).join(","),
                  ...csvData.map((row) => Object.values(row).join(",")),
                ].join("\n");

                const blob = new Blob([csvContent], { type: "text/csv" });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `meetup-users-${format(
                  new Date(),
                  "yyyy-MM-dd"
                )}.csv`;
                link.click();
              }}
            >
              Export as CSV
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const jsonData = JSON.stringify(users, null, 2);
                const blob = new Blob([jsonData], { type: "application/json" });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `meetup-users-${format(
                  new Date(),
                  "yyyy-MM-dd"
                )}.json`;
                link.click();
              }}
            >
              Export as JSON
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

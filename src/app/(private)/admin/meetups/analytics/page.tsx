"use client";

// Mark this page as dynamic since it uses server session
export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Users,
  Calendar,
  TrendingUp,
  TrendingDown,
  Download,
  Filter,
  MapPin,
  User,
  Clock,
} from "lucide-react";

import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { getAllMeetups } from "@/actions";
import { toast } from "sonner";

export default function MeetupAnalyticsPage() {
  const [meetups, setMeetups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">(
    "month"
  );
  const [topLocations, setTopLocations] = useState<any[]>([]);
  const [topHosts, setTopHosts] = useState<any[]>([]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const result = await getAllMeetups({}, {});
      if (result.success) {
        setMeetups(result.data);
        calculateAnalytics(result.data);
      } else {
        toast.error("Failed to load analytics data");
      }
    } catch (error) {
      toast.error("An error occurred while fetching analytics data");
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (meetupsData: any[]) => {
    const locationCounts = meetupsData.reduce((acc, meetup) => {
      const location = meetup.location;
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {});

    const topLocationsList = Object.entries(locationCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 5);

    setTopLocations(topLocationsList);

    const hostCounts = meetupsData.reduce((acc, meetup) => {
      const hostName = meetup.host.name;
      if (!acc[hostName]) {
        acc[hostName] = { count: 0, participants: 0 };
      }
      acc[hostName].count += 1;
      acc[hostName].participants += meetup.participants.length;
      return acc;
    }, {});

    const topHostsList = Object.entries(hostCounts)
      .map(([name, data]: [string, any]) => ({
        name,
        meetups: data.count,
        participants: data.participants,
      }))
      .sort((a, b) => b.meetups - a.meetups)
      .slice(0, 5);

    setTopHosts(topHostsList);
  };

  // Monthly growth data
  const getMonthlyGrowthData = () => {
    const monthlyData: any = {};
    const now = new Date();

    meetups.forEach((meetup) => {
      const date = new Date(meetup.date);
      const monthKey = format(date, "MMM yyyy");

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          meetups: 0,
          participants: 0,
          month: monthKey,
        };
      }

      monthlyData[monthKey].meetups += 1;
      monthlyData[monthKey].participants += meetup.participants.length;
    });

    return Object.values(monthlyData)
      .sort(
        (a: any, b: any) =>
          new Date(a.month).getTime() - new Date(b.month).getTime()
      )
      .slice(-6);
  };

  // Location distribution data
  const getLocationData = () => {
    const locationMap = meetups.reduce((acc, meetup) => {
      const location = meetup.location;
      if (!acc[location]) {
        acc[location] = 0;
      }
      acc[location] += 1;
      return acc;
    }, {});

    return Object.entries(locationMap)
      .map(([name, value]) => ({
        name: name.length > 15 ? name.substring(0, 15) + "..." : name,
        value,
      }))
      .sort((a: any, b: any) => b.value - a.value)
      .slice(0, 8);
  };

  // Calculate statistics
  const stats = {
    totalMeetups: meetups.length,
    totalParticipants: meetups.reduce(
      (sum, meetup) => sum + meetup.participants.length,
      0
    ),
    upcomingMeetups: meetups.filter((m) => new Date(m.date) > new Date())
      .length,
    averageParticipants:
      meetups.length > 0
        ? Math.round(
            meetups.reduce(
              (sum, meetup) => sum + meetup.participants.length,
              0
            ) / meetups.length
          )
        : 0,
    growthRate: 12.5, // Mock data - calculate based on previous period
    topLocation: topLocations[0]?.name || "N/A",
  };

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Meetup Analytics</h1>
          <p className="text-gray-600">
            Detailed insights and metrics for all meetups
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="year">Last Year</option>
            </select>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Total Meetups</p>
                <p className="text-3xl font-bold mt-2">{stats.totalMeetups}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600">
                +{stats.growthRate}%
              </span>
              <span className="text-sm text-gray-500 ml-2">
                from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Total Participants</p>
                <p className="text-3xl font-bold mt-2">
                  {stats.totalParticipants}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Avg: {stats.averageParticipants} per meetup
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Upcoming Meetups</p>
                <p className="text-3xl font-bold mt-2">
                  {stats.upcomingMeetups}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Scheduled for future dates
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Top Location</p>
                <p className="text-lg font-semibold mt-2 truncate">
                  {stats.topLocation}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <MapPin className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4">
              <Badge variant="outline">
                {topLocations[0]?.count || 0} meetups
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Monthly Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getMonthlyGrowthData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="meetups"
                    stroke="#8884d8"
                    name="Meetups"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="participants"
                    stroke="#82ca9d"
                    name="Participants"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Location Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Location Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getLocationData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {getLocationData().map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Locations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Top Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-12 bg-gray-200 rounded animate-pulse"
                  ></div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {topLocations.map((location, index) => (
                  <div
                    key={location.name}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{location.name}</p>
                        <p className="text-sm text-gray-500">
                          {location.count} meetups
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {((location.count / stats.totalMeetups) * 100).toFixed(1)}
                      %
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Hosts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Top Hosts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-12 bg-gray-200 rounded animate-pulse"
                  ></div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {topHosts.map((host, index) => (
                  <div
                    key={host.name}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{host.name}</p>
                        <div className="flex gap-4 text-sm text-gray-500">
                          <span>{host.meetups} meetups</span>
                          <span>{host.participants} participants</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {((host.meetups / stats.totalMeetups) * 100).toFixed(1)}%
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 border rounded-lg">
              <div className="text-4xl font-bold text-blue-600">
                {(
                  stats.totalParticipants / Math.max(stats.totalMeetups, 1)
                ).toFixed(1)}
              </div>
              <p className="text-gray-600 mt-2">Avg Participants per Meetup</p>
            </div>
            <div className="text-center p-6 border rounded-lg">
              <div className="text-4xl font-bold text-green-600">
                {meetups.filter((m) => m.participants.length > 0).length}
              </div>
              <p className="text-gray-600 mt-2">
                Active Meetups (with participants)
              </p>
            </div>
            <div className="text-center p-6 border rounded-lg">
              <div className="text-4xl font-bold text-purple-600">
                {
                  meetups.filter(
                    (m) => m.maxPeople && m.participants.length >= m.maxPeople
                  ).length
                }
              </div>
              <p className="text-gray-600 mt-2">Fully Booked Meetups</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

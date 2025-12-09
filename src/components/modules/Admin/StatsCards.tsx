// src/components/admin/StatsCards.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Map,
  CreditCard,
  Repeat,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { PlatformStats } from "@/types/admin.interface";

interface StatsCardsProps {
  stats: PlatformStats;
  previousStats?: {
    totalUsers?: number;
    totalPlans?: number;
    totalRevenue?: number;
    activeSubscriptions?: number;
  };
}

export function StatsCards({ stats, previousStats }: StatsCardsProps) {
  const calculateGrowth = (current: number, previous?: number) => {
    if (!previous || previous === 0) return null;
    const growth = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(growth).toFixed(1),
      isPositive: growth >= 0,
    };
  };

  const userGrowth = calculateGrowth(
    stats.users.total,
    previousStats?.totalUsers
  );
  const planGrowth = calculateGrowth(
    stats.travelPlans.total,
    previousStats?.totalPlans
  );
  const revenueGrowth = calculateGrowth(
    stats.payments.totalRevenue,
    previousStats?.totalRevenue
  );
  const subscriptionGrowth = calculateGrowth(
    stats.subscriptions.active,
    previousStats?.activeSubscriptions
  );

  const statsCards = [
    {
      title: "Total Users",
      value: stats.users.total,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      details: `${stats.users.active} active • ${stats.users.banned} banned`,
      growth: userGrowth,
    },
    {
      title: "Travel Plans",
      value: stats.travelPlans.total,
      icon: Map,
      color: "text-green-600",
      bgColor: "bg-green-100",
      details: "Total created plans",
      growth: planGrowth,
    },
    {
      title: "Total Revenue",
      value: `$${stats.payments.totalRevenue.toLocaleString()}`,
      icon: CreditCard,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      details: `From ${stats.payments.total} payments`,
      growth: revenueGrowth,
    },
    {
      title: "Active Subscriptions",
      value: stats.subscriptions.active,
      icon: Repeat,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      details: "Currently active",
      growth: subscriptionGrowth,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-gray-500 mt-1">{stat.details}</p>
                </div>
                {stat.growth && (
                  <div
                    className={`flex items-center gap-1 text-sm ${
                      stat.growth.isPositive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.growth.isPositive ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span>{stat.growth.value}%</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

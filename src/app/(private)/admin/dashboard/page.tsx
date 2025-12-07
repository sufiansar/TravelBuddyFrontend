import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Users,
  MapPin,
  CreditCard,
  TrendingUp,
  Shield,
  Ban,
  DollarSign,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { getPlatformStats } from "@/actions/admin/actions";

export default async function AdminDashboard() {
  const statsResult = await getPlatformStats();
  const stats = statsResult.success ? statsResult.data : null;

  const platformStats = [
    {
      label: "Total Users",
      value: stats?.users?.total || 0,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950",
      href: "/admin/users",
    },
    {
      label: "Active Users",
      value: stats?.users?.active || 0,
      icon: Shield,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950",
      href: "/admin/users?status=ACTIVE",
    },
    {
      label: "Banned Users",
      value: stats?.users?.banned || 0,
      icon: Ban,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-950",
      href: "/admin/users?status=BANNED",
    },
    {
      label: "Travel Plans",
      value: stats?.travelPlans?.total || 0,
      icon: MapPin,
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-950",
      href: "/admin/travel-plans",
    },
    {
      label: "Total Payments",
      value: stats?.payments?.total || 0,
      icon: CreditCard,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950",
      href: "/admin/payments",
    },
    {
      label: "Total Revenue",
      value: `$${stats?.payments?.totalRevenue || 0}`,
      icon: DollarSign,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-950",
      href: "/admin/payments",
    },
    {
      label: "Active Subscriptions",
      value: stats?.subscriptions?.active || 0,
      icon: TrendingUp,
      color: "text-indigo-500",
      bgColor: "bg-indigo-50 dark:bg-indigo-950",
      href: "/admin/subscriptions",
    },
  ];

  const quickActions = [
    {
      label: "Manage Users",
      description: "View and manage all users",
      href: "/admin/users",
      icon: Users,
    },
    {
      label: "Travel Plans",
      description: "Manage all travel plans",
      href: "/admin/travel-plans",
      icon: MapPin,
    },
    {
      label: "Payments",
      description: "View payment history",
      href: "/admin/payments",
      icon: CreditCard,
    },
    {
      label: "Subscriptions",
      description: "Manage subscriptions",
      href: "/admin/subscriptions",
      icon: Calendar,
    },
  ];

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-lg text-muted-foreground">
          Platform overview and management tools
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {platformStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link key={index} href={stat.href}>
              <Card className="p-6 border-border hover:shadow-lg transition-all cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-foreground mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.bgColor} p-4 rounded-lg`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link key={index} href={action.href}>
                <Card className="p-6 border-border hover:shadow-lg hover:bg-muted transition-all cursor-pointer h-full">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Icon className="h-8 w-8 text-primary" />
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {action.label}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border-border">
          <h3 className="text-xl font-bold text-foreground mb-4">
            User Statistics
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total Users</span>
              <Badge variant="secondary" className="text-lg font-semibold">
                {stats?.users?.total || 0}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Active Users</span>
              <Badge variant="default" className="text-lg font-semibold">
                {stats?.users?.active || 0}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Banned Users</span>
              <Badge variant="destructive" className="text-lg font-semibold">
                {stats?.users?.banned || 0}
              </Badge>
            </div>
            <div className="pt-4 border-t border-border">
              <Link href="/admin/users">
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Manage Users
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-border">
          <h3 className="text-xl font-bold text-foreground mb-4">
            Revenue Overview
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total Revenue</span>
              <Badge variant="secondary" className="text-lg font-semibold">
                ${stats?.payments?.totalRevenue || 0}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total Payments</span>
              <Badge variant="default" className="text-lg font-semibold">
                {stats?.payments?.total || 0}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Active Subscriptions
              </span>
              <Badge variant="default" className="text-lg font-semibold">
                {stats?.subscriptions?.active || 0}
              </Badge>
            </div>
            <div className="pt-4 border-t border-border">
              <Link href="/admin/payments">
                <Button className="w-full bg-primary hover:bg-primary/90">
                  View Payments
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <Card className="p-6 border-border">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-foreground">
            Platform Overview
          </h3>
          <Badge variant="secondary">
            Last Updated: {new Date().toLocaleDateString()}
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Total Travel Plans</p>
            <p className="text-2xl font-bold text-foreground">
              {stats?.travelPlans?.total || 0}
            </p>
            <Link href="/admin/travel-plans">
              <Button variant="ghost" size="sm" className="p-0 h-auto">
                View All Plans →
              </Button>
            </Link>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">User Growth</p>
            <p className="text-2xl font-bold text-foreground">
              {stats?.users?.active || 0} Active
            </p>
            <Link href="/admin/users">
              <Button variant="ghost" size="sm" className="p-0 h-auto">
                Manage Users →
              </Button>
            </Link>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Revenue Status</p>
            <p className="text-2xl font-bold text-foreground">
              ${stats?.payments?.totalRevenue || 0}
            </p>
            <Link href="/admin/payments">
              <Button variant="ghost" size="sm" className="p-0 h-auto">
                View Revenue →
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}

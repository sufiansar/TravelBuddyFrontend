// app/dashboard/loading.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6 space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 max-w-full hidden sm:block" />
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Skeleton className="h-9 w-full sm:w-24" />
          <Skeleton className="h-9 w-full sm:w-32" />
        </div>
      </div>

      {/* Stats Overview - 4 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border border-border/50 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
              <Skeleton className="h-7 w-16 mb-2" />
              <div className="flex items-center space-x-2">
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-3 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Area - Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Primary Chart */}
        <Card className="lg:col-span-2 border border-border/50 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <CardTitle>
                <Skeleton className="h-6 w-48" />
              </CardTitle>
              <div className="flex gap-2">
                {["Day", "Week", "Month"].map((period) => (
                  <Skeleton key={period} className="h-8 w-16" />
                ))}
              </div>
            </div>
            <Skeleton className="h-4 w-32 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Skeleton className="h-[250px] w-full rounded-lg" />
              <div className="flex justify-between pt-4">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center space-y-2">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-24 w-full rounded-md" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Side Panel - Mini charts & metrics */}
        <div className="space-y-6">
          {/* Pie/Donut Chart */}
          <Card className="border border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-32" />
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Skeleton className="h-[180px] w-[180px] rounded-full mb-4" />
              <div className="space-y-3 w-full">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-3 w-3 rounded-full" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-4 w-12" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-40" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Data Table Section */}
      <Card className="border border-border/50 shadow-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>
              <Skeleton className="h-6 w-56" />
            </CardTitle>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Skeleton className="h-9 flex-1 sm:flex-none sm:w-40" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Table Header */}
          <div className="rounded-md border border-border/40 overflow-hidden">
            <div className="grid grid-cols-6 gap-4 p-4 bg-muted/50">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-4" />
              ))}
            </div>

            {/* Table Rows */}
            {Array.from({ length: 6 }).map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="grid grid-cols-6 gap-4 p-4 border-t border-border/40 hover:bg-muted/30 transition-colors"
              >
                {Array.from({ length: 6 }).map((_, colIndex) => (
                  <div key={colIndex} className="space-y-1">
                    <Skeleton
                      className={`h-4 ${colIndex === 0 ? "w-32" : "w-full"}`}
                    />
                    {colIndex === 0 && <Skeleton className="h-3 w-24" />}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Table Footer & Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-4 gap-4">
            <Skeleton className="h-4 w-40" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-9 w-9 rounded-md" />
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-9 rounded-md" />
              ))}
              <Skeleton className="h-9 w-9 rounded-md" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Row - Recent Activity & Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="border border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-40" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-start space-x-3 p-3 rounded-lg border border-border/40"
                >
                  <Skeleton className="h-10 w-10 rounded-full mt-1" />
                  <div className="space-y-2 flex-1">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-36" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card className="border border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-44" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-3 p-3 rounded-lg border border-border/40"
                >
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <div className="text-right">
                    <Skeleton className="h-5 w-16 mb-1" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

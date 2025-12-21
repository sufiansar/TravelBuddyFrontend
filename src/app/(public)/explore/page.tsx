"use client";

import { useState, useEffect } from "react";
import { Search, Grid3x3, List } from "lucide-react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

import {
  ExploreFilters,
  Traveler,
  TravelPlan,
} from "@/types/explore.interface";

import { TravelPlanCard } from "@/components/modules/Explore/TravelPlanCard";
import { TravelerCard } from "@/components/modules/Explore/TravelerCard";
import { FilterSidebar } from "@/components/modules/Explore/FilterSidebar";
import { Pagination } from "@/components/Shared/Pagination";
import { getTravelers, getTravelPlans } from "@/actions";

type ViewMode = "grid" | "list";
type SortOption =
  | "createdAt"
  | "startDate"
  | "destination"
  | "upcomingPlansCount"
  | "averageRating";

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState<"plans" | "travelers">("plans");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<ExploreFilters>({});
  const [sortBy, setSortBy] = useState<SortOption>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [plansData, setPlansData] = useState<{
    data: TravelPlan[];
    meta: any;
  } | null>(null);

  const [travelersData, setTravelersData] = useState<{
    data: Traveler[];
    meta: any;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 12;

  const fetchData = async () => {
    setLoading(true);
    try {
      const options = {
        page,
        limit,
        sortBy,
        sortOrder,
      };

      if (activeTab === "plans") {
        const data = await getTravelPlans(filters, options);
        setPlansData(data);

        console.log(data, "plans data");
      } else {
        const data = await getTravelers(filters, options);
        console.log(data);
        setTravelersData(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, filters, sortBy, sortOrder, page]);

  const handleFilterChange = (newFilters: ExploreFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleReset = () => {
    setFilters({});
    setSearchQuery("");
    setPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === "plans") {
      handleFilterChange({ ...filters, destination: searchQuery });
    } else {
      handleFilterChange({ ...filters, interests: [searchQuery] });
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      );
    }

    if (activeTab === "plans") {
      const plans = plansData?.data || [];

      if (plans.length === 0) {
        return (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              No travel plans found
            </h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your filters or search terms
            </p>
            <Button onClick={handleReset}>Reset Filters</Button>
          </div>
        );
      }

      if (viewMode === "grid") {
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {plans.map((plan) => (
              <TravelPlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        );
      }

      return (
        <div className="space-y-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white dark:bg-gray-900 rounded-lg border p-6"
            >
              <TravelPlanCard plan={plan} />
            </div>
          ))}
        </div>
      );
    } else {
      const travelers = travelersData?.data || [];

      if (travelers.length === 0) {
        return (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No travelers found</h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your filters or search terms
            </p>
            <Button onClick={handleReset}>Reset Filters</Button>
          </div>
        );
      }

      if (viewMode === "grid") {
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-4 sm:gap-6">
            {travelers.map((traveler) => (
              <TravelerCard key={traveler.id} traveler={traveler} />
            ))}
          </div>
        );
      }

      return (
        <div className="space-y-4">
          {travelers.map((traveler) => (
            <div
              key={traveler.id}
              className="bg-white dark:bg-gray-900 rounded-lg border p-6"
            >
              <TravelerCard traveler={traveler} />
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Explore Travel World</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Discover amazing travel plans and connect with fellow travelers
            </p>

            <div className="mb-6 flex justify-center gap-3">
              <Link href="/dashboard/travel-plans">
                <Button size="lg">Find Travel Buddy</Button>
              </Link>
              <Link href="/explore">
                <Button variant="outline" size="lg">
                  Explore Travelers
                </Button>
              </Link>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder={
                    activeTab === "plans"
                      ? "Search destinations..."
                      : "Search travelers..."
                  }
                  className="pl-12 pr-4 py-6 text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  Search
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-0 lg:gap-8">
          {/* Filters Sidebar - Hidden on mobile, shown via floating button */}
          <div className="hidden lg:block lg:w-72 lg:shrink-0">
            <FilterSidebar
              activeTab={activeTab}
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleReset}
            />
          </div>

          {/* Mobile FilterSidebar - renders overlay */}
          <div className="lg:hidden">
            <FilterSidebar
              activeTab={activeTab}
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleReset}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls */}
            <div className="flex flex-col gap-4 mb-6">
              <Tabs
                value={activeTab}
                onValueChange={(value) => {
                  setActiveTab(value as "plans" | "travelers");
                  setPage(1);
                }}
                className="w-full"
              >
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="plans">Travel Plans</TabsTrigger>
                  <TabsTrigger value="travelers">Travelers</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Sort Options */}
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-sm text-gray-600 whitespace-nowrap hidden sm:inline">
                    Sort:
                  </span>
                  <Select
                    value={sortBy}
                    onValueChange={(value) => setSortBy(value as SortOption)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {activeTab === "plans" ? (
                        <>
                          <SelectItem value="createdAt">Latest</SelectItem>
                          <SelectItem value="startDate">Start Date</SelectItem>
                          <SelectItem value="destination">
                            Destination
                          </SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="createdAt">
                            Joined Recently
                          </SelectItem>
                          <SelectItem value="upcomingPlansCount">
                            Upcoming Plans
                          </SelectItem>
                          <SelectItem value="averageRating">Rating</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2 justify-end">
                  {/* Order */}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    }
                    title={sortOrder === "asc" ? "Ascending" : "Descending"}
                  >
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </Button>

                  {/* View Toggle */}
                  <div className="flex border rounded-lg">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="icon"
                      onClick={() => setViewMode("grid")}
                      className="rounded-r-none"
                      title="Grid View"
                    >
                      <Grid3x3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="icon"
                      onClick={() => setViewMode("list")}
                      className="rounded-l-none"
                      title="List View"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {renderContent()}

            {!loading &&
              (plansData?.meta.totalPage || travelersData?.meta.totalPage) >
                1 && (
                <div className="mt-8 flex justify-center">
                  <Pagination
                    currentPage={page}
                    totalPages={
                      activeTab === "plans"
                        ? plansData?.meta.totalPage
                        : travelersData?.meta.totalPage
                    }
                    onPageChange={setPage}
                  />
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

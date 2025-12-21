"use client";

import { useState, useEffect } from "react";

import { TravelType } from "@/types/admin.interface";
import { getAllTravelPlans } from "@/actions";
import { TravelPlanFilters } from "@/components/modules/TravlePlan/TravelPlanFilters";
import { TravelPlanCard } from "@/components/modules/TravlePlan/TravelPlanCard";
import { TravelPlansPagination } from "@/components/modules/TravlePlan/TravelPlansPagination";

export default function TravelPlansPage({
  travelTypes,
}: {
  travelTypes: TravelType[];
}) {
  const [travelPlans, setTravelPlans] = useState<any[]>([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0 });
  const [filters, setFilters] = useState<any>({});

  const fetchTravelPlans = async (params?: any) => {
    const res = await getAllTravelPlans({
      page: params?.page || 1,
      limit: params?.limit || 10,
      searchTerm: params?.searchTerm,
      travelType: params?.travelType,
      isPublic: params?.isPublic,
      sortBy: params?.sortBy,
      sortOrder: params?.sortOrder,
      minBudget: params?.minBudget,
      maxBudget: params?.maxBudget,
    });

    if (res.success) {
      setTravelPlans(res.data);
      setMeta(res.meta || { page: 1, limit: 10, total: 0 });
    } else {
      setTravelPlans([]);
      setMeta({ page: 1, limit: 10, total: 0 });
    }
  };

  // Filter change (typing updates instantly, no loading spinner)
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setMeta((prev) => ({ ...prev, page: 1 })); // reset page
    fetchTravelPlans({ ...newFilters, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    setMeta((prev) => ({ ...prev, page: newPage }));
    fetchTravelPlans({ ...filters, page: newPage });
  };

  useEffect(() => {
    fetchTravelPlans({ ...filters, page: meta.page });
  }, []);

  return (
    <div className="p-4 space-y-6">
      <TravelPlanFilters
        travelTypes={travelTypes}
        onChange={handleFilterChange}
      />

      {travelPlans.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {travelPlans.map((plan) => (
            <TravelPlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      ) : (
        <p className="text-center">No travel plans found.</p>
      )}

      <TravelPlansPagination meta={meta} onPageChange={handlePageChange} />
    </div>
  );
}

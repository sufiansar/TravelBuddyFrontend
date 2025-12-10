import {
  ApiResponse,
  ExploreFilters,
  Traveler,
  TravelPlan,
} from "@/types/explore.interface";

interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_API ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

function buildQueryParams(filters: ExploreFilters, options: PaginationOptions) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      if (Array.isArray(value)) {
        value.forEach((item) => params.append(key, item));
      } else {
        params.append(key, String(value));
      }
    }
  });

  Object.entries(options).forEach(([key, value]) => {
    if (value !== undefined) {
      params.append(key, String(value));
    }
  });

  return params.toString();
}

export async function getTravelPlans(
  filters: ExploreFilters = {},
  options: PaginationOptions = {}
) {
  const query = buildQueryParams(filters, options);

  const response = await fetch(`${baseUrl}/explore/plans?${query}`, {
    cache: "no-store",
  });

  if (!response.ok) throw new Error("Failed to fetch travel plans");

  const result = await response.json();

  return {
    success: result.success,
    data: result?.data?.data as TravelPlan[],
    meta: result?.data?.meta,
  };
}
export async function getTravelers(
  filters: ExploreFilters = {},
  options: PaginationOptions = {}
) {
  const query = buildQueryParams(filters, options);

  const response = await fetch(`${baseUrl}/explore/travelers?${query}`, {
    cache: "no-store",
  });

  if (!response.ok) throw new Error("Failed to fetch travelers");

  const result = await response.json();

  return {
    success: result.success,
    data: result?.data?.data as Traveler[],
    meta: result?.data?.meta,
  };
}

export interface User {
  id: string;
  fullName: string;
  username: string;
  profileImage?: string;
  email?: string;
}

export interface TravelPlan {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  minBudget?: number;
  maxBudget?: number;
  travelType: string;
  description?: string;
  isPublic: "PUBLIC" | "PRIVATE";
  userId: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  matches?: any[];
  requests?: TravelPlanRequest[];
  reviews?: any[];
}

export interface TravelPlanRequest {
  id: string;
  travelPlanId: string;
  requesterId: string;
  message?: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
  requester?: User;
}

export interface CreateTravelPlanData {
  destination: string;
  startDate: string;
  endDate: string;
  minBudget?: number;
  maxBudget?: number;
  travelType: string;
  description?: string;
  isPublic?: "PUBLIC" | "PRIVATE";
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  searchTerm?: string;
  travelType?: string;
  isPublic?: "PUBLIC" | "PRIVATE";
  minBudget?: number;
  maxBudget?: number;
}

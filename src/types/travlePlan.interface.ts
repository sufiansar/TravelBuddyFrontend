import { TravelType } from "./admin.interface";
import { User } from "./user.interface";

export interface TravelPlan {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  minBudget?: number;
  maxBudget?: number;
  travelType: string;
  description?: string;
  imageUrl?: string;
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
  startDate: Date;
  endDate: Date;
  imageUrl?: string;
  minBudget?: number;
  maxBudget?: number;
  travelType: TravelType;
  description?: string;
  isPublic?: "PUBLIC" | "PRIVATE";
  latitude?: number;
  longitude?: number;
  userId?: string;
}

export interface TravelPlanFilterParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  searchTerm?: string;
  travelType?: TravelType;
  startDate?: string;
  endDate?: string;
  minBudget?: number;
  maxBudget?: number;
}

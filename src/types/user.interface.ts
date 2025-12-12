import { Review } from "./review.types";
import { TravelPlan } from "./travlePlan.interface";

export interface User {
  id: string;
  fullName: string;
  email: string;
  username?: string;
  profileImage?: string;
  bio?: string;
  interests?: string[];
  userStatus?: "ACTIVE" | "INACTIVE" | "BANNED";
  visitedCountries?: string[];
  currentLocation?: string;
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
  verifiedBadge?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublicUserProfile {
  user: {
    id: string;
    fullName: string;
    username?: string;
    profileImage?: string;
    bio?: string;
    interests?: string[];
    visitedCountries?: string[];
    currentLocation?: string;
    verifiedBadge?: boolean;
    createdAt: Date;
  };
  upcomingPlans: TravelPlan[];
  recentReviews: Review[];
  averageRating: number | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    totalPage: number;
    total: number;
    averageRating?: number | null;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  searchTerm?: string;
  role?: "USER" | "ADMIN" | "SUPER_ADMIN";
}

export interface UpdateUserData {
  fullName?: string;
  username?: string;
  bio?: string;
  currentLocation?: string;
  interests?: string[];
  visitedCountries?: string[];
  profileImage?: string;
}

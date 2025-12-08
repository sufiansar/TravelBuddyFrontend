export interface User {
  id: string;
  fullName: string;
  email: string;
  username?: string;
  profileImage?: string;
  bio?: string;
  interests?: string[];
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

export interface TravelPlan {
  id: string;
  title: string;
  description?: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  isPublic: boolean;
}

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: Date;
  reviewer: {
    id: string;
    fullName: string;
    profileImage?: string;
  };
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

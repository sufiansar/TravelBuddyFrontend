export interface Review {
  id: string;
  rating: number;
  comment: string;
  reviewerId: string;
  receiverId: string;
  travelPlanId: string | null;
  createdAt: string;
  updatedAt: string;
  reviewer?: {
    id: string;
    fullName: string;
    username: string;
    profileImage?: string;
  };
  receiver?: {
    id: string;
    fullName: string;
    username: string;
    profileImage?: string;
  };
  travelPlan?: {
    id: string;
    title: string;
    destination: string;
    startDate: string;
    endDate: string;
  };
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
}

export interface CreateReviewData {
  rating: number;
  comment: string;
  receiverId: string;
  travelPlanId?: string;
  reviewerId?: string; // Auto-populated from session on server
}

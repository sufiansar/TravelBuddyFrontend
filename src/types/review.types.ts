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

export interface CreateReviewData {
  rating: number;
  comment: string;
  receiverId: string;
  travelPlanId?: string;
  reviewerId?: string; // Auto-populated from session on server
}

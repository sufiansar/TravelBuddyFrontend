export interface TravelPlan {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelType: string;
  minBudget: number;
  maxBudget: number;
  description: string;
  isPublic: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: {
    id: string;
    fullName: string;
    username: string;
    profileImage: string | null;
    verifiedBadge: boolean;
    interests: string[];
  };
}

export interface Traveler {
  id: string;
  fullName: string;
  username: string;
  profileImage: string | null;
  bio: string | null;
  interests: string[];
  visitedCountries: string[];
  currentLocation: string | null;
  verifiedBadge: boolean;
  createdAt: string;
  upcomingPlansCount: number;
  averageRating: number | null;
}

export interface ExploreFilters {
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
  interests?: string[];
  travelType?: string;
  minBudget?: number;
  maxBudget?: number;
}

export interface ApiResponse<T> {
  meta: {
    page: number;
    limit: number;
    totalPage: number;
    total: number;
  };
  data: T[];
}
export const travelTypes = [
  "ADVENTURE",
  "BEACH",
  "FRIENDS",
  "CITY_TOUR",
  "CULTURAL",
  "HIKING",
  "ROAD_TRIP",
  "SKI_SNOWBOARD",
  "BACKPACKING",
  "LUXURY",
  "BUSINESS",
  "FAMILY",
  "SOLO",
  "COUPLE",
  "GROUP",
  "OTHER",
] as const;

export const interests = [
  "Adventure",
  "Beaches",
  "Hiking",
  "Food",
  "Culture",
  "History",
  "Photography",
  "Wildlife",
  "Shopping",
  "Nightlife",
  "Relaxation",
  "Sports",
  "Music",
  "Art",
  "Architecture",
  "Nature",
  "Camping",
  "Road Trips",
  "Luxury Travel",
  "Budget Travel",
];

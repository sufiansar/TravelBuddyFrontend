export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface TravelType {
  SOLO: "SOLO";
  FRIENDS: "FRIENDS";
  FAMILY: "FAMILY";
  GROUP: "GROUP";
}
export interface PlanVisibility {
  PUBLIC: "PUBLIC";
  PRIVATE: "PRIVATE";
}

export interface ITravelPlan {
  destination: string;
  startDate: Date;
  endDate: Date;
  minBudget?: number;
  maxBudget?: number;
  travelType: TravelType;
  description?: string;
  isPublic?: PlanVisibility;
  latitude?: number;
  longitude?: number;
  userId?: string;
}

// Response type when fetching travel plans from API (includes id and timestamps)
export interface ITravelPlanResponse
  extends Omit<ITravelPlan, "startDate" | "endDate"> {
  id: string;
  startDate: string;
  endDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserRole {
  SUPER_ADMIN: "SUPER_ADMIN";
  ADMIN: "ADMIN";
  USER: "USER";
}

export interface Gender {
  MALE: "MALE";
  FEMALE: "FEMALE";
  OTHER: "OTHER";
}
export interface IUser {
  id?: string;
  fullName: string;
  username?: string | null;
  email: string;
  password: string;
  role: keyof UserRole;
  bio?: string | null;
  profileImage?: string | null;
  gender?: keyof Gender;
  currentLocation?: string | null;
  verifiedBadge: boolean;
  interests: string[];
  visitedCountries: string[];
  isPublic: boolean;
}

export interface Match {
  id?: string;
  plan: ITravelPlan;
  user: IUser;
  score: number;
  commonInterests: string[];
  createdAt: string;
}

export interface Review {
  id?: string;
  plan: string;
  reviewer: IUser;
  reviewee: IUser;
  rating: number;
  comment: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Post {
  id?: string;
  user: IUser;
  content: string;
  images: string[];
  reactions: Reaction[];
  comments: Comment[];
  shares: number;
  createdAt: string;
  updatedAt: string;
}

export interface Reaction {
  user: string;
  type: "like" | "love" | "wow" | "sad" | "angry";
}

export interface Comment {
  _id: string;
  user: IUser;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Meetup {
  _id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  organizer: IUser;
  members: IUser[];
  maxMembers: number;
  createdAt: string;
  updatedAt: string;
}

export interface JoinRequest {
  _id: string;
  plan: string;
  user: IUser;
  status: "pending" | "accepted" | "rejected";
  message?: string;
  createdAt: string;
}

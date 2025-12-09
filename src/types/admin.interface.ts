export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BANNED = "BANNED",
}

export enum TravelType {
  ADVENTURE = "ADVENTURE",
  BEACH = "BEACH",
  FRIENDS = "FRIENDS",
  CITY_TOUR = "CITY_TOUR",
  CULTURAL = "CULTURAL",
  HIKING = "HIKING",
  ROAD_TRIP = "ROAD_TRIP",
  SKI_SNOWBOARD = "SKI_SNOWBOARD",
  BACKPACKING = "BACKPACKING",
  LUXURY = "LUXURY",
  BUSINESS = "BUSINESS",
  FAMILY = "FAMILY",
  SOLO = "SOLO",
  COUPLE = "COUPLE",
  GROUP = "GROUP",
  OTHER = "OTHER",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

export enum SubscriptionPlan {
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}

export interface AdminFilters {
  searchTerm?: string;
  role?: UserRole;
  userStatus?: UserStatus;
  verifiedBadge?: boolean;
  destination?: string;
  travelType?: TravelType;
  isPublic?: boolean;
  status?: PaymentStatus;
  userId?: string;
  plan?: SubscriptionPlan;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: UserRole;
  userStatus: UserStatus;
  verifiedBadge: boolean;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TravelPlan {
  id: string;
  destination: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
  travelType: TravelType;
  isPublic: boolean;
  user: {
    id: string;
    fullName: string;
    email: string;
    userStatus: UserStatus;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: string;
  transactionId: string;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
  subscription?: {
    id: string;
    plan: SubscriptionPlan;
    isActive: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  plan: SubscriptionPlan;
  isActive: boolean;
  startDate: string;
  endDate: string;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PlatformStats {
  users: {
    total: number;
    active: number;
    banned: number;
  };
  travelPlans: {
    total: number;
  };
  payments: {
    total: number;
    totalRevenue: number;
  };
  subscriptions: {
    active: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  meta?: {
    page: number;
    limit: number;
    totalPage: number;
    total: number;
  };
  error?: string;
}

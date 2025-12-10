export interface User {
  id: string;
  fullName: string;
  email: string;
  role: "USER" | "ADMIN";
  profileImage?: string;
  verifiedBadge?: boolean;
}

export interface MeetupMember {
  id: string;
  userId: string;
  meetupId: string;
  user: User;
  createdAt?: Date;
}

export interface Meetup {
  id: string;
  title: string;
  location: string;
  date: Date;
  description: string;
  maxPeople: number | null;
  hostId: string;
  host: User;
  participants: MeetupMember[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MeetupFilters {
  searchTerm?: string;
  location?: string;
  date?: string;
  [key: string]: any;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
  success: boolean;
  error?: string;
}

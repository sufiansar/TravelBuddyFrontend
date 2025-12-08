import { User } from "./user.interface";

export interface Meetup {
  id: string;
  title: string;
  location: string;
  date: string;
  description: string;
  maxPeople: number | null;
  hostId: string;
  host: User;
  participants: {
    id: string;
    userId: string;
    user: User;
  }[];
}

export interface MeetupMember {
  id: string;
  userId: string;
  meetupId: string;
  user: User;
}

export interface MeetupFilters {
  searchTerm?: string;
  location?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface CreateMeetupInput {
  title: string;
  location: string;
  date: string;
  description: string;
  maxPeople?: number;
}

export interface UpdateMeetupInput {
  title?: string;
  location?: string;
  date?: string;
  description?: string;
  maxPeople?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

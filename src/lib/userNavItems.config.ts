import { UserRole } from "./commonNavItems.config";
import { NavSection } from "./types";

export const userNavItems: NavSection[] = [
  {
    title: "Travel",
    items: [
      {
        title: "Create Travel Plan",
        href: "/dashboard/travel-plans/create",
        icon: "MapPin",
        roles: ["SUPER_ADMIN", "ADMIN", "USER"] as unknown as UserRole[],
      },
      {
        title: "Travel Plans",
        href: "/dashboard/travel-plans",
        icon: "MapPin",
        roles: ["SUPER_ADMIN", "ADMIN", "USER"] as unknown as UserRole[],
      },

      {
        title: "My Travel Plans",
        href: "/dashboard/travel-plans/my-travel-plans",
        icon: "MapPin",
        roles: ["USER"] as unknown as UserRole[],
      },

      {
        title: "Explore Travelers",
        href: "/explore",
        icon: "Users",
        roles: ["USER"] as unknown as UserRole[],
      },
      {
        title: "Community Posts",
        href: "/post",
        icon: "MessageSquare",
        roles: ["USER"] as unknown as UserRole[],
      },
      {
        title: "Matches",
        href: "/dashboard/matches",
        icon: "Users",
        roles: ["USER"] as unknown as UserRole[],
      },
    ],
  },
  {
    title: "Meetups & Events",
    items: [
      {
        title: "Create Meetup",
        href: "/dashboard/meetups/create",
        icon: "PlusCircle",
        roles: ["SUPER_ADMIN", "ADMIN", "USER"] as unknown as UserRole[],
      },
      {
        title: "My Meetups",
        href: "/dashboard/meetups/my-meetups",
        icon: "Calendar",
        roles: ["SUPER_ADMIN", "ADMIN", "USER"] as unknown as UserRole[],
      },
      {
        title: "My Joined Meetups",
        href: "/dashboard/meetups/joined",
        icon: "CheckCircle",
        roles: ["SUPER_ADMIN", "ADMIN", "USER"] as unknown as UserRole[],
      },

      {
        title: "Browse All Meetups",
        href: "/dashboard/meetups",
        icon: "Search",
        roles: ["USER"] as unknown as UserRole[],
      },

      {
        title: "My Calendar",
        href: "/dashboard/meetups/calendar",
        icon: "CalendarDays",
        roles: ["USER"] as unknown as UserRole[],
      },
    ],
  },
  {
    title: "Reviews",
    items: [
      {
        title: "My Reviews",
        href: "/dashboard/reviews",
        icon: "MessageSquare",
        roles: ["USER"] as unknown as UserRole[],
      },
      {
        title: "Write Review",
        href: "/dashboard/reviews/create",
        icon: "Plus",
        roles: ["SUPER_ADMIN", "ADMIN", "USER"] as unknown as UserRole[],
      },
    ],
  },
];

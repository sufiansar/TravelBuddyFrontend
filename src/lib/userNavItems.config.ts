import { UserRole } from "./commonNavItems.config";
import { NavSection } from "./types";

export const userNavItems: NavSection[] = [
  {
    title: "Travel",
    items: [
      {
        title: "My Travel Plans",
        href: "/travel-plans/my-travel-plans",
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
        href: "/matches",
        icon: "Users",
        roles: ["USER"] as unknown as UserRole[],
      },
    ],
  },
  {
    title: "Meetups & Events",
    items: [
      {
        title: "Browse All Meetups",
        href: "/meetups",
        icon: "Search",
        roles: ["USER"] as unknown as UserRole[],
      },

      {
        title: "My Calendar",
        href: "/meetups/calendar",
        icon: "CalendarDays",
        roles: ["USER"] as unknown as UserRole[],
      },
    ],
  },
];

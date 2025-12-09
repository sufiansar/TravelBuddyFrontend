import { UserRole } from "./commonNavItems.config";
import { NavSection } from "./types";

export const superAdminNavItems: NavSection[] = [
  {
    title: "Administration",
    items: [
      {
        title: "Users",
        href: "/admin/users",
        icon: "Users",
        roles: ["SUPER_ADMIN"] as unknown as UserRole[],
      },
      {
        title: "Manage Roles",
        href: "/admin/roles",
        icon: "Shield",
        roles: ["SUPER_ADMIN"] as unknown as UserRole[],
      },
      {
        title: "Settings",
        href: "/admin/settings",
        icon: "Settings",
        roles: ["SUPER_ADMIN"] as unknown as UserRole[],
      },
      {
        title: "Reports",
        href: "/admin/reports",
        icon: "BarChart3",
        roles: ["SUPER_ADMIN"] as unknown as UserRole[],
      },
      {
        title: "All Reviews",
        href: "/reviews",
        icon: "Star",
        roles: ["SUPER_ADMIN", "ADMIN"] as unknown as UserRole[],
      },

      {
        title: "All Meetups",
        href: "/admin/meetups",
        icon: "Calendar",
        roles: ["SUPER_ADMIN"] as unknown as UserRole[],
      },
      {
        title: "Meetup Analytics",
        href: "/admin/meetups/analytics",
        icon: "BarChart",
        roles: ["SUPER_ADMIN"] as unknown as UserRole[],
      },
    ],
  },
];

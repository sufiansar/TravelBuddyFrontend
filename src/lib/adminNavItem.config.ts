import { UserRole } from "./commonNavItems.config";
import { NavSection } from "./types";

export const adminNavItems: NavSection[] = [
  {
    title: "Travel Management",
    items: [
      {
        title: "Dashboard",
        href: "/admin",
        icon: "Home",
        roles: ["ADMIN"] as unknown as UserRole[],
      },
      {
        title: "Users",
        href: "/admin/users",
        icon: "Users",
        roles: ["ADMIN"] as unknown as UserRole[],
      },
      {
        title: "Travel Plans",
        href: "/admin/travel-plans",
        icon: "MapPin",
        roles: ["ADMIN"] as unknown as UserRole[],
      },
      {
        title: "Payments",
        href: "/admin/payments",
        icon: "CreditCard",
        roles: ["ADMIN"] as unknown as UserRole[],
      },
      {
        title: "Subscriptions",
        href: "/admin/subscriptions",
        icon: "Calendar",
        roles: ["ADMIN"] as unknown as UserRole[],
      },
      {
        title: "Analytics",
        href: "/admin/analytics",
        icon: "BarChart3",
        roles: ["ADMIN"] as unknown as UserRole[],
      },
      // {
      //   title: "Settings",
      //   href: "/admin/settings",
      //   icon: "Settings",
      //   roles: ["ADMIN"] as unknown as UserRole[],
      // },
      {
        title: "Manage Roles",
        href: "/admin/roles",
        icon: "Shield",
        roles: ["ADMIN"] as unknown as UserRole[],
      },
      {
        title: "All Reviews",
        href: "/admin/reviews",
        icon: "Star",
        roles: ["SUPER_ADMIN", "ADMIN"] as unknown as UserRole[],
      },
      {
        title: "Manage Meetups",
        href: "/admin/meetups/users",
        icon: "Calendar",
        roles: ["ADMIN"] as unknown as UserRole[],
      },
    ],
  },
];

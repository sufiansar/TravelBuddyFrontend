import { NavSection } from "./types";

export type UserRole = "SUPER_ADMIN" | "ADMIN" | "USER";

export const commonNavItems = (role: UserRole): NavSection[] => {
  const items = [
    {
      title: "Dashboard",
      items: [
        {
          title: "Home",
          href: "/dashboard",
          icon: "LayoutDashboard",
          roles: ["SUPER_ADMIN", "ADMIN", "USER"] as unknown as UserRole[],
        },
        {
          title: "My Profile",
          href: "/profile",
          icon: "User",
          roles: ["SUPER_ADMIN", "ADMIN", "USER"] as unknown as UserRole[],
        },
        {
          title: "Edit Profile",
          href: "/users/me/edit",
          icon: "Edit",
          roles: ["SUPER_ADMIN", "ADMIN", "USER"] as unknown as UserRole[],
        },
        {
          title: "Home Page",
          href: "/",
          icon: "Home",
          roles: ["SUPER_ADMIN", "ADMIN", "USER"] as unknown as UserRole[],
        },
      ],
    },
  ];

  return items;
};

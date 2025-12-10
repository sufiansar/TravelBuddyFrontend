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
        {
          title: "Travel Plans",
          href: "/travel-plans",
          icon: "MapPin",
          roles: ["SUPER_ADMIN", "ADMIN", "USER"] as unknown as UserRole[],
        },

        {
          title: "Meetups",
          href: "/meetups",
          icon: "Users",
          roles: ["SUPER_ADMIN", "ADMIN", "USER"] as unknown as UserRole[],
        },
      ],
    },
    {
      title: "Reviews",
      items: [
        {
          title: "My Reviews",
          href: "/reviews",
          icon: "MessageSquare",
          roles: ["USER"] as unknown as UserRole[],
        },
        {
          title: "Write Review",
          href: "/reviews/create",
          icon: "Plus",
          roles: ["SUPER_ADMIN", "ADMIN", "USER"] as unknown as UserRole[],
        },
      ],
    },
  ];

  items.push({
    title: "Community",
    items: [
      {
        title: "Create Meetup",
        href: "/meetups/create",
        icon: "PlusCircle",
        roles: ["SUPER_ADMIN", "ADMIN", "USER"] as unknown as UserRole[],
      },
      {
        title: "My Meetups",
        href: "/meetups/my-meetups",
        icon: "Calendar",
        roles: ["SUPER_ADMIN", "ADMIN", "USER"] as unknown as UserRole[],
      },
      {
        title: "My Joined Meetups",
        href: "/meetups",
        icon: "CheckCircle",
        roles: ["SUPER_ADMIN", "ADMIN", "USER"] as unknown as UserRole[],
      },
    ],
  });

  return items;
};

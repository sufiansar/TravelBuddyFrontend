import { NavSection } from "@/types/dashboard.interface";

type UserRole = "SUPER_ADMIN" | "ADMIN" | "USER";

export const commonNavItems = (role: UserRole): NavSection[] => {
  return [
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
};

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
    ],
  },
];

export const adminNavItems: NavSection[] = [
  {
    title: "Travel Management",
    items: [
      {
        title: "All Plans",
        href: "/admin/travel-plans",
        icon: "MapPin",
        roles: ["ADMIN"] as unknown as UserRole[],
      },
      {
        title: "Users",
        href: "/admin/users",
        icon: "Users",
        roles: ["ADMIN"] as unknown as UserRole[],
      },
      {
        title: "Manage Roles",
        href: "/admin/roles",
        icon: "Shield",
        roles: ["ADMIN"] as unknown as UserRole[],
      },
      {
        title: "Analytics",
        href: "/admin/analytics",
        icon: "BarChart3",
        roles: ["ADMIN"] as unknown as UserRole[],
      },
      {
        title: "All Reviews",
        href: "/reviews",
        icon: "Star",
        roles: ["SUPER_ADMIN", "ADMIN"] as unknown as UserRole[],
      },
    ],
  },
];

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
];

export const getNavItemsByRole = (role: UserRole): NavSection[] => {
  const getcommonNavItems = commonNavItems(role);

  switch (role as unknown as string) {
    case "SUPER_ADMIN":
      return [...getcommonNavItems, ...superAdminNavItems];
    case "ADMIN":
      return [...getcommonNavItems, ...adminNavItems];
    case "USER":
      return [...getcommonNavItems, ...userNavItems];
    default:
      return [];
  }
};

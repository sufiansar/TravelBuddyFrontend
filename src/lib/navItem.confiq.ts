import { NavSection } from "@/types/dashboard.interface";

type UserRole = "SUPER_ADMIN" | "ADMIN" | "USER";

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
        // Added Meetups to common navigation
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

  // Add Create Meetup button for all users
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
        title: "Joined Meetups",
        href: "/meetups/joined",
        icon: "CheckCircle",
        roles: ["SUPER_ADMIN", "ADMIN", "USER"] as unknown as UserRole[],
      },
    ],
  });

  return items;
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
      // Added Meetup Management for Super Admin
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
      // Added Meetup Management for Admin
      {
        title: "Manage Meetups",
        href: "/admin/meetups",
        icon: "Calendar",
        roles: ["ADMIN"] as unknown as UserRole[],
      },
      {
        title: "Meetup Reports",
        href: "/admin/meetups/reports",
        icon: "FileText",
        roles: ["ADMIN"] as unknown as UserRole[],
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
      // Added Meetup specific items for regular users
      {
        title: "Upcoming Meetups",
        href: "/meetups/upcoming",
        icon: "Calendar",
        roles: ["USER"] as unknown as UserRole[],
      },
      {
        title: "Meetup Invites",
        href: "/meetups/invites",
        icon: "Bell",
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
        title: "Create New Meetup",
        href: "/meetups/create",
        icon: "PlusCircle",
        roles: ["USER"] as unknown as UserRole[],
      },
      {
        title: "My Created Meetups",
        href: "/meetups/my-created",
        icon: "FolderPlus",
        roles: ["USER"] as unknown as UserRole[],
      },
      {
        title: "My Calendar",
        href: "/meetups/calendar",
        icon: "CalendarDays",
        roles: ["USER"] as unknown as UserRole[],
      },
      {
        title: "Meetup Suggestions",
        href: "/meetups/suggestions",
        icon: "Lightbulb",
        roles: ["USER"] as unknown as UserRole[],
      },
    ],
  },
];

export const getNavItemsByRole = (role: UserRole): NavSection[] => {
  const commonItems = commonNavItems(role);

  switch (role as unknown as string) {
    case "SUPER_ADMIN":
      return [...commonItems, ...superAdminNavItems];
    case "ADMIN":
      return [...commonItems, ...adminNavItems];
    case "USER":
      return [...commonItems, ...userNavItems];
    default:
      return [];
  }
};

// Optional: Export just meetup-related nav items for specific components
export const meetupNavItems: NavSection[] = [
  {
    title: "Meetups",
    items: [
      {
        title: "All Meetups",
        href: "/meetups",
        icon: "Calendar",
        roles: ["SUPER_ADMIN", "ADMIN", "USER"] as unknown as UserRole[],
      },
      {
        title: "Create Meetup",
        href: "/meetups/create",
        icon: "PlusCircle",
        roles: ["SUPER_ADMIN", "ADMIN", "USER"] as unknown as UserRole[],
      },
      {
        title: "My Meetups",
        href: "/meetups/my-meetups",
        icon: "Users",
        roles: ["SUPER_ADMIN", "ADMIN", "USER"] as unknown as UserRole[],
      },
      {
        title: "Joined Meetups",
        href: "/meetups/joined",
        icon: "CheckCircle",
        roles: ["SUPER_ADMIN", "ADMIN", "USER"] as unknown as UserRole[],
      },
      {
        title: "Calendar View",
        href: "/meetups/calendar",
        icon: "CalendarDays",
        roles: ["SUPER_ADMIN", "ADMIN", "USER"] as unknown as UserRole[],
      },
    ],
  },
];

// Export role-specific meetup navigation
export const getMeetupNavItemsByRole = (role: UserRole) => {
  const baseItems = [
    {
      title: "All Meetups",
      href: "/meetups",
      icon: "Calendar",
      roles: ["SUPER_ADMIN", "ADMIN", "USER"] as unknown as UserRole[],
    },
    {
      title: "Create Meetup",
      href: "/meetups/create",
      icon: "PlusCircle",
      roles: ["SUPER_ADMIN", "ADMIN", "USER"] as unknown as UserRole[],
    },
  ];

  if (role === "SUPER_ADMIN" || role === "ADMIN") {
    return [
      ...baseItems,
      {
        title: "Manage Meetups",
        href: "/admin/meetups",
        icon: "Settings",
        roles: ["SUPER_ADMIN", "ADMIN"] as unknown as UserRole[],
      },
      {
        title: "Meetup Analytics",
        href: "/admin/meetups/analytics",
        icon: "BarChart",
        roles: ["SUPER_ADMIN", "ADMIN"] as unknown as UserRole[],
      },
    ];
  }

  return [
    ...baseItems,
    {
      title: "My Meetups",
      href: "/meetups/my-meetups",
      icon: "Users",
      roles: ["USER"] as unknown as UserRole[],
    },
    {
      title: "Upcoming Meetups",
      href: "/meetups/upcoming",
      icon: "Calendar",
      roles: ["USER"] as unknown as UserRole[],
    },
    {
      title: "Calendar View",
      href: "/meetups/calendar",
      icon: "CalendarDays",
      roles: ["USER"] as unknown as UserRole[],
    },
  ];
};

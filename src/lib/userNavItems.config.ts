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

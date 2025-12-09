import { NavSection } from "@/types/dashboard.interface";
import { commonNavItems } from "./commonNavItems.config";
import { superAdminNavItems } from "./superAdminNavItems.config";
import { adminNavItems } from "./adminNavItem.config";
import { userNavItems } from "./userNavItems.config";

type UserRole = "SUPER_ADMIN" | "ADMIN" | "USER";

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
// export const meetupNavItems: NavSection[] = [
//   {
//     title: "Meetups",
//     items: [
//       {
//         title: "All Meetups",
//         href: "/meetups",
//         icon: "Calendar",
//         roles: ["SUPER_ADMIN", "ADMIN", "USER"] as unknown as UserRole[],
//       },
//       {
//         title: "Create Meetup",
//         href: "/meetups/create",
//         icon: "PlusCircle",
//         roles: ["SUPER_ADMIN", "ADMIN", "USER"] as unknown as UserRole[],
//       },
//       {
//         title: "My Meetups",
//         href: "/meetups/my-meetups",
//         icon: "Users",
//         roles: ["SUPER_ADMIN", "ADMIN", "USER"] as unknown as UserRole[],
//       },
//       {
//         title: "Joined Meetups",
//         href: "/meetups/joined",
//         icon: "CheckCircle",
//         roles: ["SUPER_ADMIN", "ADMIN", "USER"] as unknown as UserRole[],
//       },
//       {
//         title: "Calendar View",
//         href: "/meetups/calendar",
//         icon: "CalendarDays",
//         roles: ["SUPER_ADMIN", "ADMIN", "USER"] as unknown as UserRole[],
//       },
//     ],
//   },
// ];

// Export role-specific meetup navigation
// export const getMeetupNavItemsByRole = (role: UserRole) => {
//   const baseItems = [
//     {
//       title: "All Meetups",
//       href: "/meetups",
//       icon: "Calendar",
//       roles: ["SUPER_ADMIN", "ADMIN", "USER"] as unknown as UserRole[],
//     },
//     {
//       title: "Create Meetup",
//       href: "/meetups/create",
//       icon: "PlusCircle",
//       roles: ["SUPER_ADMIN", "ADMIN", "USER"] as unknown as UserRole[],
//     },
//   ];

//   if (role === "SUPER_ADMIN" || role === "ADMIN") {
//     return [
//       ...baseItems,
//       {
//         title: "Manage Meetups",
//         href: "/admin/meetups",
//         icon: "Settings",
//         roles: ["SUPER_ADMIN", "ADMIN"] as unknown as UserRole[],
//       },
//       {
//         title: "Meetup Analytics",
//         href: "/admin/meetups/analytics",
//         icon: "BarChart",
//         roles: ["SUPER_ADMIN", "ADMIN"] as unknown as UserRole[],
//       },
//     ];
//   }

//   return [
//     ...baseItems,
//     {
//       title: "My Meetups",
//       href: "/meetups/my-meetups",
//       icon: "Users",
//       roles: ["USER"] as unknown as UserRole[],
//     },
//     {
//       title: "Upcoming Meetups",
//       href: "/meetups/upcoming",
//       icon: "Calendar",
//       roles: ["USER"] as unknown as UserRole[],
//     },
//     {
//       title: "Calendar View",
//       href: "/meetups/calendar",
//       icon: "CalendarDays",
//       roles: ["USER"] as unknown as UserRole[],
//     },
//   ];
// };

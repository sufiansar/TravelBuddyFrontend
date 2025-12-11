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

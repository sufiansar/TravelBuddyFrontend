"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import * as Icons from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { IUser } from "@/actions";
import { NavSection } from "@/types/dashboard.interface";
import LogoutButton from "@/components/PublicNavbar/Logout";
import { NavMain } from "./nav-main";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userInfo: IUser | null;
  navItems: NavSection[];
}

export function AppSidebar({ userInfo, navItems, ...props }: AppSidebarProps) {
  // Map icons correctly inside nested structure
  const mappedSections = navItems.map((section) => ({
    ...section,
    items: section.items.map((item) => ({
      ...item,
      icon: item.icon ? (Icons as any)[item.icon] : undefined,
    })),
  }));

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard" className="text-xl font-bold">
                <Icons.Users2 className="inline-block mr-2" />
                TravelBuddy
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain sections={mappedSections} />
      </SidebarContent>
      {mappedSections.length > 0 && <Separator className="my-3" />}
      {userInfo && (
        <SidebarMenuItem className="mt-3 px-2">
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-primary">
              {userInfo.fullName || "Unknown"}
            </p>
            <p className="text-xs font-bold">{userInfo.email}</p>
            <p className="text-[12px] font-bold text-gray-500 mt-1">
              Role: {userInfo.role}
            </p>
          </div>
          <div className="flex items-center gap-2 mt-2 text-red-600 cursor-pointer">
            <LogoutButton />
          </div>
        </SidebarMenuItem>
      )}
    </Sidebar>
  );
}

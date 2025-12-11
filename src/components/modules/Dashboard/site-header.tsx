import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "../../ui/input";
import { Bell, Search } from "lucide-react";

import UserDropdown from "./UserDropDrown";
import { IUser } from "@/actions/shared/types";

interface DashboardNavbarProps {
  userInfo: IUser | null;
}

export function SiteHeader({ userInfo }: DashboardNavbarProps) {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <div className="w-full">
          <Search className="absolute ml-3 mt-3 size-4 text-muted-foreground" />
          <Input
            className="pl-8"
            type="search"
            placeholder=" Search..."
          ></Input>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Bell className="h-5 w-5 cursor-pointer text-muted-foreground hover:text-foreground" />
          <UserDropdown userInfo={userInfo} />
        </div>
      </div>
    </header>
  );
}

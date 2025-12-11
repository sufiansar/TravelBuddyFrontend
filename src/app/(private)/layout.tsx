import { getMyProfile } from "@/actions";
import { AppSidebar } from "@/components/modules/Dashboard/app-sidebar";
import DashboardNavbar from "@/components/modules/Dashboard/DashboardNavbar";
import { getUserSession } from "@/helpers/userSession";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getNavItemsByRole } from "@/lib/navItem.confiq";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const result = await getMyProfile();

  const session = await getUserSession();

  let userInfo = null;
  let role: "SUPER_ADMIN" | "ADMIN" | "USER" = "USER";

  if ((result as any)?.success && (result as any)?.data) {
    userInfo = (result as any)?.data;
    role = (userInfo?.role || "USER") as "SUPER_ADMIN" | "ADMIN" | "USER";
    console.log("Layout - Using API profile data, role:", role);
  } else if (session?.user) {
    userInfo = {
      id: session.user.id,
      fullName: session.user.fullName,
      email: session.user.email,
      role: session.user.role,
    };
    role = (session.user.role || "USER") as "SUPER_ADMIN" | "ADMIN" | "USER";
    console.log("Layout - Using session fallback, role:", role);
  } else {
    console.warn("Layout - No user data available");
  }

  const navItems = getNavItemsByRole(role);
  console.log("Layout - Nav items for role", role, ":", navItems);

  return (
    <div>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar userInfo={userInfo} navItems={navItems} variant="inset" />
        <SidebarInset>
          <DashboardNavbar />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 pl-5 py-4 md:gap-6 md:py-6">
                {children}
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default layout;

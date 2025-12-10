import { getMyProfile } from "@/actions";
import { getUserSession } from "@/helpers/userSession";

import { SiteHeader } from "@/components/modules/Dashboard/site-header";
import { User } from "@/types/user.interface";

const DashboardNavbar = async () => {
  const result = await getMyProfile();
  const session = await getUserSession();
 
  let userInfo: User | null = null;

  if ((result as any)?.success && (result as any)?.data) {
    userInfo = (result as any)?.data as User;
  } else if (session?.user) {
    userInfo = {
      id: session.user.id,
      fullName: session.user.fullName,
      email: session.user.email,
      role: session.user.role,
    } as User;
  }

  return (
    <div>
      <SiteHeader userInfo={userInfo} />
    </div>
  );
};

export default DashboardNavbar;

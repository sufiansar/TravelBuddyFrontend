import { getMyProfile } from "@/actions";
import { getUserSession } from "@/helpers/userSession";
import { UserProfile } from "@/app/(private)/profile/page";
import { SiteHeader } from "@/components/modules/Dashboard/site-header";

const DashboardNavbar = async () => {
  const result = await getMyProfile();
  const session = await getUserSession();

  let userInfo: UserProfile | null = null;

  if ((result as any)?.success && (result as any)?.data) {
    userInfo = (result as any)?.data as UserProfile;
    console.log("DashboardNavbar - Using API data:", userInfo);
  } else if (session?.user) {
    userInfo = {
      id: session.user.id,
      fullName: session.user.fullName,
      email: session.user.email,
      role: session.user.role,
    } as UserProfile;
  } else {
    console.warn("DashboardNavbar - No user data found", {
      apiResult: result,
      hasSession: Boolean(session),
    });
  }

  return (
    <div>
      <SiteHeader userInfo={userInfo} />
    </div>
  );
};

export default DashboardNavbar;

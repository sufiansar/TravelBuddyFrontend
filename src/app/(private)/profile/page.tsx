import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/helpers/authOptions";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Redirect to the current user's public profile
  redirect(`/users/public/${session.user.id}`);
}

import { getServerSession } from "next-auth";
import { authOptions } from "@/helpers/authOptions";
import { redirect } from "next/navigation";

export default async function MyEditPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  redirect(`/users/${session.user.id}/edit`);
}

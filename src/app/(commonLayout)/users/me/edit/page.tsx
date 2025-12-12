import { getServerSession } from "next-auth";
import { authOptions } from "@/helpers/authOptions";
import { redirect } from "next/navigation";

export default async function MyEditPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Redirect to the user's actual edit page within the private route
  redirect(`/users/${session.user.id}/edit`);
}

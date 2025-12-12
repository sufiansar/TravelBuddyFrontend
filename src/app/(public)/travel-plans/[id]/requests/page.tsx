import { redirect } from "next/navigation";

export default function TravelPlanRequestsRedirect({
  params,
}: {
  params: { id: string };
}) {
  redirect(`/dashboard/travel-plans/${params.id}/requests`);
}

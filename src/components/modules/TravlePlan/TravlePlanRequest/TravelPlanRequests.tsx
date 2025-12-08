import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getTravelPlan, getTravelPlanRequests } from "@/actions";
import { RequestList } from "../RequestList";

interface TravelPlanRequestsProps {
  planId: string;
}

export async function TravelPlanRequests({ planId }: TravelPlanRequestsProps) {
  const [planResult, requestsResult] = await Promise.all([
    getTravelPlan(planId),
    getTravelPlanRequests(planId),
  ]);

  if (!planResult.success || !planResult.data) {
    notFound();
  }

  const plan = planResult.data;
  const requests = requestsResult.success ? requestsResult.data : [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Join Requests</CardTitle>
              <CardDescription>
                Manage join requests for your travel plan to {plan.destination}
              </CardDescription>
            </div>
            <Button variant="outline" asChild>
              <Link href={`/travel-plans/${planId}`}>Back to Plan</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <RequestList requests={requests} travelPlanId={planId} />
        </CardContent>
      </Card>
    </div>
  );
}

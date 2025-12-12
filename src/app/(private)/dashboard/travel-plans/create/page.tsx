import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { TravelPlanForm } from "@/components/modules/TravlePlan/TravelPlanForm";

export default function CreateTravelPlanPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" asChild className="gap-2">
          <Link href="/dashboard/travel-plans">
            <ArrowLeft className="h-4 w-4" />
            Back to Plans
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create Travel Plan</h1>
          <p className="text-muted-foreground">
            Plan your next adventure and connect with fellow travelers
          </p>
        </div>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">New Travel Plan</CardTitle>
          <CardDescription>
            Fill in the details of your travel plan. Public plans can be
            discovered by other travelers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TravelPlanForm />
        </CardContent>
      </Card>
    </div>
  );
}

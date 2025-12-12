import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Calendar, Users, Eye, EyeOff } from "lucide-react";

// Mark this page as dynamic since it uses server session
export const dynamic = "force-dynamic";
import Link from "next/link";
import { format } from "date-fns";

import { getAllTravelPlans } from "@/actions/admin/actions";
import TravelPlanEditForm from "@/components/modules/Admin/TravelPlanEditForm";

interface TravelPlanDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TravelPlanDetailPage({
  params,
}: TravelPlanDetailPageProps) {
  const { id } = await params;
  const result = await getAllTravelPlans();
  const plans = result.success ? result.data || [] : [];
  const plan = plans.find((p: any) => p.id === id);

  if (!plan) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500 mb-4">Travel plan not found</p>
        <Link href="/admin/travel-plans">
          <Button variant="outline">Back to Travel Plans</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/travel-plans">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Travel Plan Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Plan Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-2">{plan.destination}</h2>

              <div className="flex flex-wrap gap-2 mb-6">
                {plan.isPublic ? (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Public
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="bg-gray-100 text-gray-800"
                  >
                    <EyeOff className="h-3 w-3 mr-1" />
                    Private
                  </Badge>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-600">Destination</p>
                    <p className="text-sm font-medium">{plan.destination}</p>
                  </div>
                </div>

                {plan.startDate && (
                  <div className="flex items-start gap-3">
                    <Calendar className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-600">Travel Dates</p>
                      <p className="text-sm font-medium">
                        {format(new Date(plan.startDate), "MMM dd, yyyy")} -{" "}
                        {plan.endDate
                          ? format(new Date(plan.endDate), "MMM dd, yyyy")
                          : "TBD"}
                      </p>
                    </div>
                  </div>
                )}

                {plan.user && (
                  <div className="flex items-start gap-3">
                    <Users className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-600">Created By</p>
                      <p className="text-sm font-medium">
                        {plan.user.fullName}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {plan.description && (
                <div className="mt-6 pt-6 border-t">
                  <p className="text-xs text-gray-600 mb-2">Description</p>
                  <p className="text-sm text-gray-700">{plan.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stats */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base">Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm">Travel Type</span>
                <span className="font-semibold">{plan.travelType}</span>
              </div>

              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm">Budget (USD)</span>
                <span className="font-semibold">${plan.budget || "0"}</span>
              </div>

              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm">Created</span>
                <span className="font-semibold text-xs">
                  {format(new Date(plan.createdAt), "MMM dd, yyyy")}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Edit Form */}
        <div className="lg:col-span-2">
          <TravelPlanEditForm plan={plan} />
        </div>
      </div>
    </div>
  );
}

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Clock, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { TravelPlanRequest } from "@/types/travlePlan.interface";

interface RequestCardProps {
  request: TravelPlanRequest;
  travelPlanId: string;
  onRespond: (requestId: string, action: "ACCEPTED" | "REJECTED") => void;
  isPending: boolean;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "PENDING":
      return (
        <Badge variant="outline" className="gap-1">
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
      );
    case "ACCEPTED":
      return (
        <Badge variant="default" className="gap-1">
          <Check className="h-3 w-3" />
          Accepted
        </Badge>
      );
    case "REJECTED":
      return (
        <Badge variant="destructive" className="gap-1">
          <X className="h-3 w-3" />
          Rejected
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export function RequestCard({
  request,
  travelPlanId,
  onRespond,
  isPending,
}: RequestCardProps) {
  const statusBadge = getStatusBadge(request.status);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={request.requester?.profileImage} />
              <AvatarFallback>
                {request.requester?.fullName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold">{request.requester?.fullName}</h4>
                <Badge variant="outline" className="text-xs">
                  @{request.requester?.username}
                </Badge>
                {statusBadge}
              </div>
              <div className="text-sm text-muted-foreground">
                Requested{" "}
                {format(new Date(request.createdAt), "MMM d, yyyy 'at' h:mm a")}
              </div>
              {request.message && (
                <div className="pt-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <MessageSquare className="h-4 w-4" />
                    <span>Message</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">
                    {request.message}
                  </p>
                </div>
              )}
            </div>
          </div>

          {request.status === "PENDING" && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="default"
                onClick={() => onRespond(request.id, "ACCEPTED")}
                disabled={isPending}
              >
                <Check className="h-4 w-4 mr-1" />
                Accept
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onRespond(request.id, "REJECTED")}
                disabled={isPending}
              >
                <X className="h-4 w-4 mr-1" />
                Reject
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

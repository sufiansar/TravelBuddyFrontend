"use client";

import { useState, useTransition } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { User } from "lucide-react";

import { toast } from "sonner";
import { TravelPlanRequest } from "@/types/travlePlan.interface";
import { respondToRequest } from "@/actions";
import { RequestCard } from "./RequestCard";

interface RequestListProps {
  requests: TravelPlanRequest[];
  travelPlanId: string;
  onUpdate?: () => void;
}

export function RequestList({
  requests,
  travelPlanId,
  onUpdate,
}: RequestListProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedRequest, setSelectedRequest] =
    useState<TravelPlanRequest | null>(null);

  // Ensure requests is an array
  const requestsArray = Array.isArray(requests) ? requests : [];

  const handleRespond = (
    requestId: string,
    action: "ACCEPTED" | "REJECTED"
  ) => {
    if (!travelPlanId) return;

    startTransition(async () => {
      const result = await respondToRequest(travelPlanId, requestId, action);
      console.log(result);
      if (result.success) {
        toast.success(`Request ${action.toLowerCase()} successfully`);
        onUpdate?.();
      } else {
        toast.error(
          result.error || `Failed to ${action.toLowerCase()} request`
        );
      }
    });
  };

  if (requestsArray.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <User className="h-12 w-12 mx-auto text-muted-foreground" />
        <div>
          <h3 className="text-lg font-semibold">No join requests</h3>
          <p className="text-muted-foreground">
            No one has requested to join this travel plan yet
          </p>
        </div>
      </div>
    );
  }

  const pendingRequests = requestsArray.filter((req) => req.status === "PENDING");
  const otherRequests = requestsArray.filter((req) => req.status !== "PENDING");

  return (
    <div className="space-y-6">
      {pendingRequests.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Pending Requests</h3>
          {pendingRequests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              travelPlanId={travelPlanId}
              onRespond={handleRespond}
              isPending={isPending}
            />
          ))}
        </div>
      )}

      {otherRequests.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Previous Requests</h3>
          {otherRequests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              travelPlanId={travelPlanId}
              onRespond={handleRespond}
              isPending={isPending}
            />
          ))}
        </div>
      )}

      <AlertDialog
        open={!!selectedRequest}
        onOpenChange={(open) => !open && setSelectedRequest(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject this join request? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                selectedRequest && handleRespond(selectedRequest.id, "REJECTED")
              }
              disabled={isPending}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isPending ? "Rejecting..." : "Reject Request"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

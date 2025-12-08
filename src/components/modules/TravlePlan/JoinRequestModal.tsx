"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, MapPin, AlertCircle } from "lucide-react";

import { toast } from "sonner";
import { requestToJoin } from "@/actions";

interface JoinRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  travelPlanId: string;
  travelPlanDestination: string;
}

export function JoinRequestModal({
  open,
  onOpenChange,
  travelPlanId,
  travelPlanDestination,
}: JoinRequestModalProps) {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!travelPlanId) return;

    setError("");
    startTransition(async () => {
      const result = await requestToJoin(travelPlanId, message);
      if (result.success) {
        toast.success("Join request sent successfully!");
        onOpenChange(false);
        setMessage("");
      } else {
        setError(result.error || "Failed to send join request");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Request to Join
          </DialogTitle>
          <DialogDescription>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="h-4 w-4" />
              {travelPlanDestination}
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Message (Optional)</label>
            <Textarea
              placeholder="Tell the plan owner why you want to join..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[100px] resize-none"
            />
            <p className="text-sm text-muted-foreground">
              Add a personal note to increase your chances of being accepted
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Request"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, MapPin, Calendar, AlertCircle } from "lucide-react";
import { format } from "date-fns";

import { toast } from "sonner";
import { type ITravelPlanResponse } from "@/actions";
import { generateMatches } from "@/actions/matches/actions";

interface GenerateMatchesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  travelPlans: ITravelPlanResponse[];
}

export function GenerateMatchesModal({
  open,
  onOpenChange,
  travelPlans,
}: GenerateMatchesModalProps) {
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const selectedPlan = travelPlans.find((plan) => plan.id === selectedPlanId);

  const handleGenerate = () => {
    if (!selectedPlanId) {
      setError("Please select a travel plan");
      toast.error("Please select a travel plan");
      return;
    }

    setError("");
    startTransition(async () => {
      try {
        const result = await generateMatches(selectedPlanId);
        console.log("Generate matches result:", result);

        if (result.success) {
          const matchCount = result.data?.length || 0;
          if (matchCount > 0) {
            toast.success(
              `Successfully generated ${matchCount} match${
                matchCount === 1 ? "" : "es"
              }!`
            );
          } else {
            toast.info(
              "No matches found for this travel plan. Try again later!"
            );
          }
          onOpenChange(false);
          setSelectedPlanId("");

          // Refresh the page to show new matches
          window.location.reload();
        } else {
          const errorMsg = result.error || "Failed to generate matches";
          setError(errorMsg);
          toast.error(errorMsg);
        }
      } catch (err: any) {
        const errorMsg = err.message || "An unexpected error occurred";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Generate Travel Matches
          </DialogTitle>
          <DialogDescription>
            Find potential travel companions based on destination, dates, and
            interests.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Travel Plan</label>
            <Select
              value={selectedPlanId}
              onValueChange={(value) => {
                setSelectedPlanId(value);
                setError("");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a travel plan" />
              </SelectTrigger>
              <SelectContent>
                {travelPlans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{plan.destination}</span>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(plan.startDate), "MMM d")} -{" "}
                        {format(new Date(plan.endDate), "MMM d, yyyy")}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedPlan && (
            <div className="rounded-lg border p-3 space-y-2 bg-muted/50">
              <h4 className="font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {selectedPlan.destination}
              </h4>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  {format(new Date(selectedPlan.startDate), "MMM d, yyyy")} -{" "}
                  {format(new Date(selectedPlan.endDate), "MMM d, yyyy")}
                </span>
              </div>
              {selectedPlan.description && (
                <p className="text-sm pt-1">{selectedPlan.description}</p>
              )}
            </div>
          )}

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
          <Button
            onClick={handleGenerate}
            disabled={isPending || !selectedPlanId}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Matches"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

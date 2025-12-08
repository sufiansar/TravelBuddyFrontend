"use client";
import { Sparkles } from "lucide-react";
import type { ITravelPlanResponse } from "@/actions";
import { GenerateMatchesModal } from "./GenerateMatchesModal";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

interface MatchesClientProps {
  travelPlans: ITravelPlanResponse[];
}

export function MatchesClient({ travelPlans }: MatchesClientProps) {
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const hasPlans = travelPlans.length > 0;

  return (
    <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
      <Button
        onClick={() => setGenerateModalOpen(true)}
        className="gap-2"
        disabled={!hasPlans}
      >
        <Sparkles className="h-4 w-4" />
        Generate Matches
      </Button>

      {!hasPlans && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Create a travel plan to generate matches.</span>
          <Button variant="outline" size="sm" asChild>
            <Link href="/travel-plans/add">Add travel plan</Link>
          </Button>
        </div>
      )}

      <GenerateMatchesModal
        open={generateModalOpen}
        onOpenChange={setGenerateModalOpen}
        travelPlans={travelPlans}
      />
    </div>
  );
}

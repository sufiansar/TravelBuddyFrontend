"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { generateMatches } from "@/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface PlanMatchesClientProps {
  planId: string;
}

export function PlanMatchesClient({ planId }: PlanMatchesClientProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleGenerateMatches = () => {
    startTransition(async () => {
      const result = await generateMatches(planId);
      if (result.success) {
        toast.success(
          `Generated ${result.data?.length || 0} matches successfully!`
        );
        router.refresh(); // Refresh the page to show new matches
      } else {
        toast.error(result.error || "Failed to generate matches");
      }
    });
  };

  return (
    <Button
      onClick={handleGenerateMatches}
      disabled={isPending}
      className="gap-2"
    >
      <Sparkles className="h-4 w-4" />
      {isPending ? "Generating..." : "Generate New Matches"}
    </Button>
  );
}

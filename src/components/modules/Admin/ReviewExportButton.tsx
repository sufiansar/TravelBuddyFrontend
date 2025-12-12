"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ReviewExportButtonProps {
  reviews: any[];
}

export function ReviewExportButton({ reviews }: ReviewExportButtonProps) {
  const handleExport = () => {
    if (!reviews || reviews.length === 0) return;

    const csv = [
      ["Reviewer", "Receiver", "Rating", "Comment", "Date"],
      ...reviews.map((review: any) => [
        review.reviewer?.fullName || "Unknown",
        review.receiver?.fullName || "Unknown",
        review.rating,
        review.comment,
        new Date(review.createdAt).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.map((cell: any) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reviews-${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Button onClick={handleExport} variant="outline" className="gap-2">
      <Download className="w-4 h-4" />
      Export
    </Button>
  );
}

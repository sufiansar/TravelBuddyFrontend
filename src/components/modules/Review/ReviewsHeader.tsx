import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";

interface ReviewsHeaderProps {
  title: string;
  description: string;
  showBackButton?: boolean;
  showCreateButton?: boolean;
  createButtonHref?: string;
  createButtonLabel?: string;
  additionalContent?: React.ReactNode;
}

export function ReviewsHeader({
  title,
  description,
  showBackButton = false,
  showCreateButton = false,
  createButtonHref = "/reviews/create",
  createButtonLabel = "Write a Review",
  additionalContent,
}: ReviewsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground mt-2">{description}</p>
        {additionalContent}
      </div>

      <div className="flex gap-2">
        {showBackButton && (
          <Button variant="outline" size="sm" asChild className="gap-2">
            <Link href="/reviews">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
        )}
        {showCreateButton && (
          <Button asChild>
            <Link href={createButtonHref}>
              <Plus className="mr-2 h-4 w-4" />
              {createButtonLabel}
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

interface ReviewsEmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
}

export function ReviewsEmptyState({
  icon,
  title,
  description,
  action,
}: ReviewsEmptyStateProps) {
  return (
    <div className="text-center py-12 space-y-4">
      {icon}
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
        {action && (
          <Button className="mt-4" asChild>
            <Link href={action.href}>
              <Plus className="mr-2 h-4 w-4" />
              {action.label}
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}

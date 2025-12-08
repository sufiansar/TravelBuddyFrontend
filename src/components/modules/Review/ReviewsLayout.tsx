import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ReviewsHeader } from "./ReviewsHeader";
import { Suspense } from "react";
import { ReviewsListSkeleton } from "./ReviewsList";
import { ReviewsFilter } from "./ReviewsFilter";

interface ReviewsLayoutProps {
  children: React.ReactNode;
  headerProps: {
    title: string;
    description: string;
    showBackButton?: boolean;
    showCreateButton?: boolean;
    createButtonHref?: string;
    createButtonLabel?: string;
    additionalContent?: React.ReactNode;
  };
  showFilter?: boolean;
  showCardHeader?: boolean;
}

export function ReviewsLayout({
  children,
  headerProps,
  showFilter = true,
  showCardHeader = true,
}: ReviewsLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <ReviewsHeader {...headerProps} />

      <Card>
        {showCardHeader && (
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>All Reviews</CardTitle>
                <CardDescription>{headerProps.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
        )}
        <CardContent className="space-y-6">
          {showFilter && <ReviewsFilter />}

          <Suspense
            fallback={<ReviewsListSkeleton showHeader={showCardHeader} />}
          >
            {children}
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

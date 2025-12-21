import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Globe,
  User,
  Clock,
  MessageSquare,
} from "lucide-react";
import { format, differenceInDays } from "date-fns";

import { getServerSession } from "next-auth";
import { getTravelPlan } from "@/actions";
import { JoinRequestModal } from "@/components/modules/TravlePlan/JoinRequestModal";
import { TravelPlanDetailsHeader } from "./TravelPlanDetailsHeader";
import { TravelPlanDetailsGrid } from "./TravelPlanDetailsGrid";
import { TravelPlanDetailsStats } from "./TravelPlanDetailsStats";
import { TravelPlanDetailsActions } from "./TravelPlanDetailsActions";
import Image from "next/image";

interface TravelPlanDetailsProps {
  planId: string;
}

// Safe date parsing utility
const parseDate = (dateValue: any): Date => {
  if (dateValue instanceof Date) return dateValue;
  if (typeof dateValue === "string") return new Date(dateValue);
  return new Date();
};

// export async function TravelPlanDetails({ planId }: TravelPlanDetailsProps) {
//   const [planResult, session] = await Promise.all([
//     getTravelPlan(planId),
//     getServerSession(),
//   ]);

//   if (!planResult.success || !planResult.data) {
//     notFound();
//   }

//   const plan = planResult.data;
//   const isOwner = session?.user?.id === plan.userId;

//   const startDate = parseDate(plan.startDate);
//   const endDate = parseDate(plan.endDate);
//   const createdAt = parseDate(plan.createdAt);
//   const duration = differenceInDays(endDate, startDate) + 1;

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardContent className="p-6">
//           <div className="space-y-6">
//             {/* Header */}
//             <TravelPlanDetailsHeader plan={plan} isOwner={isOwner} />

//             {/* Details Grid */}
//             <TravelPlanDetailsGrid
//               startDate={startDate}
//               endDate={endDate}
//               duration={duration}
//               travelType={plan.travelType}
//               minBudget={plan.minBudget}
//               maxBudget={plan.maxBudget}
//             />

//             {/* Description */}
//             {plan.description && (
//               <div className="space-y-2">
//                 <h3 className="font-semibold text-lg">Description</h3>
//                 <p className="text-gray-700 whitespace-pre-wrap">
//                   {plan.description}
//                 </p>
//               </div>
//             )}

//             {/* Stats */}
//             <TravelPlanDetailsStats
//               matchesCount={plan.matches?.length || 0}
//               requestsCount={plan.requests?.length || 0}
//               reviewsCount={plan.reviews?.length || 0}
//             />

//             {/* Created Info */}
//             <div className="pt-4 border-t text-sm text-muted-foreground">
//               Created {format(createdAt, "MMM d, yyyy 'at' h:mm a")}
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Related Actions */}
//       <TravelPlanDetailsActions plan={plan} isOwner={isOwner} />
//     </div>
//   );
// }
export async function TravelPlanDetails({ planId }: TravelPlanDetailsProps) {
  const [planResult, session] = await Promise.all([
    getTravelPlan(planId),
    getServerSession(),
  ]);

  if (!planResult.success || !planResult.data) {
    notFound();
  }

  const plan = planResult.data;
  const isOwner = session?.user?.id === plan.userId;

  const startDate = parseDate(plan.startDate);
  const endDate = parseDate(plan.endDate);
  const createdAt = parseDate(plan.createdAt);
  const duration = differenceInDays(endDate, startDate) + 1;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
      <Card className="overflow-hidden shadow-md">
        {/* Image at the top */}
        <div className="relative w-full h-64 sm:h-80">
          {plan.imageUrl ? (
            <Image
              src={plan.imageUrl}
              alt={plan.destination}
              fill
              sizes="(max-width: 640px) 100vw,
                     (max-width: 1024px) 50vw,
                     33vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground">
              No image available
            </div>
          )}
        </div>

        <CardContent className="p-5 sm:p-8">
          <div className="space-y-8">
            {/* Header */}
            <div className="border-b pb-6">
              <TravelPlanDetailsHeader plan={plan} isOwner={isOwner} />
            </div>

            {/* Details Grid */}
            <div className="bg-muted/40 rounded-xl p-4 sm:p-6">
              <TravelPlanDetailsGrid
                startDate={startDate}
                endDate={endDate}
                duration={duration}
                travelType={plan.travelType}
                minBudget={plan.minBudget}
                maxBudget={plan.maxBudget}
              />
            </div>

            {/* Description */}
            {plan.description && (
              <section className="space-y-3">
                <h3 className="text-lg font-semibold tracking-tight">
                  About this trip
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {plan.description}
                </p>
              </section>
            )}

            {/* Stats */}
            <section className="pt-2">
              <TravelPlanDetailsStats
                matchesCount={plan.matches?.length || 0}
                requestsCount={plan.requests?.length || 0}
                reviewsCount={plan.reviews?.length || 0}
              />
            </section>

            {/* Footer */}
            <div className="pt-4 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-muted-foreground">
              <span>
                Created {format(createdAt, "MMM d, yyyy 'at' h:mm a")}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="sticky bottom-0 sm:static bg-background sm:bg-transparent py-4 sm:py-0 border-t sm:border-none">
        <TravelPlanDetailsActions plan={plan} isOwner={isOwner} />
      </div>
    </div>
  );
}

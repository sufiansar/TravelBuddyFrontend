"use client";

import { useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Globe,
  MoreVertical,
  Edit,
  Trash2,
  Clock,
  User,
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

import { TravelPlan } from "@/types/travlePlan.interface";
import { deleteTravelPlan } from "@/actions";
import { JoinRequestModal } from "./JoinRequestModal";
import Image from "next/image";

interface TravelPlanCardProps {
  plan: TravelPlan;
  showActions?: boolean;
  onEdit?: (plan: TravelPlan) => void;
  onDelete?: (id: string) => void;
  variant?: "default" | "compact";
}

export function TravelPlanCard({
  plan,
  showActions = false,
  onEdit,
  onDelete,
  variant = "default",
}: TravelPlanCardProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  console.log(plan);

  const isOwner = session?.user?.id === plan.userId;
  const hasBudget = plan.minBudget || plan.maxBudget;
  const duration =
    differenceInDays(new Date(plan.endDate), new Date(plan.startDate)) + 1;

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteTravelPlan(plan.id);
      if (result.success) {
        toast.success("Travel plan deleted successfully");
        onDelete?.(plan.id);
      } else {
        toast.error(result.error || "Failed to delete travel plan");
      }
      setIsDeleteDialogOpen(false);
    });
  };

  const handleViewDetails = () =>
    router.push(`/dashboard/travel-plans/${plan.id}`);

  if (variant === "compact") {
    return (
      <Card
        className="hover:shadow-sm transition-shadow cursor-pointer"
        onClick={handleViewDetails}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold text-lg">{plan.destination}</h3>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {format(new Date(plan.startDate), "MMM d")} -{" "}
                    {format(new Date(plan.endDate), "MMM d, yyyy")}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{duration} days</span>
                </div>
              </div>
            </div>
            <Badge
              variant={plan.isPublic === "PUBLIC" ? "default" : "secondary"}
            >
              {plan.isPublic}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="flex flex-col h-full hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden">
        <div className="relative w-full h-44 overflow-hidden bg-muted">
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
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
              No image available
            </div>
          )}
        </div>
        {/* Header */}
        <CardHeader className="pb-3 pt-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-xl">{plan.destination}</h3>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>By {plan.user?.fullName || "Unknown"}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(new Date(plan.startDate), "MMM d, yyyy")} -{" "}
                    {format(new Date(plan.endDate), "MMM d, yyyy")}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{duration} days</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant={plan.isPublic === "PUBLIC" ? "default" : "secondary"}
              >
                <Globe className="h-3 w-3 mr-1" />
                {plan.isPublic}
              </Badge>

              {showActions && isOwner && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit?.(plan)}>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => setIsDeleteDialogOpen(true)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </CardHeader>

        {/* Content grows */}
        <CardContent className="flex-1 space-y-4">
          {plan.description && (
            <p className="text-gray-700 dark:text-gray-200 line-clamp-3">
              {plan.description}
            </p>
          )}

          <div className="flex flex-wrap gap-2 pt-3">
            <Badge variant="outline" className="gap-1">
              <Users className="h-3 w-3" />
              {plan.travelType}
            </Badge>

            {hasBudget && (
              <Badge variant="outline" className="gap-1">
                <DollarSign className="h-3 w-3" />
                {plan.minBudget && plan.maxBudget
                  ? `$${plan.minBudget} - $${plan.maxBudget}`
                  : plan.minBudget
                  ? `From $${plan.minBudget}`
                  : `Up to $${plan.maxBudget}`}
              </Badge>
            )}

            {plan.matches && plan.matches.length > 0 && (
              <Badge variant="secondary">{plan.matches.length} matches</Badge>
            )}

            {plan.requests && plan.requests.length > 0 && (
              <Badge variant="secondary">{plan.requests.length} requests</Badge>
            )}
          </div>
        </CardContent>

        {/* Footer pinned bottom */}
        <CardFooter className="border-t pt-4">
          <div className="flex gap-2 ml-auto">
            {!isOwner && plan.isPublic === "PUBLIC" && (
              <Button
                size="sm"
                onClick={() => setIsRequestModalOpen(true)}
                disabled={isPending}
              >
                Request to Join
              </Button>
            )}

            <Button size="sm" variant="outline" onClick={handleViewDetails}>
              View Details
            </Button>

            {isOwner && (
              <Button size="sm" variant="outline" asChild>
                <Link href={`/dashboard/travel-plans/${plan.id}/requests`}>
                  View Requests
                </Link>
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      {/* Delete Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Travel Plan</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this travel plan? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Join Request Modal */}
      {!isOwner && (
        <JoinRequestModal
          open={isRequestModalOpen}
          onOpenChange={setIsRequestModalOpen}
          travelPlanId={plan.id}
          travelPlanDestination={plan.destination}
        />
      )}
    </>
  );
}

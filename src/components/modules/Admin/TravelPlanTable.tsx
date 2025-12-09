"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Trash2, Globe, Lock } from "lucide-react";

import { format } from "date-fns";

import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TravelPlan, TravelType } from "@/types/admin.interface";
import { deleteTravelPlan } from "@/actions";
import { Pagination } from "@/components/Shared/Pagination";

interface TravelPlanTableProps {
  plans: TravelPlan[];
  meta?: {
    page: number;
    limit: number;
    totalPage: number;
    total: number;
  };
  currentFilters?: Record<string, any>;
}

export function TravelPlanTable({
  plans,
  meta,
  currentFilters,
}: TravelPlanTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (planId: string) => {
    try {
      setDeletingId(planId);
      const result = await deleteTravelPlan(planId);

      if (result.success) {
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to delete travel plan:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const getTravelTypeColor = (type: TravelType) => {
    switch (type) {
      case TravelType.ADVENTURE:
        return "bg-red-100 text-red-800";
      case TravelType.BEACH:
        return "bg-cyan-100 text-cyan-800";
      case TravelType.FRIENDS:
        return "bg-indigo-100 text-indigo-800";
      case TravelType.CITY_TOUR:
        return "bg-orange-100 text-orange-800";
      case TravelType.CULTURAL:
        return "bg-amber-100 text-amber-800";
      case TravelType.HIKING:
        return "bg-lime-100 text-lime-800";
      case TravelType.ROAD_TRIP:
        return "bg-teal-100 text-teal-800";
      case TravelType.SKI_SNOWBOARD:
        return "bg-slate-100 text-slate-800";
      case TravelType.BACKPACKING:
        return "bg-emerald-100 text-emerald-800";
      case TravelType.LUXURY:
        return "bg-yellow-100 text-yellow-800";
      case TravelType.BUSINESS:
        return "bg-yellow-100 text-yellow-800";
      case TravelType.FAMILY:
        return "bg-purple-100 text-purple-800";
      case TravelType.SOLO:
        return "bg-blue-100 text-blue-800";
      case TravelType.COUPLE:
        return "bg-pink-100 text-pink-800";
      case TravelType.GROUP:
        return "bg-green-100 text-green-800";
      case TravelType.OTHER:
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Destination</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No travel plans found.
                </TableCell>
              </TableRow>
            ) : (
              plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell>
                    <div className="font-medium">{plan.destination}</div>
                    <div className="text-sm text-gray-500 line-clamp-1">
                      {plan.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{plan.user.fullName}</div>
                      <div className="text-sm text-gray-500">
                        {plan.user.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={getTravelTypeColor(plan.travelType)}
                    >
                      {plan.travelType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {format(new Date(plan.startDate), "MMM d")} -{" "}
                      {format(new Date(plan.endDate), "MMM d, yyyy")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      ${plan?.budget?.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    {plan.isPublic ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <Globe className="h-4 w-4" />
                        <span className="text-sm">Public</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-gray-600">
                        <Lock className="h-4 w-4" />
                        <span className="text-sm">Private</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {format(new Date(plan.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Plan
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Travel Plan
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this travel
                                plan? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(plan.id)}
                                className="bg-red-600 hover:bg-red-700"
                                disabled={deletingId === plan.id}
                              >
                                {deletingId === plan.id
                                  ? "Deleting..."
                                  : "Delete"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {meta && meta.totalPage > 1 && (
        <Pagination
          currentPage={meta.page}
          totalPages={meta.totalPage}
          onPageChange={(page) => {
            const params = new URLSearchParams(currentFilters || {});
            params.set("page", page.toString());
            router.push(`?${params.toString()}`);
          }}
        />
      )}
    </div>
  );
}

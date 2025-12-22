"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import { toast } from "sonner";
import { TravelPlan } from "@/types/travlePlan.interface";
import { createTravelPlan, updateTravelPlan } from "@/actions";
import { travelPlanFormSchema } from "@/components/zod/travle.validation";

type TravelPlanFormValues = z.infer<typeof travelPlanFormSchema>;

interface TravelPlanFormProps {
  travelPlanToEdit?: TravelPlan;
  onSuccess?: () => void;
}

export function TravelPlanForm({
  travelPlanToEdit,
  onSuccess,
}: TravelPlanFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const form = useForm<TravelPlanFormValues>({
    resolver: zodResolver(travelPlanFormSchema),
    defaultValues: {
      destination: travelPlanToEdit?.destination || "",
      startDate: travelPlanToEdit?.startDate
        ? new Date(travelPlanToEdit.startDate)
        : undefined,
      endDate: travelPlanToEdit?.endDate
        ? new Date(travelPlanToEdit.endDate)
        : undefined,
      minBudget: travelPlanToEdit?.minBudget ?? undefined,
      maxBudget: travelPlanToEdit?.maxBudget ?? undefined,
      travelType: travelPlanToEdit?.travelType || "",
      description: travelPlanToEdit?.description || "",
      isPublic:
        (travelPlanToEdit?.isPublic as "PUBLIC" | "PRIVATE") || "PUBLIC",
      imageUrl: travelPlanToEdit?.imageUrl || undefined,
    },
  });

  const travelTypes = [
    "ADVENTURE",
    "BEACH",
    "FRIENDS",
    "CITY_TOUR",
    "CULTURAL",
    "HIKING",
    "ROAD_TRIP",
    "SKI_SNOWBOARD",
    "BACKPACKING",
    "LUXURY",
    "BUSINESS",
    "FAMILY",
    "SOLO",
    "COUPLE",
    "GROUP",
    "OTHER",
  ];

  const onSubmit = (values: TravelPlanFormValues) => {
    setError("");
    startTransition(async () => {
      try {
        let result;
        if (travelPlanToEdit) {
          const formData = new FormData();
          formData.append("destination", values.destination);
          formData.append("travelType", values.travelType);
          formData.append("startDate", values.startDate.toISOString());
          formData.append("endDate", values.endDate.toISOString());
          formData.append("isPublic", values.isPublic);
          if (values.minBudget !== undefined)
            formData.append("minBudget", String(values.minBudget));
          if (values.maxBudget !== undefined)
            formData.append("maxBudget", String(values.maxBudget));
          if (values.description)
            formData.append("description", values.description);
          if (values.imageUrl instanceof File) {
            formData.append("image", values.imageUrl);
          }
          result = await updateTravelPlan(travelPlanToEdit.id, formData as any);
          if (result.success) {
            toast.success("Travel plan updated successfully");
            onSuccess?.();
            router.push(`/dashboard/travel-plans/${travelPlanToEdit.id}`);
          } else {
            setError(result.error || "Failed to update travel plan");
          }
        } else {
          result = await createTravelPlan({
            destination: values.destination,
            travelType: values.travelType as any,
            startDate: values.startDate,
            endDate: values.endDate,
            isPublic: values.isPublic,
            minBudget: values.minBudget,
            maxBudget: values.maxBudget,
            description: values.description,
            imageUrl: values.imageUrl as any,
          });
          if (result.success) {
            toast.success("Travel plan created successfully");
            onSuccess?.();
            const planId = result?.data?.id || result?.data?._id;
            if (planId) {
              router.push(`/dashboard/travel-plans/${planId}`);
            } else {
              console.error("No plan ID in response:", result.data);
              setError("Failed to retrieve created plan ID");
            }
          } else {
            setError(result.error || "Failed to create travel plan");
          }
        }
      } catch (error) {
        console.error("Error submitting travel plan:", error);
        setError("An unexpected error occurred");
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Destination & Travel Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="destination"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Destination *</FormLabel>
                <FormControl>
                  <Input placeholder="Where are you going?" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="travelType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Travel Type *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select travel type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {travelTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Budget */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="minBudget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Budget (Optional)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <Input
                      type="number"
                      placeholder="0"
                      className="pl-8"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? parseInt(e.target.value) : ""
                        )
                      }
                    />
                  </div>
                </FormControl>
                <FormDescription>Leave empty if flexible</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maxBudget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Budget (Optional)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <Input
                      type="number"
                      placeholder="0"
                      className="pl-8"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? parseInt(e.target.value) : ""
                        )
                      }
                    />
                  </div>
                </FormControl>
                <FormDescription>Leave empty if flexible</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell others about your travel plans, interests, expectations..."
                  className="min-h-[120px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Share details about your trip, activities planned, etc.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Visibility */}
        <FormField
          control={form.control}
          name="isPublic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Visibility</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="PUBLIC">
                    Public (Anyone can see)
                  </SelectItem>
                  <SelectItem value="PRIVATE">
                    Private (Only you can see)
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Public plans can be discovered by other travelers
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image Upload */}
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={isPending} className="flex-1">
            {isPending
              ? travelPlanToEdit
                ? "Updating..."
                : "Creating..."
              : travelPlanToEdit
              ? "Update Travel Plan"
              : "Create Travel Plan"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isPending}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}

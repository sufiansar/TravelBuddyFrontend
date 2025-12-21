"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Star } from "lucide-react";
import { cn } from "@/lib/utils";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { CreateReviewData } from "@/types/review.types";
import { createReview, updateReview } from "@/actions";

const reviewFormSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10).max(1000),
  receiverId: z.string().min(1, "Please select a user"),
  travelPlanId: z.string().optional(),
});

interface ReviewFormProps {
  receiverId?: string;
  travelPlanId?: string;
  users?: Array<{ id: string; fullName: string; username: string }>;
  travelPlans?: Array<{ id: string; destination: string; endDate: string }>;
  reviewToEdit?: any;
  onSuccess?: () => void;
}

export function ReviewForm({
  receiverId,
  travelPlanId,
  users = [],
  travelPlans = [],
  reviewToEdit,
  onSuccess,
}: ReviewFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof reviewFormSchema>>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      rating: reviewToEdit?.rating || 0,
      comment: reviewToEdit?.comment || "",
      receiverId: receiverId || reviewToEdit?.receiverId || "",
      travelPlanId: travelPlanId || reviewToEdit?.travelPlanId || "",
    },
  });

  const onSubmit = (values: z.infer<typeof reviewFormSchema>) => {
    setError("");
    startTransition(async () => {
      const data: CreateReviewData = {
        rating: values.rating,
        comment: values.comment,
        receiverId: values.receiverId,
        // Only include travelPlanId if it's not empty or 'none'
        travelPlanId:
          values.travelPlanId &&
          values.travelPlanId !== "" &&
          values.travelPlanId !== "none"
            ? values.travelPlanId
            : undefined,
      };

      if (reviewToEdit) {
        const result = await updateReview(reviewToEdit.id, data);
        if (result.success) {
          toast.success("Review updated successfully");
          onSuccess?.();
          router.refresh();
        } else {
          setError(result.error || "Failed to update review");
        }
      } else {
        const result = await createReview(data);
        if (result.success) {
          toast.success("Review created successfully");
          onSuccess?.();
          router.push(`/dashboard/reviews/user/${values.receiverId}`);
        } else {
          const errorMsg = result.error || "Failed to create review";
          setError(errorMsg);
          toast.error(errorMsg);
        }
      }
    });
  };

  const rating = form.watch("rating");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!receiverId && users.length > 0 && (
          <FormField
            control={form.control}
            name="receiverId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User to Review</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a user to review" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.fullName} (@{user.username})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {!travelPlanId && (
          <FormField
            control={form.control}
            name="travelPlanId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Travel Plan (Optional)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={travelPlans.length === 0}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          travelPlans.length === 0
                            ? "No completed travel plans available"
                            : "Select associated travel plan"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {travelPlans.length > 0 && (
                      <SelectItem value="none">None</SelectItem>
                    )}
                    {travelPlans.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.destination} (ended{" "}
                        {new Date(plan.endDate).toLocaleDateString()})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  {travelPlans.length === 0
                    ? "You need to have completed travel plans to link reviews to them"
                    : "Select a completed travel plan if this review is related to it"}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
              <FormControl>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Button
                      key={value}
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "h-10 w-10 p-0",
                        field.value >= value && "text-yellow-400"
                      )}
                      onClick={() => field.onChange(value)}
                    >
                      <Star
                        className={cn(
                          "h-6 w-6",
                          field.value >= value && "fill-yellow-400"
                        )}
                      />
                    </Button>
                  ))}
                </div>
              </FormControl>
              <FormDescription>
                Click on stars to rate (1 = Poor, 5 = Excellent)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Review Comment</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share your experience..."
                  className="min-h-[120px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Minimum 10 characters, maximum 1000 characters
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3">
          <Button type="submit" disabled={isPending}>
            {isPending
              ? reviewToEdit
                ? "Updating..."
                : "Creating..."
              : reviewToEdit
              ? "Update Review"
              : "Create Review"}
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

// src/components/payment/SubscriptionStatus.tsx
"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Calendar,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

import { format, differenceInDays, isAfter, parseISO } from "date-fns";
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
} from "@/components/ui/alert-dialog";

interface SubscriptionStatusProps {
  subscription?: Subscription | null;
}

export function SubscriptionStatus({ subscription }: SubscriptionStatusProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Active Subscription</CardTitle>
          <CardDescription>
            You don't have an active subscription. Subscribe to unlock premium
            features.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => router.push("/payments")}>
            View Subscription Plans
          </Button>
        </CardContent>
      </Card>
    );
  }

  const startDate = parseISO(subscription.startDate);
  const endDate = parseISO(subscription.endDate);
  const isActive = subscription.isActive;
  const daysUntilExpiry = differenceInDays(endDate, new Date());
  const isExpiringSoon = daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  const isExpired = !isAfter(endDate, new Date());

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount / 100);
  };

  const getStatusBadge = () => {
    if (!isActive || isExpired) {
      return (
        <Badge variant="destructive" className="gap-1">
          <XCircle className="h-3 w-3" />
          Inactive
        </Badge>
      );
    }

    if (isExpiringSoon) {
      return (
        <Badge
          variant="outline"
          className="text-amber-600 border-amber-200 gap-1"
        >
          <AlertTriangle className="h-3 w-3" />
          Expiring Soon
        </Badge>
      );
    }

    return (
      <Badge variant="default" className="gap-1 bg-green-600">
        <CheckCircle className="h-3 w-3" />
        Active
      </Badge>
    );
  };

  const handleCancelSubscription = async () => {
    try {
      setLoading(true);
      const result = await cancelSubscription();

      if (result.success) {
        router.refresh();
        setShowCancelDialog(false);
      }
    } catch (error) {
      console.error("Failed to cancel subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Subscription Details</CardTitle>
                <CardDescription>
                  Manage your subscription and billing information
                </CardDescription>
              </div>
              {getStatusBadge()}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <CreditCard className="h-4 w-4" />
                  Current Plan
                </div>
                <div className="text-xl font-bold capitalize">
                  {subscription.plan.toLowerCase()}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  Billing Period
                </div>
                <div className="text-xl font-bold">
                  {subscription.plan === "YEARLY" ? "Annual" : "Monthly"}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <CreditCard className="h-4 w-4" />
                  Amount
                </div>
                <div className="text-xl font-bold">
                  {formatCurrency(subscription.price)}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  Renewal Date
                </div>
                <div className="text-xl font-bold">
                  {format(endDate, "MMM d, yyyy")}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Subscription Period
                  </span>
                  <span className="font-medium">
                    {format(startDate, "MMM d, yyyy")} -{" "}
                    {format(endDate, "MMM d, yyyy")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Days Remaining</span>
                  <span
                    className={cn(
                      "font-medium",
                      daysUntilExpiry <= 3
                        ? "text-red-600"
                        : daysUntilExpiry <= 7
                        ? "text-amber-600"
                        : "text-green-600"
                    )}
                  >
                    {daysUntilExpiry > 0
                      ? `${daysUntilExpiry} days`
                      : "Expired"}
                  </span>
                </div>
                {subscription.stripeSubscriptionId && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Stripe ID</span>
                    <span className="font-mono text-sm">
                      {subscription.stripeSubscriptionId.slice(0, 8)}...
                    </span>
                  </div>
                )}
              </div>
            </div>

            {isExpiringSoon && (
              <Alert variant="default">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Subscription Expiring Soon</AlertTitle>
                <AlertDescription>
                  Your subscription will expire in {daysUntilExpiry} days. Renew
                  to continue enjoying premium features.
                </AlertDescription>
              </Alert>
            )}

            {isExpired && (
              <Alert variant="destructive">
                <Clock className="h-4 w-4" />
                <AlertTitle>Subscription Expired</AlertTitle>
                <AlertDescription>
                  Your subscription has expired. Subscribe again to regain
                  access to premium features.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => router.push("/payments")}
              >
                Change Plan
              </Button>

              {isActive && !isExpired && (
                <Button
                  variant="destructive"
                  onClick={() => setShowCancelDialog(true)}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    "Cancel Subscription"
                  )}
                </Button>
              )}

              {isExpired && (
                <Button onClick={() => router.push("/payments")}>
                  Renew Subscription
                </Button>
              )}

              {subscription.stripeSubscriptionId && (
                <Button
                  variant="outline"
                  onClick={() => {
                    // Redirect to Stripe customer portal
                    window.open(
                      "https://billing.stripe.com/p/login/test_00g5mI5kWeUV8tK3cc",
                      "_blank"
                    );
                  }}
                >
                  Manage in Stripe
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {isActive && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Cancellation Policy</AlertTitle>
            <AlertDescription>
              When you cancel, you'll continue to have access until the end of
              your current billing period. No refunds are provided for partial
              months.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel your subscription? You'll continue
              to have access until {format(endDate, "MMMM d, yyyy")}. After
              that, you'll lose access to premium features.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>
              Keep Subscription
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelSubscription}
              className="bg-red-600 hover:bg-red-700"
              disabled={loading}
            >
              {loading ? "Cancelling..." : "Confirm Cancellation"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

import { cn } from "@/lib/utils";
import { Subscription } from "@/types/payment.interface";
import { cancelSubscription } from "@/actions";

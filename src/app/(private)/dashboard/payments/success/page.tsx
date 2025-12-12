"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle, Clock, ExternalLink } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { verifySession } from "@/actions";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      setError("No session ID found");
      setLoading(false);
      return;
    }

    const verify = async () => {
      try {
        const response = await verifySession(sessionId);

        if (!response.success) {
          throw new Error(response.error || "Failed to verify session");
        }

        setResult(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <div>
                <h3 className="text-lg font-semibold">
                  Verifying your payment
                </h3>
                <p className="text-gray-600">
                  Please wait while we confirm your subscription...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-6 w-6" />
              Payment Verification Failed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">{error}</p>
            {result?.checkoutUrl && (
              <Alert>
                <AlertTitle>Complete Your Payment</AlertTitle>
                <AlertDescription>
                  Your payment is still pending. Click the button below to
                  complete the checkout process.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3">
            <Button onClick={() => router.push("/payments")}>
              Back to Plans
            </Button>
            {result?.checkoutUrl && (
              <Button
                variant="outline"
                onClick={() => (window.location.href = result.checkoutUrl)}
                className="gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Complete Payment
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    );
  }

  const { success, subscription, user, paymentStatus } = result;

  if (!success) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-600">
              <Clock className="h-6 w-6" />
              Payment {paymentStatus || "Pending"}
            </CardTitle>
            <CardDescription>
              Your payment is being processed. Please check back in a few
              minutes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700">
                If you've completed the payment, it may take a few moments to
                process. You'll receive a confirmation email once it's complete.
              </p>

              {result.checkoutUrl && (
                <Alert>
                  <AlertTitle>Payment Not Completed</AlertTitle>
                  <AlertDescription>
                    It looks like you haven't completed the checkout process.
                    Click below to finish your payment.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3">
            <Button onClick={() => router.push("/payments")}>
              Back to Plans
            </Button>
            {result.checkoutUrl && (
              <Button
                variant="outline"
                onClick={() => (window.location.href = result.checkoutUrl)}
                className="gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Complete Payment
              </Button>
            )}
            <Button variant="ghost" onClick={() => router.push("/profile")}>
              Go to Profile
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <CardDescription>
            Thank you for subscribing to TravelBuddy Pro
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Subscription Plan</span>
              <span className="font-bold capitalize">
                {subscription?.plan?.toLowerCase()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Status</span>
              <Badge variant="default" className="bg-green-600">
                Active
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Verified Badge</span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {user?.verifiedBadge ? "Active" : "Pending"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Transaction ID</span>
              <span className="font-mono text-sm">
                {sessionId?.slice(0, 8)}...
              </span>
            </div>
          </div>

          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Welcome to TravelBuddy Pro!</AlertTitle>
            <AlertDescription>
              You now have access to all premium features. Start exploring your
              enhanced travel planning experience.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <h4 className="font-medium">What's Next?</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                Your premium features are now active
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                You'll receive a confirmation email shortly
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                The verified badge will appear on your profile
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                Manage your subscription from the payments page
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3">
          <Button onClick={() => router.push("/dashboard")} className="flex-1">
            Go to Dashboard
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/profile")}
            className="flex-1"
          >
            View Profile
          </Button>
          <Button
            variant="ghost"
            onClick={() => router.push("/payments")}
            className="flex-1"
          >
            Manage Subscription
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

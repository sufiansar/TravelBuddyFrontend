"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, CreditCard } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function PaymentCancelPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
          <CardTitle className="text-2xl">Payment Cancelled</CardTitle>
          <CardDescription>Your payment was not completed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="destructive">
            <AlertTitle>Checkout Cancelled</AlertTitle>
            <AlertDescription>
              You cancelled the checkout process. No charges were made to your
              account.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h4 className="font-medium">Why did this happen?</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                You closed the checkout window
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                Your payment method was declined
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                There was an error with the payment processor
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                You decided not to complete the purchase
              </li>
            </ul>
          </div>

          <Alert>
            <CreditCard className="h-4 w-4" />
            <AlertTitle>Need help?</AlertTitle>
            <AlertDescription>
              If you encountered any issues during checkout, please contact our
              support team or try using a different payment method.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => router.push("/payments")}
            className="gap-2 flex-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Plans
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/support")}
            className="flex-1"
          >
            Contact Support
          </Button>
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard")}
            className="flex-1"
          >
            Go to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

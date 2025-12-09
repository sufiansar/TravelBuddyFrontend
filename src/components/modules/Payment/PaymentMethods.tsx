// src/components/payment/PaymentMethods.tsx
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
import { CreditCard, Plus, Trash2, Check, AlertTriangle } from "lucide-react";

interface PaymentMethod {
  id: string;
  type: "card" | "paypal" | "bank";
  last4?: string;
  brand?: string;
  expiry?: string;
  isDefault: boolean;
}

export function PaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "card",
      last4: "4242",
      brand: "Visa",
      expiry: "12/25",
      isDefault: true,
    },
    {
      id: "2",
      type: "card",
      last4: "8888",
      brand: "Mastercard",
      expiry: "06/24",
      isDefault: false,
    },
  ]);

  const [addingNew, setAddingNew] = useState(false);

  const handleSetDefault = (id: string) => {
    setPaymentMethods((methods) =>
      methods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
  };

  const handleDelete = (id: string) => {
    if (paymentMethods.find((m) => m.id === id)?.isDefault) {
      alert(
        "Cannot delete default payment method. Set another method as default first."
      );
      return;
    }
    setPaymentMethods((methods) => methods.filter((m) => m.id !== id));
  };

  const getMethodIcon = (type: string) => {
    switch (type) {
      case "card":
        return "💳";
      case "paypal":
        return "🔵";
      case "bank":
        return "🏦";
      default:
        return "💰";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Manage your saved payment methods</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAddingNew(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {addingNew && (
          <Alert>
            <AlertTitle>Add Payment Method</AlertTitle>
            <AlertDescription>
              To add a new payment method, please complete a subscription
              purchase. New payment methods are added automatically during
              checkout.
            </AlertDescription>
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAddingNew(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="ml-2"
                onClick={() => (window.location.href = "/payments")}
              >
                Go to Plans
              </Button>
            </div>
          </Alert>
        )}

        {paymentMethods.length === 0 ? (
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No payment methods saved</p>
            <p className="text-sm text-gray-400 mt-2">
              Add a payment method during checkout
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl">{getMethodIcon(method.type)}</div>
                  <div>
                    <div className="font-medium">
                      {method.brand} •••• {method.last4}
                    </div>
                    <div className="text-sm text-gray-500">
                      Expires {method.expiry}
                    </div>
                  </div>
                  {method.isDefault && (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800"
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Default
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {!method.isDefault && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSetDefault(method.id)}
                      >
                        Set Default
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(method.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Security Notice</AlertTitle>
          <AlertDescription>
            Your payment information is securely processed by Stripe. We never
            store your full card details on our servers.
          </AlertDescription>
        </Alert>

        <div className="text-sm text-gray-500">
          <p>Supported payment methods:</p>
          <div className="flex items-center gap-4 mt-2">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>American Express</span>
            <span>Discover</span>
            <span>PayPal</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

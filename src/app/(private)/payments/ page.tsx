import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, CreditCard, History, Settings } from "lucide-react";
import { getSubscriptionStatus } from "@/actions";
import { PaymentPlans } from "@/components/modules/Payment/PaymentPlans";
import { SubscriptionStatus } from "@/components/modules/Payment/SubscriptionStatus";
import { PaymentHistory } from "@/components/modules/Payment/PaymentHistory";
import { PaymentMethods } from "@/components/modules/Payment/PaymentMethods";
import { BillingInfo } from "@/components/modules/Payment/BillingInfo";

export default async function PaymentsPage() {
  const subscriptionResult = await getSubscriptionStatus();
  // console.log(subscriptionResult);
  const subscription = subscriptionResult.success
    ? subscriptionResult.data
    : null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Billing & Payments
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your subscription, payment methods, and billing history
        </p>
      </div>

      <Tabs defaultValue="plans" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="plans" className="gap-2">
            <Shield className="h-4 w-4" />
            Plans
          </TabsTrigger>
          <TabsTrigger value="status" className="gap-2">
            <CreditCard className="h-4 w-4" />
            Subscription
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="h-4 w-4" />
            History
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-2">
            <Settings className="h-4 w-4" />
            Billing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Choose Your Plan</CardTitle>
              <CardDescription>
                Select a subscription plan that fits your needs. All plans
                include premium features.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentPlans currentSubscription={subscription} />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What's Included</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    Premium travel plan templates
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    Unlimited travel plan creation
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    Advanced collaboration tools
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    Priority customer support
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    Verified badge on profile
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    Early access to new features
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">FAQ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium">Can I cancel anytime?</h4>
                  <p className="text-sm text-gray-600">
                    Yes, you can cancel your subscription at any time. You'll
                    continue to have access until the end of your billing
                    period.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Is there a free trial?</h4>
                  <p className="text-sm text-gray-600">
                    We don't offer a free trial, but we have a 30-day money-back
                    guarantee if you're not satisfied.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">
                    What payment methods do you accept?
                  </h4>
                  <p className="text-sm text-gray-600">
                    We accept all major credit cards through Stripe. Your
                    payment information is securely processed.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="status" className="space-y-6">
          <SubscriptionStatus subscription={subscription} />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <PaymentHistory />
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PaymentMethods />
            <BillingInfo />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

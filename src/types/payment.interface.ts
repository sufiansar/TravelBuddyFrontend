export type Plan = "MONTHLY" | "YEARLY";

export interface Subscription {
  id: string;
  plan: Plan;
  startDate: string;
  endDate: string;
  isActive: boolean;
  price: number;
  userId: string;
  stripeSubscriptionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  amount: number;
  status: "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";
  transactionId: string;
  stripePaymentIntentId?: string;
  stripeSessionId?: string;
  purpose: string;
  userId: string;
  subscriptionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutSessionResponse {
  url: string;
  sessionId: string;
}

export interface VerifySessionResponse {
  success: boolean;
  message?: string;
  paymentStatus?: string;
  checkoutUrl?: string;
  subscription?: Subscription;
  user?: {
    id: string;
    verifiedBadge: boolean;
    email: string;
  };
  session?: {
    id: string;
    status: string;
    payment_status: string;
  };
}

export interface PaymentPlan {
  id: Plan;
  name: string;
  description: string;
  price: number; // in cents
  interval: string;
  features: string[];
  popular?: boolean;
  savings?: string;
}

// src/components/payment/BillingInfo.tsx
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Mail, MapPin, User, Building, Phone, Save } from "lucide-react";
import { AlertTriangle } from "lucide-react";

export function BillingInfo() {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [billingInfo, setBillingInfo] = useState({
    fullName: "John Doe",
    email: "john@example.com",
    company: "Acme Inc",
    address: "123 Main Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States",
    phone: "+1 (555) 123-4567",
    taxId: "12-3456789",
  });

  const handleChange = (field: string, value: string) => {
    setBillingInfo((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Failed to save billing info:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing Information</CardTitle>
        <CardDescription>
          Update your billing address and contact information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {saved && (
          <Alert variant="default" className="bg-green-50 border-green-200">
            <AlertTitle className="text-green-800">
              Billing information saved!
            </AlertTitle>
            <AlertDescription className="text-green-700">
              Your billing information has been updated successfully.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Full Name
            </Label>
            <Input
              id="fullName"
              value={billingInfo.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={billingInfo.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Company (Optional)
            </Label>
            <Input
              id="company"
              value={billingInfo.company}
              onChange={(e) => handleChange("company", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone Number
            </Label>
            <Input
              id="phone"
              value={billingInfo.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Street Address
          </Label>
          <Input
            id="address"
            value={billingInfo.address}
            onChange={(e) => handleChange("address", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={billingInfo.city}
              onChange={(e) => handleChange("city", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State/Province</Label>
            <Input
              id="state"
              value={billingInfo.state}
              onChange={(e) => handleChange("state", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="zipCode">ZIP/Postal Code</Label>
            <Input
              id="zipCode"
              value={billingInfo.zipCode}
              onChange={(e) => handleChange("zipCode", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={billingInfo.country}
              onChange={(e) => handleChange("country", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="taxId">Tax ID (Optional)</Label>
            <Input
              id="taxId"
              value={billingInfo.taxId}
              onChange={(e) => handleChange("taxId", e.target.value)}
              placeholder="e.g., 12-3456789"
            />
          </div>
        </div>

        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Important</AlertTitle>
          <AlertDescription>
            This information will be used for invoicing and tax purposes. Please
            ensure it's accurate.
          </AlertDescription>
        </Alert>

        <div className="pt-4">
          <Button onClick={handleSave} disabled={loading} className="gap-2">
            <Save className="h-4 w-4" />
            {loading ? "Saving..." : "Save Billing Information"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
    
// src/components/payment/PaymentHistory.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { format } from "date-fns";
import { Payment } from "@/types/payment.interface";
import { getPaymentHistory } from "@/actions";

export function PaymentHistory() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
  });

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const result = await getPaymentHistory();

      if (!result.success) {
        throw new Error(result.error || "Failed to load payment history");
      }

      setPayments(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount / 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      case "REFUNDED":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredPayments = payments.filter((payment) => {
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        payment.transactionId.toLowerCase().includes(searchTerm) ||
        payment.purpose.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.status) {
      return payment.status === filters.status;
    }

    return true;
  });

  const handleExport = () => {
    const csvContent = [
      ["Date", "Transaction ID", "Amount", "Status", "Purpose"],
      ...filteredPayments.map((p) => [
        format(new Date(p.createdAt), "yyyy-MM-dd"),
        p.transactionId,
        formatCurrency(p.amount),
        p.status,
        p.purpose,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "payment-history.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>Loading your payment history...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>Failed to load payment history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p>{error}</p>
            <Button onClick={loadPayments} className="mt-4">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>
              View all your past payments and transactions
            </CardDescription>
          </div>
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  placeholder="Search by transaction ID or purpose..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                  className="pl-9"
                />
              </div>
            </div>
            <Select
              value={filters.status}
              onValueChange={(value) =>
                setFilters({ ...filters, status: value })
              }
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="SUCCESS">Success</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
                <SelectItem value="REFUNDED">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredPayments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No payment history found</p>
              {payments.length === 0 && (
                <p className="text-sm text-gray-400 mt-2">
                  Your payment history will appear here after your first
                  transaction
                </p>
              )}
            </div>
          ) : (
            <div className="border rounded-lg">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-4 text-sm font-medium text-gray-600">
                        Date
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-gray-600">
                        Transaction ID
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-gray-600">
                        Amount
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-gray-600">
                        Status
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-gray-600">
                        Purpose
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map((payment) => (
                      <tr
                        key={payment.id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="p-4">
                          <div className="text-sm">
                            {format(new Date(payment.createdAt), "MMM d, yyyy")}
                          </div>
                          <div className="text-xs text-gray-500">
                            {format(new Date(payment.createdAt), "HH:mm")}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-mono text-sm">
                            {payment.transactionId.slice(0, 12)}...
                          </div>
                        </td>
                        <td className="p-4 font-medium">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className="p-4">
                          <Badge
                            variant="secondary"
                            className={getStatusColor(payment.status)}
                          >
                            {payment.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="text-sm">{payment.purpose}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {payments.length > 0 && (
            <div className="text-sm text-gray-500 text-center">
              Showing {filteredPayments.length} of {payments.length} payments
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

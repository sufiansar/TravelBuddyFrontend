"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, CheckCircle, XCircle, Clock } from "lucide-react";

import { format } from "date-fns";
import { Payment, PaymentStatus } from "@/types/admin.interface";
import { Pagination } from "@/components/Shared/Pagination";

interface PaymentTableProps {
  payments: Payment[];
  meta?: {
    page: number;
    limit: number;
    totalPage: number;
    total: number;
  };
  currentFilters?: Record<string, any>;
}
export function PaymentTable({
  payments,
  meta,
  currentFilters,
}: PaymentTableProps) {
  const router = useRouter();

  const getStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.SUCCESS:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case PaymentStatus.FAILED:
        return <XCircle className="h-4 w-4 text-red-500" />;
      case PaymentStatus.PENDING:
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.SUCCESS:
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case PaymentStatus.FAILED:
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case PaymentStatus.PENDING:
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Subscription</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No payments found.
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-mono text-sm">
                    {payment.transactionId}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{payment.user.fullName}</div>
                      <div className="text-sm text-gray-500">
                        {payment.user.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {payment.currency} {payment.amount.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{payment.paymentMethod}</div>
                  </TableCell>
                  <TableCell>
                    {payment.subscription ? (
                      <Badge variant="outline">
                        {payment.subscription.plan}
                      </Badge>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(payment.status)}
                      <Badge
                        variant="secondary"
                        className={getStatusColor(payment.status)}
                      >
                        {payment.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(payment.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark as Completed
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <XCircle className="mr-2 h-4 w-4" />
                          Refund Payment
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {meta && meta.totalPage > 1 && (
        <Pagination
          currentPage={meta.page}
          totalPages={meta.totalPage}
          onPageChange={(page) => {
            const params = new URLSearchParams(currentFilters || {});
            params.set("page", page.toString());
            router.push(`?${params.toString()}`);
          }}
        />
      )}
    </div>
  );
}

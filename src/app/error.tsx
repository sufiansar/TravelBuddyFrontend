"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error boundary caught: ", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 py-16">
      <Card className="bg-white/5 border-white/10 shadow-2xl max-w-xl w-full backdrop-blur-md">
        <CardContent className="p-8 space-y-6">
          <div className="flex items-center gap-3 text-xl font-semibold">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
            Something went wrong
          </div>
          <p className="text-slate-200/80 leading-relaxed">
            We hit an unexpected error. You can retry or head back to the home
            page.
          </p>

          {error?.message && (
            <div className="rounded-lg border border-amber-300/40 bg-amber-100/10 text-amber-100 px-4 py-3 text-sm">
              {error.message}
            </div>
          )}

          {error?.digest && (
            <Badge variant="outline" className="border-white/20 text-xs">
              Error ID: {error.digest}
            </Badge>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <Button
              onClick={reset}
              className="w-full bg-amber-400 text-slate-900 hover:bg-amber-300"
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/10"
            >
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

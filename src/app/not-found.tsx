import Link from "next/link";
import { ArrowLeft, Compass, MapPin, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="container mx-auto px-4 py-16 flex flex-col items-center gap-10">
        <Badge
          variant="outline"
          className="bg-white/5 border-white/10 text-xs uppercase tracking-[0.2em]"
        >
          404 — Not Found
        </Badge>

        <Card className="bg-white/5 border-white/10 shadow-2xl max-w-2xl w-full backdrop-blur-md">
          <CardContent className="p-10 space-y-6">
            <div className="flex items-center gap-3 text-2xl font-semibold">
              <Compass className="h-6 w-6 text-amber-300" />
              Lost your way?
            </div>
            <p className="text-slate-200/80 leading-relaxed">
              The page you are looking for isn&apos;t here. Check the link or
              jump back to explore travel plans and profiles.
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                asChild
                className="w-full bg-amber-400 text-slate-900 hover:bg-amber-300"
              >
                <Link href="/explore">Continue Exploring</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10"
              >
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-slate-300/80">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 border border-white/10">
                <MapPin className="h-4 w-4 text-emerald-300" />
                Discover destinations
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 border border-white/10">
                <Sparkles className="h-4 w-4 text-indigo-200" />
                Meet fellow travelers
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

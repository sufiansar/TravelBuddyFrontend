"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Github, Mail, Lock } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString();

    if (!email || !password) {
      setError("Email and password are required.");
      setLoading(false);
      return;
    }

    const result = await signIn("credentials", {
      redirect: false,
      callbackUrl,
      email,
      password,
    });

    if (result?.ok && !result?.error) {
      toast.success("Successfully signed in!");
    }

    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    // Success: redirect manually
    router.push(callbackUrl);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-3 text-center mb-4">
          <div className="rounded-full bg-primary/10 p-4">
            <div className="rounded-full bg-primary/20 p-3">
              <svg
                className="w-8 h-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Enter your credentials to access your account
            </p>
          </div>
        </div>

        <Field>
          <FieldLabel htmlFor="email" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email Address
          </FieldLabel>
          <div className="relative">
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your.email@example.com"
              required
              disabled={loading}
              className="pl-10 peer focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 peer-focus:text-primary" />
          </div>
        </Field>

        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Password
            </FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
            >
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              disabled={loading}
              className="pr-10 peer focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </Field>

        <Field>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </Field>

        {error && (
          <p className="text-sm text-destructive text-center" role="alert">
            {error}
          </p>
        )}

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <Field>
          <Button
            variant="outline"
            type="button"
            disabled={loading}
            className="w-full border-2 hover:border-primary/30 hover:bg-primary/5 transition-all"
          >
            <Github className="w-5 h-5 mr-2" />
            Sign in with GitHub
          </Button>
        </Field>

        <FieldDescription className="text-center pt-4 border-t">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-primary hover:text-primary/80 underline-offset-4 hover:underline transition-colors"
          >
            Create one now
          </Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}

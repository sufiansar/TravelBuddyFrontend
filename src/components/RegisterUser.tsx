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
import { Eye, EyeOff, Github, Mail, Lock, User, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

interface RegistrationFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function RegistrationForm({
  className,
  onSubmit,
  ...props
}: React.ComponentProps<"form"> & {
  onSubmit?: (data: RegistrationFormData) => void;
}) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<RegistrationFormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setError(null);
    setSuccess(null);
    setSubmitting(true);

    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
    };

    // If parent supplied handler, delegate to it
    if (onSubmit) {
      try {
        await onSubmit(formData);
        toast.success("Account created. You can now sign in.");
      } finally {
        setSubmitting(false);
      }
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/user/create-user`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "Registration failed");
      }

      // setSuccess("Account created. You can now sign in.");
      toast.success("Account created. You can now sign in.");
      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      // Redirect after a short delay to let the toast show
      setTimeout(() => router.push("/login"), 500);
    } catch (err: any) {
      setError(err.message || "Registration failed");
      toast.error(err.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const passwordStrength = () => {
    const { password } = formData;
    if (!password) return { strength: 0, color: "bg-gray-200" };

    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;

    let color = "bg-red-500";
    if (strength >= 50) color = "bg-yellow-500";
    if (strength >= 75) color = "bg-green-500";

    return { strength, color };
  };

  const passwordMatch = formData.password === formData.confirmPassword;
  const { strength: passwordStrengthValue, color: passwordStrengthColor } =
    passwordStrength();

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup>
        {error && (
          <div className="text-sm text-destructive rounded-md bg-destructive/10 border border-destructive/30 px-3 py-2">
            {error}
          </div>
        )}
        {success && (
          <div className="text-sm text-emerald-600 rounded-md bg-emerald-500/10 border border-emerald-500/40 px-3 py-2">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="fullName" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Full Name
            </FieldLabel>
            <Input
              id="fullName"
              type="text"
              placeholder="John Doe"
              required
              value={formData.fullName}
              onChange={handleChange}
              className="focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              disabled={submitting}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address
            </FieldLabel>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                required
                value={formData.email}
                onChange={handleChange}
                className="pl-10 peer focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                disabled={submitting}
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 peer-focus:text-primary" />
            </div>
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel
                htmlFor="password"
                className="flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Password
              </FieldLabel>
              <span className="text-xs text-muted-foreground">
                {passwordStrengthValue}%
              </span>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={handleChange}
                className="pr-10 peer focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                disabled={submitting}
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

            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="mt-2">
                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${passwordStrengthColor} transition-all duration-300`}
                    style={{ width: `${passwordStrengthValue}%` }}
                  />
                </div>
                <div className="grid grid-cols-4 gap-1 mt-2">
                  <div
                    className={`text-xs flex items-center gap-1 ${
                      formData.password.length >= 8
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  >
                    <Check className="w-3 h-3" /> 8+ chars
                  </div>
                  <div
                    className={`text-xs flex items-center gap-1 ${
                      /[A-Z]/.test(formData.password)
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  >
                    <Check className="w-3 h-3" /> Uppercase
                  </div>
                  <div
                    className={`text-xs flex items-center gap-1 ${
                      /[0-9]/.test(formData.password)
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  >
                    <Check className="w-3 h-3" /> Number
                  </div>
                  <div
                    className={`text-xs flex items-center gap-1 ${
                      /[^A-Za-z0-9]/.test(formData.password)
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  >
                    <Check className="w-3 h-3" /> Special
                  </div>
                </div>
              </div>
            )}
          </Field>

          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel
                htmlFor="confirmPassword"
                className="flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Confirm Password
              </FieldLabel>
              {formData.confirmPassword && (
                <span
                  className={`text-xs ${
                    passwordMatch ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {passwordMatch ? "✓ Match" : "✗ No Match"}
                </span>
              )}
            </div>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`pr-10 peer focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                  formData.confirmPassword && !passwordMatch
                    ? "border-red-500 focus:border-red-500"
                    : ""
                }`}
                disabled={submitting}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </Field>
        </div>

        <Field>
          <Button
            type="submit"
            className="w-full bg-linear-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary transition-all shadow-lg hover:shadow-xl active:scale-[0.98] text-white"
            disabled={
              !passwordMatch || passwordStrengthValue < 75 || submitting
            }
          >
            {submitting ? "Creating..." : "Create Account"}
          </Button>
        </Field>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or sign up with
            </span>
          </div>
        </div>

        <Field>
          <Button
            variant="outline"
            type="button"
            className="w-full border-2 hover:border-primary/30 hover:bg-primary/5 transition-all"
          >
            <Github className="w-5 h-5 mr-2" />
            Sign up with GitHub
          </Button>
        </Field>

        <FieldDescription className="text-center pt-4 border-t">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:text-primary/80 underline-offset-4 hover:underline transition-colors"
          >
            Sign in here
          </Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}

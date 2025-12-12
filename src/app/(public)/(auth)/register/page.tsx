import { GalleryVerticalEnd, UserPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { RegistrationForm } from "@/components/RegisterUser";

export default function RegisterPage() {
  const handleRegistrationSubmit = (data: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    console.log("Registration data:", data);
    // Your registration logic here
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <Image
              src="/assets/Logo.jpg"
              alt="TravelBuddy Logo"
              width={40}
              height={40}
              className="rounded-md"
            />
            TravelBuddy
          </Link>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="w-full max-w-xs">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10">
                <UserPlus className="size-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">
                Create an account
              </h1>
              <p className="text-muted-foreground mt-2 text-sm">
                Enter your details to get started
              </p>
            </div>
            {/* <RegistrationForm onSubmit={handleRegistrationSubmit} /> */}
            <RegistrationForm />
          </div>
          {/* <p className="text-muted-foreground mt-8 text-center text-sm">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-primary font-medium underline-offset-4 hover:underline"
            >
              Sign in
            </a>
          </p> */}
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/assets/Register.jpg"
          alt="Register Illustration"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}

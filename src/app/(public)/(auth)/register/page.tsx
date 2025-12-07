import { GalleryVerticalEnd, UserPlus } from "lucide-react";

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
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              {/* <GalleryVerticalEnd className="size-4" /> */}
            </div>
            Logo
          </a>
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
        <img
          src="/placeholder.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-10 left-10 right-10 text-white">
          <blockquote className="space-y-4">
            <p className="text-lg font-medium">
              "Join thousands of satisfied customers who have transformed their
              workflow with our platform."
            </p>
            <footer className="text-sm">
              <div className="font-semibold">Sarah Johnson</div>
              <div className="text-white/80">Product Manager at TechCorp</div>
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}

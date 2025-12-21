"use client";

import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "@/components/login-form";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useState } from "react";
import { User, Shield, ChevronDown } from "lucide-react";

export default function LoginPage() {
  const [showCredentials, setShowCredentials] = useState(false);

  const credentials = {
    user: {
      email: "sufiancodecrush@gmail.com",
      password: "Sufian123@",
    },
    superadmin: {
      email: "superadmin@example.com",
      password: "SuperSecretPassword@123",
    },
  };

  type CredentialType = keyof typeof credentials;
  const [selectedCredentials, setSelectedCredentials] = useState<
    (typeof credentials)[CredentialType] | null
  >(null);

  const handleCredentialSelect = (type: CredentialType) => {
    setSelectedCredentials(credentials[type]);
    setShowCredentials(false);

    setTimeout(() => {
      const emailInput = document.querySelector('input[type="email"]');
      const passwordInput = document.querySelector('input[type="password"]');

      if (emailInput && passwordInput) {
        (emailInput as HTMLInputElement).value = credentials[type].email;
        (passwordInput as HTMLInputElement).value = credentials[type].password;

        const changeEvent = new Event("input", { bubbles: true });
        emailInput.dispatchEvent(changeEvent);
        passwordInput.dispatchEvent(changeEvent);
      }
    }, 100);
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/assets/Login.jpg"
          alt="Login Illustration"
          fill
          className="object-cover"
          priority
        />
      </div>
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
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            {/* Quick Access Button for Teachers/Mentors */}
            <div className="mb-4 relative">
              <button
                type="button"
                onClick={() => setShowCredentials(!showCredentials)}
                className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Shield className="w-4 h-4" />
                Quick Access (Mentors)
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    showCredentials ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Credentials Dropdown */}
              {showCredentials && (
                <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg dark:shadow-gray-900/30 z-10 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => handleCredentialSelect("user")}
                    className="w-full px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center gap-3 transition-colors border-b border-gray-100 dark:border-gray-700 text-left"
                  >
                    <User className="w-5 h-5 text-blue-500 dark:text-blue-400 shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                        User Account
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Regular user access
                      </div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCredentialSelect("superadmin")}
                    className="w-full px-4 py-3 hover:bg-purple-50 dark:hover:bg-purple-900/20 flex items-center gap-3 transition-colors text-left"
                  >
                    <Shield className="w-5 h-5 text-purple-500 dark:text-purple-400 shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                        Super Admin
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Full system access
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <Suspense fallback={<div>Loading...</div>}>
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { signOut } from "next-auth/react";
import { Button } from "../ui/button";
import { toast } from "sonner";

const LogoutButton = () => {
  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/login" });
    toast.success("Successfully logged out!");
  };
  return (
    <Button variant={"destructive"} onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;

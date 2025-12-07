"use client";

import { signOut } from "next-auth/react";
import { Button } from "../ui/button";

const LogoutButton = () => {
  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/login" });
  };
  return (
    <Button variant={"destructive"} onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;

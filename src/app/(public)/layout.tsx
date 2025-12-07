import PublicNavbar from "@/components/PublicNavbar/Navbar";
import React from "react";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <PublicNavbar />
      {children}
    </div>
  );
};

export default PublicLayout;

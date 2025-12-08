import { Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ModeToggle } from "../modeToggle";
import LogoutButton from "./Logout";
import { getUserSession } from "@/helpers/userSession";

const PublicNavbar = async () => {
  const session = await getUserSession();
  const isLoggedIn = Boolean(session?.user?.id || session?.accessToken);

  const publicNavItems = [
    { href: "/", label: "Home" },
    { href: "/packages", label: "Packages" },
    { href: "/explore", label: "Explore" },
    { href: "/post", label: "Posts" },
    // { href: "/explore", label: "Explore" },
  ];

  const loggedInNavItems = [
    { href: "/", label: "Home" },
    { href: "/packages", label: "Packages" },
    { href: "/post", label: "Posts" },
    { href: "/explore", label: "Explore" },
    { href: "/travel-plans", label: "Travel Plans" },
    // { href: "/matches", label: "Matches" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  const navItems = isLoggedIn ? loggedInNavItems : publicNavItems;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur dark:bg-background/95">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-primary">✈️ TravelBuddy</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navItems.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-3">
          <ModeToggle />

          {isLoggedIn ? (
            <>
              <Link href="/profile">
                <Button variant="outline">Profile</Button>
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[300px] sm:w-[400px] p-4">
              <SheetTitle>Navigation Menu</SheetTitle>

              <nav className="flex flex-col space-y-4 mt-8">
                {navItems.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-lg font-medium hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Mobile Actions */}
                <div className="border-t pt-4 flex flex-col space-y-4">
                  <ModeToggle />

                  {isLoggedIn ? (
                    <>
                      <Link href="/profile">
                        <Button className="w-full">Profile</Button>
                      </Link>
                      <LogoutButton />
                    </>
                  ) : (
                    <>
                      <Link href="/login">
                        <Button className="w-full" variant="outline">
                          Login
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default PublicNavbar;

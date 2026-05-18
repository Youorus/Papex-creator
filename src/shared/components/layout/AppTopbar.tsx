"use client";

import { useAuth } from "@/providers/auth-provider";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./UserMenu";
import { MobileNav } from "./AppSidebar";

export function AppTopbar() {
  const { user } = useAuth();

  return (
    <header className="h-16 border-b bg-card/80 backdrop-blur-xl px-4 md:px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center space-x-4">
        <MobileNav />
      </div>
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        {user && <UserMenu user={user as any} />}
      </div>
    </header>
  );
}

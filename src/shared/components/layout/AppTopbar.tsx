"use client";

import { useAuth } from "@/providers/auth-provider";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./UserMenu";

export function AppTopbar() {
  const { user } = useAuth();

  return (
    <header className="h-16 border-b bg-card px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center space-x-4">
        {/* Breadcrumbs or Page Title could go here */}
      </div>
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        {user && <UserMenu user={user} />}
      </div>
    </header>
  );
}

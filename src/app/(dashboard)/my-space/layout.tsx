"use client";

import { useAuth } from "@/providers/auth-provider";
import { CreatorSidebar, CreatorMobileNav } from "@/shared/components/layout/CreatorSidebar";
import { ThemeToggle } from "@/shared/components/layout/ThemeToggle";
import { UserMenu } from "@/shared/components/layout/UserMenu";
import { Loader2 } from "lucide-react";

export default function CreatorLayout({ children }: { children: React.ReactNode }) {
  const { user, creatorProfile, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // Double check role
  if (!user || user.role !== "CREATOR") {
    return null; // The AuthProvider will handle redirect
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <CreatorSidebar />
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <header className="flex items-center justify-between h-20 px-4 md:px-8 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <CreatorMobileNav />
            <div className="hidden sm:flex flex-col">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Espace Créateur</h2>
              <p className="text-lg font-black text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-none">
                {creatorProfile?.full_name}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <UserMenu user={user} />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

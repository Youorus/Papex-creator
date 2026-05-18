"use client";

import { AppSidebar } from "@/shared/components/layout/AppSidebar";
import { AppTopbar } from "@/shared/components/layout/AppTopbar";
import { useAuth } from "@/providers/auth-provider";
import { Loader2, AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, checkAuth } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const hasAccess = user && (user.role === "ADMIN" || user.is_superuser);

  if (!user || !hasAccess) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-white dark:bg-slate-950 space-y-4">
        <AlertTriangle className="h-12 w-12 text-destructive" />
        <h2 className="text-xl font-bold">Accès non autorisé</h2>
        <p className="text-muted-foreground max-w-md text-center">
          {user 
            ? "Votre compte ne possède pas les droits d'administration nécessaires pour accéder à cette interface (rôle manquant ou insuffisant)." 
            : "Vous n'êtes pas connecté."}
        </p>
        <div className="flex gap-4 pt-4">
          <Button onClick={() => checkAuth()}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Vérifier à nouveau
          </Button>
          {user && (
            <Button variant="outline" onClick={() => window.location.href = "/login"}>
              Retour à la connexion
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-slate-950">
      <AppSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AppTopbar />
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50/30 dark:bg-transparent">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

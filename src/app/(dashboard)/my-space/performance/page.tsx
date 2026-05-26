"use client";

import { useAuth } from "@/providers/auth-provider";
import { CreatorDetailAnalytics } from "@/features/creators/components/CreatorDetailAnalytics";
import { TrendingUp, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";

export default function PerformancePage() {
  const { creatorProfile } = useAuth();

  if (!creatorProfile) return null;

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Analyses de Performance
          </h1>
          <p className="text-muted-foreground mt-2">
            Analysez l&apos;impact de vos campagnes sur une période donnée.
          </p>
        </div>
      </div>

      <Alert className="bg-primary/5 border-primary/20 text-primary-foreground dark:text-primary">
        <Info className="h-4 w-4" />
        <AlertTitle className="font-bold">Astuce Pro</AlertTitle>
        <AlertDescription>
          Comparez vos performances d&apos;un mois à l&apos;autre pour identifier les contenus qui convertissent le mieux.
        </AlertDescription>
      </Alert>

      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold tracking-tight">Statistiques Détaillées</h2>
        </div>
        
        <CreatorDetailAnalytics creatorId={creatorProfile.id} />
      </div>

      {/* Note: Charts will use the same component or a specialized one for creators later if needed */}
    </div>
  );
}

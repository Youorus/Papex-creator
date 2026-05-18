import { MetricCard } from "@/shared/components/cards/MetricCard";
import { Users, UserCheck, Clock, PauseCircle, UserX } from "lucide-react";
import { CreatorStats } from "../types";
import { Skeleton } from "@/shared/components/ui/skeleton";

interface CreatorStatsCardsProps {
  stats?: CreatorStats;
  isLoading: boolean;
}

export function CreatorStatsCards({ stats, isLoading }: CreatorStatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <MetricCard
        title="Total Créateurs"
        value={stats.total}
        icon={Users}
        colorPreset="cyan"
      />
      <MetricCard
        title="Actifs"
        value={stats.active}
        icon={UserCheck}
        colorPreset="emerald"
      />
      <MetricCard
        title="En attente"
        value={stats.pending}
        icon={Clock}
        colorPreset="amber"
      />
      <MetricCard
        title="En pause"
        value={stats.paused}
        icon={PauseCircle}
        colorPreset="violet"
      />
      <MetricCard
        title="Désactivés"
        value={stats.disabled}
        icon={UserX}
        colorPreset="rose"
      />
    </div>
  );
}

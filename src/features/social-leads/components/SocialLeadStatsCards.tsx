import { MetricCard } from "@/shared/components/cards/MetricCard";
import {
  Users,
  CheckCircle2,
  MessageSquare,
  UserPlus,
  TrendingUp,
  XCircle
} from "lucide-react";
import { SocialLeadStats } from "../types";
import { Skeleton } from "@/shared/components/ui/skeleton";

interface SocialLeadStatsCardsProps {
  stats?: SocialLeadStats;
  isLoading: boolean;
}

export function SocialLeadStatsCards({ stats, isLoading }: SocialLeadStatsCardsProps) {
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
      <MetricCard
        title="Total Leads"
        value={stats.total}
        icon={Users}
        colorPreset="cyan"
      />
      <MetricCard
        title="Viables"
        value={stats.viable}
        icon={CheckCircle2}
        colorPreset="emerald"
      />
        <MetricCard
            title="Contactés"
            value={stats.contacted}
            icon={MessageSquare}
            colorPreset="amber"
        />
      <MetricCard
        title="Positifs"
        value={stats.positive}
        icon={TrendingUp}
        colorPreset="fuchsia"
      />
      <MetricCard
        title="Convertis"
        value={stats.converted}
        icon={UserPlus}
        colorPreset="violet"
      />
      <MetricCard
        title="Non pertinents"
        value={stats.not_relevant}
        icon={XCircle}
        colorPreset="rose"
      />
    </div>
  );
}

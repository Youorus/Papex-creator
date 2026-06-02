import { MetricCard } from "@/shared/components/cards/MetricCard";
import {
  Users,
  CheckCircle2,
  MessageSquare,
  UserPlus,
  TrendingUp,
  XCircle,
  Zap,
  Target,
  UserCheck,
  Loader2
} from "lucide-react";
import { SocialLeadStats } from "../types";
import { Card, CardContent } from "@/shared/components/ui/card";
import { cn } from "@/lib/utils";

interface SocialLeadStatsCardsProps {
  stats?: SocialLeadStats;
  isLoading: boolean;
}

export function SocialLeadStatsCards({ stats, isLoading }: SocialLeadStatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="border-border/50 bg-card/40 backdrop-blur-sm h-32 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const cards = [
    { title: "Total Profils", value: stats.total, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Profils Viables", value: stats.viable, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Déjà Contactés", value: stats.contacted, icon: MessageSquare, color: "text-amber-500", bg: "bg-amber-500/10" },
    { title: "Retours Positifs", value: stats.positive, icon: TrendingUp, color: "text-fuchsia-500", bg: "bg-fuchsia-500/10" },
    { title: "Profils Convertis", value: stats.converted, icon: UserCheck, color: "text-violet-500", bg: "bg-violet-500/10" },
    { title: "Non Pertinents", value: stats.not_relevant, icon: XCircle, color: "text-rose-500", bg: "bg-rose-500/10" },
  ];

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card, idx) => (
        <Card key={idx} className="border-border/50 bg-card/40 backdrop-blur-sm hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden group">
          <CardContent className="p-5">
            <div className={cn("p-2 rounded-xl w-fit mb-3 transition-transform group-hover:scale-110", card.bg, card.color)}>
              <card.icon className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{card.title}</p>
              <h3 className="text-2xl font-black tracking-tighter">{card.value}</h3>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

"use client";

import { useCreatorStats } from "@/features/creators/hooks/use-creators";
import { useSocialLeadStats } from "@/features/social-leads/hooks/use-social-leads";
import { MetricCard } from "@/shared/components/cards/MetricCard";
import {
  Users,
  MessageSquare,
  TrendingUp,
  CheckCircle,
  Plus,
  UserPlus,
  Search
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";
import { AggregateKPIView } from "@/features/creators/components/AggregateKPIView";

const mockData = [
  { name: "Jan", creators: 4, profiles: 24 },
  { name: "Feb", creators: 7, profiles: 32 },
  { name: "Mar", creators: 5, profiles: 18 },
  { name: "Apr", creators: 12, profiles: 45 },
  { name: "May", creators: 18, profiles: 56 },
  { name: "Jun", creators: 24, profiles: 72 },
];

export default function DashboardPage() {
  const { data: creatorStats } = useCreatorStats();
  const { data: leadStats } = useSocialLeadStats();

  return (
      <div className="space-y-8 p-4 md:p-8 pt-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight">Tableau de bord</h1>
            <p className="text-muted-foreground">
              Aperçu global de votre programme d&apos;acquisition créateurs.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/creators/create">
              <Button size="sm" className="shadow-sm bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" /> Créateur
              </Button>
            </Link>
            <Link href="/social-leads/create">
              <Button size="sm" variant="outline" className="shadow-sm text-foreground bg-background">
                <Plus className="mr-2 h-4 w-4" /> Compte-Social
              </Button>
            </Link>
          </div>
        </div>

        <div className="space-y-4 pt-8 border-t">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-black tracking-tight">Performance des Créateurs</h2>
          </div>
          <p className="text-muted-foreground">
            Analyse des conversions et revenus générés par les codes promo.
          </p>
          <AggregateKPIView />
        </div>
      </div>
  );
}

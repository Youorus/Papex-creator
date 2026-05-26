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
                <Plus className="mr-2 h-4 w-4" /> Profil
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <MetricCard
              title="Total Créateurs"
              value={creatorStats?.total || 0}
              icon={Users}
              colorPreset="violet"
              description="Profils officiels"
          />
          <MetricCard
              title="Prospects Sourcés"
              value={leadStats?.total || 0}
              icon={Search}
              colorPreset="cyan"
              description="Comptes identifiés"
          />
          <MetricCard
              title="Profils Viables"
              value={leadStats?.viable || 0}
              icon={CheckCircle}
              colorPreset="emerald"
              description="Potentiel élevé"
          />
          <MetricCard
              title="Contactés"
              value={leadStats?.contacted || 0}
              icon={MessageSquare}
              colorPreset="amber"
              description="Prospection active"
          />
          <MetricCard
              title="Réponses +"
              value={leadStats?.positive || 0}
              icon={TrendingUp}
              colorPreset="fuchsia"
              description="Prêts à l'envoi"
          />
          <MetricCard
              title="Convertis"
              value={leadStats?.converted || 0}
              icon={UserPlus}
              colorPreset="rose"
              description="Succès acquisition"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4 border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Croissance Mensuelle</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                    <XAxis
                        dataKey="name"
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                    />
                    <Bar
                        dataKey="profiles"
                        fill="currentColor"
                        radius={[4, 4, 0, 0]}
                        className="fill-primary"
                    />
                    <Bar
                        dataKey="creators"
                        fill="currentColor"
                        radius={[4, 4, 0, 0]}
                        className="fill-amber-500"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3 border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Actions Rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                <Link href="/creators">
                  <Button variant="outline" className="w-full justify-start h-12 text-foreground">
                    <Users className="mr-3 h-5 w-5 text-violet-500" />
                    Gérer les créateurs
                  </Button>
                </Link>
                <Link href="/social-leads">
                  <Button variant="outline" className="w-full justify-start h-12 text-foreground">
                    <Search className="mr-3 h-5 w-5 text-cyan-500" />
                    Explorer les profils
                  </Button>
                </Link>
                <Link href="/social-leads?contact_status=POSITIVE">
                  <Button variant="outline" className="w-full justify-start h-12 text-foreground">
                    <UserPlus className="mr-3 h-5 w-5 text-emerald-500" />
                    Convertir les profils intéressés
                  </Button>
                </Link>
                <Link href="/social-leads?is_viable=true&contact_status=NEW">
                  <Button variant="outline" className="w-full justify-start h-12 text-foreground">
                    <MessageSquare className="mr-3 h-5 w-5 text-amber-500" />
                    Contacter les nouveaux profils
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
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

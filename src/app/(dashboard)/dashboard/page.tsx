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
import { motion } from "framer-motion";

const mockData = [
  { name: "Jan", creators: 4, leads: 24 },
  { name: "Feb", creators: 7, leads: 32 },
  { name: "Mar", creators: 5, leads: 18 },
  { name: "Apr", creators: 12, leads: 45 },
  { name: "May", creators: 18, leads: 56 },
  { name: "Jun", creators: 24, leads: 72 },
];

export default function DashboardPage() {
  const { data: creatorStats, isLoading: loadingCreators } = useCreatorStats();
  const { data: leadStats, isLoading: loadingLeads } = useSocialLeadStats();

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
            <Button size="sm" className="shadow-sm">
              <Plus className="mr-2 h-4 w-4" /> Créateur
            </Button>
          </Link>
          <Link href="/social-leads/create">
            <Button size="sm" variant="outline" className="shadow-sm">
              <Plus className="mr-2 h-4 w-4" /> Lead
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Créateurs"
          value={creatorStats?.total || 0}
          icon={Users}
          colorPreset="violet"
          description="Profils enregistrés"
        />
        <MetricCard
          title="Leads Sociaux"
          value={leadStats?.total || 0}
          icon={MessageSquare}
          colorPreset="cyan"
          description="Prospects identifiés"
        />
        <MetricCard
          title="Leads Viables"
          value={leadStats?.viable || 0}
          icon={CheckCircle}
          colorPreset="emerald"
          description="Prêts pour contact"
        />
        <MetricCard
          title="Conversions"
          value={leadStats?.converted || 0}
          icon={TrendingUp}
          colorPreset="amber"
          description="Passés en créateurs"
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
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                  />
                  <Bar
                    dataKey="leads"
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
                <Button variant="outline" className="w-full justify-start h-12">
                  <Users className="mr-3 h-5 w-5 text-violet-500" />
                  Gérer les créateurs
                </Button>
              </Link>
              <Link href="/social-leads">
                <Button variant="outline" className="w-full justify-start h-12">
                  <Search className="mr-3 h-5 w-5 text-cyan-500" />
                  Explorer les leads
                </Button>
              </Link>
              <Link href="/social-leads?contact_status=POSITIVE">
                <Button variant="outline" className="w-full justify-start h-12">
                  <UserPlus className="mr-3 h-5 w-5 text-emerald-500" />
                  Convertir les leads positifs
                </Button>
              </Link>
              <Link href="/social-leads?is_viable=true&contact_status=NEW">
                <Button variant="outline" className="w-full justify-start h-12">
                  <MessageSquare className="mr-3 h-5 w-5 text-amber-500" />
                  Contacter les nouveaux leads
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

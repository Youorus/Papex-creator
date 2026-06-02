"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { creatorsService } from "../services/creators.service";
import { IndividualKpiParams } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { 
  Users, 
  FileCheck, 
  TrendingUp, 
  Euro, 
  Wallet, 
  Loader2, 
  Target, 
  Calendar,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { format, subDays, startOfMonth, startOfToday, endOfToday } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";

interface CreatorDetailAnalyticsProps {
  creatorId: string;
}

const formatCurrency = (value: string | number, currency: string = "EUR") => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
  }).format(Number(value));
};

const formatPercent = (value: number) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
};

export function CreatorDetailAnalytics({ creatorId }: CreatorDetailAnalyticsProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN" || user?.is_superuser;

  const [rangeType, setRangeType] = useState<string>("allTime");
  const [params, setParams] = useState<IndividualKpiParams>({
    start_date: undefined,
    end_date: undefined,
  });

  const { data: kpi, isLoading } = useQuery({
    queryKey: ["creator-kpis", creatorId, params],
    queryFn: () => creatorsService.getCreatorKpis(creatorId, params),
    enabled: !!creatorId,
  });

  const handleRangeChange = (value: string) => {
    setRangeType(value);
    if (value === "custom") return;

    let start: Date | null = null;
    let end: Date | null = null;

    switch (value) {
      case "allTime":
        start = null;
        end = null;
        break;
      case "today":
        start = startOfToday();
        end = endOfToday();
        break;
      case "yesterday":
        start = subDays(startOfToday(), 1);
        end = subDays(endOfToday(), 1);
        break;
      case "last7days":
        start = subDays(startOfToday(), 7);
        end = endOfToday();
        break;
      case "last30days":
        start = subDays(startOfToday(), 30);
        end = endOfToday();
        break;
      case "thisMonth":
        start = startOfMonth(new Date());
        end = endOfToday();
        break;
      default:
        start = null;
        end = null;
    }

    setParams({
      start_date: start ? format(start, "yyyy-MM-dd") : undefined,
      end_date: end ? format(end, "yyyy-MM-dd") : undefined,
    });
  };

  const handleCustomDateChange = (type: "start" | "end", value: string) => {
    setParams(prev => ({
      ...prev,
      [type === "start" ? "start_date" : "end_date"]: value
    }));
  };

  const statsCards = useMemo(() => {
    const cards = [
      {
        title: "Leads Générés",
        value: kpi?.total_leads || 0,
        icon: Users,
        trend: "+12%",
        trendUp: true,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10"
      },
      {
        title: "Contrats Signés",
        value: kpi?.total_contracts || 0,
        icon: FileCheck,
        trend: "+5%",
        trendUp: true,
        color: "text-emerald-500",
        bgColor: "bg-emerald-500/10"
      },
      {
        title: "Taux de Conversion",
        value: formatPercent(kpi?.conversion_rate || 0),
        icon: Target,
        trend: "-2%",
        trendUp: false,
        color: "text-fuchsia-500",
        bgColor: "bg-fuchsia-500/10"
      }
    ];

    if (isAdmin) {
      cards.push({
        title: "Chiffre d'Affaires",
        value: formatCurrency(kpi?.total_revenue || "0", kpi?.currency),
        icon: TrendingUp,
        trend: "+24%",
        trendUp: true,
        color: "text-amber-500",
        bgColor: "bg-amber-500/10"
      });
    }

    cards.push({
      title: isAdmin ? "Commissions Dues" : "Mes Commissions",
      value: formatCurrency(kpi?.total_commissions || "0", kpi?.currency),
      icon: Wallet,
      trend: "+18%",
      trendUp: true,
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10"
    });

    return cards;
  }, [kpi, isAdmin]);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
          <p className="text-sm text-muted-foreground animate-pulse">Chargement des données analytiques...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header & Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-card/30 p-6 rounded-2xl border border-border/50 backdrop-blur-sm shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-primary/10 text-primary shadow-inner">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">Performance Analytique</h2>
            <p className="text-xs text-muted-foreground font-medium">
              {params.start_date && params.end_date 
                ? `Analyse du ${format(new Date(params.start_date), "dd MMMM", { locale: fr })} au ${format(new Date(params.end_date), "dd MMMM yyyy", { locale: fr })}`
                : "Performance globale (Toute la période)"}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          {rangeType === "custom" && (
            <div className="flex items-center gap-2 animate-in slide-in-from-right-4 duration-300 w-full sm:w-auto">
              <Input 
                type="date" 
                value={params.start_date || ""}
                onChange={(e) => handleCustomDateChange("start", e.target.value)}
                className="h-10 flex-1 sm:w-[140px] bg-background/50 border-border/50 rounded-xl text-xs font-semibold"
              />
              <span className="text-muted-foreground text-[10px] font-black uppercase">à</span>
              <Input 
                type="date" 
                value={params.end_date || ""}
                onChange={(e) => handleCustomDateChange("end", e.target.value)}
                className="h-10 flex-1 sm:w-[140px] bg-background/50 border-border/50 rounded-xl text-xs font-semibold"
              />
            </div>
          )}
          
          <Select value={rangeType} onValueChange={handleRangeChange}>
            <SelectTrigger className="w-full sm:w-[200px] h-10 bg-background/50 border-border/50 shadow-sm rounded-xl font-bold text-xs">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border/50">
              <SelectItem value="allTime">Toute la période</SelectItem>
              <SelectItem value="today">Aujourd&apos;hui</SelectItem>
              <SelectItem value="yesterday">Hier</SelectItem>
              <SelectItem value="last7days">7 derniers jours</SelectItem>
              <SelectItem value="last30days">30 derniers jours</SelectItem>
              <SelectItem value="thisMonth">Mois en cours</SelectItem>
              <SelectItem value="custom" className="font-bold text-primary">Période personnalisée</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statsCards.map((stat, idx) => (
          <Card key={idx} className="border-border/50 bg-card/40 backdrop-blur-sm hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 overflow-hidden group">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className={cn("p-2 rounded-lg transition-colors", stat.bgColor, stat.color)}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className={cn(
                  "flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm ring-1 ring-inset",
                  stat.trendUp ? "bg-emerald-500/10 text-emerald-500 ring-emerald-500/20" : "bg-rose-500/10 text-rose-500 ring-rose-500/20"
                )}>
                  {stat.trendUp ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                  {stat.trend}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{stat.title}</p>
                <h3 className="text-2xl font-black tracking-tighter">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart / Visual Indicator */}
        <Card className="lg:col-span-1 border-border/50 bg-card/40 backdrop-blur-sm shadow-sm overflow-hidden">
          <CardHeader className="pb-2 border-b border-border/50 bg-muted/20">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Efficacité de Conversion
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12 relative">
            <div className="relative h-44 w-44">
              {/* Complex SVG for better visual */}
              <svg className="h-full w-full" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(var(--primary) / 0.5)" />
                  </linearGradient>
                </defs>
                <circle
                  className="text-muted/10 stroke-current"
                  strokeWidth="8"
                  cx="50"
                  cy="50"
                  r="42"
                  fill="transparent"
                />
                <circle
                  className="stroke-[url(#progressGradient)] transition-all duration-1000 ease-in-out"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 42}
                  strokeDashoffset={2 * Math.PI * 42 * (1 - (kpi?.conversion_rate || 0) / 100)}
                  strokeLinecap="round"
                  cx="50"
                  cy="50"
                  r="42"
                  fill="transparent"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black tracking-tighter">{formatPercent(kpi?.conversion_rate || 0)}</span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Score de Perf</span>
              </div>
            </div>
            
            <div className="mt-8 grid grid-cols-2 w-full gap-4 px-4">
              <div className="text-center space-y-1 border-r border-border/50">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Leads</p>
                <p className="text-xl font-black">{kpi?.total_leads || 0}</p>
              </div>
              <div className="text-center space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Succès</p>
                <p className="text-xl font-black">{kpi?.total_contracts || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed KPI Table / List */}
        <Card className="lg:col-span-2 border-border/50 bg-card/40 backdrop-blur-sm shadow-sm overflow-hidden">
          <CardHeader className="pb-2 border-b border-border/50 bg-muted/20 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Euro className="h-4 w-4 text-primary" />
              Récapitulatif de Performance
            </CardTitle>
            <div className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">TEMPS RÉEL</div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {isAdmin && (
                <div className="flex items-center justify-between p-6 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Chiffre d&apos;affaires brut</p>
                      <p className="text-xs text-muted-foreground">Volume total des ventes générées</p>
                    </div>
                  </div>
                  <p className="text-lg font-black">{formatCurrency(kpi?.total_revenue || "0", kpi?.currency)}</p>
                </div>
              )}
              
              <div className="flex items-center justify-between p-6 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                    <Wallet className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{isAdmin ? "Commissions totales" : "Mes commissions accumulées"}</p>
                    <p className="text-xs text-muted-foreground">{isAdmin ? "Montant total dû au créateur" : "Gains générés sur la période"}</p>
                  </div>
                </div>
                <p className="text-lg font-black text-primary">{formatCurrency(kpi?.total_commissions || "0", kpi?.currency)}</p>
              </div>

              <div className="flex items-center justify-between p-6 hover:bg-muted/30 transition-colors bg-muted/10">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Nombre de Leads</p>
                    <p className="text-xs text-muted-foreground">Prospects ayant utilisé le code</p>
                  </div>
                </div>
                <p className="text-lg font-black">{kpi?.total_leads || 0}</p>
              </div>
            </div>
            
            <div className="p-4 bg-muted/20 border-t border-border/50">
              <Button variant="ghost" className="w-full text-xs font-bold text-muted-foreground hover:text-primary transition-colors group">
                VOIR LE RAPPORT DÉTAILLÉ 
                <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

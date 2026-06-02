"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { creatorsService } from "../services/creators.service";
import { CreatorKpiParams, CreatorStatus } from "../types";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/shared/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/shared/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { 
  Users, 
  FileCheck, 
  TrendingUp, 
  Euro, 
  Wallet, 
  Loader2, 
  Calendar,
  Search,
  Filter,
  ArrowUpRight,
  ChevronRight
} from "lucide-react";
import { format, startOfMonth, startOfToday, endOfToday, subDays } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";

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

export function AggregateKPIView() {
  const [rangeType, setRangeType] = useState<string>("allTime");
  const [params, setParams] = useState<CreatorKpiParams>({
    leads_date_range_after: undefined,
    leads_date_range_before: undefined,
    status: "ACTIVE" as CreatorStatus,
  });

  const { data: kpis, isLoading: isLoadingKpis } = useQuery({
    queryKey: ["creator-aggregate-kpis", params],
    queryFn: () => creatorsService.getAggregateKpis(params),
  });

  const { data: creatorsList } = useQuery({
    queryKey: ["creators-list-simple"],
    queryFn: () => creatorsService.getCreators({ page_size: 100 }),
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

    setParams((prev) => ({
      ...prev,
      leads_date_range_after: start ? format(start, "yyyy-MM-dd") : undefined,
      leads_date_range_before: end ? format(end, "yyyy-MM-dd") : undefined,
    }));
  };

  const handleCustomDateChange = (type: "start" | "end", value: string) => {
    setParams(prev => ({
      ...prev,
      [type === "start" ? "leads_date_range_after" : "leads_date_range_before"]: value
    }));
  };

  const handleCreatorChange = (value: string) => {
    setParams((prev) => ({
      ...prev,
      creator: value === "all" ? undefined : value,
    }));
  };

  const handleStatusChange = (value: string) => {
    setParams((prev) => ({
      ...prev,
      status: value === "all" ? undefined : (value as CreatorStatus),
    }));
  };

  const summary = kpis?.summary;
  const creators = kpis?.creators || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Filters Panel */}
      <Card className="border-border/50 bg-card/30 backdrop-blur-md shadow-xl overflow-hidden rounded-3xl">
        <div className="h-1.5 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-black flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10 text-primary shadow-inner">
                <Filter className="h-5 w-5" />
              </div>
              Tableau de Bord Global
            </CardTitle>
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-bold px-3 py-1">
              {creators.length} Créateurs Analysés
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            {/* Period Section */}
            <div className="lg:col-span-5 space-y-3">
              <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground flex items-center gap-2">
                <Calendar className="h-3 w-3" /> Période d&apos;Analyse
              </label>
              <div className="flex items-center gap-3">
                <Select value={rangeType} onValueChange={handleRangeChange}>
                  <SelectTrigger className="w-full bg-background/50 border-border/50 rounded-2xl h-12 font-bold text-xs shadow-sm">
                    <SelectValue placeholder="Choisir..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-border/50">
                    <SelectItem value="allTime">Toute la période</SelectItem>
                    <SelectItem value="today">Aujourd&apos;hui</SelectItem>
                    <SelectItem value="last7days">7 derniers jours</SelectItem>
                    <SelectItem value="last30days">30 derniers jours</SelectItem>
                    <SelectItem value="thisMonth">Mois en cours</SelectItem>
                    <SelectItem value="custom" className="font-bold text-primary">Période personnalisée</SelectItem>
                  </SelectContent>
                </Select>

                {rangeType === "custom" && (
                  <div className="flex items-center gap-2 animate-in zoom-in duration-300">
                    <Input 
                      type="date" 
                      value={params.leads_date_range_after}
                      onChange={(e) => handleCustomDateChange("start", e.target.value)}
                      className="h-12 w-[140px] bg-background/50 border-border/50 rounded-2xl text-xs font-bold shadow-sm"
                    />
                    <Input 
                      type="date" 
                      value={params.leads_date_range_before}
                      onChange={(e) => handleCustomDateChange("end", e.target.value)}
                      className="h-12 w-[140px] bg-background/50 border-border/50 rounded-2xl text-xs font-bold shadow-sm"
                    />
                  </div>
                )}
              </div>
            </div>
            
            {/* Creator Picker */}
            <div className="lg:col-span-4 space-y-3">
              <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground flex items-center gap-2">
                <Users className="h-3 w-3" /> Filtre par Ambassadeur
              </label>
              <Select value={(params.creator as string) || "all"} onValueChange={handleCreatorChange}>
                <SelectTrigger className="bg-background/50 border-border/50 rounded-2xl h-12 font-bold text-xs shadow-sm">
                  <SelectValue placeholder="Tous les créateurs" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-border/50">
                  <SelectItem value="all">Tous les créateurs</SelectItem>
                  {creatorsList?.results.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Picker */}
            <div className="lg:col-span-3 space-y-3">
              <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Statut du Compte</label>
              <Select value={params.status || "all"} onValueChange={handleStatusChange}>
                <SelectTrigger className="bg-background/50 border-border/50 rounded-2xl h-12 font-bold text-xs shadow-sm">
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-border/50">
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="ACTIVE">Actif uniquement</SelectItem>
                  <SelectItem value="PENDING">En attente</SelectItem>
                  <SelectItem value="PAUSED">En pause</SelectItem>
                  <SelectItem value="DISABLED">Désactivé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoadingKpis ? (
        <div className="flex h-96 items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary/30" />
            <p className="text-sm font-bold text-muted-foreground animate-pulse">Calcul des KPIs en cours...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Summary Metrics */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Leads Totaux", value: summary?.total_leads, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", trend: "+8%" },
              { title: "Ventes (Contrats)", value: summary?.total_contracts, icon: FileCheck, color: "text-emerald-500", bg: "bg-emerald-500/10", trend: "+12%" },
              { title: "Chiffre d'Affaires", value: formatCurrency(summary?.total_revenue || "0"), icon: Euro, color: "text-amber-500", bg: "bg-amber-500/10", trend: "+24%" },
              { title: "Commissions Dues", value: formatCurrency(summary?.total_commissions || "0"), icon: Wallet, color: "text-indigo-500", bg: "bg-indigo-500/10", trend: "+15%" }
            ].map((stat, idx) => (
              <Card key={idx} className="border-border/50 bg-card/40 backdrop-blur-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-3xl overflow-hidden group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn("p-3 rounded-2xl shadow-inner group-hover:scale-110 transition-transform", stat.bg, stat.color)}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <Badge variant="outline" className="bg-emerald-500/5 text-emerald-500 border-emerald-500/20 text-[10px] font-black">
                      <ArrowUpRight className="h-3 w-3 mr-0.5" /> {stat.trend}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">{stat.title}</p>
                    <h3 className="text-3xl font-black tracking-tighter">{stat.value}</h3>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detailed Analytics Table */}
          <Card className="border-border/50 bg-card/40 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/50 py-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-black flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Classement de Performance
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Chercher un nom..." className="pl-9 h-9 w-[200px] bg-background/50 border-border/50 rounded-xl text-xs" />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/20 border-b border-border/50">
                      <TableHead className="py-4 font-black uppercase text-[10px] tracking-widest px-6">Créateur</TableHead>
                      <TableHead className="text-center font-black uppercase text-[10px] tracking-widest">Leads</TableHead>
                      <TableHead className="text-center font-black uppercase text-[10px] tracking-widest">Contrats</TableHead>
                      <TableHead className="text-center font-black uppercase text-[10px] tracking-widest">Efficacité</TableHead>
                      <TableHead className="text-right font-black uppercase text-[10px] tracking-widest">Revenue</TableHead>
                      <TableHead className="text-right font-black uppercase text-[10px] tracking-widest px-6">Commission</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {creators.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-48 text-center text-muted-foreground font-bold italic">
                          <div className="flex flex-col items-center gap-3">
                            <Search className="h-10 w-10 opacity-20" />
                            Aucune donnée trouvée pour cette période.
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      creators.map((c) => (
                        <TableRow key={c.id} className="group hover:bg-primary/5 transition-colors">
                          <TableCell className="px-6 py-4">
                            <Link href={`/creators/${c.id}`} className="flex items-center gap-3 group/link">
                              <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-sm group-hover/link:bg-primary group-hover/link:text-white transition-all">
                                {c.full_name.substring(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-bold group-hover/link:underline">{c.full_name}</p>
                                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Performance globale</p>
                              </div>
                            </Link>
                          </TableCell>
                          <TableCell className="text-center font-bold">{c.total_leads}</TableCell>
                          <TableCell className="text-center font-bold">{c.total_contracts}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex flex-col items-center gap-1">
                              <span className={cn(
                                "text-xs font-black",
                                c.conversion_rate > 30 ? "text-emerald-500" : c.conversion_rate > 15 ? "text-amber-500" : "text-muted-foreground"
                              )}>
                                {formatPercent(c.conversion_rate)}
                              </span>
                              <div className="w-12 h-1 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className={cn("h-full", c.conversion_rate > 30 ? "bg-emerald-500" : c.conversion_rate > 15 ? "bg-amber-500" : "bg-muted-foreground")}
                                  style={{ width: `${Math.min(c.conversion_rate, 100)}%` }}
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-black text-slate-700 dark:text-slate-300">{formatCurrency(c.total_revenue, c.currency)}</TableCell>
                          <TableCell className="text-right px-6">
                            <div className="flex items-center justify-end gap-2">
                              <span className="font-black text-primary text-lg">{formatCurrency(c.total_commissions, c.currency)}</span>
                              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

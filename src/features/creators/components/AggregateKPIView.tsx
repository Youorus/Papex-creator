"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { creatorsService } from "../services/creators.service";
import { CreatorKpiParams, CreatorStatus } from "../types";
import { MetricCard } from "@/shared/components/cards/MetricCard";
import { DateRangeFilter } from "@/shared/components/forms/DateRangeFilter";
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
import { Users, FileText, Euro, Wallet, Loader2 } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { Badge } from "@/shared/components/ui/badge";

const formatCurrency = (value: string | number) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
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
  const [params, setParams] = useState<CreatorKpiParams>({
    leads_date_range_after: format(new Date(), "yyyy-MM-01"), // Start of current month
    leads_date_range_before: format(new Date(), "yyyy-MM-dd"), // Today
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

  const handleRangeChange = (start: string, end: string) => {
    setParams((prev) => ({
      ...prev,
      leads_date_range_after: start,
      leads_date_range_before: end,
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
    <div className="space-y-8">
      <Card className="border-border/50 bg-card/60 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Filtres de Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-4 items-end">
            <div className="lg:col-span-2">
              <DateRangeFilter 
                onRangeChange={handleRangeChange}
                initialStart={params.leads_date_range_after}
                initialEnd={params.leads_date_range_before}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-2 lg:col-span-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Créateur</label>
                <Select value={(params.creator as string) || "all"} onValueChange={handleCreatorChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    {creatorsList?.results.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Statut</label>
                <Select value={params.status || "all"} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="ACTIVE">Actif</SelectItem>
                    <SelectItem value="PENDING">En attente</SelectItem>
                    <SelectItem value="PAUSED">En pause</SelectItem>
                    <SelectItem value="DISABLED">Désactivé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoadingKpis ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Leads Totaux"
              value={summary?.total_leads || 0}
              icon={Users}
              colorPreset="violet"
            />
            <MetricCard
              title="Contrats Signés"
              value={summary?.total_contracts || 0}
              icon={FileText}
              colorPreset="emerald"
              description={`${formatPercent(summary?.average_conversion_rate || 0)} conversion`}
            />
            <MetricCard
              title="Chiffre d'Affaires"
              value={formatCurrency(summary?.total_revenue || "0")}
              icon={Euro}
              colorPreset="amber"
            />
            <MetricCard
              title="Commissions"
              value={formatCurrency(summary?.total_commissions || "0")}
              icon={Wallet}
              colorPreset="cyan"
            />
          </div>

          <Card className="border-border/50 bg-card/60 backdrop-blur-md overflow-hidden">
            <CardHeader>
              <CardTitle>Comparatif des Créateurs</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Créateur</TableHead>
                    <TableHead>Code Promo</TableHead>
                    <TableHead className="text-right">Leads</TableHead>
                    <TableHead className="text-right">Contrats</TableHead>
                    <TableHead className="text-right">Conv. %</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Commissions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {creators.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                        Aucune donnée pour cette période.
                      </TableCell>
                    </TableRow>
                  ) : (
                    creators.map((c) => (
                      <TableRow key={c.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell className="font-medium">
                          <Link href={`/creators/${c.id}`} className="hover:underline">
                            {c.full_name}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="font-mono">
                            {c.promo_code}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{c.total_leads}</TableCell>
                        <TableCell className="text-right">{c.total_contracts}</TableCell>
                        <TableCell className="text-right">{formatPercent(c.conversion_rate)}</TableCell>
                        <TableCell className="text-right font-semibold">{formatCurrency(c.total_revenue)}</TableCell>
                        <TableCell className="text-right font-semibold text-primary">{formatCurrency(c.total_commissions)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

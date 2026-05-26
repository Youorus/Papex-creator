"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { creatorsService } from "../services/creators.service";
import { IndividualKpiParams } from "../types";
import { MetricCard } from "@/shared/components/cards/MetricCard";
import { DateRangeFilter } from "@/shared/components/forms/DateRangeFilter";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Users, FileText, Euro, Wallet, Loader2, Target } from "lucide-react";
import { format, startOfMonth } from "date-fns";

interface CreatorDetailAnalyticsProps {
  creatorId: string;
}

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

export function CreatorDetailAnalytics({ creatorId }: CreatorDetailAnalyticsProps) {
  const [params, setParams] = useState<IndividualKpiParams>({
    start_date: format(startOfMonth(new Date()), "yyyy-MM-01"),
    end_date: format(new Date(), "yyyy-MM-dd"),
  });

  const { data: kpi, isLoading } = useQuery({
    queryKey: ["creator-kpis", creatorId, params],
    queryFn: () => creatorsService.getCreatorKpis(creatorId, params),
    enabled: !!creatorId,
  });

  const handleRangeChange = (start: string, end: string) => {
    setParams({
      start_date: start,
      end_date: end,
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-border/50 bg-card/60 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Analyse de Période</CardTitle>
        </CardHeader>
        <CardContent>
          <DateRangeFilter 
            onRangeChange={handleRangeChange}
            initialStart={params.start_date}
            initialEnd={params.end_date}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <MetricCard
          title="Leads"
          value={kpi?.total_leads || 0}
          icon={Users}
          colorPreset="violet"
          className="col-span-1"
        />
        <MetricCard
          title="Contrats"
          value={kpi?.total_contracts || 0}
          icon={FileText}
          colorPreset="emerald"
          className="col-span-1"
        />
        <MetricCard
          title="Taux de Conversion"
          value={formatPercent(kpi?.conversion_rate || 0)}
          icon={Target}
          colorPreset="fuchsia"
          className="col-span-2 lg:col-span-1"
        />
        <MetricCard
          title="Revenue Généré"
          value={formatCurrency(kpi?.total_revenue || "0")}
          icon={Euro}
          colorPreset="amber"
          className="col-span-2 lg:col-span-1"
        />
        <MetricCard
          title="Commissions Totales"
          value={formatCurrency(kpi?.total_commissions || "0")}
          icon={Wallet}
          colorPreset="cyan"
          className="col-span-2 lg:col-span-2"
        />
      </div>

      <Card className="border-border/50 bg-card/60 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Indicateur de Performance</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <div className="relative h-48 w-48">
            {/* Simple Radial Progress / Gauge */}
            <svg className="h-full w-full" viewBox="0 0 100 100">
              <circle
                className="text-muted/20 stroke-current"
                strokeWidth="10"
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
              />
              <circle
                className="text-primary stroke-current transition-all duration-1000 ease-in-out"
                strokeWidth="10"
                strokeDasharray={2 * Math.PI * 40}
                strokeDashoffset={2 * Math.PI * 40 * (1 - (kpi?.conversion_rate || 0) / 100)}
                strokeLinecap="round"
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">{formatPercent(kpi?.conversion_rate || 0)}</span>
              <span className="text-xs text-muted-foreground uppercase">Conversion</span>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground text-center max-w-xs">
            Ce taux représente le ratio entre les contrats signés et le nombre total de leads générés sur la période.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

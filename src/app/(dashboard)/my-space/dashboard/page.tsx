"use client";

import { useAuth } from "@/providers/auth-provider";
import { useQuery } from "@tanstack/react-query";
import { creatorsService } from "@/features/creators/services/creators.service";
import { 
  Users, 
  Target, 
  Wallet, 
  TrendingUp, 
  Gift,
  Copy,
  Check,
  Tag,
  Calendar,
  Loader2,
  FileCheck,
  ChevronRight,
  Coins,
  Globe,
  Mail
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";
import { promoCodesService } from "@/features/promo-codes/services/promo-codes.service";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Badge } from "@/shared/components/ui/badge";
import { format, startOfMonth, startOfToday, endOfToday, subDays } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/shared/components/ui/select";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/lib/utils";
import { Country } from "country-state-city";

// Configuration des devises locales
const CURRENCY_MAP: Record<string, { code: string, rate: number, symbol: string }> = {
  "ivory coast": { code: "XOF", rate: 655.957, symbol: "CFA" },
  "côte d'ivoire": { code: "XOF", rate: 655.957, symbol: "CFA" },
  "cote d'ivoire": { code: "XOF", rate: 655.957, symbol: "CFA" },
  "france": { code: "EUR", rate: 1, symbol: "€" },
  "senegal": { code: "XOF", rate: 655.957, symbol: "CFA" },
  "sénégal": { code: "XOF", rate: 655.957, symbol: "CFA" },
  "benin": { code: "XOF", rate: 655.957, symbol: "CFA" },
  "bénin": { code: "XOF", rate: 655.957, symbol: "CFA" },
  "togo": { code: "XOF", rate: 655.957, symbol: "CFA" },
  "burkina faso": { code: "XOF", rate: 655.957, symbol: "CFA" },
  "mali": { code: "XOF", rate: 655.957, symbol: "CFA" },
  "guinea": { code: "GNF", rate: 9350, symbol: "FG" },
  "guinée": { code: "GNF", rate: 9350, symbol: "FG" },
  "cameroon": { code: "XAF", rate: 655.957, symbol: "FCFA" },
  "cameroun": { code: "XAF", rate: 655.957, symbol: "FCFA" },
  "gabon": { code: "XAF", rate: 655.957, symbol: "FCFA" },
  "congo": { code: "XAF", rate: 655.957, symbol: "FCFA" },
  "united states": { code: "USD", rate: 1.08, symbol: "$" },
  "états-unis": { code: "USD", rate: 1.08, symbol: "$" },
};

const formatMoney = (amount: string | number, currency: string = "EUR") => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currency || "EUR",
    maximumFractionDigits: 0,
  }).format(Number(amount));
};

const formatLocalMoney = (eurAmount: number, countryName: string = "") => {
  const normalizedCountry = countryName.toLowerCase().trim();
  let config = { code: "EUR", rate: 1, symbol: "€" };
  for (const key in CURRENCY_MAP) {
    if (normalizedCountry.includes(key)) {
      config = CURRENCY_MAP[key];
      break;
    }
  }
  const localAmount = eurAmount * config.rate;
  const formatted = new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 0,
  }).format(localAmount);
  return `${formatted} ${config.symbol}`;
};

const formatPercent = (value: number) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format((value || 0) / 100);
};

export default function CreatorDashboard() {
  const { creatorProfile, isLoading: authLoading } = useAuth();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [rangeType, setRangeType] = useState<string>("allTime");
  const [params, setParams] = useState({
    start_date: undefined as string | undefined,
    end_date: undefined as string | undefined,
  });

  const countryFlag = useMemo(() => {
    if (!creatorProfile?.country) return null;
    const country = Country.getAllCountries().find(c => c.name === creatorProfile.country);
    return country?.flag || null;
  }, [creatorProfile?.country]);

  const { data: kpis, isLoading: isLoadingKpis } = useQuery({
    queryKey: ["creator-kpis-individual", creatorProfile?.id, params],
    queryFn: () => creatorsService.getCreatorKpis(creatorProfile!.id, params),
    enabled: !!creatorProfile?.id,
  });

  const { data: promoCodes, isLoading: isLoadingCodes } = useQuery({
    queryKey: ["creator-promo-codes-list", creatorProfile?.id],
    queryFn: () => promoCodesService.getPromoCodes({ creator: creatorProfile?.id, page_size: 5 }),
    enabled: !!creatorProfile?.id,
  });

  const handleRangeChange = (value: string) => {
    setRangeType(value);
    if (value === "custom") return;
    let start: Date | null = null;
    let end: Date | null = null;
    switch (value) {
      case "allTime": start = null; end = null; break;
      case "today": start = startOfToday(); end = endOfToday(); break;
      case "last7days": start = subDays(startOfToday(), 7); end = endOfToday(); break;
      case "last30days": start = subDays(startOfToday(), 30); end = endOfToday(); break;
      case "thisMonth": start = startOfMonth(new Date()); end = endOfToday(); break;
      default: start = null; end = null;
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

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success("Code promo copié !");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (authLoading || (!!creatorProfile?.id && isLoadingKpis)) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-sm font-bold text-muted-foreground animate-pulse">Chargement de ton espace...</p>
        </div>
      </div>
    );
  }

  const totalCommissions = Number(kpis?.total_commissions || 0);

  return (
    <div className="space-y-6 md:space-y-10 pb-20 animate-in fade-in duration-700 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="text-5xl md:text-7xl drop-shadow-xl animate-in zoom-in duration-500 select-none flex-shrink-0">
            {countryFlag || "🌍"}
          </div>
          <div className="min-w-0">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter text-slate-900 dark:text-white truncate">
              Hello, {creatorProfile?.first_name} <span className="animate-bounce inline-block">👋</span>
            </h1>
            <p className="text-sm md:text-lg text-muted-foreground mt-1 md:mt-2 font-medium">
              {rangeType === "allTime" 
                ? "Tes performances globales depuis ton arrivée."
                : "Performance pour la période sélectionnée."}
            </p>
          </div>
        </div>

        {/* Date Filter Panel */}
        <div className="flex flex-col sm:flex-row items-center gap-3 bg-card/50 p-2 rounded-2xl border border-border/50 backdrop-blur-md shadow-sm w-full lg:w-auto">
          {rangeType === "custom" && (
            <div className="flex items-center gap-2 animate-in zoom-in duration-300 w-full sm:w-auto">
              <Input 
                type="date" 
                value={params.start_date || ""}
                onChange={(e) => handleCustomDateChange("start", e.target.value)}
                className="h-10 flex-1 sm:w-[130px] bg-background/50 border-none rounded-xl text-xs font-bold"
              />
              <Input 
                type="date" 
                value={params.end_date || ""}
                onChange={(e) => handleCustomDateChange("end", e.target.value)}
                className="h-10 flex-1 sm:w-[130px] bg-background/50 border-none rounded-xl text-xs font-bold"
              />
            </div>
          )}
          <Select value={rangeType} onValueChange={handleRangeChange}>
            <SelectTrigger className="w-full sm:w-[180px] h-10 bg-background/50 border-none rounded-xl font-black text-[10px] uppercase tracking-widest">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border/50">
              <SelectItem value="allTime">Toute la période</SelectItem>
              <SelectItem value="today">Aujourd&apos;hui</SelectItem>
              <SelectItem value="last7days">7 derniers jours</SelectItem>
              <SelectItem value="last30days">30 derniers jours</SelectItem>
              <SelectItem value="thisMonth">Mois en cours</SelectItem>
              <SelectItem value="custom" className="font-bold text-primary">Personnalisé</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { title: "Mes Commissions", value: formatMoney(totalCommissions, kpis?.currency || creatorProfile?.currency), icon: Wallet, color: "text-indigo-500", bg: "bg-indigo-500/10", desc: "Tes gains Euro" },
          { title: "Leads Apportés", value: kpis?.total_leads || 0, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", desc: "Prospects" },
          { title: "Ventes Réussies", value: kpis?.total_contracts || 0, icon: FileCheck, color: "text-emerald-500", bg: "bg-emerald-500/10", desc: "Contrats" },
          { title: "Conversion", value: formatPercent(kpis?.conversion_rate || 0), icon: Target, color: "text-rose-500", bg: "bg-rose-500/10", desc: "Efficacité" }
        ].map((stat, idx) => (
          <Card key={idx} className="border-border/50 bg-card/40 backdrop-blur-md hover:shadow-xl transition-all duration-300 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden group">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-start justify-between mb-4 md:mb-6">
                <div className={cn("p-3 md:p-4 rounded-2xl shadow-inner group-hover:scale-110 transition-transform", stat.bg, stat.color)}>
                  <stat.icon className="h-6 w-6 md:h-7 md:h-7" />
                </div>
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              </div>
              <div className="space-y-1 md:space-y-2">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stat.title}</p>
                <h3 className="text-3xl md:text-4xl font-black tracking-tighter truncate">{stat.value}</h3>
                <p className="text-[10px] md:text-xs text-muted-foreground font-medium italic truncate">{stat.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:gap-8 lg:grid-cols-3">
        {/* Active Codes */}
        <Card className="lg:col-span-2 border-border/50 bg-card/40 backdrop-blur-md rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between p-6 md:p-8 border-b border-border/50 bg-muted/20">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <Tag className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg md:text-xl font-black tracking-tight">Codes Promo Actifs</CardTitle>
            </div>
            <Link href="/my-space/promo-codes">
              <Button variant="ghost" size="sm" className="text-primary font-bold hover:bg-primary/5 rounded-xl text-xs">
                Tout voir <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <div className="space-y-4">
              {isLoadingCodes ? (
                Array(2).fill(0).map((_, i) => (
                  <div key={i} className="h-20 w-full bg-muted/50 animate-pulse rounded-2xl" />
                ))
              ) : promoCodes?.results.length === 0 ? (
                <div className="text-center py-12 flex flex-col items-center gap-4">
                  <p className="text-muted-foreground font-bold italic text-sm">Aucun code actif.</p>
                </div>
              ) : (
                promoCodes?.results.map((code) => (
                  <div 
                    key={code.id}
                    className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-5 rounded-[1.5rem] border border-border/50 bg-white/5 dark:bg-slate-900/50 hover:bg-primary/[0.02] hover:border-primary/20 transition-all duration-300 gap-4"
                  >
                    <div className="flex items-center gap-4 md:gap-5">
                      <div className="p-3 md:p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary group-hover:scale-105 transition-transform">
                        <Gift className="h-5 w-5 md:h-6 md:h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 md:gap-3">
                          <span className="font-black text-xl md:text-2xl tracking-tighter">{code.code}</span>
                          <Badge className="bg-primary text-white border-none text-[8px] md:text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                            {code.commission_rate}% COM.
                          </Badge>
                        </div>
                        <p className="text-[10px] md:text-xs text-muted-foreground font-semibold mt-1">
                          {code.bonus_amount > 0 ? `🔥 +${formatMoney(code.bonus_amount, kpis?.currency || creatorProfile?.currency)} bonus` : "✨ Commission standard"}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full sm:w-auto rounded-xl border-border/50 font-bold gap-2 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all text-xs h-10"
                      onClick={() => handleCopy(code.code)}
                    >
                      {copiedCode === code.code ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {copiedCode === code.code ? "Copié" : "Copier"}
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Currency Conversion Card */}
        <div className="space-y-6">
          <Card className="border-border/60 bg-white dark:bg-slate-900 shadow-2xl rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
              <Coins className="h-32 w-32 rotate-12" />
            </div>
            <CardHeader className="p-6 md:p-8 pb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <Globe className="h-5 w-5" />
                </div>
                <CardTitle className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white">Conversion</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 md:p-8 pt-2 space-y-6">
              <p className="text-xs md:text-sm text-muted-foreground font-medium leading-relaxed">
                Gains estimés dans ta devise locale : <span className="text-primary font-bold">{creatorProfile?.country || "Non défini"}</span>.
              </p>
              
              <div className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-slate-50 dark:bg-white/5 border border-border/50 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Valeur Estimée</span>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-primary break-all">
                  {formatLocalMoney(totalCommissions, creatorProfile?.country || "France")}
                </h2>
                <div className="mt-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/5 border border-primary/10">
                  <span className="text-[9px] font-black text-primary uppercase tracking-tighter">Taux Indicatif</span>
                </div>
              </div>

              <div className="pt-6 border-t border-border/50 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Paiement prévu</span>
                  <span className="text-slate-900 dark:text-emerald-400 font-black text-lg">05 JUIN 2026</span>
                </div>
                <Badge className="bg-primary/10 text-primary border-none text-[9px] font-black uppercase">Automatique</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Support Card */}
          <Card className="border-border/50 bg-card/40 backdrop-blur-md rounded-[1.5rem] md:rounded-[2rem] p-6 border-dashed group hover:border-primary/50 transition-colors">
            <CardContent className="p-0 flex flex-col items-center text-center gap-4">
              <div className="p-3 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                <Mail className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <p className="font-black text-sm uppercase">Besoin d&apos;aide ?</p>
                <p className="text-xs text-muted-foreground px-2">Une question sur tes commissions ? Contacte ton gestionnaire.</p>
              </div>
              <Button asChild variant="outline" className="w-full rounded-xl font-bold h-11 border-border/60 hover:bg-primary hover:text-white hover:border-primary transition-all">
                <a href="mailto:contact@papiers-express.fr">Contacter par mail</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useAuth } from "@/providers/auth-provider";
import { useQuery } from "@tanstack/react-query";
import { creatorsService } from "@/features/creators/services/creators.service";
import { MetricCard } from "@/shared/components/cards/MetricCard";
import { 
  Users, 
  Target, 
  Euro, 
  Wallet, 
  TrendingUp, 
  ArrowRight,
  Gift,
  Copy,
  Check,
  Tag
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { promoCodesService } from "@/features/promo-codes/services/promo-codes.service";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/shared/components/ui/badge";

const formatMoney = (amount: string | number, currency: string = "EUR") => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currency,
  }).format(Number(amount));
};

const formatPercent = (value: number) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
};

export default function CreatorDashboard() {
  const { creatorProfile } = useAuth();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const { data: kpis, isLoading: isLoadingKpis } = useQuery({
    queryKey: ["creator-kpis-lifetime", creatorProfile?.id],
    queryFn: () => creatorsService.getCreatorKpis(creatorProfile!.id),
    enabled: !!creatorProfile?.id,
  });

  const { data: promoCodes, isLoading: isLoadingCodes } = useQuery({
    queryKey: ["creator-promo-codes", creatorProfile?.id],
    queryFn: () => promoCodesService.getPromoCodes({ page_size: 5 }), // Just top 5
    enabled: !!creatorProfile?.id,
  });

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success("Code promo copié !");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          Bienvenue, {creatorProfile?.first_name} 👋
        </h1>
        <p className="text-muted-foreground mt-2">
          Voici un aperçu de vos performances et de votre impact commercial.
        </p>
      </div>

      {/* Summary Ribbon */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <MetricCard
          title="Chiffre d'Affaires"
          value={formatMoney(kpis?.total_revenue || 0, creatorProfile?.currency)}
          icon={Euro}
          colorPreset="violet"
          description="Impact commercial généré"
        />
        <MetricCard
          title="Mes Commissions"
          value={formatMoney(kpis?.total_commissions || 0, creatorProfile?.currency)}
          icon={Wallet}
          colorPreset="emerald"
          description="Vos revenus cumulés"
        />
        <MetricCard
          title="Leads Apportés"
          value={kpis?.total_leads || 0}
          icon={Users}
          colorPreset="amber"
          description="Prospects recommandés"
        />
        <MetricCard
          title="Conversion"
          value={formatPercent(kpis?.conversion_rate || 0)}
          icon={Target}
          colorPreset="rose"
          description="Qualité de l'audience"
        />
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Active Codes */}
        <Card className="lg:col-span-2 border-border/50 bg-card/60 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-primary" />
              <CardTitle>Mes Codes Promo Actifs</CardTitle>
            </div>
            <Link href="/my-space/promo-codes">
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                Tout voir <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoadingCodes ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="h-16 w-full bg-muted animate-pulse rounded-xl" />
                ))
              ) : promoCodes?.results.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  Vous n&apos;avez pas encore de code promo actif.
                </div>
              ) : (
                promoCodes?.results.map((code) => (
                  <div 
                    key={code.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-white dark:bg-slate-900 shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-primary/10 text-primary">
                        <Gift className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-lg tracking-tight">{code.code}</span>
                          <Badge variant="secondary" className="text-[10px] uppercase">
                            {code.commission_rate}% Com.
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {code.bonus_amount > 0 ? `+ ${formatMoney(code.bonus_amount, creatorProfile?.currency)} de bonus` : "Commission standard"}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2"
                      onClick={() => handleCopy(code.code)}
                    >
                      {copiedCode === code.code ? (
                        <Check className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      {copiedCode === code.code ? "Copié" : "Copier"}
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Tips / Actions */}
        <Card className="border-border/50 bg-slate-900 text-white overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              Boostez vos gains
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm text-slate-400">
                Saviez-vous que partager votre code en Story Instagram augmente votre conversion de 25% ?
              </p>
            </div>
            <div className="space-y-3">
              <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white border-none shadow-lg shadow-emerald-500/20">
                Partager mon code
              </Button>
              <Link href="/my-space/performance" className="block w-full">
                <Button variant="outline" className="w-full border-slate-700 bg-transparent text-white hover:bg-slate-800">
                  Analyser mes stats
                </Button>
              </Link>
            </div>
            <div className="pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Paiement prévu</span>
                <span className="font-bold text-emerald-400">Le 5 du mois</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

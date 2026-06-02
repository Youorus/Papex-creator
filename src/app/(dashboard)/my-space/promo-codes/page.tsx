"use client";

import { useAuth } from "@/providers/auth-provider";
import { useQuery } from "@tanstack/react-query";
import { promoCodesService } from "@/features/promo-codes/services/promo-codes.service";
import { 
  Gift, 
  Copy, 
  Check, 
  Calendar, 
  TrendingUp, 
  Percent,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const formatMoney = (amount: string | number, currency: string = "EUR") => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currency,
  }).format(Number(amount));
};

export default function MyPromoCodesPage() {
  const { creatorProfile } = useAuth();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const { data: promoCodes, isLoading } = useQuery({
    queryKey: ["creator-promo-codes-full", creatorProfile?.id],
    queryFn: () => promoCodesService.getPromoCodes({ page_size: 100 }),
    enabled: !!creatorProfile?.id,
  });

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success("Code promo copié !");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          Mes Codes Promo
        </h1>
        <p className="text-muted-foreground mt-2">
          Retrouvez ici tous vos codes actifs et vos conditions de commissionnement.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-48 w-full bg-muted animate-pulse rounded-2xl" />
          ))
        ) : promoCodes?.results.length === 0 ? (
          <Card className="md:col-span-2 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Gift className="h-12 w-12 mb-4 opacity-20" />
              <p>Aucun code promo n&apos;est actuellement rattaché à votre compte.</p>
              <p className="text-sm">Contactez votre manager si vous pensez qu&apos;il s&apos;agit d&apos;une erreur.</p>
            </CardContent>
          </Card>
        ) : (
          promoCodes?.results.map((code) => (
            <Card key={code.id} className="group relative overflow-hidden border-border/50 bg-card/60 backdrop-blur-md hover:shadow-xl transition-all duration-300 rounded-2xl">
              <div className="absolute top-0 right-0 p-4">
                <Badge 
                  variant={code.status === "ACTIVE" ? "default" : "secondary"}
                  className={code.status === "ACTIVE" ? "bg-emerald-500 hover:bg-emerald-500" : ""}
                >
                  {code.status === "ACTIVE" ? "Actif" : "Expiré"}
                </Badge>
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle className="text-3xl font-black tracking-tighter flex items-center gap-2">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg">
                    {code.code}
                  </span>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                      <Percent className="h-3 w-3" /> Commission
                    </p>
                    <p className="text-xl font-black text-emerald-500">{code.commission_rate}%</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" /> Bonus Vente
                    </p>
                    <p className="text-xl font-black text-primary">
                      {code.bonus_amount > 0 ? `+ ${formatMoney(code.bonus_amount, creatorProfile?.currency)}` : "Aucun"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-xl">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {code.valid_until 
                      ? `Expire le ${format(new Date(code.valid_until), "dd MMMM yyyy", { locale: fr })}`
                      : "Validité illimitée"}
                  </span>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    className="flex-1 font-bold h-12 rounded-xl shadow-lg shadow-primary/20"
                    onClick={() => handleCopy(code.code)}
                  >
                    {copiedCode === code.code ? (
                      <Check className="mr-2 h-5 w-5" />
                    ) : (
                      <Copy className="mr-2 h-5 w-5" />
                    )}
                    {copiedCode === code.code ? "Copié !" : "Copier mon code"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      </div>
      );
      }

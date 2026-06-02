import { CreatorProfile } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { CreatorStatusBadge } from "./CreatorStatusBadge";
import { Mail, Phone, Calendar, Tag, FileText, Globe, Copy, Check, Edit2, Loader2, Euro, Clock, Info } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";
import { useState, useMemo } from "react";
import { Country } from "country-state-city";
import { usePromoCodes, useUpdatePromoCode, useCreatePromoCode } from "@/features/promo-codes/hooks/use-promo-codes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { PromoCodeForm } from "@/features/promo-codes/components/PromoCodeForm";
import { PromoCodeStatusBadge } from "@/features/promo-codes/components/PromoCodeStatusBadge";

interface CreatorDetailCardProps {
  creator: CreatorProfile;
}

export function CreatorDetailCard({ creator }: CreatorDetailCardProps) {
  const [copied, setCopied] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const { data: promoCodesData, isLoading: isLoadingPromo } = usePromoCodes({ creator: creator.id });
  const { mutate: updatePromoCode, isPending: isUpdating } = useUpdatePromoCode();
  const { mutate: createPromoCode, isPending: isCreating } = useCreatePromoCode();

  const mainPromoCode = useMemo(() => {
    if (!promoCodesData?.results?.length) return null;
    return promoCodesData.results.find(pc => pc.code === creator.promo_code) || promoCodesData.results[0];
  }, [promoCodesData, creator.promo_code]);

  const countryFlag = useMemo(() => {
    if (!creator.country) return null;
    const country = Country.getAllCountries().find(c => c.name === creator.country);
    return country?.flag || null;
  }, [creator.country]);

  const copyPromoCode = () => {
    const codeToCopy = mainPromoCode?.code || creator.promo_code;
    if (codeToCopy) {
      navigator.clipboard.writeText(codeToCopy);
      setCopied(true);
      toast.success("Code promo copié");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePromoSubmit = (values: any) => {
    if (mainPromoCode) {
      updatePromoCode({ id: mainPromoCode.id, payload: values }, {
        onSuccess: () => setIsFormOpen(false)
      });
    } else {
      createPromoCode({ ...values, creator_id: creator.id }, {
        onSuccess: () => setIsFormOpen(false)
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-2 border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Informations Personnelles</CardTitle>
          <CreatorStatusBadge status={creator.status} />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Mail className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Email</p>
                <p className="font-medium">{creator.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Phone className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Téléphone</p>
                <p className="font-medium">{creator.phone_number || "Non renseigné"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Globe className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Localisation</p>
                <p className="font-medium flex items-center gap-2">
                  {countryFlag && <span className="text-lg">{countryFlag}</span>}
                  {creator.city && creator.country ? `${creator.city}, ${creator.country}` : creator.city || creator.country || "Non renseignée"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Inscrit le</p>
                <p className="font-medium">
                  {format(new Date(creator.created_at), "dd MMMM yyyy", { locale: fr })}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border/50">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <h4 className="text-sm font-semibold">Notes</h4>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <p className="text-sm text-muted-foreground whitespace-pre-wrap italic">
                {creator.notes || "Aucune note pour ce créateur."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden group relative">
          <div className="absolute top-0 right-0 p-3 flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => setIsFormOpen(true)}
            >
              <Edit2 className="h-3.5 w-3.5" />
            </Button>
          </div>
          
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Tag className="h-4 w-4 text-primary" />
              Code Promo Actif
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {isLoadingPromo ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary/50" />
              </div>
            ) : mainPromoCode ? (
              <div className="space-y-4">
                <div className="w-full p-6 rounded-xl bg-primary/5 border border-primary/20 flex flex-col items-center justify-center gap-2 relative overflow-hidden group-hover:bg-primary/10 transition-colors">
                  <div className="absolute top-0 right-0 p-1">
                    <Tag className="h-12 w-12 text-primary/5 -rotate-12 translate-x-4 -translate-y-4" />
                  </div>
                  <span className="text-4xl font-black tracking-tighter text-primary">
                    {mainPromoCode.code}
                  </span>
                  <PromoCodeStatusBadge status={mainPromoCode.status} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Commission</p>
                    <p className="text-lg font-bold">{mainPromoCode.commission_rate}%</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Bonus</p>
                    <p className="text-lg font-bold">{mainPromoCode.bonus_amount}€</p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-muted/30 border border-border/50 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Validité
                    </p>
                    <p className="text-xs font-semibold">
                      {mainPromoCode.valid_until 
                        ? format(new Date(mainPromoCode.valid_until), "dd MMM yyyy", { locale: fr })
                        : "Illimitée"}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 hover:bg-primary/10" 
                    onClick={copyPromoCode}
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 border-2 border-dashed rounded-xl flex flex-col items-center gap-3">
                <Info className="h-8 w-8 text-muted-foreground/30" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold">Aucun code actif</p>
                  <p className="text-xs text-muted-foreground">Générez un code pour ce créateur.</p>
                </div>
                <Button size="sm" onClick={() => setIsFormOpen(true)}>
                  Générer maintenant
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {mainPromoCode ? "Gérer le code promo" : "Nouveau code promo"}
            </DialogTitle>
          </DialogHeader>
          <PromoCodeForm
            creatorId={creator.id}
            initialData={mainPromoCode || undefined}
            onSubmit={handlePromoSubmit}
            isLoading={isUpdating || isCreating}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { CreatorProfile } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { CreatorStatusBadge } from "./CreatorStatusBadge";
import { Mail, Phone, MapPin, Calendar, Percent, Tag, FileText } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface CreatorDetailCardProps {
  creator: CreatorProfile;
}

export function CreatorDetailCard({ creator }: CreatorDetailCardProps) {
  const [copied, setCopied] = useState(false);

  const copyPromoCode = () => {
    navigator.clipboard.writeText(creator.promo_code);
    setCopied(true);
    toast.success("Code promo copié");
    setTimeout(() => setCopied(false), 2000);
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
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Localisation</p>
                <p className="font-medium">
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
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Tag className="h-4 w-4 text-primary" />
              Code Promo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4 py-2">
              <div className="w-full p-4 rounded-xl bg-primary/5 border border-primary/20 flex flex-col items-center justify-center gap-2">
                <span className="text-3xl font-black tracking-tighter text-primary">
                  {creator.promo_code}
                </span>
              </div>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={copyPromoCode}
              >
                {copied ? <Check className="mr-2 h-4 w-4 text-emerald-500" /> : <Copy className="mr-2 h-4 w-4" />}
                {copied ? "Copié !" : "Copier le code"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-primary/5 pb-4">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-primary">
              <Percent className="h-4 w-4" />
              Commission
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-5xl font-black tracking-tighter text-foreground">
                {creator.commission_rate}
              </span>
              <span className="text-xl font-bold text-muted-foreground">%</span>
            </div>
            <p className="text-center text-xs text-muted-foreground mt-4">
              Taux appliqué sur chaque vente générée.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

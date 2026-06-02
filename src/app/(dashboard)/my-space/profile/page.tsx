"use client";

import { useAuth } from "@/providers/auth-provider";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Globe,
  Calendar,
  Lock,
  BadgeCheck,
  Smartphone,
  Hash
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { AppAvatar } from "@/shared/components/avatar/AppAvatar";
import { Badge } from "@/shared/components/ui/badge";
import { useMemo } from "react";
import { Country } from "country-state-city";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

export default function CreatorProfilePage() {
  const { creatorProfile } = useAuth();

  const countryFlag = useMemo(() => {
    if (!creatorProfile?.country) return null;
    const country = Country.getAllCountries().find(c => c.name === creatorProfile.country);
    return country?.flag || null;
  }, [creatorProfile?.country]);

  if (!creatorProfile) return null;

  const infoItems = [
    { label: "Prénom", value: creatorProfile.first_name, icon: User },
    { label: "Nom", value: creatorProfile.last_name, icon: User },
    { label: "Email Professionnel", value: creatorProfile.email, icon: Mail, highlight: true },
    { label: "Téléphone", value: creatorProfile.phone_number || "Non renseigné", icon: Smartphone },
    { label: "Code Ambassadeur", value: creatorProfile.promo_code, icon: Hash, isCode: true },
    { label: "Taux de Commission", value: `${creatorProfile.commission_rate}%`, icon: BadgeCheck },
  ];

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-700 max-w-5xl mx-auto">
      {/* Header Profile */}
      <div className="relative">
        <div className="h-48 w-full bg-gradient-to-r from-primary/20 via-primary/10 to-transparent rounded-[2.5rem] border border-primary/10" />
        <div className="absolute -bottom-12 left-10 flex flex-col md:flex-row items-end gap-6">
          <div className="relative group">
            <AppAvatar 
              name={creatorProfile.full_name} 
              className="h-32 w-32 md:h-40 md:w-40 rounded-[2.5rem] border-4 border-background shadow-2xl transition-transform group-hover:scale-105 duration-500"
            />
            <div className="absolute -bottom-2 -right-2 p-2 bg-primary text-white rounded-2xl shadow-lg border-2 border-background">
                <Shield className="h-6 w-6" />
            </div>
          </div>
          <div className="mb-4 space-y-1">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
              {creatorProfile.full_name}
            </h1>
            <div className="flex items-center gap-3">
              <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-bold uppercase text-[10px] tracking-widest px-3 py-1 rounded-full">
                Ambassadeur Certifié
              </Badge>
              <span className="text-muted-foreground text-sm font-medium flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                Depuis {format(new Date(creatorProfile.created_at), "MMMM yyyy", { locale: fr })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 mt-20">
        {/* Left: Vital Stats */}
        <div className="space-y-6">
            <Card className="border-border/50 bg-card/40 backdrop-blur-md rounded-[2.5rem] overflow-hidden shadow-xl">
                <CardHeader className="bg-primary/5 pb-4 border-b border-border/10">
                    <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                        <Globe className="h-4 w-4 text-primary" />
                        Localisation
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8 flex flex-col items-center gap-4 text-center">
                    <div className="text-8xl drop-shadow-2xl animate-in zoom-in duration-700">
                        {countryFlag || "🌍"}
                    </div>
                    <div className="space-y-1">
                        <p className="text-2xl font-black tracking-tight">{creatorProfile.country || "Non défini"}</p>
                        <p className="text-muted-foreground font-bold">{creatorProfile.city || "Ville non précisée"}</p>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-border/50 bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                    <Lock className="h-24 w-24" />
                </div>
                <div className="space-y-4 relative z-10">
                    <p className="text-xl font-black tracking-tight">Accès Sécurisé</p>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                        Tes informations personnelles sont protégées et ne sont jamais partagées avec des tiers. Pour toute modification, contacte l&apos;administration.
                    </p>
                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">ID Unique</span>
                        <span className="text-[10px] font-mono text-primary">{creatorProfile.id.substring(0, 8)}...</span>
                    </div>
                </div>
            </Card>
        </div>

        {/* Right: Detailed Info (Read Only) */}
        <div className="lg:col-span-2">
            <Card className="border-border/50 bg-card/40 backdrop-blur-md rounded-[2.5rem] shadow-xl h-full">
                <CardHeader className="p-8 pb-0">
                    <CardTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
                        Fiche d&apos;Identité
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {infoItems.map((item, idx) => (
                            <div key={idx} className="space-y-2 group">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 group-hover:text-primary transition-colors">
                                    <item.icon className="h-3 w-3" /> {item.label}
                                </label>
                                <div className={cn(
                                    "p-4 rounded-2xl border border-border/50 bg-background/50 font-bold transition-all group-hover:border-primary/30",
                                    item.highlight && "text-primary bg-primary/5 border-primary/20",
                                    item.isCode && "font-mono tracking-wider text-xl uppercase"
                                )}>
                                    {item.value}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 p-6 rounded-3xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-4">
                        <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 shadow-inner">
                            <Shield className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                            <p className="font-black text-sm uppercase text-amber-900 dark:text-amber-400">Mode Consultation Seule</p>
                            <p className="text-xs text-amber-800 dark:text-amber-500/80 leading-relaxed font-medium">
                                En tant qu&apos;ambassadeur certifié, ton profil est verrouillé pour garantir la conformité de ton contrat. Si tu souhaites mettre à jour une information, merci de nous envoyer un justificatif via l&apos;assistance.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

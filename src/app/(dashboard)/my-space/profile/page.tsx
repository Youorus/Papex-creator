"use client";

import { useAuth } from "@/providers/auth-provider";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Bell, 
  Wallet,
  Settings,
  CreditCard
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { AppAvatar } from "@/shared/components/avatar/AppAvatar";

export default function CreatorProfilePage() {
  const { creatorProfile } = useAuth();

  if (!creatorProfile) return null;

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          Mon Profil
        </h1>
        <p className="text-muted-foreground mt-2">
          Gérez vos informations personnelles et vos préférences de paiement.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="lg:col-span-1 border-border/50 bg-card/60 backdrop-blur-md">
          <CardContent className="pt-10 flex flex-col items-center text-center">
            <AppAvatar 
              name={creatorProfile.full_name} 
              className="h-24 w-24 mb-4 ring-4 ring-primary/10"
            />
            <h2 className="text-2xl font-black tracking-tight">{creatorProfile.full_name}</h2>
            <p className="text-primary font-bold">{creatorProfile.email}</p>
            <div className="mt-6 w-full space-y-3">
              <div className="flex items-center justify-between text-sm p-3 bg-muted/50 rounded-xl">
                <span className="text-muted-foreground">Statut Compte</span>
                <span className="font-bold text-emerald-500">Vérifié</span>
              </div>
              <div className="flex items-center justify-between text-sm p-3 bg-muted/50 rounded-xl">
                <span className="text-muted-foreground">Devise de Travail</span>
                <span className="font-black">{creatorProfile.currency}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Tabs/Sections */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/50 bg-card/60 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Informations Personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input id="firstName" defaultValue={creatorProfile.first_name} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input id="lastName" defaultValue={creatorProfile.last_name} disabled />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email professionnel</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" className="pl-9" defaultValue={creatorProfile.email} disabled />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="phone" className="pl-9" defaultValue={creatorProfile.phone_number || ""} placeholder="Non renseigné" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Localisation</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="location" className="pl-9" defaultValue={`${creatorProfile.city || ""}, ${creatorProfile.country || ""}`} placeholder="Non renseigné" />
                </div>
              </div>
              <Button className="mt-4">Enregistrer les modifications</Button>
            </CardContent>
          </Card>

          {/* Payment Section */}
          <Card className="border-border/50 bg-card/60 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-emerald-500" />
                Configuration des Paiements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Choisissez votre méthode de paiement préférée pour vos commissions.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border-2 border-primary bg-primary/5 flex items-start gap-3 cursor-pointer">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-bold">Virement Bancaire (IBAN)</p>
                    <p className="text-xs text-muted-foreground">Recommandé pour {creatorProfile.currency}</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-border bg-card flex items-start gap-3 cursor-pointer hover:border-primary/50 transition-colors">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-bold">PayPal</p>
                    <p className="text-xs text-muted-foreground">Frais de service applicables</p>
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <Button variant="outline" className="w-full sm:w-auto">Ajouter un RIB</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

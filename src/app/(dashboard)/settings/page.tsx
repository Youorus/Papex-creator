"use client";

import { useAuth } from "@/providers/auth-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { User, Mail, Shield } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground">
          Gérez vos préférences et informations de compte.
        </p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Profil</CardTitle>
            <CardDescription>Vos informations personnelles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User size={32} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">ID Utilisateur</p>
                <p className="font-mono text-sm">{user?.id}</p>
              </div>
            </div>
            
            <div className="grid gap-2">
              <div className="flex items-center space-x-2">
                <Mail size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium">Email:</span>
                <span className="text-sm">{user?.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium">Rôle:</span>
                <Badge variant="outline">{user?.role}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sécurité</CardTitle>
            <CardDescription>Gérez votre mot de passe et vos accès</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Les fonctionnalités de changement de mot de passe seront disponibles prochainement.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

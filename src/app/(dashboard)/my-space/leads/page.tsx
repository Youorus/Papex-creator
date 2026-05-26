"use client";

import { useAuth } from "@/providers/auth-provider";
import { useQuery } from "@tanstack/react-query";
import { socialLeadsService } from "@/features/social-leads/services/social-leads.service";
import { 
  Users, 
  Search, 
  Filter, 
  Calendar,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/shared/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ContactStatus } from "@/features/social-leads/types";

const statusConfig: Record<ContactStatus, { label: string; icon: any; className: string }> = {
  NEW: { label: "Nouveau", icon: Clock, className: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  TO_CONTACT: { label: "À contacter", icon: MessageSquare, className: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  CONTACTED: { label: "Contacté", icon: MessageSquare, className: "bg-slate-500/10 text-slate-500 border-slate-500/20" },
  POSITIVE: { label: "Intéressé", icon: CheckCircle2, className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  NEGATIVE: { label: "Pas intéressé", icon: XCircle, className: "bg-rose-500/10 text-rose-500 border-rose-500/20" },
  CONVERTED: { label: "Contrat Signé", icon: CheckCircle2, className: "bg-primary text-white border-transparent" },
  NOT_RELEVANT: { label: "Non pertinent", icon: XCircle, className: "bg-slate-500/10 text-slate-500 border-slate-500/20" },
};

export default function LeadTrackingPage() {
  const { creatorProfile } = useAuth();
  const [search, setSearch] = useState("");

  const { data: leads, isLoading } = useQuery({
    queryKey: ["creator-leads", creatorProfile?.id],
    queryFn: () => socialLeadsService.getSocialLeads({ creator_profile: creatorProfile?.id, page_size: 100 } as any),
    enabled: !!creatorProfile?.id,
  });

  const filteredLeads = leads?.results.filter(lead => 
    lead.username.toLowerCase().includes(search.toLowerCase()) ||
    lead.display_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          Suivi des Leads
        </h1>
        <p className="text-muted-foreground mt-2">
          Suivez l&apos;avancement des prospects qui ont utilisé vos codes promo.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher un prospect..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white dark:bg-slate-900"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filtrer par date</span>
        </div>
      </div>

      <Card className="border-border/50 bg-card/60 backdrop-blur-md overflow-hidden rounded-2xl">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 dark:bg-slate-900/50">
                <TableHead>Prospect (Anonymisé)</TableHead>
                <TableHead>Date d&apos;arrivée</TableHead>
                <TableHead>Plateforme</TableHead>
                <TableHead>Statut du Dossier</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={4} className="h-12 bg-muted/20 animate-pulse" />
                  </TableRow>
                ))
              ) : filteredLeads?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                    Aucun lead trouvé pour le moment.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLeads?.map((lead) => {
                  const status = statusConfig[lead.contact_status] || statusConfig.NEW;
                  const StatusIcon = status.icon;
                  // Anonymize: Only show first name or first part of username
                  const displayName = lead.display_name?.split(' ')[0] || lead.username.substring(0, 4) + '***';

                  return (
                    <TableRow key={lead.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-bold text-slate-700 dark:text-slate-300">
                        {displayName}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5" />
                          {format(new Date(lead.created_at), "dd MMM yyyy", { locale: fr })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {lead.platform.toLowerCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={status.className}>
                          <StatusIcon className="mr-1.5 h-3 w-3" />
                          {status.label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-slate-100 dark:bg-slate-900 p-4 rounded-xl">
        <Users className="h-4 w-4" />
        <p>
          Pour des raisons de confidentialité (RGPD), les noms de famille et coordonnées des prospects ne sont pas affichés avant la signature finale.
        </p>
      </div>
    </div>
  );
}

import { SocialAccountLead } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { SocialLeadStatusBadge } from "./SocialLeadStatusBadge";
import { SocialPlatformBadge } from "./SocialPlatformBadge";
import { 
  Users, 
  ExternalLink, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  XCircle,
  Link2,
  Mail,
  MapPin,
  Globe2,
  Tag,
  Activity
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface SocialLeadDetailCardProps {
  lead: SocialAccountLead;
}

export function SocialLeadDetailCard({ lead }: SocialLeadDetailCardProps) {
  const formatFollowers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-2 border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-3">
              {lead.username}
              <SocialPlatformBadge platform={lead.platform} />
            </CardTitle>
            {lead.display_name && (
              <p className="text-muted-foreground">{lead.display_name}</p>
            )}
          </div>
          <SocialLeadStatusBadge status={lead.contact_status} />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Followers</p>
                <p className="font-bold text-lg">{formatFollowers(lead.followers_count)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                lead.is_viable ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
              )}>
                {lead.is_viable ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Viabilité</p>
                <p className="font-medium">{lead.is_viable ? "Profil Viable" : "Non Viable"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Ajouté le</p>
                <p className="font-medium">
                  {format(new Date(lead.created_at), "dd MMMM yyyy", { locale: fr })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <ExternalLink className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Lien Profil</p>
                {lead.profile_url ? (
                  <a 
                    href={lead.profile_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-medium text-primary hover:underline flex items-center gap-1"
                  >
                    Ouvrir le profil <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <p className="font-medium text-muted-foreground italic">Non renseigné</p>
                )}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border/50 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted text-muted-foreground">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Pays</p>
                <p className="font-medium">{lead.country || "Non renseigné"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted text-muted-foreground">
                <Globe2 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Langue</p>
                <p className="font-medium uppercase">{lead.language || "Non renseignée"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted text-muted-foreground">
                <Tag className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Catégories</p>
                <p className="font-medium">{lead.categories || "Non renseignées"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted text-muted-foreground">
                <Activity className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Source</p>
                <p className="font-medium truncate max-w-[150px]" title={lead.source || ""}>
                  {lead.source || "Manuelle"}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border/50">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <h4 className="text-sm font-semibold">Biographie</h4>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <p className="text-sm text-muted-foreground whitespace-pre-wrap italic">
                {lead.bio || "Aucune biographie."}
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-border/50">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <h4 className="text-sm font-semibold">Notes & Historique</h4>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <p className="text-sm text-muted-foreground whitespace-pre-wrap italic">
                {lead.notes || "Aucune note pour ce lead."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Link2 className="h-4 w-4 text-primary" />
              Créateur Lié
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lead.creator ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                    {lead.creator.full_name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{lead.creator.full_name}</p>
                    <p className="text-xs text-muted-foreground truncate">Créateur Partenaire</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/creators/${lead.creator.id}`}>
                    Voir le profil créateur
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="mx-auto w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-3">
                  <Link2 className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mb-4">Ce lead n&apos;est pas encore lié à un créateur.</p>
                <Button variant="secondary" size="sm" className="w-full">
                  Lier maintenant
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {lead.followers_count > 10000 && (
          <Card className="border-border/50 bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-2">
              <Badge className="w-fit bg-amber-500 hover:bg-amber-500">Profil à fort potentiel</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium">
                Ce compte a plus de 10k followers. Il est prioritaire pour le recrutement.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

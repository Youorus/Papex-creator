import { SocialAccountLead } from "../types";
import { SocialLeadStatusBadge } from "./SocialLeadStatusBadge";
import { SocialPlatformBadge } from "./SocialPlatformBadge";
import { 
  Users, 
  ExternalLink, 
  CheckCircle2, 
  XCircle,
  Link2,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  MessageSquare
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { AppAvatar } from "@/shared/components/avatar/AppAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

interface SocialLeadMobileCardProps {
  lead: SocialAccountLead;
  onDelete: (id: string) => void;
  onStatusAction: (id: string, action: string) => void;
  onLinkCreator: (id: string) => void;
}

export function SocialLeadMobileCard({ 
  lead, 
  onDelete,
  onStatusAction,
  onLinkCreator
}: SocialLeadMobileCardProps) {
  const formatFollowers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
  };

  return (
    <div className="bg-card rounded-xl border border-border/50 p-4 space-y-4 shadow-sm relative overflow-hidden">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <AppAvatar 
            name={lead.display_name || lead.username} 
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-slate-100">{lead.username}</span>
              {lead.profile_url && (
                <a 
                  href={lead.profile_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
            {lead.display_name && (
              <span className="text-xs text-muted-foreground font-normal">{lead.display_name}</span>
            )}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 -mt-2 -mr-2">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/social-leads/${lead.id}`} className="flex items-center cursor-pointer">
                <Eye className="mr-2 h-4 w-4" />
                Voir le détail
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/social-leads/${lead.id}/edit`} className="flex items-center cursor-pointer">
                <Edit className="mr-2 h-4 w-4" />
                Modifier
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onLinkCreator(lead.id)}>
              <Link2 className="mr-2 h-4 w-4" />
              {lead.creator ? "Modifier créateur" : "Lier à un créateur"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-rose-500 focus:text-rose-500 cursor-pointer"
              onClick={() => onDelete(lead.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm pt-2">
        <div className="flex flex-col space-y-2">
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Plateforme</span>
          <SocialPlatformBadge platform={lead.platform} className="w-fit" />
        </div>
        <div className="flex flex-col space-y-2">
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Followers</span>
          <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
            <Users className="h-3.5 w-3.5 text-muted-foreground" />
            {formatFollowers(lead.followers_count)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm pt-2">
        <div className="flex flex-col space-y-2">
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Statut</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-auto p-0 hover:bg-transparent justify-start">
                <SocialLeadStatusBadge status={lead.contact_status} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => onStatusAction(lead.id, "mark_contacted")}>
                <MessageSquare className="mr-2 h-4 w-4" /> Contacté
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusAction(lead.id, "mark_positive")}>
                <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500" /> Positif
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusAction(lead.id, "mark_negative")}>
                <XCircle className="mr-2 h-4 w-4 text-rose-500" /> Négatif
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusAction(lead.id, "mark_not_relevant")}>
                <XCircle className="mr-2 h-4 w-4 text-slate-500" /> Non pertinent
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex flex-col space-y-2">
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Viabilité</span>
          <Badge 
            variant="outline" 
            className={cn(
              "w-fit font-medium",
              lead.is_viable 
                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                : "bg-rose-500/10 text-rose-500 border-rose-500/20"
            )}
          >
            {lead.is_viable ? "Viable" : "Non viable"}
          </Badge>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border/50">
        <div className="flex flex-col space-y-1">
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Créateur lié</span>
          {lead.creator ? (
            <div className="flex items-center gap-1.5">
              <AppAvatar 
                name={lead.creator.full_name} 
                className="h-5 w-5 border-none"
                fallbackClassName="text-[8px]"
              />
              <span className="text-xs font-bold truncate max-w-[100px] text-primary">
                {lead.creator.full_name}
              </span>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground italic">Aucun créateur lié</span>
          )}
        </div>
        
        <Link href={`/social-leads/${lead.id}`}>
          <Button variant="secondary" size="sm" className="text-xs">
            Détails
          </Button>
        </Link>
      </div>
    </div>
  );
}

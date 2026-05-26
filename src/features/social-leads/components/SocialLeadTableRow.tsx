import { useState } from "react";
import { CheckCircle2, Copy, MoreHorizontal, Edit, Eye, Trash2, Link2, MessageSquare, XCircle, ExternalLink } from "lucide-react";
import { SocialAccountLead } from "../types";
import { SocialLeadStatusBadge } from "./SocialLeadStatusBadge";
import { SocialPlatformBadge } from "./SocialPlatformBadge";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import Link from "next/link";
import { AppAvatar } from "@/shared/components/avatar/AppAvatar";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/lib/utils";
import { useUpdateSocialLead } from "../hooks/use-social-leads";

interface SocialLeadTableRowProps {
  lead: SocialAccountLead;
  onDelete: (id: string) => void;
  onStatusAction: (id: string, action: string) => void;
  onLinkCreator: (id: string) => void;
  onRowDoubleClick?: (id: string) => void;
}

export function SocialLeadTableRow({ 
  lead, 
  onDelete, 
  onStatusAction,
  onLinkCreator,
  onRowDoubleClick
}: SocialLeadTableRowProps) {
  const { mutate: updateLead, isPending } = useUpdateSocialLead();

  const formatFollowers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
  };

  const handleViabilityToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateLead({ id: lead.id, payload: { is_viable: !lead.is_viable } });
  };

  return (
    <tr 
      className={cn(
        "group transition-colors hover:bg-muted/50 cursor-pointer",
        !lead.is_viable && "opacity-60 grayscale-[0.5] bg-slate-50/50 dark:bg-slate-900/20"
      )}
      onDoubleClick={() => onRowDoubleClick && onRowDoubleClick(lead.id)}
      onClick={() => onRowDoubleClick && onRowDoubleClick(lead.id)}
    >
      <td className="p-4 align-middle font-medium">
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
                  onClick={(e) => e.stopPropagation()}
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
      </td>
      <td className="p-4 align-middle">
        <SocialPlatformBadge platform={lead.platform} />
      </td>
      <td className="p-4 align-middle font-semibold text-slate-700 dark:text-slate-300">
        {formatFollowers(lead.followers_count)}
      </td>
      <td className="p-4 align-middle">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleViabilityToggle}
          disabled={isPending}
          className="h-7 px-2 hover:bg-transparent -ml-2"
        >
          <Badge 
            variant="outline" 
            className={cn(
              "font-medium transition-colors",
              lead.is_viable 
                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20" 
                : "bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500/20"
            )}
          >
            {lead.is_viable ? "Viable" : "Non viable"}
          </Badge>
        </Button>
      </td>
      <td className="p-4 align-middle">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 px-2 hover:bg-transparent -ml-2" onClick={(e) => e.stopPropagation()}>
              <SocialLeadStatusBadge status={lead.contact_status} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel className="text-xs uppercase text-muted-foreground">Changer statut</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onStatusAction(lead.id, "mark_contacted"); }}>
              <MessageSquare className="mr-2 h-4 w-4" /> Contacté
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onStatusAction(lead.id, "mark_positive"); }}>
              <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500" /> Positif
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onStatusAction(lead.id, "mark_negative"); }}>
              <XCircle className="mr-2 h-4 w-4 text-rose-500" /> Négatif
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onStatusAction(lead.id, "mark_to_contact"); }}>
              <MessageSquare className="mr-2 h-4 w-4 text-amber-500" /> À recontacter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
      <td className="p-4 align-middle">
        {lead.creator ? (
          <div className="flex items-center gap-2">
            <AppAvatar 
              name={lead.creator.full_name}
              className="h-6 w-6 border-none"
              fallbackClassName="text-[10px]"
            />
            <span className="text-xs font-medium truncate max-w-[120px]">
              {lead.creator.full_name}
            </span>
          </div>
        ) : (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs text-muted-foreground italic h-7 px-2"
            onClick={(e) => { e.stopPropagation(); onLinkCreator(lead.id); }}
          >
            Lier créateur...
          </Button>
        )}
      </td>
      <td className="p-4 align-middle text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
              <MoreHorizontal className="h-4 w-4" />
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
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onLinkCreator(lead.id); }}>
              <Link2 className="mr-2 h-4 w-4" />
              {lead.creator ? "Modifier créateur" : "Lier à un créateur"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-rose-500 focus:text-rose-500 cursor-pointer"
              onClick={(e) => { e.stopPropagation(); onDelete(lead.id); }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}

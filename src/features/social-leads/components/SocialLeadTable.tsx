import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { SocialAccountLead } from "../types";
import { SocialLeadStatusBadge } from "./SocialLeadStatusBadge";
import { SocialPlatformBadge } from "./SocialPlatformBadge";
import { ExternalLink, Users, MoreHorizontal, Eye, Edit, Trash2, Link2, CheckCircle2, XCircle, MessageSquare } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/lib/utils";

interface SocialLeadTableProps {
  leads: SocialAccountLead[];
  onDelete: (id: string) => void;
  onStatusAction: (id: string, action: string) => void;
  onLinkCreator: (id: string) => void;
}

export function SocialLeadTable({ 
  leads, 
  onDelete, 
  onStatusAction,
  onLinkCreator
}: SocialLeadTableProps) {
  const formatFollowers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
  };

  return (
    <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Username</TableHead>
            <TableHead>Plateforme</TableHead>
            <TableHead>Followers</TableHead>
            <TableHead>Viabilité</TableHead>
            <TableHead>Statut Contact</TableHead>
            <TableHead>Créateur lié</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                Aucun compte trouvé.
              </TableCell>
            </TableRow>
          ) : (
            leads.map((lead) => (
              <TableRow key={lead.id} className="group transition-colors hover:bg-muted/50">
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      {lead.username}
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
                </TableCell>
                <TableCell>
                  <SocialPlatformBadge platform={lead.platform} />
                </TableCell>
                <TableCell className="font-semibold">
                  {formatFollowers(lead.followers_count)}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "font-medium",
                      lead.is_viable 
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                        : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                    )}
                  >
                    {lead.is_viable ? "Viable" : "Non viable"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <SocialLeadStatusBadge status={lead.contact_status} />
                </TableCell>
                <TableCell>
                  {lead.creator ? (
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                        {lead.creator.full_name ? lead.creator.full_name.substring(0, 2).toUpperCase() : lead.creator.email.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="text-xs font-medium truncate max-w-[120px]">
                        {lead.creator.full_name || lead.creator.email}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground italic">Aucun</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={`/social-leads/${lead.id}`} className="flex items-center">
                          <Eye className="mr-2 h-4 w-4" />
                          Voir le détail
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/social-leads/${lead.id}/edit`} className="flex items-center">
                          <Edit className="mr-2 h-4 w-4" />
                          Modifier
                        </Link>
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel className="text-[10px] uppercase text-muted-foreground py-1">Marquer comme</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onStatusAction(lead.id, "mark_contacted")}>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Contacté
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onStatusAction(lead.id, "mark_positive")}>
                        <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500" />
                        Positif
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onStatusAction(lead.id, "mark_negative")}>
                        <XCircle className="mr-2 h-4 w-4 text-rose-500" />
                        Négatif
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onStatusAction(lead.id, "mark_not_relevant")}>
                        <XCircle className="mr-2 h-4 w-4 text-slate-500" />
                        Non pertinent
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onLinkCreator(lead.id)}>
                        <Link2 className="mr-2 h-4 w-4" />
                        Lier à un créateur
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-rose-500 focus:text-rose-500"
                        onClick={() => onDelete(lead.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

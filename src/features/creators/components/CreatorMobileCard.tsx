import { useState, useMemo } from "react";
import { CreatorProfile } from "../types";
import { CreatorStatusBadge } from "./CreatorStatusBadge";
import { Copy, Check, MoreVertical, Edit, Eye, ShieldCheck, ShieldOff, Trash2 } from "lucide-react";
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
import { toast } from "sonner";
import { AppAvatar } from "@/shared/components/avatar/AppAvatar";
import { Country } from 'country-state-city';

interface CreatorMobileCardProps {
  creator: CreatorProfile;
  onDelete: (id: string) => void;
}

export function CreatorMobileCard({ creator, onDelete }: CreatorMobileCardProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const countryFlag = useMemo(() => {
    if (!creator.country) return null;
    const country = Country.getAllCountries().find(c => c.name === creator.country);
    return country?.flag || null;
  }, [creator.country]);

  const copyToClipboard = (e: React.MouseEvent, text: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Code promo copié");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-card rounded-xl border border-border/50 p-4 space-y-4 shadow-sm relative overflow-hidden">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <AppAvatar 
            name={creator.full_name} 
            email={creator.email} 
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-slate-100">{creator.full_name}</span>
              {countryFlag && <span className="text-sm">{countryFlag}</span>}
            </div>
            <span className="text-xs text-muted-foreground">{creator.email}</span>
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
              <Link href={`/creators/${creator.id}`} className="flex items-center cursor-pointer">
                <Eye className="mr-2 h-4 w-4" />
                Voir le détail
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/creators/${creator.id}/edit`} className="flex items-center cursor-pointer">
                <Edit className="mr-2 h-4 w-4" />
                Modifier
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-rose-500 focus:text-rose-500 cursor-pointer"
              onClick={() => onDelete(creator.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm pt-2">
        <div className="flex flex-col space-y-1">
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Statut</span>
          <CreatorStatusBadge status={creator.status} className="w-fit" />
        </div>
        <div className="flex flex-col space-y-1">
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Commission</span>
          <span className="font-bold text-primary">{creator.commission_rate}%</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border/50">
        <div className="flex flex-col space-y-1">
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Code Promo</span>
          {creator.promo_code ? (
            <div className="flex items-center gap-2">
              <code className="px-1.5 py-0.5 rounded bg-primary/5 dark:bg-primary/10 font-mono text-xs font-bold text-primary border border-primary/20">
                {creator.promo_code}
              </code>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => copyToClipboard(e, creator.promo_code, creator.id)}
              >
                {copiedId === creator.id ? (
                  <Check className="h-3 w-3 text-emerald-500" />
                ) : (
                  <Copy className="h-3 w-3 text-muted-foreground" />
                )}
              </Button>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground italic">Aucun code</span>
          )}
        </div>
        
        <Link href={`/creators/${creator.id}`}>
          <Button variant="secondary" size="sm" className="text-xs">
            Détails
          </Button>
        </Link>
      </div>
    </div>
  );
}

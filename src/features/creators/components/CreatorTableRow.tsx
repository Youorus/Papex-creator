import { useState, useMemo } from "react";
import { Check, Copy, MoreHorizontal, Edit, Eye, Trash2, ShieldCheck, ShieldOff } from "lucide-react";
import { CreatorProfile, CreatorStatus } from "../types";
import { CreatorStatusBadge } from "./CreatorStatusBadge";
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
import { useUpdateCreator } from "../hooks/use-creators";
import { Country } from 'country-state-city';

interface CreatorTableRowProps {
  creator: CreatorProfile;
  onDelete: (id: string) => void;
  onRowDoubleClick?: (id: string) => void;
}

export function CreatorTableRow({ creator, onDelete, onRowDoubleClick }: CreatorTableRowProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { mutate: updateCreator, isPending } = useUpdateCreator();

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

  const handleStatusChange = (newStatus: CreatorStatus) => {
    updateCreator({ id: creator.id, payload: { status: newStatus } });
  };

  const handleActiveToggle = () => {
    updateCreator({ id: creator.id, payload: { is_active: !creator.is_active } });
  };

  return (
    <tr 
      className="group transition-colors hover:bg-muted/50 cursor-pointer"
      onDoubleClick={() => onRowDoubleClick && onRowDoubleClick(creator.id)}
    >
      <td className="p-4 align-middle font-medium">
        <div className="flex items-center gap-3">
          <AppAvatar 
            name={creator.full_name} 
            email={creator.email} 
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-slate-100">{creator.full_name}</span>
              {countryFlag && <span className="text-lg" title={creator.country || ""}>{countryFlag}</span>}
            </div>
            <span className="text-xs text-muted-foreground font-normal">{creator.email}</span>
          </div>
        </div>
      </td>
      <td className="p-4 align-middle">
        {creator.promo_code ? (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-bold text-xs tracking-tight border border-primary/20 shadow-sm">
              {creator.promo_code}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-all hover:bg-primary/10"
              onClick={(e) => copyToClipboard(e, creator.promo_code, creator.id)}
            >
              {copiedId === creator.id ? (
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground italic px-2 py-1 rounded-md bg-muted/30">Aucun code</span>
        )}
      </td>
      <td className="p-4 align-middle">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 px-2 hover:bg-transparent -ml-2" disabled={isPending}>
              <CreatorStatusBadge status={creator.status} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Changer statut</DropdownMenuLabel>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleStatusChange("ACTIVE"); }}>Actif</DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleStatusChange("PENDING"); }}>En attente</DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleStatusChange("PAUSED"); }}>En pause</DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleStatusChange("DISABLED"); }}>Désactivé</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
      <td className="p-4 align-middle">
        <div className="flex flex-col">
          <span className="text-sm font-black text-slate-900 dark:text-slate-100">
            {creator.commission_rate || "0"}%
          </span>
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Commission</span>
        </div>
      </td>
      <td className="p-4 align-middle text-muted-foreground text-sm">
        {format(new Date(creator.created_at), "dd MMM yyyy", { locale: fr })}
      </td>
      <td className="p-4 align-middle text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Actions Rapides</DropdownMenuLabel>
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
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleActiveToggle(); }}>
              {creator.is_active ? (
                <><ShieldOff className="mr-2 h-4 w-4 text-amber-500" /> Désactiver le compte</>
              ) : (
                <><ShieldCheck className="mr-2 h-4 w-4 text-emerald-500" /> Activer le compte</>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-rose-500 focus:text-rose-500 cursor-pointer"
              onClick={(e) => { e.stopPropagation(); onDelete(creator.id); }}
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

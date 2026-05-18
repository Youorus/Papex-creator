import { useState } from "react";
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
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/shared/components/ui/dropdown-menu";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { toast } from "sonner";
import { AppAvatar } from "@/shared/components/avatar/AppAvatar";
import { useUpdateCreator } from "../hooks/use-creators";

interface CreatorTableRowProps {
  creator: CreatorProfile;
  onDelete: (id: string) => void;
  onRowDoubleClick?: (id: string) => void;
}

export function CreatorTableRow({ creator, onDelete, onRowDoubleClick }: CreatorTableRowProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { mutate: updateCreator, isPending } = useUpdateCreator();

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
            <span className="font-bold text-slate-900 dark:text-slate-100">{creator.full_name}</span>
            <span className="text-xs text-muted-foreground font-normal">{creator.email}</span>
          </div>
        </div>
      </td>
      <td className="p-4 align-middle">
        <div className="flex items-center gap-2">
          <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-xs font-semibold border border-slate-200 dark:border-slate-700">
            {creator.promo_code}
          </code>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => copyToClipboard(e, creator.promo_code, creator.id)}
          >
            {copiedId === creator.id ? (
              <Check className="h-3 w-3 text-emerald-500" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </div>
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
        <span className="font-semibold text-primary">
          {creator.commission_rate}%
        </span>
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

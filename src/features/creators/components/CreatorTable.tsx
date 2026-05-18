import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { CreatorProfile } from "../types";
import { CreatorStatusBadge } from "./CreatorStatusBadge";
import { MoreHorizontal, Eye, Edit, Trash2, Copy, Check } from "lucide-react";
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
import { useState } from "react";
import { toast } from "sonner";

interface CreatorTableProps {
  creators: CreatorProfile[];
  onDelete: (id: string) => void;
}

export function CreatorTable({ creators, onDelete }: CreatorTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copié dans le presse-papier");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Code Promo</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Commission</TableHead>
            <TableHead>Créé le</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {creators.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                Aucun créateur trouvé.
              </TableCell>
            </TableRow>
          ) : (
            creators.map((creator) => (
              <TableRow key={creator.id} className="group transition-colors hover:bg-muted/50">
                <TableCell className="font-medium">
                  {creator.full_name}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {creator.email}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs font-semibold">
                      {creator.promo_code}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => copyToClipboard(creator.promo_code, creator.id)}
                    >
                      {copiedId === creator.id ? (
                        <Check className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <CreatorStatusBadge status={creator.status} />
                </TableCell>
                <TableCell>
                  <span className="font-semibold text-primary">
                    {creator.commission_rate}%
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {format(new Date(creator.created_at), "dd MMM yyyy", { locale: fr })}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={`/creators/${creator.id}`} className="flex items-center">
                          <Eye className="mr-2 h-4 w-4" />
                          Voir le détail
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/creators/${creator.id}/edit`} className="flex items-center">
                          <Edit className="mr-2 h-4 w-4" />
                          Modifier
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-rose-500 focus:text-rose-500"
                        onClick={() => onDelete(creator.id)}
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

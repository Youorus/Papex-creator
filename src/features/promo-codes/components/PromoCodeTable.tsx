import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { PromoCode } from "../types";
import { PromoCodeStatusBadge } from "./PromoCodeStatusBadge";
import { Button } from "@/shared/components/ui/button";
import { Edit, Trash2, Calendar, Percent, Euro } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface PromoCodeTableProps {
  promoCodes: PromoCode[];
  onEdit: (promoCode: PromoCode) => void;
  onDelete: (id: string) => void;
  showCreator?: boolean;
}

export function PromoCodeTable({ promoCodes, onEdit, onDelete, showCreator = false }: PromoCodeTableProps) {
  if (promoCodes.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/20">
        <p className="text-muted-foreground">Aucun code promo trouvé.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/50 overflow-hidden shadow-sm bg-white dark:bg-slate-950">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/50 dark:bg-slate-900/50">
            <TableHead className="font-semibold">Code</TableHead>
            {showCreator && <TableHead className="font-semibold">Créateur</TableHead>}
            <TableHead className="font-semibold">Commission</TableHead>
            <TableHead className="font-semibold">Bonus</TableHead>
            <TableHead className="font-semibold">Validité</TableHead>
            <TableHead className="font-semibold">Statut</TableHead>
            <TableHead className="text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {promoCodes.map((pc) => (
            <TableRow key={pc.id} className="hover:bg-muted/30">
              <TableCell className="font-mono font-bold text-primary">
                {pc.code}
              </TableCell>
              {showCreator && (
                <TableCell className="font-medium">
                  {pc.creator.full_name}
                </TableCell>
              )}
              <TableCell>
                <div className="flex items-center gap-1.5 font-semibold">
                  <Percent className="h-3.5 w-3.5 text-muted-foreground" />
                  {pc.commission_rate}%
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5 font-semibold">
                  <Euro className="h-3.5 w-3.5 text-muted-foreground" />
                  {pc.bonus_amount}€
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {pc.valid_until 
                    ? format(new Date(pc.valid_until), "dd MMM yyyy", { locale: fr })
                    : "Illimité"}
                </div>
              </TableCell>
              <TableCell>
                <PromoCodeStatusBadge status={pc.status} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(pc)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30" onClick={() => onDelete(pc.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

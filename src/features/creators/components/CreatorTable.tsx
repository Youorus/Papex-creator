import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { CreatorProfile } from "../types";
import { CreatorTableRow } from "./CreatorTableRow";
import { CreatorMobileCard } from "./CreatorMobileCard";
import { ResponsiveDataView } from "@/shared/components/responsive/ResponsiveDataView";
import { useRouter } from "next/navigation";

interface CreatorTableProps {
  creators: CreatorProfile[];
  onDelete: (id: string) => void;
}

export function CreatorTable({ creators, onDelete }: CreatorTableProps) {
  const router = useRouter();

  const handleRowDoubleClick = (id: string) => {
    router.push(`/creators/${id}`);
  };

  const renderDesktopTable = () => (
    <div className="rounded-xl border border-border/50 bg-white/50 dark:bg-card/50 backdrop-blur-sm overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent bg-slate-50/50 dark:bg-slate-900/50">
            <TableHead className="font-semibold h-12">Créateur</TableHead>
            <TableHead className="font-semibold h-12">Code Promo</TableHead>
            <TableHead className="font-semibold h-12">Statut</TableHead>
            <TableHead className="font-semibold h-12">Commission</TableHead>
            <TableHead className="font-semibold h-12">Créé le</TableHead>
            <TableHead className="text-right font-semibold h-12">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {creators.map((creator) => (
            <CreatorTableRow 
              key={creator.id} 
              creator={creator} 
              onDelete={onDelete} 
              onRowDoubleClick={handleRowDoubleClick}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <ResponsiveDataView 
      data={creators}
      renderDesktopTable={renderDesktopTable}
      renderMobileCard={(creator) => (
        <CreatorMobileCard 
          key={creator.id} 
          creator={creator} 
          onDelete={onDelete} 
        />
      )}
      emptyState="Aucun créateur trouvé."
    />
  );
}

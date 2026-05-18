import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { SocialAccountLead } from "../types";
import { SocialLeadTableRow } from "./SocialLeadTableRow";
import { SocialLeadMobileCard } from "./SocialLeadMobileCard";
import { ResponsiveDataView } from "@/shared/components/responsive/ResponsiveDataView";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const handleRowDoubleClick = (id: string) => {
    router.push(`/social-leads/${id}`);
  };

  const renderDesktopTable = () => (
    <div className="rounded-xl border border-border/50 bg-white/50 dark:bg-card/50 backdrop-blur-sm overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent bg-slate-50/50 dark:bg-slate-900/50">
            <TableHead className="font-semibold h-12">Compte</TableHead>
            <TableHead className="font-semibold h-12">Plateforme</TableHead>
            <TableHead className="font-semibold h-12">Followers</TableHead>
            <TableHead className="font-semibold h-12">Viabilité</TableHead>
            <TableHead className="font-semibold h-12">Statut Contact</TableHead>
            <TableHead className="font-semibold h-12">Créateur lié</TableHead>
            <TableHead className="text-right font-semibold h-12">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <SocialLeadTableRow 
              key={lead.id} 
              lead={lead} 
              onDelete={onDelete}
              onStatusAction={onStatusAction}
              onLinkCreator={onLinkCreator}
              onRowDoubleClick={handleRowDoubleClick}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <ResponsiveDataView 
      data={leads}
      renderDesktopTable={renderDesktopTable}
      renderMobileCard={(lead) => (
        <SocialLeadMobileCard 
          key={lead.id} 
          lead={lead} 
          onDelete={onDelete}
          onStatusAction={onStatusAction}
          onLinkCreator={onLinkCreator}
        />
      )}
      emptyState="Aucun compte prospect trouvé."
    />
  );
}

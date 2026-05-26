import { Badge } from "@/shared/components/ui/badge";
import { ContactStatus } from "../types";
import { cn } from "@/lib/utils";

interface SocialLeadStatusBadgeProps {
  status: ContactStatus;
  className?: string;
}

const statusMap: Record<ContactStatus, { label: string; className: string }> = {
  NEW: { label: "Nouveau", className: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  TO_CONTACT: { label: "À contacter", className: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  CONTACTED: { label: "Contacté", className: "bg-slate-500/10 text-slate-500 border-slate-500/20" },
  POSITIVE: { label: "Positif", className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  NEGATIVE: { label: "Négatif", className: "bg-rose-500/10 text-rose-500 border-rose-500/20" },
  CONVERTED: { label: "Converti", className: "bg-primary text-white border-transparent" },
  NOT_RELEVANT: { label: "Non pertinent", className: "bg-slate-500/10 text-slate-500 border-slate-500/20" },
};


export function SocialLeadStatusBadge({ status, className }: SocialLeadStatusBadgeProps) {
  const config = statusMap[status] || statusMap.NEW;
  
  return (
    <Badge variant="outline" className={cn("font-medium", config.className, className)}>
      {config.label}
    </Badge>
  );
}

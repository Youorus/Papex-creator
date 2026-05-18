import { Badge } from "@/shared/components/ui/badge";
import { CreatorStatus } from "../types";
import { cn } from "@/lib/utils";

interface CreatorStatusBadgeProps {
  status: CreatorStatus;
  className?: string;
}

const statusMap: Record<CreatorStatus, { label: string; className: string }> = {
  ACTIVE: { label: "Actif", className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  PENDING: { label: "En attente", className: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  PAUSED: { label: "En pause", className: "bg-violet-500/10 text-violet-500 border-violet-500/20" },
  DISABLED: { label: "Désactivé", className: "bg-rose-500/10 text-rose-500 border-rose-500/20" },
};

export function CreatorStatusBadge({ status, className }: CreatorStatusBadgeProps) {
  const config = statusMap[status];
  
  return (
    <Badge variant="outline" className={cn("font-medium", config.className, className)}>
      {config.label}
    </Badge>
  );
}

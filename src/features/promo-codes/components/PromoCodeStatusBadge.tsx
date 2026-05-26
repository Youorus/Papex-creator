import { Badge } from "@/shared/components/ui/badge";
import { PromoCodeStatus } from "../types";

interface PromoCodeStatusBadgeProps {
  status: PromoCodeStatus;
}

export function PromoCodeStatusBadge({ status }: PromoCodeStatusBadgeProps) {
  switch (status) {
    case "ACTIVE":
      return (
        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold">
          ACTIF
        </Badge>
      );
    case "INACTIVE":
      return (
        <Badge variant="outline" className="bg-slate-500/10 text-slate-600 border-slate-500/20 font-bold">
          INACTIF
        </Badge>
      );
    case "EXPIRED":
      return (
        <Badge variant="outline" className="bg-rose-500/10 text-rose-600 border-rose-500/20 font-bold">
          EXPIRÉ
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

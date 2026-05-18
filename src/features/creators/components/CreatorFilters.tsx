import { Input } from "@/shared/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import { Search, X, Filter } from "lucide-react";
import { CreatorFilters, CreatorStatus } from "../types";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/shared/components/ui/collapsible";
import { useState } from "react";

interface CreatorFiltersProps {
  filters: CreatorFilters;
  onFiltersChange: (filters: CreatorFilters) => void;
}

export function CreatorFiltersComponent({ filters, onFiltersChange }: CreatorFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, search: e.target.value, page: 1 });
  };

  const handleStatusChange = (value: string) => {
    onFiltersChange({ 
      ...filters, 
      status: value === "all" ? undefined : (value as CreatorStatus),
      page: 1 
    });
  };

  const clearFilters = () => {
    onFiltersChange({ search: "", page: 1 });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher un créateur..."
            value={filters.search || ""}
            onChange={handleSearchChange}
            className="pl-9 bg-card/50"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={filters.status || "all"} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px] bg-card/50">
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="ACTIVE">Actif</SelectItem>
              <SelectItem value="PENDING">En attente</SelectItem>
              <SelectItem value="PAUSED">En pause</SelectItem>
              <SelectItem value="DISABLED">Désactivé</SelectItem>
            </SelectContent>
          </Select>

          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="icon" className="bg-card/50">
                <Filter className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
          </Collapsible>

          {(filters.search || filters.status) && (
            <Button variant="ghost" onClick={clearFilters} className="text-muted-foreground">
              <X className="mr-2 h-4 w-4" />
              Réinitialiser
            </Button>
          )}
        </div>
      </div>

      <Collapsible open={isOpen}>
        <CollapsibleContent className="space-y-4 pt-4 border-t border-border/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Pays
              </label>
              <Input
                placeholder="Ex: France"
                value={filters.country || ""}
                onChange={(e) => onFiltersChange({ ...filters, country: e.target.value, page: 1 })}
                className="bg-card/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Ville
              </label>
              <Input
                placeholder="Ex: Paris"
                value={filters.city || ""}
                onChange={(e) => onFiltersChange({ ...filters, city: e.target.value, page: 1 })}
                className="bg-card/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Actif uniquement
              </label>
              <Select 
                value={filters.is_active === undefined ? "all" : filters.is_active.toString()} 
                onValueChange={(v) => onFiltersChange({ 
                  ...filters, 
                  is_active: v === "all" ? undefined : v === "true",
                  page: 1 
                })}
              >
                <SelectTrigger className="bg-card/50">
                  <SelectValue placeholder="Peu importe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Peu importe</SelectItem>
                  <SelectItem value="true">Oui</SelectItem>
                  <SelectItem value="false">Non</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

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
import { CreatorFilters as FiltersType, CreatorStatus } from "../types";
import { useMediaQuery } from "@/shared/hooks/use-media-query";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/shared/components/ui/sheet";

interface CreatorFiltersProps {
  filters: FiltersType;
  onFiltersChange: (filters: FiltersType) => void;
}

export function CreatorFilters({ filters, onFiltersChange }: CreatorFiltersProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

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

  const activeFiltersCount = [filters.status, filters.country, filters.city, filters.is_active].filter(v => v !== undefined && v !== "").length;

  const FilterControls = () => (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Statut
        </label>
        <Select value={filters.status || "all"} onValueChange={handleStatusChange}>
          <SelectTrigger className="bg-white dark:bg-card">
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
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Pays
        </label>
        <Input
          placeholder="Ex: France"
          value={filters.country || ""}
          onChange={(e) => onFiltersChange({ ...filters, country: e.target.value, page: 1 })}
          className="bg-white dark:bg-card"
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
          className="bg-white dark:bg-card"
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
          <SelectTrigger className="bg-white dark:bg-card">
            <SelectValue placeholder="Peu importe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Peu importe</SelectItem>
            <SelectItem value="true">Oui</SelectItem>
            <SelectItem value="false">Non</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {(filters.search || activeFiltersCount > 0) && (
        <Button variant="outline" onClick={clearFilters} className="mt-4 w-full text-muted-foreground">
          <X className="mr-2 h-4 w-4" />
          Réinitialiser les filtres
        </Button>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full">
      <div className="relative flex-1 w-full sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Rechercher un créateur..."
          value={filters.search || ""}
          onChange={handleSearchChange}
          className="pl-9 bg-white dark:bg-card shadow-sm"
        />
      </div>
      
      {isDesktop ? (
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={filters.status || "all"} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px] bg-white dark:bg-card shadow-sm">
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

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="bg-white dark:bg-card shadow-sm relative">
                <Filter className="h-4 w-4 mr-2" /> Plus de filtres
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Filtres Avancés</SheetTitle>
              </SheetHeader>
              <div className="py-6">
                <FilterControls />
              </div>
            </SheetContent>
          </Sheet>

          {(filters.search || filters.status) && (
            <Button variant="ghost" onClick={clearFilters} className="text-muted-foreground">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full bg-white dark:bg-card shadow-sm justify-center relative">
              <Filter className="h-4 w-4 mr-2" /> 
              Filtres
              {activeFiltersCount > 0 && (
                <span className="ml-2 bg-primary text-primary-foreground px-1.5 py-0.5 rounded-md text-[10px] font-bold">
                  {activeFiltersCount} actif(s)
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh] rounded-t-2xl">
            <SheetHeader>
              <SheetTitle>Filtres</SheetTitle>
            </SheetHeader>
            <div className="py-6 overflow-y-auto max-h-full">
              <FilterControls />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}

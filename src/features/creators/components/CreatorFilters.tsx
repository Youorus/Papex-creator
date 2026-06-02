import { Input } from "@/shared/components/ui/input";
import { 
  Select as UISelect, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import { Search, X, Filter, MapPin, Globe } from "lucide-react";
import { CreatorFilters as FiltersType, CreatorStatus } from "../types";
import { useMediaQuery } from "@/shared/hooks/use-media-query";
import Select from 'react-select';
import { Country } from 'country-state-city';
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

interface CreatorFiltersProps {
  filters: FiltersType;
  onFiltersChange: (filters: FiltersType) => void;
}

export function CreatorFilters({ filters, onFiltersChange }: CreatorFiltersProps) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const countryOptions = useMemo(() => 
    Country.getAllCountries().map(c => ({
      value: c.name,
      label: `${c.flag} ${c.name}`,
    })), []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, search: e.target.value, page: 1 });
  };

  const clearFilters = () => {
    onFiltersChange({ search: "", page: 1, status: undefined, country: undefined, city: undefined, is_active: undefined });
  };

  const activeFiltersCount = [filters.status, filters.country, filters.city, filters.is_active].filter(v => v !== undefined && v !== "").length;

  const selectStyles = {
    control: (base: any) => ({
      ...base,
      backgroundColor: 'transparent',
      borderColor: 'hsl(var(--border) / 0.6)',
      borderRadius: '12px',
      height: '40px',
      minHeight: '40px',
      fontSize: '12px',
      fontWeight: '600',
      boxShadow: 'none',
      '&:hover': {
        borderColor: 'hsl(var(--primary))',
      },
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: 'hsl(var(--popover))',
      border: '1px solid hsl(var(--border))',
      borderRadius: '12px',
      zIndex: 100,
    }),
    option: (base: any, state: { isFocused: boolean; isSelected: boolean }) => ({
      ...base,
      fontSize: '12px',
      backgroundColor: state.isSelected 
        ? 'hsl(var(--primary))' 
        : state.isFocused 
          ? 'hsl(var(--accent))' 
          : 'transparent',
      color: state.isSelected ? 'hsl(var(--primary-foreground))' : 'hsl(var(--popover-foreground))',
    }),
    singleValue: (base: any) => ({
      ...base,
      color: 'hsl(var(--foreground))',
    }),
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Main Search & Basic Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto flex-1">
          <div className="relative w-full sm:max-w-md group">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Rechercher par nom ou email..."
              value={filters.search || ""}
              onChange={handleSearchChange}
              className="pl-10 bg-background/50 border-border/60 rounded-xl h-10 text-sm shadow-sm focus:ring-primary/20 transition-all"
            />
          </div>

          <div className="w-full sm:w-[160px]">
            <UISelect 
              value={filters.status || "all"} 
              onValueChange={(v) => onFiltersChange({ ...filters, status: v === "all" ? undefined : (v as CreatorStatus), page: 1 })}
            >
              <SelectTrigger className="h-10 bg-background/50 border-border/60 rounded-xl text-xs font-bold shadow-sm">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="ACTIVE">Actif</SelectItem>
                <SelectItem value="PENDING">En attente</SelectItem>
                <SelectItem value="PAUSED">En pause</SelectItem>
                <SelectItem value="DISABLED">Désactivé</SelectItem>
              </SelectContent>
            </UISelect>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button 
            variant={showAdvanced ? "secondary" : "outline"} 
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={cn(
              "h-10 rounded-xl gap-2 font-bold transition-all border-border/60",
              activeFiltersCount > 0 && "border-primary text-primary bg-primary/5"
            )}
          >
            <Filter className="h-4 w-4" />
            {isDesktop && "Filtres avancés"}
            {activeFiltersCount > 0 && (
              <span className="bg-primary text-primary-foreground h-5 min-w-[20px] px-1 rounded-full flex items-center justify-center text-[10px] shadow-sm">
                {activeFiltersCount}
              </span>
            )}
          </Button>

          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-10 px-3 rounded-xl text-muted-foreground hover:text-rose-500">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Advanced Filters Panel (Inline) */}
      {showAdvanced && (
        <div className="p-5 bg-card/30 border border-border/50 rounded-2xl backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Globe className="h-3 w-3" /> Pays d&apos;origine
              </label>
              <Select
                options={countryOptions}
                styles={selectStyles}
                placeholder="Sélectionner..."
                isClearable
                value={countryOptions.find(opt => opt.value === filters.country)}
                onChange={(val: any) => onFiltersChange({ ...filters, country: val?.value || undefined, page: 1 })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <MapPin className="h-3 w-3" /> Ville
              </label>
              <Input
                placeholder="Ex: Paris"
                value={filters.city || ""}
                onChange={(e) => onFiltersChange({ ...filters, city: e.target.value, page: 1 })}
                className="h-10 bg-background/50 border-border/60 rounded-xl text-xs font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Visibilité publique</label>
              <UISelect 
                value={filters.is_active === undefined ? "all" : filters.is_active.toString()} 
                onValueChange={(v) => onFiltersChange({ ...filters, is_active: v === "all" ? undefined : v === "true", page: 1 })}
              >
                <SelectTrigger className="h-10 bg-background/50 border-border/60 rounded-xl text-xs font-bold">
                  <SelectValue placeholder="Peu importe" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">Peu importe</SelectItem>
                  <SelectItem value="true">Actif (Public)</SelectItem>
                  <SelectItem value="false">Inactif (Masqué)</SelectItem>
                </SelectContent>
              </UISelect>
            </div>
            
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={clearFilters} 
                className="h-10 w-full rounded-xl text-xs font-black uppercase border-dashed border-border/80 hover:bg-rose-500/5 hover:text-rose-500 hover:border-rose-200 transition-all"
              >
                Réinitialiser les filtres
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

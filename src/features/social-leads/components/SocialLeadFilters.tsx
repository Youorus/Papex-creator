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
import { SocialLeadFilters as FiltersType, SocialPlatform, LeadContactStatus } from "../types";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/shared/components/ui/sheet";
import { useMediaQuery } from "@/shared/hooks/use-media-query";

interface SocialLeadFiltersProps {
  filters: FiltersType;
  onFiltersChange: (filters: FiltersType) => void;
}

export function SocialLeadFilters({ filters, onFiltersChange }: SocialLeadFiltersProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, search: e.target.value, page: 1 });
  };

  const clearFilters = () => {
    onFiltersChange({ search: "", page: 1 });
  };

  const activeFiltersCount = [
    filters.platform, 
    filters.contact_status, 
    filters.is_viable, 
    filters.has_creator, 
    filters.followers_min, 
    filters.followers_max
  ].filter(v => v !== undefined && String(v) !== "").length;

  const FilterControls = () => (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Viabilité
        </label>
        <Select 
          value={filters.is_viable === undefined ? "all" : filters.is_viable.toString()} 
          onValueChange={(v) => onFiltersChange({ 
            ...filters, 
            is_viable: v === "all" ? undefined : v === "true",
            page: 1 
          })}
        >
          <SelectTrigger className="bg-white dark:bg-card">
            <SelectValue placeholder="Peu importe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Peu importe</SelectItem>
            <SelectItem value="true">Viable</SelectItem>
            <SelectItem value="false">Non viable</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Créateur lié
        </label>
        <Select 
          value={filters.has_creator === undefined ? "all" : filters.has_creator.toString()} 
          onValueChange={(v) => onFiltersChange({ 
            ...filters, 
            has_creator: v === "all" ? undefined : v === "true",
            page: 1 
          })}
        >
          <SelectTrigger className="bg-white dark:bg-card">
            <SelectValue placeholder="Peu importe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Peu importe</SelectItem>
            <SelectItem value="true">Avec créateur</SelectItem>
            <SelectItem value="false">Sans créateur</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Followers Min
        </label>
        <Input
          type="number"
          placeholder="0"
          value={filters.followers_min || ""}
          onChange={(e) => onFiltersChange({ ...filters, followers_min: parseInt(e.target.value) || undefined, page: 1 })}
          className="bg-white dark:bg-card"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Followers Max
        </label>
        <Input
          type="number"
          placeholder="Ex: 100000"
          value={filters.followers_max || ""}
          onChange={(e) => onFiltersChange({ ...filters, followers_max: parseInt(e.target.value) || undefined, page: 1 })}
          className="bg-white dark:bg-card"
        />
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
          placeholder="Rechercher par username..."
          value={filters.search || ""}
          onChange={handleSearchChange}
          className="pl-9 bg-white dark:bg-card shadow-sm"
        />
      </div>
      
      {isDesktop ? (
        <div className="flex items-center gap-2 flex-wrap">
          <Select 
            value={filters.platform || "all"} 
            onValueChange={(v) => onFiltersChange({ 
              ...filters, 
              platform: v === "all" ? undefined : (v as SocialPlatform),
              page: 1 
            })}
          >
            <SelectTrigger className="w-[150px] bg-white dark:bg-card shadow-sm">
              <SelectValue placeholder="Plateforme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Plateformes</SelectItem>
              <SelectItem value="TIKTOK">TikTok</SelectItem>
              <SelectItem value="INSTAGRAM">Instagram</SelectItem>
              <SelectItem value="YOUTUBE">YouTube</SelectItem>
              <SelectItem value="FACEBOOK">Facebook</SelectItem>
              <SelectItem value="LINKEDIN">LinkedIn</SelectItem>
              <SelectItem value="OTHER">Autre</SelectItem>
            </SelectContent>
          </Select>

          <Select 
            value={filters.contact_status || "all"} 
            onValueChange={(v) => onFiltersChange({ 
              ...filters, 
              contact_status: v === "all" ? undefined : (v as LeadContactStatus),
              page: 1 
            })}
          >
            <SelectTrigger className="w-[180px] bg-white dark:bg-card shadow-sm">
              <SelectValue placeholder="Statut contact" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="NEW">Nouveau</SelectItem>
              <SelectItem value="TO_CONTACT">À contacter</SelectItem>
              <SelectItem value="CONTACTED">Contacté</SelectItem>
              <SelectItem value="POSITIVE">Positif</SelectItem>
              <SelectItem value="NEGATIVE">Négatif</SelectItem>
              <SelectItem value="CONVERTED">Converti</SelectItem>
              <SelectItem value="NOT_RELEVANT">Non pertinent</SelectItem>
            </SelectContent>
          </Select>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="bg-white dark:bg-card shadow-sm relative">
                <Filter className="h-4 w-4 mr-2" /> Plus de filtres
                {activeFiltersCount > 2 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm">
                    {activeFiltersCount - 2}
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

          {(filters.search || filters.platform || filters.contact_status || activeFiltersCount > 0) && (
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
          <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl flex flex-col">
            <SheetHeader>
              <SheetTitle>Filtres</SheetTitle>
            </SheetHeader>
            <div className="py-6 flex-1 overflow-y-auto space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Plateforme
                </label>
                <Select 
                  value={filters.platform || "all"} 
                  onValueChange={(v) => onFiltersChange({ 
                    ...filters, 
                    platform: v === "all" ? undefined : (v as SocialPlatform),
                    page: 1 
                  })}
                >
                  <SelectTrigger className="bg-white dark:bg-card">
                    <SelectValue placeholder="Plateforme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Plateformes</SelectItem>
                    <SelectItem value="TIKTOK">TikTok</SelectItem>
                    <SelectItem value="INSTAGRAM">Instagram</SelectItem>
                    <SelectItem value="YOUTUBE">YouTube</SelectItem>
                    <SelectItem value="FACEBOOK">Facebook</SelectItem>
                    <SelectItem value="LINKEDIN">LinkedIn</SelectItem>
                    <SelectItem value="OTHER">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Statut Contact
                </label>
                <Select 
                  value={filters.contact_status || "all"} 
                  onValueChange={(v) => onFiltersChange({ 
                    ...filters, 
                    contact_status: v === "all" ? undefined : (v as LeadContactStatus),
                    page: 1 
                  })}
                >
                  <SelectTrigger className="bg-white dark:bg-card">
                    <SelectValue placeholder="Statut contact" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="NEW">Nouveau</SelectItem>
                    <SelectItem value="TO_CONTACT">À contacter</SelectItem>
                    <SelectItem value="CONTACTED">Contacté</SelectItem>
                    <SelectItem value="POSITIVE">Positif</SelectItem>
                    <SelectItem value="NEGATIVE">Négatif</SelectItem>
                    <SelectItem value="CONVERTED">Converti</SelectItem>
                    <SelectItem value="NOT_RELEVANT">Non pertinent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <FilterControls />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}

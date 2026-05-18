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
import { SocialLeadFilters, SocialPlatform, LeadContactStatus } from "../types";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/shared/components/ui/collapsible";
import { useState } from "react";

interface SocialLeadFiltersProps {
  filters: SocialLeadFilters;
  onFiltersChange: (filters: SocialLeadFilters) => void;
}

export function SocialLeadFiltersComponent({ filters, onFiltersChange }: SocialLeadFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, search: e.target.value, page: 1 });
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
            placeholder="Rechercher par username..."
            value={filters.search || ""}
            onChange={handleSearchChange}
            className="pl-9 bg-card/50"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Select 
            value={filters.platform || "all"} 
            onValueChange={(v) => onFiltersChange({ 
              ...filters, 
              platform: v === "all" ? undefined : (v as SocialPlatform),
              page: 1 
            })}
          >
            <SelectTrigger className="w-[150px] bg-card/50">
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
            <SelectTrigger className="w-[180px] bg-card/50">
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

          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="icon" className="bg-card/50">
                <Filter className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
          </Collapsible>

          {(filters.search || filters.platform || filters.contact_status) && (
            <Button variant="ghost" onClick={clearFilters} className="text-muted-foreground">
              <X className="mr-2 h-4 w-4" />
              Réinitialiser
            </Button>
          )}
        </div>
      </div>

      <Collapsible open={isOpen}>
        <CollapsibleContent className="space-y-4 pt-4 border-t border-border/50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <SelectTrigger className="bg-card/50">
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
                <SelectTrigger className="bg-card/50">
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
                className="bg-card/50"
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
                className="bg-card/50"
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

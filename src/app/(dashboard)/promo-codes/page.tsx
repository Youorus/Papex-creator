"use client";

import { useState } from "react";
import { Tag, Plus, Filter, Search, X } from "lucide-react";
import { PromoCodeTable } from "@/features/promo-codes/components/PromoCodeTable";
import { usePromoCodes, useDeletePromoCode, useUpdatePromoCode, useCreatePromoCode } from "@/features/promo-codes/hooks/use-promo-codes";
import { PromoCodeFilters, PromoCode, PromoCodeStatus } from "@/features/promo-codes/types";
import { motion } from "framer-motion";
import { Input } from "@/shared/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { PromoCodeForm } from "@/features/promo-codes/components/PromoCodeForm";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

export default function PromoCodesPage() {
  const [filters, setFilters] = useState<PromoCodeFilters>({
    page: 1,
    page_size: 10,
    search: "",
    status: undefined,
  });

  const [editingCode, setEditingCode] = useState<PromoCode | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = usePromoCodes(filters);
  const { mutate: createCode, isPending: isCreating } = useCreatePromoCode();
  const { mutate: updateCode, isPending: isUpdating } = useUpdatePromoCode();
  const { mutate: deleteCode, isPending: isDeleting } = useDeletePromoCode();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, search: e.target.value, page: 1 });
  };

  const handleStatusChange = (value: string) => {
    setFilters({ 
      ...filters, 
      status: value === "all" ? undefined : (value as PromoCodeStatus),
      page: 1 
    });
  };

  const clearFilters = () => {
    setFilters({ search: "", status: undefined, page: 1, page_size: 10 });
  };

  const openCreate = () => {
    setEditingCode(undefined);
    setIsFormOpen(true);
  };

  const openEdit = (code: PromoCode) => {
    setEditingCode(code);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (values: any) => {
    if (editingCode) {
      updateCode(
        { id: editingCode.id, payload: values },
        {
          onSuccess: () => {
            setIsFormOpen(false);
            setEditingCode(undefined);
          },
        }
      );
    } else {
      createCode(values, {
        onSuccess: () => {
          setIsFormOpen(false);
        },
      });
    }
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteCode(deleteId, {
        onSuccess: () => setDeleteId(null),
      });
    }
  };

  return (
    <div className="space-y-8 p-4 md:p-8 pt-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Gestion des Codes Promo
          </h1>
          <p className="text-muted-foreground mt-1">
            Gérez tous les codes promo de la plateforme et leurs commissions.
          </p>
        </div>
        <Button onClick={openCreate} className="shadow-lg shadow-primary/20 transition-all hover:scale-105">
          <Plus className="mr-2 h-4 w-4" /> Créer un code promo
        </Button>
      </motion.div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher un code ou un créateur..."
              value={filters.search}
              onChange={handleSearchChange}
              className="pl-9 h-10 border-border/50 bg-card/50"
            />
          </div>
          <Select value={filters.status || "all"} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px] bg-card/50 border-border/50">
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="ACTIVE">Actif</SelectItem>
              <SelectItem value="INACTIVE">Inactif</SelectItem>
              <SelectItem value="EXPIRED">Expiré</SelectItem>
            </SelectContent>
          </Select>
          {(filters.search || filters.status) && (
            <Button variant="ghost" onClick={clearFilters} className="text-muted-foreground">
              <X className="mr-2 h-4 w-4" /> Effacer
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20 text-muted-foreground font-medium">
            Chargement des codes promo...
          </div>
        ) : (
          <PromoCodeTable 
            promoCodes={data?.results || []} 
            onEdit={openEdit}
            onDelete={setDeleteId}
            showCreator
          />
        )}

        {data && data.total_pages > 1 && (
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
              disabled={filters.page === 1}
            >
              Précédent
            </Button>
            <div className="text-sm font-medium">
              Page {filters.page} sur {data.total_pages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
              disabled={filters.page === data.total_pages}
            >
              Suivant
            </Button>
          </div>
        )}
      </div>

      <Dialog open={isFormOpen} onOpenChange={(open) => !open && setIsFormOpen(false)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingCode ? "Modifier le code promo" : "Nouveau code promo"}
            </DialogTitle>
          </DialogHeader>
          <PromoCodeForm
            initialData={editingCode}
            onSubmit={handleFormSubmit}
            isLoading={isCreating || isUpdating}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce code promo ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le code ne pourra plus être utilisé par les clients.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-rose-600 hover:bg-rose-700"
              disabled={isDeleting}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

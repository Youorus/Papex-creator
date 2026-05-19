"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { CreatorTable } from "@/features/creators/components/CreatorTable";
import { CreatorStatsCards } from "@/features/creators/components/CreatorStatsCards";
import { CreatorFilters } from "@/features/creators/components/CreatorFilters";
import { CreatorDeleteDialog } from "@/features/creators/components/CreatorDeleteDialog";
import { useCreators, useCreatorStats, useDeleteCreator } from "@/features/creators/hooks/use-creators";
import { CreatorFilters as CreatorFiltersType } from "@/features/creators/types";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CreatorsPage() {
  const [filters, setFilters] = useState<CreatorFiltersType>({
    page: 1,
    page_size: 10,
  });

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: creatorsData, isLoading: isLoadingCreators } = useCreators(filters);
  const { data: statsData, isLoading: isLoadingStats } = useCreatorStats(filters);
  const { mutate: deleteCreator, isPending: isDeleting } = useDeleteCreator();

  const handleFiltersChange = (newFilters: CreatorFiltersType) => {
    setFilters(newFilters);
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      deleteCreator(deleteId, {
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
              Créateurs
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerez votre réseau de créateurs et suivez leurs performances.
            </p>
          </div>
          <Link href="/creators/create">
            {/* bg-primary et text-primary-foreground corrigent le texte blanc invisible en Light Mode */}
            <Button className="shadow-lg shadow-primary/20 transition-all hover:scale-105 bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" /> Ajouter un créateur
            </Button>
          </Link>
        </motion.div>

        <div className="space-y-8">
          <CreatorStatsCards stats={statsData} isLoading={isLoadingStats} />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Liste des créateurs</h2>
            </div>

            <CreatorFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
            />

            <CreatorTable
                creators={creatorsData?.results || []}
                onDelete={setDeleteId}
            />

            {/* Simple Pagination */}
            {creatorsData && creatorsData.total_pages > 1 && (
                <div className="flex items-center justify-end space-x-2 py-4">
                  <Button
                      variant="outline"
                      size="sm"
                      className="text-foreground"
                      onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
                      disabled={filters.page === 1}
                  >
                    Précédent
                  </Button>
                  <div className="text-sm font-medium text-foreground">
                    Page {filters.page} sur {creatorsData.total_pages}
                  </div>
                  <Button
                      variant="outline"
                      size="sm"
                      className="text-foreground"
                      onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
                      disabled={filters.page === creatorsData.total_pages}
                  >
                    Suivant
                  </Button>
                </div>
            )}
          </div>
        </div>

        <CreatorDeleteDialog
            isOpen={!!deleteId}
            onOpenChange={(open) => !open && setDeleteId(null)}
            onConfirm={handleDeleteConfirm}
            isLoading={isDeleting}
        />
      </div>
  );
}
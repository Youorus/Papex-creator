"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { SocialLeadTable } from "@/features/social-leads/components/SocialLeadTable";
import { SocialLeadStatsCards } from "@/features/social-leads/components/SocialLeadStatsCards";
import { SocialLeadFilters } from "@/features/social-leads/components/SocialLeadFilters";
import { SocialLeadDeleteDialog } from "@/features/social-leads/components/SocialLeadDeleteDialog";
import { LinkCreatorDialog } from "@/features/social-leads/components/LinkCreatorDialog";
import {
  useSocialLeads,
  useSocialLeadStats,
  useDeleteSocialLead,
  useMarkLeadContacted,
  useMarkLeadPositive,
  useMarkLeadNegative,
  useMarkLeadToContact,
  useMarkLeadNotRelevant,
  useLinkLeadCreator
} from "@/features/social-leads/hooks/use-social-leads";
import { SocialLeadFilters as SocialLeadFiltersType, SocialAccountLead } from "@/features/social-leads/types";
import { ProspectDetailSidebar } from "@/features/social-leads/components/ProspectDetailSidebar";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SocialLeadsPage() {
  const [filters, setFilters] = useState<SocialLeadFiltersType>({
    page: 1,
    page_size: 10,
  });

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [linkLeadId, setLinkLeadId] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<SocialAccountLead | null>(null);

  const { data: leadsData, isLoading: isLoadingLeads } = useSocialLeads(filters);
  const { data: statsData, isLoading: isLoadingStats } = useSocialLeadStats(filters);

  const { mutate: deleteLead, isPending: isDeleting } = useDeleteSocialLead();
  const { mutate: markContacted } = useMarkLeadContacted();
  const { mutate: markPositive } = useMarkLeadPositive();
  const { mutate: markNegative } = useMarkLeadNegative();
  const { mutate: markToContact } = useMarkLeadToContact();
  const { mutate: markNotRelevant } = useMarkLeadNotRelevant();
  const { mutate: linkCreator, isPending: isLinking } = useLinkLeadCreator();

  const handleFiltersChange = (newFilters: SocialLeadFiltersType) => {
    setFilters(newFilters);
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      deleteLead(deleteId, {
        onSuccess: () => setDeleteId(null),
      });
    }
  };

  const handleLinkConfirm = (creatorId: string) => {
    if (linkLeadId) {
      linkCreator({ id: linkLeadId, creatorId }, {
        onSuccess: () => setLinkLeadId(null),
      });
    }
  };

  const handleStatusAction = (id: string, action: string) => {
    if (action === "mark_contacted") markContacted(id);
    if (action === "mark_positive") markPositive(id);
    if (action === "mark_negative") markNegative(id);
    if (action === "mark_to_contact") markToContact(id);
    if (action === "mark_not_relevant") markNotRelevant(id);
  };

  const handleRowClick = (id: string) => {
    const lead = leadsData?.results.find(l => l.id === id);
    if (lead) {
      setSelectedLead(lead);
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
              Comptes Sociaux
            </h1>
            <p className="text-muted-foreground mt-1">
              Gérez vos profils et opportunités provenant des réseaux sociaux.
            </p>
          </div>
          <Link href="/social-leads/create">
            {/* bg-primary et text-primary-foreground pour la visibilité du texte en Light Mode */}
            <Button className="shadow-lg shadow-primary/20 transition-all hover:scale-105 bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" /> Ajouter un compte
            </Button>
          </Link>
        </motion.div>

        <div className="space-y-8">
          <SocialLeadStatsCards stats={statsData} isLoading={isLoadingStats} />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Profils identifiés</h2>
            </div>

            <SocialLeadFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
            />

            <SocialLeadTable
                leads={leadsData?.results || []}
                onDelete={setDeleteId}
                onStatusAction={handleStatusAction}
                onLinkCreator={setLinkLeadId}
            />

            {/* Simple Pagination avec styles pour le Light Mode */}
            {leadsData && leadsData.total_pages > 1 && (
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
                    Page {filters.page} sur {leadsData.total_pages}
                  </div>
                  <Button
                      variant="outline"
                      size="sm"
                      className="text-foreground"
                      onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
                      disabled={filters.page === leadsData.total_pages}
                  >
                    Suivant
                  </Button>
                </div>
            )}
          </div>
        </div>

        <SocialLeadDeleteDialog
            isOpen={!!deleteId}
            onOpenChange={(open) => !open && setDeleteId(null)}
            onConfirm={handleDeleteConfirm}
            isLoading={isDeleting}
        />

        <LinkCreatorDialog
            isOpen={!!linkLeadId}
            onOpenChange={(open) => !open && setLinkLeadId(null)}
            onConfirm={handleLinkConfirm}
            isLoading={isLinking}
        />

        <ProspectDetailSidebar 
          lead={selectedLead}
          isOpen={!!selectedLead}
          onOpenChange={(open) => !open && setSelectedLead(null)}
          onStatusAction={handleStatusAction}
        />
        </div>
        );
        }
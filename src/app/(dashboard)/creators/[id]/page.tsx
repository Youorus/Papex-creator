"use client";

import { useParams, useRouter } from "next/navigation";
import { useCreator, useDeleteCreator } from "@/features/creators/hooks/use-creators";
import { CreatorDetailCard } from "@/features/creators/components/CreatorDetailCard";
import { PromoCodeManager } from "@/features/promo-codes/components/PromoCodeManager";
import { CreatorDeleteDialog } from "@/features/creators/components/CreatorDeleteDialog";
import { CreatorDetailAnalytics } from "@/features/creators/components/CreatorDetailAnalytics";
import { ContractManager } from "@/features/creators/components/ContractManager";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft, Edit, Trash2, Loader2, Info, BarChart3, FileText } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function CreatorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "stats" | "docs">("info");

  const { data: creator, isLoading, isError } = useCreator(id);
  const { mutate: deleteCreator, isPending: isDeleting } = useDeleteCreator();

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !creator) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <p className="text-xl font-semibold">Créateur non trouvé</p>
        <Button onClick={() => router.push("/creators")}>Retour à la liste</Button>
      </div>
    );
  }

  const handleDelete = () => {
    deleteCreator(id, {
      onSuccess: () => {
        router.push("/creators");
      },
    });
  };

  return (
    <div className="space-y-8 p-4 md:p-8 pt-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/creators">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{creator.full_name}</h1>
            <p className="text-muted-foreground">{creator.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/creators/${id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" /> Modifier
            </Button>
          </Link>
          <Button 
            variant="destructive" 
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Supprimer
          </Button>
        </div>
      </div>

      <div className="flex border-b border-border/50">
        <button
          onClick={() => setActiveTab("info")}
          className={cn(
            "flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors",
            activeTab === "info" 
              ? "border-primary text-primary" 
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <Info className="h-4 w-4" />
          Informations
        </button>
        <button
          onClick={() => setActiveTab("stats")}
          className={cn(
            "flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors",
            activeTab === "stats" 
              ? "border-primary text-primary" 
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <BarChart3 className="h-4 w-4" />
          Statistiques
        </button>
        <button
          onClick={() => setActiveTab("docs")}
          className={cn(
            "flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors",
            activeTab === "docs" 
              ? "border-primary text-primary" 
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <FileText className="h-4 w-4" />
          Documents
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {activeTab === "info" && (
            <>
              <CreatorDetailCard creator={creator} />
              <PromoCodeManager creatorId={id} />
            </>
          )}
          {activeTab === "stats" && <CreatorDetailAnalytics creatorId={id} />}
          {activeTab === "docs" && <ContractManager creatorId={id} />}
        </motion.div>
      </AnimatePresence>

      <CreatorDeleteDialog
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}

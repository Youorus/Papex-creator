"use client";

import { useParams, useRouter } from "next/navigation";
import { 
  useSocialLead, 
  useDeleteSocialLead,
  useMarkLeadContacted,
  useMarkLeadPositive,
  useMarkLeadNegative,
  useMarkLeadNotRelevant,
  useLinkLeadCreator
} from "@/features/social-leads/hooks/use-social-leads";
import { SocialLeadDetailCard } from "@/features/social-leads/components/SocialLeadDetailCard";
import { SocialLeadDeleteDialog } from "@/features/social-leads/components/SocialLeadDeleteDialog";
import { LinkCreatorDialog } from "@/features/social-leads/components/LinkCreatorDialog";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft, Edit, Trash2, Loader2, MessageSquare, CheckCircle2, XCircle, Link2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

export default function SocialLeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);

  const { data: lead, isLoading, isError } = useSocialLead(id);
  const { mutate: deleteLead, isPending: isDeleting } = useDeleteSocialLead();
  const { mutate: markContacted } = useMarkLeadContacted();
  const { mutate: markPositive } = useMarkLeadPositive();
  const { mutate: markNegative } = useMarkLeadNegative();
  const { mutate: markNotRelevant } = useMarkLeadNotRelevant();
  const { mutate: linkCreator, isPending: isLinking } = useLinkLeadCreator();

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !lead) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <p className="text-xl font-semibold">Lead non trouvé</p>
        <Button onClick={() => router.push("/social-leads")}>Retour à la liste</Button>
      </div>
    );
  }

  const handleDelete = () => {
    deleteLead(id, {
      onSuccess: () => {
        router.push("/social-leads");
      },
    });
  };

  const handleLinkConfirm = (creatorId: string) => {
    linkCreator({ id, creatorId }, {
      onSuccess: () => setShowLinkDialog(false),
    });
  };

  return (
    <div className="space-y-8 p-4 md:p-8 pt-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/social-leads">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{lead.username}</h1>
            <p className="text-muted-foreground">{lead.platform}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/social-leads/${id}/edit`}>
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

      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" size="sm" onClick={() => markContacted(id)}>
          <MessageSquare className="mr-2 h-4 w-4" /> Marquer contacté
        </Button>
        <Button variant="secondary" size="sm" onClick={() => markPositive(id)} className="hover:text-emerald-500">
          <CheckCircle2 className="mr-2 h-4 w-4" /> Marquer positif
        </Button>
        <Button variant="secondary" size="sm" onClick={() => markNegative(id)} className="hover:text-rose-500">
          <XCircle className="mr-2 h-4 w-4" /> Marquer négatif
        </Button>
        <Button variant="secondary" size="sm" onClick={() => markNotRelevant(id)} className="hover:text-slate-500">
          <XCircle className="mr-2 h-4 w-4" /> Marquer non pertinent
        </Button>
        <Button variant="secondary" size="sm" onClick={() => setShowLinkDialog(true)}>
          <Link2 className="mr-2 h-4 w-4" /> Lier à un créateur
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <SocialLeadDetailCard lead={lead} />
      </motion.div>

      <SocialLeadDeleteDialog
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />

      <LinkCreatorDialog
        isOpen={showLinkDialog}
        onOpenChange={setShowLinkDialog}
        onConfirm={handleLinkConfirm}
        isLoading={isLinking}
      />
    </div>
  );
}

"use client";

import { useParams, useRouter } from "next/navigation";
import { useSocialLead, useUpdateSocialLead } from "@/features/social-leads/hooks/use-social-leads";
import { SocialLeadForm } from "@/features/social-leads/components/SocialLeadForm";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function EditSocialLeadPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: lead, isLoading, isError } = useSocialLead(id);
  const { mutate: updateLead, isPending: isUpdating } = useUpdateSocialLead();

  const onSubmit = (data: any) => {
    updateLead({ id, payload: data }, {
      onSuccess: () => {
        router.push(`/social-leads/${id}`);
      },
    });
  };

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

  return (
    <div className="space-y-6 p-4 md:p-8 pt-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-4"
      >
        <Link href={`/social-leads/${id}`}>
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Modifier le Prospect</h1>
          <p className="text-muted-foreground">
            Mettez à jour les informations de {lead.username}.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <SocialLeadForm 
          initialData={lead} 
          onSubmit={onSubmit} 
          isLoading={isUpdating} 
        />
      </motion.div>
    </div>
  );
}

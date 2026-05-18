"use client";

import { SocialLeadForm } from "@/features/social-leads/components/SocialLeadForm";
import { useCreateSocialLead } from "@/features/social-leads/hooks/use-social-leads";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CreateSocialLeadPage() {
  const router = useRouter();
  const { mutate: createLead, isPending } = useCreateSocialLead();

  const onSubmit = (data: any) => {
    createLead(data, {
      onSuccess: () => {
        router.push("/social-leads");
      },
    });
  };

  return (
    <div className="space-y-6 p-4 md:p-8 pt-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-4"
      >
        <Link href="/social-leads">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ajouter un Prospect</h1>
          <p className="text-muted-foreground">
            Enregistrez un nouveau compte social à prospecter.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <SocialLeadForm onSubmit={onSubmit} isLoading={isPending} />
      </motion.div>
    </div>
  );
}

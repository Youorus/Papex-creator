"use client";

import { CreatorForm } from "@/features/creators/components/CreatorForm";
import { useCreateCreator } from "@/features/creators/hooks/use-creators";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CreateCreatorPage() {
  const router = useRouter();
  const { mutate: createCreator, isPending } = useCreateCreator();

  const onSubmit = (data: any) => {
    createCreator(data, {
      onSuccess: () => {
        router.push("/creators");
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
        <Link href="/creators">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nouveau Créateur</h1>
          <p className="text-muted-foreground">
            Inscrivez un nouveau créateur dans votre programme.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <CreatorForm onSubmit={onSubmit} isLoading={isPending} />
      </motion.div>
    </div>
  );
}

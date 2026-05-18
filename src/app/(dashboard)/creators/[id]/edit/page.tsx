"use client";

import { useParams, useRouter } from "next/navigation";
import { useCreator, useUpdateCreator } from "@/features/creators/hooks/use-creators";
import { CreatorForm } from "@/features/creators/components/CreatorForm";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function EditCreatorPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: creator, isLoading, isError } = useCreator(id);
  const { mutate: updateCreator, isPending: isUpdating } = useUpdateCreator();

  const onSubmit = (data: any) => {
    updateCreator({ id, payload: data }, {
      onSuccess: () => {
        router.push(`/creators/${id}`);
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

  if (isError || !creator) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <p className="text-xl font-semibold">Créateur non trouvé</p>
        <Button onClick={() => router.push("/creators")}>Retour à la liste</Button>
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
        <Link href={`/creators/${id}`}>
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Modifier le Créateur</h1>
          <p className="text-muted-foreground">
            Mettez à jour les informations de {creator.full_name}.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <CreatorForm 
          initialData={creator} 
          onSubmit={onSubmit} 
          isLoading={isUpdating} 
        />
      </motion.div>
    </div>
  );
}

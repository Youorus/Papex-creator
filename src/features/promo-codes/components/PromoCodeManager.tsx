import { useState } from "react";
import { Plus, Tag } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { PromoCodeTable } from "./PromoCodeTable";
import { PromoCodeForm } from "./PromoCodeForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { usePromoCodes, useCreatePromoCode, useUpdatePromoCode, useDeletePromoCode } from "../hooks/use-promo-codes";
import { PromoCode } from "../types";
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

interface PromoCodeManagerProps {
  creatorId: string;
}

export function PromoCodeManager({ creatorId }: PromoCodeManagerProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCode, setEditingCode] = useState<PromoCode | undefined>(undefined);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = usePromoCodes({ creator: creatorId });
  const { mutate: createCode, isPending: isCreating } = useCreatePromoCode();
  const { mutate: updateCode, isPending: isUpdating } = useUpdatePromoCode();
  const { mutate: deleteCode, isPending: isDeleting } = useDeletePromoCode();

  const handleCreate = (values: any) => {
    createCode(values, {
      onSuccess: () => setIsFormOpen(false),
    });
  };

  const handleUpdate = (values: any) => {
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
    }
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteCode(deleteId, {
        onSuccess: () => setDeleteId(null),
      });
    }
  };

  const openEdit = (code: PromoCode) => {
    setEditingCode(code);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingCode(undefined);
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Tag className="h-5 w-5 text-primary" />
          Codes Promo
        </CardTitle>
        <Button size="sm" onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Générer un code
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8 text-muted-foreground">Chargement...</div>
        ) : (
          <PromoCodeTable 
            promoCodes={data?.results || []} 
            onEdit={openEdit}
            onDelete={setDeleteId}
          />
        )}

        <Dialog open={isFormOpen} onOpenChange={(open) => !open && closeForm()}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCode ? "Modifier le code promo" : "Nouveau code promo"}
              </DialogTitle>
            </DialogHeader>
            <PromoCodeForm
              creatorId={creatorId}
              initialData={editingCode}
              onSubmit={editingCode ? handleUpdate : handleCreate}
              isLoading={isCreating || isUpdating}
              onCancel={closeForm}
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
      </CardContent>
    </Card>
  );
}

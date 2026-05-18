import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import { useCreators } from "@/features/creators/hooks/use-creators";
import { Loader2, Link2 } from "lucide-react";

interface LinkCreatorDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (creatorId: string) => void;
  isLoading: boolean;
}

export function LinkCreatorDialog({
  isOpen,
  onOpenChange,
  onConfirm,
  isLoading,
}: LinkCreatorDialogProps) {
  const [selectedCreatorId, setSelectedCreatorId] = useState<string>("");
  const { data: creatorsData, isLoading: isLoadingCreators } = useCreators({ page_size: 100 });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-primary" />
            Lier à un créateur
          </DialogTitle>
          <DialogDescription>
            Sélectionnez le créateur auquel vous souhaitez lier ce compte social.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Select 
            value={selectedCreatorId} 
            onValueChange={setSelectedCreatorId}
            disabled={isLoadingCreators || isLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={isLoadingCreators ? "Chargement des créateurs..." : "Choisir un créateur"} />
            </SelectTrigger>
            <SelectContent>
              {creatorsData?.results.map((creator) => (
                <SelectItem key={creator.id} value={creator.id}>
                  {creator.full_name} ({creator.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Annuler
          </Button>
          <Button 
            onClick={() => onConfirm(selectedCreatorId)} 
            disabled={!selectedCreatorId || isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Lier le compte
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

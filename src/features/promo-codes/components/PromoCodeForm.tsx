import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { promoCodeSchema, PromoCodeInput } from "../schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { PromoCode } from "../types";
import { useCreators } from "@/features/creators/hooks/use-creators";

interface PromoCodeFormProps {
  creatorId?: string;
  initialData?: PromoCode;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  onCancel: () => void;
}

export function PromoCodeForm({
  creatorId,
  initialData,
  onSubmit,
  isLoading,
  onCancel,
}: PromoCodeFormProps) {
  const isEditing = !!initialData;
  const { data: creatorsData, isLoading: isLoadingCreators } = useCreators({ page_size: 100 });

  const form = useForm<PromoCodeInput>({
    resolver: zodResolver(promoCodeSchema),
    defaultValues: initialData
      ? {
          creator_id: initialData.creator.id,
          code: initialData.code,
          commission_rate: initialData.commission_rate,
          bonus_amount: initialData.bonus_amount,
          description: initialData.description || "",
          valid_until: initialData.valid_until || "",
          status: initialData.status,
        }
      : {
          creator_id: creatorId || "",
          code: "",
          commission_rate: 10,
          bonus_amount: 0,
          description: "",
          valid_until: "",
          status: "ACTIVE",
        },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="creator_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Créateur</FormLabel>
              {isEditing || creatorId ? (
                <Input 
                  value={initialData?.creator.full_name || creatorsData?.results.find(c => c.id === creatorId)?.full_name || "Chargement..."} 
                  disabled 
                  className="bg-muted"
                />
              ) : (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un créateur" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {creatorsData?.results.map((creator) => (
                      <SelectItem key={creator.id} value={creator.id}>
                        {creator.full_name} ({creator.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code Promo</FormLabel>
              <FormControl>
                <Input 
                  placeholder="PROMO20" 
                  {...field} 
                  className="font-mono font-bold uppercase" 
                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="commission_rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Commission (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bonus_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bonus (€)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Description du code promo..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="valid_until"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valide jusqu&apos;au</FormLabel>
                <FormControl>
                  <Input type="date" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Statut</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Actif</SelectItem>
                    <SelectItem value="INACTIVE">Inactif</SelectItem>
                    <SelectItem value="EXPIRED">Expiré</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Enregistrer" : "Créer le code"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  socialLeadCreateSchema, 
  socialLeadUpdateSchema,
  SocialLeadCreateInput,
  SocialLeadUpdateInput
} from "../schemas";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage, 
  FormDescription 
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/shared/components/ui/select";
import { Switch } from "@/shared/components/ui/switch";
import { Textarea } from "@/shared/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Loader2 } from "lucide-react";
import { SocialAccountLead } from "../types";
import { useCreators } from "@/features/creators/hooks/use-creators";

interface SocialLeadFormProps {
  initialData?: SocialAccountLead;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

export function SocialLeadForm({ initialData, onSubmit, isLoading }: SocialLeadFormProps) {
  const isEditing = !!initialData;
  const { data: creatorsData } = useCreators({ page_size: 100 });
  
  const form = useForm<any>({
    resolver: zodResolver((isEditing ? socialLeadUpdateSchema : socialLeadCreateSchema) as any),
    defaultValues: initialData ? {
      ...initialData,
      creator: initialData.creator?.id || null,
      display_name: initialData.display_name || "",
      bio: initialData.bio || "",
      country: initialData.country || "",
      language: initialData.language || "",
      categories: initialData.categories || "",
      source: initialData.source || "",
    } : {
      platform: "TIKTOK",
      username: "",
      display_name: "",
      profile_url: "",
      followers_count: 0,
      bio: "",
      country: "",
      language: "",
      categories: "",
      source: "",
      is_viable: true,
      contact_status: "NEW",
      creator: null,
      notes: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Source & Identité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plateforme</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir une plateforme" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="TIKTOK">TikTok</SelectItem>
                          <SelectItem value="INSTAGRAM">Instagram</SelectItem>
                          <SelectItem value="YOUTUBE">YouTube</SelectItem>
                          <SelectItem value="FACEBOOK">Facebook</SelectItem>
                          <SelectItem value="LINKEDIN">LinkedIn</SelectItem>
                          <SelectItem value="OTHER">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom d&apos;utilisateur</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: john_doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="display_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom affiché</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="profile_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL du profil</FormLabel>
                      <FormControl>
                        <Input placeholder="https://instagram.com/john_doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="followers_count"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Abonnés</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="source"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Source d&apos;acquisition</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: scrape, manuel..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Profil & Détails</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pays</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: France" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Langue</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: fr" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="categories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Catégories</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: business, lifestyle" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Biographie</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Biographie du profil..." 
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Qualification & Statut</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="is_viable"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Lead Viable</FormLabel>
                        <FormDescription>
                          Le profil correspond-il à nos critères ?
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contact_status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Statut du contact</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir un statut" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="NEW">Nouveau</SelectItem>
                          <SelectItem value="TO_CONTACT">À contacter</SelectItem>
                          <SelectItem value="CONTACTED">Contacté</SelectItem>
                          <SelectItem value="POSITIVE">Positif</SelectItem>
                          <SelectItem value="NEGATIVE">Négatif</SelectItem>
                          <SelectItem value="CONVERTED">Converti</SelectItem>
                          <SelectItem value="NOT_RELEVANT">Non pertinent</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="creator"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Créateur lié (optionnel)</FormLabel>
                      <Select 
                        onValueChange={(v) => field.onChange(v === "none" ? null : v)} 
                        defaultValue={field.value || "none"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Lier à un créateur" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Aucun</SelectItem>
                          {creatorsData?.results.map((creator) => (
                            <SelectItem key={creator.id} value={creator.id}>
                              {creator.full_name} ({creator.email})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Si le lead est déjà converti ou lié à un créateur existant.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Notes Internes</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea 
                          placeholder="Ajouter des notes, historique des échanges..." 
                          className="min-h-[120px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="px-8 bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/20 transition-all"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Mettre à jour" : "Ajouter le lead"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

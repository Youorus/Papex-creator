import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  creatorCreateSchema, 
  creatorUpdateSchema, 
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
  Select as UISelect, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Loader2, User, Globe, FileText, Eye, EyeOff, Phone, Mail, Lock, MapPin } from "lucide-react";
import { CreatorProfile } from "../types";
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import Select from 'react-select';
import { Country, City } from 'country-state-city';

interface CreatorFormProps {
  initialData?: CreatorProfile;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

export function CreatorForm({ initialData, onSubmit, isLoading }: CreatorFormProps) {
  const isEditing = !!initialData;
  const [showPassword, setShowPassword] = useState(false);
  
  const countryOptions = useMemo(() => 
    Country.getAllCountries().map(c => ({
      value: c.isoCode,
      label: `${c.flag} ${c.name}`,
      name: c.name
    })), []);

  const form = useForm<any>({
    resolver: zodResolver((isEditing ? creatorUpdateSchema : creatorCreateSchema) as any),
    defaultValues: {
      email: initialData?.email || "",
      first_name: initialData?.first_name || "",
      last_name: initialData?.last_name || "",
      password: "",
      phone_number: initialData?.phone_number || "",
      country: initialData?.country || "",
      country_code: initialData?.country ? countryOptions.find(c => c.name === initialData.country)?.value : "",
      city: initialData?.city || "",
      notes: initialData?.notes || "",
      status: initialData?.status || "PENDING",
    },
  });

  const selectedCountryCode = form.watch("country_code");

  const handleFormSubmit = (data: any) => {
    // Remove UI-only fields before submission
    const { country_code, ...payload } = data;
    onSubmit(payload);
  };
  
  const cityOptions = useMemo(() => {
    if (!selectedCountryCode) return [];
    return City.getCitiesOfCountry(selectedCountryCode)?.map(c => ({
      value: c.name,
      label: c.name
    })) || [];
  }, [selectedCountryCode]);

  // Custom styles for react-select to match shadcn
  const selectStyles = {
    control: (base: any) => ({
      ...base,
      backgroundColor: 'transparent',
      borderColor: 'hsl(var(--border) / 0.5)',
      borderRadius: 'calc(var(--radius) - 2px)',
      '&:hover': {
        borderColor: 'hsl(var(--primary))',
      },
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: 'hsl(var(--popover))',
      border: '1px solid hsl(var(--border))',
    }),
    option: (base: any, state: { isFocused: boolean; isSelected: boolean }) => ({
      ...base,
      backgroundColor: state.isSelected 
        ? 'hsl(var(--primary))' 
        : state.isFocused 
          ? 'hsl(var(--accent))' 
          : 'transparent',
      color: state.isSelected ? 'hsl(var(--primary-foreground))' : 'hsl(var(--popover-foreground))',
      '&:active': {
        backgroundColor: 'hsl(var(--primary))',
      },
    }),
    singleValue: (base: any) => ({
      ...base,
      color: 'hsl(var(--foreground))',
    }),
    placeholder: (base: any) => ({
      ...base,
      color: 'hsl(var(--muted-foreground))',
    }),
    input: (base: any) => ({
      ...base,
      color: 'hsl(var(--foreground))',
    }),
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Identité Section */}
          <Card className="border-border/50 bg-card/30 backdrop-blur-md shadow-xl overflow-hidden">
            <div className="h-2 bg-primary" />
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className="p-2 rounded-lg bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                Identité & Compte
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {!isEditing && (
                <>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Mail className="h-4 w-4" /> Email
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="creator@example.com" 
                            className="bg-background/50" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Lock className="h-4 w-4" /> Mot de passe
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type={showPassword ? "text" : "password"} 
                              placeholder="••••••••" 
                              className="bg-background/50 pr-10"
                              {...field} 
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormDescription>Minimum 8 caractères</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom</FormLabel>
                      <FormControl>
                        <Input placeholder="Jean" className="bg-background/50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input placeholder="Dupont" className="bg-background/50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Phone className="h-4 w-4" /> Numéro de téléphone
                    </FormLabel>
                    <FormControl>
                      <div className="phone-input-container">
                        <PhoneInput
                          defaultCountry={selectedCountryCode?.toLowerCase() || "fr"}
                          value={field.value}
                          onChange={(phone) => field.onChange(phone)}
                          forceDialCode={true}
                          className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Localisation & Statut Section */}
          <Card className="border-border/50 bg-card/30 backdrop-blur-md shadow-xl overflow-hidden">
            <div className="h-2 bg-primary" />
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Globe className="h-5 w-5 text-primary" />
                </div>
                Localisation & Statut
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> Pays
                    </FormLabel>
                    <FormControl>
                      <Select
                        options={countryOptions}
                        styles={selectStyles}
                        placeholder="Rechercher un pays..."
                        value={countryOptions.find(opt => opt.name === field.value)}
                        onChange={(val: any) => {
                          field.onChange(val?.name || "");
                          form.setValue("country_code", val?.value || "");
                          form.setValue("city", ""); // Reset city when country changes
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ville</FormLabel>
                    <FormControl>
                      <Select
                        options={cityOptions}
                        styles={selectStyles}
                        placeholder={selectedCountryCode ? "Rechercher une ville..." : "Sélectionnez d'abord un pays"}
                        isDisabled={!selectedCountryCode}
                        value={cityOptions.find(opt => opt.value === field.value)}
                        onChange={(val: any) => field.onChange(val?.value || "")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isEditing && (
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Statut du compte</FormLabel>
                      <UISelect onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background/50">
                            <SelectValue placeholder="Choisir un statut" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="PENDING">En attente</SelectItem>
                          <SelectItem value="ACTIVE">Actif</SelectItem>
                          <SelectItem value="PAUSED">En pause</SelectItem>
                          <SelectItem value="DISABLED">Désactivé</SelectItem>
                        </SelectContent>
                      </UISelect>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/50 bg-card/30 backdrop-blur-md shadow-xl overflow-hidden">
          <div className="h-2 bg-primary" />
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              Notes Internes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea 
                      placeholder="Ajouter des notes sur ce créateur (visibles uniquement par l'admin)..." 
                      className="min-h-[100px] bg-background/50"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row justify-end gap-4 pb-8">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
            disabled={isLoading}
            className="px-8"
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="px-8 bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/20 transition-all font-semibold"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Mettre à jour le profil" : "Créer le nouveau créateur"}
          </Button>
        </div>
      </form>

      <style jsx global>{`
        .phone-input-container .react-international-phone-input {
          width: 100% !important;
          border: none !important;
          background: transparent !important;
          color: inherit !important;
        }
        .phone-input-container .react-international-phone-country-selector-button {
          background: transparent !important;
          border: none !important;
          border-right: 1px solid hsl(var(--border)) !important;
        }
        .phone-input-container .react-international-phone-country-selector-button:hover {
          background: hsl(var(--accent)) !important;
        }
      `}</style>
    </Form>
  );
}

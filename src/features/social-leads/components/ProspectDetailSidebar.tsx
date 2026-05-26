"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetDescription 
} from "@/shared/components/ui/sheet";
import { SocialAccountLead, ContactStatus } from "../types";
import { SocialPlatformBadge } from "./SocialPlatformBadge";
import { SocialLeadStatusBadge } from "./SocialLeadStatusBadge";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";
import { 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  ExternalLink, 
  Loader2,
  Save
} from "lucide-react";
import { useUpdateSocialLead } from "../hooks/use-social-leads";
import { toast } from "sonner";
import { AppAvatar } from "@/shared/components/avatar/AppAvatar";
import { Badge } from "@/shared/components/ui/badge";
import { debounce } from "lodash";

interface ProspectDetailSidebarProps {
  lead: SocialAccountLead | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusAction: (id: string, action: string) => void;
}

export function ProspectDetailSidebar({ 
  lead, 
  isOpen, 
  onOpenChange,
  onStatusAction
}: ProspectDetailSidebarProps) {
  const { mutate: updateLead, isPending } = useUpdateSocialLead();
  const [notes, setNotes] = useState(lead?.notes || "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (lead) {
      setNotes(lead.notes || "");
    }
  }, [lead]);

  const debouncedSave = useCallback(
    debounce((newNotes: string, leadId: string) => {
      setIsSaving(true);
      updateLead(
        { id: leadId, payload: { notes: newNotes } },
        { 
          onSettled: () => setIsSaving(false),
          onSuccess: () => toast.success("Notes enregistrées")
        }
      );
    }, 1000),
    []
  );

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setNotes(value);
    if (lead) {
      debouncedSave(value, lead.id);
    }
  };

  if (!lead) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader className="space-y-4 pr-6">
          <div className="flex items-center justify-between">
            <SocialPlatformBadge platform={lead.platform} />
            <SocialLeadStatusBadge status={lead.contact_status} />
          </div>
          <div className="flex items-center gap-4">
            <AppAvatar 
              name={lead.display_name || lead.username} 
              className="h-16 w-16"
            />
            <div className="flex flex-col">
              <SheetTitle className="text-2xl font-black">{lead.username}</SheetTitle>
              <SheetDescription className="text-base font-medium">
                {lead.display_name}
              </SheetDescription>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {lead.profile_url && (
              <Button variant="outline" size="sm" asChild>
                <a href={lead.profile_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Voir le profil
                </a>
              </Button>
            )}
            <Badge variant="secondary" className="text-sm px-3 py-1">
              {new Intl.NumberFormat("fr-FR").format(lead.followers_count)} abonnés
            </Badge>
          </div>
        </SheetHeader>

        <div className="mt-8 space-y-8">
          {/* Social Info Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Informations Sociales</h3>
            <div className="grid gap-4 bg-muted/30 p-4 rounded-xl border border-border/50">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Bio</Label>
                <p className="text-sm italic">
                  {lead.bio || "Aucune biographie disponible"}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Catégories</Label>
                  <p className="text-sm font-medium">{lead.categories || "Non classé"}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Pays / Langue</Label>
                  <p className="text-sm font-medium">
                    {lead.country || "Inconnu"} / {lead.language || "Inconnu"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Actions Rapides</h3>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                onClick={() => onStatusAction(lead.id, "mark_positive")}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" /> Positif
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-rose-500/5 hover:bg-rose-500/10 text-rose-600 border-rose-500/20"
                onClick={() => onStatusAction(lead.id, "mark_negative")}
              >
                <XCircle className="mr-2 h-4 w-4" /> Négatif
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-amber-500/5 hover:bg-amber-500/10 text-amber-600 border-amber-500/20"
                onClick={() => onStatusAction(lead.id, "mark_to_contact")}
              >
                <MessageSquare className="mr-2 h-4 w-4" /> À recontacter
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onStatusAction(lead.id, "mark_contacted")}
              >
                <MessageSquare className="mr-2 h-4 w-4" /> Marquer contacté
              </Button>
            </div>
          </div>

          {/* Notes Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Notes de Prospection</h3>
              {isSaving && (
                <div className="flex items-center text-[10px] text-muted-foreground animate-pulse">
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" /> Enregistrement...
                </div>
              )}
            </div>
            <div className="relative">
              <Textarea 
                value={notes}
                onChange={handleNotesChange}
                placeholder="Ajouter des notes sur cet échange..."
                className="min-h-[150px] bg-card resize-none pr-10"
              />
              <Save className="absolute right-3 bottom-3 h-4 w-4 text-muted-foreground opacity-30" />
            </div>
            <p className="text-[10px] text-muted-foreground italic">
              Les notes sont sauvegardées automatiquement après 1 seconde d&apos;inactivité.
            </p>
          </div>

          {/* Conversion Section */}
          {!lead.creator && lead.contact_status === "POSITIVE" && (
            <div className="pt-6 border-t border-border/50">
              <Button className="w-full bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20" size="lg">
                Convertir en Créateur
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

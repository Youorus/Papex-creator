"use client";

import { useAuth } from "@/providers/auth-provider";
import { useCreatorContracts } from "@/features/creators/hooks/use-creator-contracts";
import { 
  FileText, 
  Download, 
  FileIcon, 
  ImageIcon,
  Calendar,
  ExternalLink,
  ShieldCheck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/shared/components/ui/badge";

export default function MyContractsPage() {
  const { creatorProfile } = useAuth();
  
  const { data: contracts, isLoading } = useCreatorContracts({ 
    creator_id: creatorProfile?.id 
  });

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return <FileText className="h-10 w-10 text-rose-500" />;
    if (['jpg', 'jpeg', 'png', 'webp'].includes(ext || '')) return <ImageIcon className="h-10 w-10 text-blue-500" />;
    return <FileIcon className="h-10 w-10 text-slate-500" />;
  };

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          Mes Contrats & Documents
        </h1>
        <p className="text-muted-foreground mt-2">
          Consultez et téléchargez vos documents contractuels en toute sécurité.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-48 w-full bg-muted animate-pulse rounded-2xl" />
          ))
        ) : contracts?.results.length === 0 ? (
          <Card className="md:col-span-2 lg:col-span-3 border-dashed border-2">
            <CardContent className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <ShieldCheck className="h-12 w-12 mb-4 opacity-20" />
              <p className="text-lg font-medium">Aucun document disponible.</p>
              <p className="text-sm">Vos contrats apparaîtront ici une fois qu&apos;ils auront été déposés par l&apos;équipe.</p>
            </CardContent>
          </Card>
        ) : (
          contracts?.results.map((contract) => (
            <Card key={contract.id} className="group overflow-hidden border-border/50 bg-card/60 backdrop-blur-md hover:shadow-xl transition-all duration-300 rounded-2xl flex flex-col">
              <CardHeader className="pb-2 border-b border-border/10 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="bg-white dark:bg-slate-800">
                    Officiel
                  </Badge>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(contract.created_at), "dd MMM yyyy", { locale: fr })}
                  </div>
                </div>
                <CardTitle className="text-xl font-black tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
                  {contract.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-6 flex-1 flex flex-col justify-between">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 rounded-2xl bg-muted/50 group-hover:scale-110 transition-transform duration-300">
                    {getFileIcon(contract.file_name)}
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-tighter">Type de fichier</p>
                    <p className="text-sm font-black uppercase">{contract.file_name.split('.').pop()}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    className="flex-1 font-bold h-12 rounded-xl shadow-lg shadow-primary/20"
                    asChild
                  >
                    <a href={contract.file} target="_blank" rel="noopener noreferrer" download>
                      <Download className="mr-2 h-5 w-5" /> Télécharger
                    </a>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-12 w-12 rounded-xl"
                    asChild
                  >
                    <a href={contract.file} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="bg-slate-900 text-slate-400 rounded-2xl p-6 flex items-start gap-4">
        <ShieldCheck className="h-6 w-6 text-emerald-400 shrink-0 mt-1" />
        <div className="space-y-1">
          <p className="font-bold text-white">Espace Sécurisé</p>
          <p className="text-sm leading-relaxed">
            Tous vos contrats sont stockés sur nos serveurs sécurisés. Seuls vous et l&apos;équipe administrative de Papiers Express pouvez y accéder.
          </p>
        </div>
      </div>
    </div>
  );
}

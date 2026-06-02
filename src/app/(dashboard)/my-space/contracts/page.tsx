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
  ShieldCheck,
  FolderOpen
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/shared/components/ui/badge";

export default function MyDocumentsPage() {
  const { creatorProfile } = useAuth();
  
  const { data: contracts, isLoading } = useCreatorContracts(
    { 
      creator: creatorProfile?.id,
      creator_id: creatorProfile?.id 
    },
    { enabled: !!creatorProfile?.id }
  );

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return <FileText className="h-10 w-10 text-rose-500" />;
    if (['jpg', 'jpeg', 'png', 'webp'].includes(ext || '')) return <ImageIcon className="h-10 w-10 text-blue-500" />;
    return <FileIcon className="h-10 w-10 text-slate-500" />;
  };

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Mes Documents
          </h1>
          <p className="text-muted-foreground mt-2 font-medium leading-relaxed">
            Consultez et téléchargez vos documents contractuels et administratifs.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-xl border border-primary/10">
          <FolderOpen className="h-5 w-5 text-primary" />
          <span className="text-sm font-bold text-primary">{contracts?.results.length || 0} Fichiers</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-48 w-full bg-muted animate-pulse rounded-[2rem]" />
          ))
        ) : contracts?.results.length === 0 ? (
          <Card className="md:col-span-2 lg:col-span-3 border-dashed border-2 rounded-[2rem] bg-card/30 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-24 text-muted-foreground">
              <div className="p-6 rounded-3xl bg-muted/20 mb-4">
                <ShieldCheck className="h-12 w-12 opacity-20" />
              </div>
              <p className="text-xl font-black text-foreground">Aucun document disponible</p>
              <p className="text-sm font-medium max-w-xs text-center mt-2">Vos documents apparaîtront ici dès qu&apos;ils seront validés par l&apos;administration.</p>
            </CardContent>
          </Card>
        ) : (
          contracts?.results.map((contract) => (
            <Card key={contract.id} className="group overflow-hidden border-border/50 bg-card/40 backdrop-blur-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-[2rem] flex flex-col">
              <CardHeader className="pb-4 border-b border-border/10 bg-slate-50/50 dark:bg-slate-900/50 p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge className="bg-primary text-white border-none text-[9px] font-black uppercase px-2.5 py-1">
                    OFFICIEL
                  </Badge>
                  <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(contract.created_at), "dd MMM yyyy", { locale: fr })}
                  </div>
                </div>
                <CardTitle className="text-xl font-black tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
                  {contract.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6 flex-1 flex flex-col justify-between">
                <div className="flex items-center gap-5 mb-8">
                  <div className="p-5 rounded-3xl bg-muted/50 group-hover:scale-110 group-hover:bg-primary/5 transition-all duration-300 shadow-inner">
                    {getFileIcon(contract.file_name)}
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Type Archive</p>
                    <p className="text-sm font-black uppercase tracking-tighter">{contract.file_name.split('.').pop()} Document</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    className="flex-1 font-black h-12 rounded-2xl shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 transition-all uppercase text-[10px] tracking-widest"
                    asChild
                  >
                    <a href={contract.file} target="_blank" rel="noopener noreferrer" download>
                      <Download className="mr-2 h-4 w-4" /> Télécharger
                    </a>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-12 w-12 rounded-2xl border-border/50 hover:bg-accent hover:border-primary/20 transition-all"
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

      <div className="bg-slate-900 text-slate-400 rounded-[2rem] p-8 flex items-start gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
            <ShieldCheck className="h-32 w-32" />
        </div>
        <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500 shadow-inner shrink-0 mt-1">
            <ShieldCheck className="h-7 w-7" />
        </div>
        <div className="space-y-2 relative z-10">
          <p className="text-xl font-black text-white tracking-tight">Espace Coffre-fort</p>
          <p className="text-sm font-medium leading-relaxed max-w-2xl">
            Tous vos documents sont cryptés et stockés sur nos serveurs haute sécurité. Vous seul et l&apos;équipe administrative de <span className="text-primary font-bold">Papiers Express</span> pouvez accéder à ces fichiers.
          </p>
        </div>
      </div>
    </div>
  );
}

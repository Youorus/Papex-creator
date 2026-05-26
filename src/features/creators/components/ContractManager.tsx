"use client";

import React, { useState } from "react";
import { 
  FileText, 
  Plus, 
  Download, 
  Trash2, 
  Edit, 
  FileIcon, 
  ImageIcon,
  Loader2,
  AlertCircle
} from "lucide-react";
import { 
  useCreatorContracts, 
  useDeleteContract, 
  useUpdateContract,
  useCreateContract 
} from "../hooks/use-creator-contracts";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/shared/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/lib/utils";

interface ContractManagerProps {
  creatorId: string;
}

export function ContractManager({ creatorId }: ContractManagerProps) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<{ id: string, title: string } | null>(null);
  
  // Upload form state
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const { data: contracts, isLoading } = useCreatorContracts({ creator_id: creatorId });
  const { mutate: deleteContract } = useDeleteContract();
  const { mutate: updateContract, isPending: isUpdating } = useUpdateContract();
  const { mutate: createContract, isPending: isUploading } = useCreateContract();

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !uploadTitle) return;

    const formData = new FormData();
    formData.append("title", uploadTitle);
    formData.append("file", uploadFile);
    formData.append("creator_id", creatorId);

    createContract(formData, {
      onSuccess: () => {
        setIsUploadModalOpen(false);
        setUploadTitle("");
        setUploadFile(null);
      }
    });
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingContract) return;

    updateContract({ id: editingContract.id, title: editingContract.title }, {
      onSuccess: () => {
        setIsEditModalOpen(false);
        setEditingContract(null);
      }
    });
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "N/A";
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return <FileText className="h-5 w-5 text-rose-500" />;
    if (['jpg', 'jpeg', 'png', 'webp'].includes(ext || '')) return <ImageIcon className="h-5 w-5 text-blue-500" />;
    return <FileIcon className="h-5 w-5 text-slate-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">Documents & Contrats</h2>
        </div>
        <Button onClick={() => setIsUploadModalOpen(true)} size="sm">
          <Plus className="mr-2 h-4 w-4" /> Ajouter un contrat
        </Button>
      </div>

      <Card className="border-border/50 bg-card/60 backdrop-blur-md overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 dark:bg-slate-900/50">
                <TableHead>Titre</TableHead>
                <TableHead>Date d&apos;ajout</TableHead>
                <TableHead>Taille</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(2).fill(0).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={4} className="h-12 bg-muted/20 animate-pulse" />
                  </TableRow>
                ))
              ) : contracts?.results.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                    Aucun document rattaché à ce créateur.
                  </TableCell>
                </TableRow>
              ) : (
                contracts?.results.map((contract) => (
                  <TableRow key={contract.id} className="group hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        {getFileIcon(contract.file_name)}
                        <span className="font-bold">{contract.title}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {format(new Date(contract.created_at), "dd MMM yyyy", { locale: fr })}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[10px]">
                        {formatFileSize(contract.file_size)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8" 
                          asChild
                        >
                          <a href={contract.file} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => {
                            setEditingContract({ id: contract.id, title: contract.title });
                            setIsEditModalOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                          onClick={() => {
                            if (confirm("Supprimer ce contrat définitivement ?")) {
                              deleteContract(contract.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Upload Modal */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau contrat</DialogTitle>
            <DialogDescription>
              Téléchargez un document PDF ou une image. Le fichier sera stocké de manière sécurisée.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpload} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre du document</Label>
              <Input 
                id="title" 
                placeholder="Ex: Contrat de Partenariat 2026" 
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="file">Fichier (PDF ou Image)</Label>
              <Input 
                id="file" 
                type="file" 
                accept=".pdf,image/*" 
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                required
                className="cursor-pointer"
              />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsUploadModalOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={isUploading || !uploadFile || !uploadTitle}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  "Envoyer le contrat"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modifier le titre</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Titre du document</Label>
              <Input 
                id="edit-title" 
                value={editingContract?.title || ""}
                onChange={(e) => setEditingContract(prev => prev ? { ...prev, title: e.target.value } : null)}
                required
              />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enregistrer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

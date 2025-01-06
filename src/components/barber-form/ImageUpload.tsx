import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { UserCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ImageUploadProps {
  currentImage: string | null;
  onUpload: (url: string) => void;
}

export function ImageUpload({ currentImage, onUpload }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('barbers')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('barbers')
        .getPublicUrl(filePath);

      onUpload(publicUrl);
      toast({
        title: "Imagem carregada com sucesso",
        description: "A foto do barbeiro foi atualizada.",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Erro ao carregar imagem",
        description: "Não foi possível carregar a imagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <FormLabel className="text-sm">Foto do Barbeiro</FormLabel>
      <div className="flex items-start gap-4">
        <div className="relative h-32 w-32 overflow-hidden rounded-full border border-border">
          {currentImage ? (
            <img
              src={currentImage}
              alt="Foto do barbeiro"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <UserCircle2 className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Button
            type="button"
            variant="outline"
            className="relative"
            disabled={uploading}
          >
            {uploading ? "Carregando..." : "Carregar Foto"}
            <input
              type="file"
              className="absolute inset-0 cursor-pointer opacity-0"
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
            />
          </Button>
          <p className="text-sm text-muted-foreground">
            Formatos suportados: JPG, PNG. Tamanho máximo: 5MB
          </p>
        </div>
      </div>
    </div>
  );
}
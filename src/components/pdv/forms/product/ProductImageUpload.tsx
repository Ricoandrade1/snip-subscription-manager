import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Package } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProductImageUploadProps {
  initialImage?: string | null;
  onImageUpload: (url: string) => void;
}

export function ProductImageUpload({ initialImage, onImageUpload }: ProductImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImage || null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      setUploading(true);
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      onImageUpload(publicUrl);
      setPreviewUrl(publicUrl);
      toast.success('Imagem carregada com sucesso');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Erro ao carregar imagem');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mb-6">
      <FormLabel className="text-barber-light mb-2 block">Imagem do Produto</FormLabel>
      <div className="flex items-start gap-4">
        <div className="relative aspect-square w-32 overflow-hidden rounded-lg border border-barber-gold/30">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-barber-gray">
              <Package className="h-8 w-8 text-muted-foreground/50" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="bg-barber-gray border-barber-gold/30 text-barber-light"
          />
          <p className="mt-2 text-sm text-muted-foreground">
            Recomendado: JPG, PNG. Máximo 5MB
          </p>
        </div>
      </div>
    </div>
  );
}
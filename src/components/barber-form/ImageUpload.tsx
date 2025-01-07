import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Upload, Pencil } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

interface ImageUploadProps {
  currentImage: string | null;
  onUpload: (url: string) => void;
}

export function ImageUpload({ currentImage, onUpload }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const form = useForm();

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Imagem muito grande. Máximo 2MB permitido.");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        toast.error("Apenas imagens são permitidas.");
        return;
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from("barbers")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("barbers")
        .getPublicUrl(filePath);

      onUpload(publicUrl);
      toast.success("Imagem atualizada com sucesso!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Erro ao fazer upload da imagem");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-4">
        <div className="flex flex-col items-center gap-4">
          {currentImage ? (
            <div className="relative">
              <img
                src={currentImage}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-barber-gold"
              />
              <div className="absolute -bottom-1 -right-1">
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isUploading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-barber-gray border-barber-gold text-barber-gold hover:bg-barber-gold hover:text-barber-black"
                    disabled={isUploading}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-barber-gray flex items-center justify-center border-2 border-barber-gold">
                <Upload className="w-8 h-8 text-barber-gold" />
              </div>
              <div className="absolute -bottom-1 -right-1">
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isUploading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-barber-gray border-barber-gold text-barber-gold hover:bg-barber-gold hover:text-barber-black"
                    disabled={isUploading}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
    </Form>
  );
}
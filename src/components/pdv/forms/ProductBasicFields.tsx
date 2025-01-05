import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { ProductFormValues } from "./schema";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Package } from "lucide-react";

interface ProductBasicFieldsProps {
  form: UseFormReturn<ProductFormValues>;
  initialImage?: string | null;
}

export function ProductBasicFields({ form, initialImage }: ProductBasicFieldsProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImage || null);

  const price = parseFloat(form.watch("price") || "0");
  const vatRate = parseFloat(form.watch("vat_rate") || "23");
  const vatIncluded = form.watch("vat_included");

  const vatAmount = price * (vatRate / 100);
  const totalWithVat = vatIncluded ? price : price + vatAmount;
  const priceWithoutVat = vatIncluded ? price - vatAmount : price;

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

      form.setValue('image_url', publicUrl);
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
    <>
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

      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-barber-light">Nome do Item</FormLabel>
            <FormControl>
              <Input 
                placeholder="Digite o nome do item" 
                className="bg-barber-gray border-barber-gold/30 text-barber-light placeholder:text-gray-500"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-barber-light">Descrição</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Adicione uma descrição do item"
                className="min-h-[80px] bg-barber-gray border-barber-gold/30 text-barber-light placeholder:text-gray-500"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-barber-light">Preço</FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  step="0.01"
                  placeholder="Digite o preço" 
                  className="bg-barber-gray border-barber-gold/30 text-barber-light placeholder:text-gray-500"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-barber-light">Quantidade em Estoque</FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  placeholder="Digite a quantidade" 
                  className="bg-barber-gray border-barber-gold/30 text-barber-light placeholder:text-gray-500"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <Card className="p-4 bg-barber-gray border-barber-gold/30">
        <h3 className="font-medium text-barber-light mb-4">Configurações de IVA</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="vat_rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-barber-light">Taxa de IVA (%)</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    step="0.1"
                    placeholder="23%" 
                    className="bg-barber-black border-barber-gold/30 text-barber-light placeholder:text-gray-500"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vat_included"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-lg border border-barber-gold/30 p-3 bg-barber-black">
                <div className="space-y-0.5">
                  <FormLabel className="text-barber-light">IVA incluído no preço</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-barber-gold"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
          <div className="space-y-1">
            <span className="text-gray-400">Preço sem IVA:</span>
            <div className="font-medium text-barber-light">
              {new Intl.NumberFormat("pt-PT", {
                style: "currency",
                currency: "EUR",
              }).format(priceWithoutVat)}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-gray-400">Valor do IVA:</span>
            <div className="font-medium text-barber-light">
              {new Intl.NumberFormat("pt-PT", {
                style: "currency",
                currency: "EUR",
              }).format(vatAmount)}
            </div>
          </div>
          <div className="col-span-2 pt-2 border-t border-barber-gold/30">
            <span className="text-gray-400">Preço total com IVA:</span>
            <div className="text-lg font-bold text-barber-light">
              {new Intl.NumberFormat("pt-PT", {
                style: "currency",
                currency: "EUR",
              }).format(totalWithVat)}
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}
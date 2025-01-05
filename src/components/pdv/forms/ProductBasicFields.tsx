import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { ProductFormValues } from "./schema";
import { ProductImageUpload } from "./product/ProductImageUpload";
import { ProductVatConfig } from "./product/ProductVatConfig";

interface ProductBasicFieldsProps {
  form: UseFormReturn<ProductFormValues>;
  initialImage?: string | null;
}

export function ProductBasicFields({ form, initialImage }: ProductBasicFieldsProps) {
  return (
    <div className="space-y-6">
      <ProductImageUpload 
        initialImage={initialImage}
        onImageUpload={(url) => form.setValue('image_url', url)}
      />

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

      <ProductVatConfig form={form} />
    </div>
  );
}
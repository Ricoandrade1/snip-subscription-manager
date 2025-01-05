import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { ProductFormValues } from "./schema";

interface ProductBasicFieldsProps {
  form: UseFormReturn<ProductFormValues>;
}

export function ProductBasicFields({ form }: ProductBasicFieldsProps) {
  const price = parseFloat(form.watch("price") || "0");
  const vatRate = parseFloat(form.watch("vat_rate") || "23");
  const vatIncluded = form.watch("vat_included");

  const vatAmount = price * (vatRate / 100);
  const totalWithVat = vatIncluded ? price : price + vatAmount;
  const priceWithoutVat = vatIncluded ? price - vatAmount : price;

  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome do Item</FormLabel>
            <FormControl>
              <Input placeholder="Digite o nome do item" {...field} />
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
            <FormLabel>Descrição</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Adicione uma descrição do item"
                className="min-h-[80px]"
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
              <FormLabel>Preço</FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  step="0.01"
                  placeholder="Digite o preço" 
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
              <FormLabel>Quantidade em Estoque</FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  placeholder="Digite a quantidade" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4 border rounded-lg p-4 bg-muted/50">
        <h3 className="font-medium">Configurações de IVA</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="vat_rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Taxa de IVA (%)</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    step="0.1"
                    placeholder="23%" 
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
              <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>IVA incluído no preço</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <span className="text-muted-foreground">Preço sem IVA:</span>
            <div className="font-medium">
              {new Intl.NumberFormat("pt-PT", {
                style: "currency",
                currency: "EUR",
              }).format(priceWithoutVat)}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground">Valor do IVA:</span>
            <div className="font-medium">
              {new Intl.NumberFormat("pt-PT", {
                style: "currency",
                currency: "EUR",
              }).format(vatAmount)}
            </div>
          </div>
          <div className="col-span-2 pt-2 border-t">
            <span className="text-muted-foreground">Preço total com IVA:</span>
            <div className="text-lg font-bold">
              {new Intl.NumberFormat("pt-PT", {
                style: "currency",
                currency: "EUR",
              }).format(totalWithVat)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
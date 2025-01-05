import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { ProductFormValues } from "../schema";

interface ProductVatConfigProps {
  form: UseFormReturn<ProductFormValues>;
}

export function ProductVatConfig({ form }: ProductVatConfigProps) {
  const price = parseFloat(form.watch("price") || "0");
  const vatRate = parseFloat(form.watch("vat_rate") || "23");
  const vatIncluded = form.watch("vat_included");

  const vatAmount = price * (vatRate / 100);
  const totalWithVat = vatIncluded ? price : price + vatAmount;
  const priceWithoutVat = vatIncluded ? price - vatAmount : price;

  return (
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
  );
}
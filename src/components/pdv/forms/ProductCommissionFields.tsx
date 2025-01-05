import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ProductFormValues } from "./schema";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Percent } from "lucide-react";
import { toast } from "sonner";

interface Barber {
  id: string;
  name: string;
  commission_rate: number;
}

interface ProductCommissionFieldsProps {
  form: UseFormReturn<ProductFormValues>;
}

export function ProductCommissionFields({ form }: ProductCommissionFieldsProps) {
  const [barbers, setBarbers] = useState<Barber[]>([]);

  useEffect(() => {
    fetchBarbers();
  }, []);

  const fetchBarbers = async () => {
    try {
      const { data, error } = await supabase
        .from("barbers")
        .select("id, name, commission_rate")
        .eq("status", "active")
        .order("name");
      
      if (error) throw error;
      
      if (data) {
        setBarbers(data);
        initializeCommissionRates(data);
      }
    } catch (error) {
      console.error("Error fetching barbers:", error);
      toast.error("Erro ao carregar barbeiros");
    }
  };

  const initializeCommissionRates = (barberData: Barber[]) => {
    const currentRates = form.getValues("commission_rates") || {};
    const initializedRates = { ...currentRates };
    
    barberData.forEach(barber => {
      if (!(barber.id in initializedRates)) {
        initializedRates[barber.id] = barber.commission_rate || 0;
      }
    });
    
    form.setValue("commission_rates", initializedRates, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    });
  };

  const handleCommissionChange = (barberId: string, value: string) => {
    try {
      const numValue = value === "" ? 0 : parseFloat(value);
      if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
        const currentRates = { ...form.getValues("commission_rates") };
        currentRates[barberId] = numValue;
        
        form.setValue("commission_rates", currentRates, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true
        });
      } else {
        toast.error("A comissão deve estar entre 0 e 100%");
      }
    } catch (error) {
      console.error("Error updating commission rate:", error);
      toast.error("Erro ao atualizar comissão");
    }
  };

  return (
    <Card className="bg-barber-gray border-barber-gold/20 p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-barber-gold/20 pb-4">
          <Percent className="h-5 w-5 text-barber-gold" />
          <h3 className="text-lg font-medium text-barber-gold">Comissões por Barbeiro</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {barbers.map((barber) => (
            <FormField
              key={barber.id}
              control={form.control}
              name={`commission_rates.${barber.id}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-barber-light">{barber.name}</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        placeholder="% comissão"
                        value={field.value ?? barber.commission_rate}
                        onChange={(e) => handleCommissionChange(barber.id, e.target.value)}
                        className="w-24 bg-barber-black border-barber-gold/50 focus:border-barber-gold text-white"
                      />
                      <span className="text-sm text-barber-light">%</span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}
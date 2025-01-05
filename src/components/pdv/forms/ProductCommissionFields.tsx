import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ProductFormValues } from "./schema";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Percent } from "lucide-react";

interface Barber {
  id: string;
  name: string;
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
    const { data } = await supabase
      .from("barbers")
      .select("id, name")
      .order("name");
    
    if (data) {
      setBarbers(data);
    }
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Percent className="h-5 w-5" />
          <h3 className="text-lg font-medium">Comissões por Barbeiro</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {barbers.map((barber) => (
            <FormField
              key={barber.id}
              control={form.control}
              name={`commission_rates.${barber.id}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{barber.name}</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="% comissão"
                        {...field}
                        className="w-24"
                      />
                      <span className="text-sm text-muted-foreground">%</span>
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
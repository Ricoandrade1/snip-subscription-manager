import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { SubscriberFormData } from "./SubscriberForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PlanFieldsProps {
  form: UseFormReturn<SubscriberFormData>;
}

export function PlanFields({ form }: PlanFieldsProps) {
  const { data: plans } = useQuery({
    queryKey: ['plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('id');
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <FormField
      control={form.control}
      name="plan"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm">Plano</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-col space-y-2"
            >
              {plans?.map((plan) => (
                <FormItem key={plan.id} className="flex items-center space-x-2">
                  <FormControl>
                    <RadioGroupItem value={plan.title} />
                  </FormControl>
                  <FormLabel className="text-sm">
                    {plan.title} ({plan.price}€)
                  </FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
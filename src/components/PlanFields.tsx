import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { SubscriberFormData } from "./SubscriberForm";
import { useEffect, useState } from "react";
import { getPlanPrices } from "@/utils/planPrices";

interface PlanFieldsProps {
  form: UseFormReturn<SubscriberFormData>;
}

export function PlanFields({ form }: PlanFieldsProps) {
  const [planPrices, setPlanPrices] = useState<Record<string, number>>({
    Basic: 30,
    Classic: 40,
    Business: 50
  });

  useEffect(() => {
    const loadPlanPrices = async () => {
      const prices = await getPlanPrices();
      setPlanPrices(prices);
    };
    loadPlanPrices();
  }, []);

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
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <RadioGroupItem value="Basic" />
                </FormControl>
                <FormLabel className="text-sm">
                  Basic ({planPrices.Basic}€)
                </FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <RadioGroupItem value="Classic" />
                </FormControl>
                <FormLabel className="text-sm">
                  Classic ({planPrices.Classic}€)
                </FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <RadioGroupItem value="Business" />
                </FormControl>
                <FormLabel className="text-sm">
                  Business ({planPrices.Business}€)
                </FormLabel>
              </FormItem>
            </RadioGroup>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
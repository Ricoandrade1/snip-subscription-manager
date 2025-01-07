import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { SubscriberFormData } from "./SubscriberForm";
import { PLAN_PRICES } from "./subscribers/utils/planPrices";

interface PlanFieldsProps {
  form: UseFormReturn<SubscriberFormData>;
}

export function PlanFields({ form }: PlanFieldsProps) {
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
                  Basic ({PLAN_PRICES.Basic}€)
                </FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <RadioGroupItem value="Classic" />
                </FormControl>
                <FormLabel className="text-sm">
                  Classic ({PLAN_PRICES.Classic}€)
                </FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <RadioGroupItem value="Business" />
                </FormControl>
                <FormLabel className="text-sm">
                  Business ({PLAN_PRICES.Business}€)
                </FormLabel>
              </FormItem>
            </RadioGroup>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
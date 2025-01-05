import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { SubscriberFormData } from "./SubscriberForm";

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
          <FormLabel>Plano</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-col space-y-1"
            >
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="Basic" />
                </FormControl>
                <FormLabel className="font-normal">
                  Basic - Somente Barba (30€)
                </FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="Classic" />
                </FormControl>
                <FormLabel className="font-normal">
                  Classic - Somente Cabelo (40€)
                </FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="Business" />
                </FormControl>
                <FormLabel className="font-normal">
                  Business - Cabelo e Barba (50€)
                </FormLabel>
              </FormItem>
            </RadioGroup>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
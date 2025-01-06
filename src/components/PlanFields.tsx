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
                  Basic (30€)
                </FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <RadioGroupItem value="Classic" />
                </FormControl>
                <FormLabel className="text-sm">
                  Classic (40€)
                </FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <RadioGroupItem value="Business" />
                </FormControl>
                <FormLabel className="text-sm">
                  Business (50€)
                </FormLabel>
              </FormItem>
            </RadioGroup>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
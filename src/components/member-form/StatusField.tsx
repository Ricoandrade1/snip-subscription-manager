import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./schema";

interface StatusFieldProps {
  form: UseFormReturn<FormValues>;
}

export function StatusField({ form }: StatusFieldProps) {
  return (
    <FormField
      control={form.control}
      name="status"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel className="text-barber-light">Status</FormLabel>
          <RadioGroup
            onValueChange={field.onChange}
            defaultValue={field.value}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="active" id="active" className="border-barber-gold text-barber-gold" />
              <FormLabel htmlFor="active" className="text-barber-light">
                Pago
              </FormLabel>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="inactive" id="inactive" className="border-barber-gold text-barber-gold" />
              <FormLabel htmlFor="inactive" className="text-barber-light">
                Cancelado
              </FormLabel>
            </div>
          </RadioGroup>
        </FormItem>
      )}
    />
  );
}
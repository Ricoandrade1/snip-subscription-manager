import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./schema";
import { MemberStatus } from "@/contexts/types";

interface StatusFieldProps {
  form: UseFormReturn<FormValues>;
  disabled?: boolean;
}

export function StatusField({ form, disabled = false }: StatusFieldProps) {
  return (
    <FormField
      control={form.control}
      name="status"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel className="text-barber-light">Status</FormLabel>
          <RadioGroup
            onValueChange={(value: MemberStatus) => {
              field.onChange(value);
            }}
            defaultValue={field.value}
            value={field.value}
            disabled={disabled}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-3">
              <RadioGroupItem 
                value="pago" 
                id="pago" 
                className="border-barber-gold text-barber-gold" 
                disabled={disabled}
              />
              <FormLabel htmlFor="pago" className="text-barber-light">
                Pago
              </FormLabel>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem 
                value="pendente" 
                id="pendente" 
                className="border-barber-gold text-barber-gold"
                disabled={disabled}
              />
              <FormLabel htmlFor="pendente" className="text-barber-light">
                Pendente
              </FormLabel>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem 
                value="cancelado" 
                id="cancelado" 
                className="border-barber-gold text-barber-gold"
                disabled={disabled}
              />
              <FormLabel htmlFor="cancelado" className="text-barber-light">
                Cancelado
              </FormLabel>
            </div>
          </RadioGroup>
        </FormItem>
      )}
    />
  );
}
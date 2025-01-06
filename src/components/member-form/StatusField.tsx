import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./schema";
import { MemberStatus } from "@/contexts/types";

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
            onValueChange={(value: MemberStatus) => {
              console.log('Alterando status para:', value);
              field.onChange(value);
              
              // Se o status for alterado para "pago" e não houver data de pagamento,
              // define a data atual como data de pagamento
              if (value === 'pago' && !form.getValues('payment_date')) {
                const today = new Date();
                form.setValue('payment_date', today, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true
                });
              }
            }}
            defaultValue={field.value}
            value={field.value}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="pago" id="pago" className="border-barber-gold text-barber-gold" />
              <FormLabel htmlFor="pago" className="text-barber-light">
                Pago
              </FormLabel>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="pendente" id="pendente" className="border-barber-gold text-barber-gold" />
              <FormLabel htmlFor="pendente" className="text-barber-light">
                Pendente
              </FormLabel>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="cancelado" id="cancelado" className="border-barber-gold text-barber-gold" />
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
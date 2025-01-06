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
              field.onChange(value);
              console.log('Status alterado para:', value);
            }}
            defaultValue={field.value}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="active" id="active" className="border-barber-gold text-barber-gold" />
              <FormLabel htmlFor="active" className="text-barber-light">
                Ativo
              </FormLabel>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="pending" id="pending" className="border-barber-gold text-barber-gold" />
              <FormLabel htmlFor="pending" className="text-barber-light">
                Pendente
              </FormLabel>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="inactive" id="inactive" className="border-barber-gold text-barber-gold" />
              <FormLabel htmlFor="inactive" className="text-barber-light">
                Inativo
              </FormLabel>
            </div>
          </RadioGroup>
        </FormItem>
      )}
    />
  );
}
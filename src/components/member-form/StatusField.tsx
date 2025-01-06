import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./schema";
import { MemberStatus } from "@/contexts/types";
import { toast } from "sonner";

interface StatusFieldProps {
  form: UseFormReturn<FormValues>;
}

export function StatusField({ form }: StatusFieldProps) {
  const handleStatusChange = (newStatus: MemberStatus) => {
    const currentStatus = form.getValues('status');
    
    // Define valid transitions
    const validTransitions: Record<MemberStatus, MemberStatus[]> = {
      'pago': ['pendente', 'cancelado'],
      'pendente': ['pago', 'cancelado'],
      'cancelado': ['pago', 'pendente']
    };

    // Check if transition is valid
    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      toast.error(`Não é possível mudar diretamente de ${currentStatus} para ${newStatus}`);
      return;
    }

    // If status changes to 'pago' and there's no payment date, set it to today
    if (newStatus === 'pago' && !form.getValues('payment_date')) {
      const today = new Date();
      form.setValue('payment_date', today, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true
      });
    }

    // Update the status
    form.setValue('status', newStatus, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    });
  };

  return (
    <FormField
      control={form.control}
      name="status"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel className="text-barber-light">Status</FormLabel>
          <RadioGroup
            onValueChange={(value: MemberStatus) => handleStatusChange(value)}
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
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { SubscriberFormData } from "./SubscriberForm";

interface PersonalInfoFieldsProps {
  form: UseFormReturn<SubscriberFormData>;
}

export function PersonalInfoFields({ form }: PersonalInfoFieldsProps) {
  // Use watch to get current form values
  const { name, phone } = form.watch();

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-barber-light">Nome</FormLabel>
            <FormControl>
              <Input 
                placeholder="Nome completo" 
                {...field} 
                value={name || ''}
                className="bg-barber-gray border-barber-gold/20 focus:border-barber-gold text-barber-light"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-barber-light">Telefone</FormLabel>
            <FormControl>
              <Input 
                placeholder="+351 912 345 678" 
                {...field} 
                value={phone || ''}
                className="bg-barber-gray border-barber-gold/20 focus:border-barber-gold text-barber-light"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
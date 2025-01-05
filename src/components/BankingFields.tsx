import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { SubscriberFormData } from "./SubscriberForm";
import { cn } from "@/lib/utils";

interface BankingFieldsProps {
  form: UseFormReturn<SubscriberFormData>;
}

export function BankingFields({ form }: BankingFieldsProps) {
  const watchedFields = {
    bank: form.watch("bank"),
    iban: form.watch("iban"),
  };

  return (
    <>
      <FormField
        control={form.control}
        name="bank"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn("text-sm", !watchedFields.bank && "text-destructive")}>Banco *</FormLabel>
            <FormControl>
              <Input 
                placeholder="Nome do Banco" 
                {...field} 
                className={cn(
                  "h-8",
                  !watchedFields.bank && "border-destructive"
                )} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="iban"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn("text-sm", !watchedFields.iban && "text-destructive")}>IBAN *</FormLabel>
            <FormControl>
              <Input 
                placeholder="PT50..." 
                {...field} 
                className={cn(
                  "h-8",
                  !watchedFields.iban && "border-destructive"
                )} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="debitDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm">Data de Débito</FormLabel>
            <FormControl>
              <Input type="date" {...field} className="h-8" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
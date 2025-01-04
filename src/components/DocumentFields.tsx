import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { SubscriberFormData } from "./SubscriberForm";

interface DocumentFieldsProps {
  form: UseFormReturn<SubscriberFormData>;
}

export function DocumentFields({ form }: DocumentFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="nif"
        render={({ field }) => (
          <FormItem>
            <FormLabel>NIF</FormLabel>
            <FormControl>
              <Input placeholder="Número de Identificação Fiscal" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="passport"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Passaporte</FormLabel>
            <FormControl>
              <Input placeholder="Número do Passaporte" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="citizenCard"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cartão Cidadão</FormLabel>
            <FormControl>
              <Input placeholder="Número do Cartão Cidadão" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="bi"
        render={({ field }) => (
          <FormItem>
            <FormLabel>BI</FormLabel>
            <FormControl>
              <Input placeholder="Número do BI" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
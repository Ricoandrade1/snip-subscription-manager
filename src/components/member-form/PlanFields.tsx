import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "./schema";

interface PlanFieldsProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export function PlanFields({ form }: PlanFieldsProps) {
  return (
    <FormField
      control={form.control}
      name="plan"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-barber-light">Plano</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="bg-barber-gray border-barber-gold/20 focus:border-barber-gold">
                <SelectValue placeholder="Selecione um plano" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-barber-gray border-barber-gold/20">
              <SelectItem value="Basic" className="text-barber-light hover:bg-barber-gold/10">Basic</SelectItem>
              <SelectItem value="Classic" className="text-barber-light hover:bg-barber-gold/10">Classic</SelectItem>
              <SelectItem value="Business" className="text-barber-light hover:bg-barber-gold/10">Business</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
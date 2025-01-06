import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./schema";

interface PersonalInfoFieldsProps {
  form: UseFormReturn<FormValues>;
}

export function PersonalInfoFields({ form }: PersonalInfoFieldsProps) {
  return (
    <>
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
                className="bg-barber-gray border-barber-gold/20 focus:border-barber-gold"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="nickname"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-barber-light">Apelido</FormLabel>
            <FormControl>
              <Input 
                placeholder="Apelido" 
                {...field}
                className="bg-barber-gray border-barber-gold/20 focus:border-barber-gold"
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
                className="bg-barber-gray border-barber-gold/20 focus:border-barber-gold"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="nif"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-barber-light">NIF</FormLabel>
            <FormControl>
              <Input 
                placeholder="Número de Identificação Fiscal" 
                {...field}
                className="bg-barber-gray border-barber-gold/20 focus:border-barber-gold"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
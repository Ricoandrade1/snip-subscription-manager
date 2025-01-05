import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { SubscriberFormData } from "./SubscriberForm";
import { cn } from "@/lib/utils";

interface PersonalInfoFieldsProps {
  form: UseFormReturn<SubscriberFormData>;
}

export function PersonalInfoFields({ form }: PersonalInfoFieldsProps) {
  const watchedFields = {
    name: form.watch("name"),
    phone: form.watch("phone"),
  };

  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn("text-sm", !watchedFields.name && "text-destructive")}>Nome *</FormLabel>
            <FormControl>
              <Input 
                placeholder="Nome completo" 
                {...field} 
                className={cn(
                  "h-8",
                  !watchedFields.name && "border-destructive"
                )} 
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
            <FormLabel className="text-sm">Apelido</FormLabel>
            <FormControl>
              <Input placeholder="Apelido" {...field} className="h-8" />
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
            <FormLabel className={cn("text-sm", !watchedFields.phone && "text-destructive")}>Telefone *</FormLabel>
            <FormControl>
              <Input 
                placeholder="+351 912 345 678" 
                {...field} 
                className={cn(
                  "h-8",
                  !watchedFields.phone && "border-destructive"
                )} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="birthDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm">Data de Nascimento</FormLabel>
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
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { BarberFormData } from "./BarberForm";

interface PersonalInfoFieldsProps {
  form: UseFormReturn<BarberFormData>;
}

export function PersonalInfoFields({ form }: PersonalInfoFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm">Nome</FormLabel>
            <FormControl>
              <Input placeholder="Nome completo" {...field} className="h-8" />
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
            <FormLabel className="text-sm">Telefone</FormLabel>
            <FormControl>
              <Input placeholder="+351 912 345 678" {...field} className="h-8" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm">Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="email@exemplo.com" {...field} className="h-8" />
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
            <FormLabel className="text-sm">NIF</FormLabel>
            <FormControl>
              <Input placeholder="Número de Identificação Fiscal" {...field} className="h-8" />
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

      <FormField
        control={form.control}
        name="startDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm">Data de Início</FormLabel>
            <FormControl>
              <Input type="date" {...field} className="h-8" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
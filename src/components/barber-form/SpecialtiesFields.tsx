import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";

const specialties = [
  { id: "corte-masculino", label: "Corte Masculino" },
  { id: "barba", label: "Barba" },
  { id: "corte-feminino", label: "Corte Feminino" },
  { id: "coloracao", label: "Coloração" },
  { id: "penteados", label: "Penteados" },
  { id: "tratamentos", label: "Tratamentos Capilares" },
  { id: "admin", label: "Administrador" },
  { id: "vendedor", label: "Vendedor" },
];

interface SpecialtiesFieldsProps {
  form: UseFormReturn<any>;
}

export function SpecialtiesFields({ form }: SpecialtiesFieldsProps) {
  return (
    <FormField
      control={form.control}
      name="specialties"
      render={() => (
        <FormItem>
          <FormLabel>Especialidades e Funções</FormLabel>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
            {specialties.map((specialty) => (
              <FormField
                key={specialty.id}
                control={form.control}
                name="specialties"
                render={({ field }) => {
                  return (
                    <FormItem
                      key={specialty.id}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <Checkbox
                        checked={field.value?.includes(specialty.id)}
                        onCheckedChange={(checked) => {
                          const updatedSpecialties = checked
                            ? [...(field.value || []), specialty.id]
                            : field.value?.filter((value: string) => value !== specialty.id) || [];
                          field.onChange(updatedSpecialties);
                        }}
                      />
                      <FormLabel className="font-normal cursor-pointer">
                        {specialty.label}
                      </FormLabel>
                    </FormItem>
                  );
                }}
              />
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
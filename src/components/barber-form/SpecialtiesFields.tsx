import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { Flag } from "lucide-react";
import { cn } from "@/lib/utils";

const specialties = [
  { id: "corte-masculino", label: "Corte Masculino", color: "text-[#0EA5E9]" },
  { id: "barba", label: "Barba", color: "text-[#F97316]" },
  { id: "corte-feminino", label: "Corte Feminino", color: "text-[#D946EF]" },
  { id: "coloracao", label: "Coloração", color: "text-[#8B5CF6]" },
  { id: "penteados", label: "Penteados", color: "text-[#F97316]" },
  { id: "tratamentos", label: "Tratamentos Capilares", color: "text-[#0EA5E9]" },
  { id: "admin", label: "Administrador", color: "text-barber-gold" },
  { id: "vendedor", label: "Vendedor", color: "text-[#8B5CF6]" },
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
                  const isChecked = field.value?.includes(specialty.id);
                  return (
                    <FormItem
                      key={specialty.id}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={(checked) => {
                          const updatedSpecialties = checked
                            ? [...(field.value || []), specialty.id]
                            : field.value?.filter((value: string) => value !== specialty.id) || [];
                          field.onChange(updatedSpecialties);
                        }}
                        className={cn(
                          "border-2 transition-colors",
                          isChecked && "border-transparent bg-transparent",
                          specialty.color
                        )}
                        icon={
                          <Flag 
                            className={cn(
                              "h-4 w-4 transition-transform",
                              isChecked && "scale-110"
                            )}
                          />
                        }
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
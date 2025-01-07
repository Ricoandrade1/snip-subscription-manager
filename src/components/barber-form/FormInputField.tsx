import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";

interface FormInputFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  className?: string;
}

export function FormInputField({
  form,
  name,
  label,
  placeholder,
  type = "text",
  className,
}: FormInputFieldProps) {
  const { watch } = form;
  const currentValues = watch();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className="text-sm">{label}</FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              {...field}
              className="h-9"
              value={currentValues[name] || ""}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
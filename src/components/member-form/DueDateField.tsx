import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "./schema";

interface DueDateFieldProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export function DueDateField({ form }: DueDateFieldProps) {
  return (
    <FormField
      control={form.control}
      name="due_date"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="text-barber-light">Data de Vencimento</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal bg-barber-gray border-barber-gold/20 hover:bg-barber-gold/10",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(field.value, "PPP", { locale: ptBR })
                  ) : (
                    <span>Selecione uma data</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) =>
                  date < new Date(new Date().setHours(0, 0, 0, 0))
                }
                initialFocus
                className="rounded-md border-barber-gold/20 bg-barber-gray text-barber-light"
                classNames={{
                  months: "space-y-4",
                  month: "space-y-4",
                  caption: "flex justify-center pt-1 relative items-center text-barber-light",
                  caption_label: "text-sm font-medium",
                  nav: "space-x-1 flex items-center",
                  nav_button: cn(
                    "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-barber-light"
                  ),
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex",
                  head_cell: "text-barber-light/60 rounded-md w-9 font-normal text-[0.8rem]",
                  row: "flex w-full mt-2",
                  cell: cn(
                    "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-barber-gold/10",
                    "first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
                  ),
                  day: cn(
                    "h-9 w-9 p-0 font-normal",
                    "hover:bg-barber-gold/20 hover:text-barber-light focus:bg-barber-gold/20 focus:text-barber-light"
                  ),
                  day_selected:
                    "bg-barber-gold text-barber-black hover:bg-barber-gold hover:text-barber-black focus:bg-barber-gold focus:text-barber-black",
                  day_today: "bg-barber-gold/5 text-barber-light",
                  day_outside: "text-barber-light/40 opacity-50",
                  day_disabled: "text-barber-light/20",
                  day_hidden: "invisible",
                }}
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
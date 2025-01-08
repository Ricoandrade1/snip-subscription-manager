import { Label } from "@/components/ui/label";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRange } from "react-day-picker";

interface SalesFiltersProps {
  dateRange: Required<DateRange>;
  onDateChange: (date: DateRange | undefined) => void;
  period: string;
  onPeriodChange: (value: string) => void;
}

export function SalesFilters({ dateRange, onDateChange, period, onPeriodChange }: SalesFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-end">
      <div className="space-y-2 flex-1">
        <Label>Período de Análise</Label>
        <DatePickerWithRange date={dateRange} onDateChange={onDateChange} />
      </div>
      <div className="space-y-2">
        <Label>Agrupamento</Label>
        <Select value={period} onValueChange={onPeriodChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione o período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Diário</SelectItem>
            <SelectItem value="weekly">Semanal</SelectItem>
            <SelectItem value="monthly">Mensal</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
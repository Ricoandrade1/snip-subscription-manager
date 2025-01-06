import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FilterState } from "./types";

interface SubscribersFilterProps {
  filters: FilterState;
  onFilterChange: (field: keyof FilterState, value: string) => void;
}

export function SubscribersFilter({ filters, onFilterChange }: SubscribersFilterProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-barber-gray rounded-lg">
      <div className="space-y-2">
        <Label htmlFor="name-filter" className="text-barber-light">Nome</Label>
        <Input
          id="name-filter"
          placeholder="Filtrar por nome..."
          value={filters.name}
          onChange={(e) => onFilterChange('name', e.target.value)}
          className="bg-black/40 border-0 text-barber-light placeholder:text-barber-light/50"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone-filter" className="text-barber-light">Telefone</Label>
        <Input
          id="phone-filter"
          placeholder="Filtrar por telefone..."
          value={filters.phone}
          onChange={(e) => onFilterChange('phone', e.target.value)}
          className="bg-black/40 border-0 text-barber-light placeholder:text-barber-light/50"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="nif-filter" className="text-barber-light">NIF</Label>
        <Input
          id="nif-filter"
          placeholder="Filtrar por NIF..."
          value={filters.nif}
          onChange={(e) => onFilterChange('nif', e.target.value)}
          className="bg-black/40 border-0 text-barber-light placeholder:text-barber-light/50"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="status-filter" className="text-barber-light">Status</Label>
        <Select
          value={filters.status}
          onValueChange={(value) => onFilterChange('status', value)}
        >
          <SelectTrigger className="bg-black/40 border-0 text-barber-light">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Pago</SelectItem>
            <SelectItem value="overdue">Atrasado</SelectItem>
            <SelectItem value="cancelled">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
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
        <Label htmlFor="sort-by" className="text-barber-light">Ordenar por</Label>
        <Select
          value={filters.sortBy}
          onValueChange={(value) => onFilterChange('sortBy', value)}
        >
          <SelectTrigger className="bg-black/40 border-0 text-barber-light">
            <SelectValue placeholder="Selecione..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Nome</SelectItem>
            <SelectItem value="payment_date">Data de Pagamento</SelectItem>
            <SelectItem value="plan">Plano</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="sort-order" className="text-barber-light">Ordem</Label>
        <Select
          value={filters.sortOrder}
          onValueChange={(value) => onFilterChange('sortOrder', value)}
        >
          <SelectTrigger className="bg-black/40 border-0 text-barber-light">
            <SelectValue placeholder="Selecione..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Crescente</SelectItem>
            <SelectItem value="desc">Decrescente</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
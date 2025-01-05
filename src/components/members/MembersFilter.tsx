import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FilterState {
  name: string;
  phone: string;
  nif: string;
  birthDate: string;
  iban: string;
}

interface MembersFilterProps {
  filters: FilterState;
  onFilterChange: (field: keyof FilterState, value: string) => void;
}

export function MembersFilter({ filters, onFilterChange }: MembersFilterProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4 bg-muted rounded-lg">
      <div className="space-y-2">
        <Label htmlFor="name-filter">Nome</Label>
        <Input
          id="name-filter"
          placeholder="Filtrar por nome..."
          value={filters.name}
          onChange={(e) => onFilterChange('name', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone-filter">Telefone</Label>
        <Input
          id="phone-filter"
          placeholder="Filtrar por telefone..."
          value={filters.phone}
          onChange={(e) => onFilterChange('phone', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="nif-filter">NIF</Label>
        <Input
          id="nif-filter"
          placeholder="Filtrar por NIF..."
          value={filters.nif}
          onChange={(e) => onFilterChange('nif', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="birth-date-filter">Data de Nascimento</Label>
        <Input
          id="birth-date-filter"
          type="date"
          value={filters.birthDate}
          onChange={(e) => onFilterChange('birthDate', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="iban-filter">IBAN</Label>
        <Input
          id="iban-filter"
          placeholder="Filtrar por IBAN..."
          value={filters.iban}
          onChange={(e) => onFilterChange('iban', e.target.value)}
        />
      </div>
    </div>
  );
}
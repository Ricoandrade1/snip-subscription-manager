import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FilterState } from "./types";
import { Search, Phone, UserRound, FileText, Bookmark } from "lucide-react";

interface SubscribersFilterProps {
  filters: FilterState;
  onFilterChange: (field: keyof FilterState, value: string) => void;
}

export function SubscribersFilter({ filters, onFilterChange }: SubscribersFilterProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-6 bg-barber-gray rounded-lg border border-barber-gold/10">
      <div className="space-y-2">
        <Label htmlFor="name-filter" className="text-barber-light flex items-center gap-2">
          <UserRound className="w-4 h-4" /> Nome
        </Label>
        <div className="relative">
          <Input
            id="name-filter"
            placeholder="Filtrar por nome..."
            value={filters.name}
            onChange={(e) => onFilterChange('name', e.target.value)}
            className="bg-black/40 border-0 text-barber-light placeholder:text-barber-light/50 pl-9"
          />
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-barber-light/50" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone-filter" className="text-barber-light flex items-center gap-2">
          <Phone className="w-4 h-4" /> Telefone
        </Label>
        <div className="relative">
          <Input
            id="phone-filter"
            placeholder="Filtrar por telefone..."
            value={filters.phone}
            onChange={(e) => onFilterChange('phone', e.target.value)}
            className="bg-black/40 border-0 text-barber-light placeholder:text-barber-light/50 pl-9"
          />
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-barber-light/50" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="nif-filter" className="text-barber-light flex items-center gap-2">
          <FileText className="w-4 h-4" /> NIF
        </Label>
        <div className="relative">
          <Input
            id="nif-filter"
            placeholder="Filtrar por NIF..."
            value={filters.nif}
            onChange={(e) => onFilterChange('nif', e.target.value)}
            className="bg-black/40 border-0 text-barber-light placeholder:text-barber-light/50 pl-9"
          />
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-barber-light/50" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status-filter" className="text-barber-light flex items-center gap-2">
          <Search className="w-4 h-4" /> Status
        </Label>
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

      <div className="space-y-2">
        <Label htmlFor="plan-filter" className="text-barber-light flex items-center gap-2">
          <Bookmark className="w-4 h-4" /> Plano
        </Label>
        <Select
          value={filters.plan}
          onValueChange={(value) => onFilterChange('plan', value)}
        >
          <SelectTrigger className="bg-black/40 border-0 text-barber-light">
            <SelectValue placeholder="Filtrar por plano" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="Basic">Basic</SelectItem>
            <SelectItem value="Classic">Classic</SelectItem>
            <SelectItem value="Business">Business</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
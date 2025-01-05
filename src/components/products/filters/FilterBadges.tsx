import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface FilterBadgesProps {
  activeFilters: string[];
  onClearFilter: (filter: string) => void;
  onClearAllFilters: () => void;
}

export function FilterBadges({ activeFilters, onClearFilter, onClearAllFilters }: FilterBadgesProps) {
  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-sm text-muted-foreground">Filtros ativos:</span>
      {activeFilters.map((filter) => (
        <Badge
          key={filter}
          variant="secondary"
          className="flex items-center gap-1"
        >
          {filter}
          <X
            className="h-3 w-3 cursor-pointer"
            onClick={() => onClearFilter(filter)}
          />
        </Badge>
      ))}
      <button
        onClick={onClearAllFilters}
        className="text-sm text-muted-foreground hover:text-primary"
      >
        Limpar todos
      </button>
    </div>
  );
}
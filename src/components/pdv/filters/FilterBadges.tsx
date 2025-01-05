import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { ProductListFilters } from "../types";

interface FilterBadgesProps {
  filters: ProductListFilters;
  categories: Array<{ id: string; name: string }>;
  brands: Array<{ id: string; name: string }>;
  onClearFilter: (filter: keyof ProductListFilters) => void;
  onClearAll: () => void;
}

export function FilterBadges({
  filters,
  categories,
  brands,
  onClearFilter,
  onClearAll,
}: FilterBadgesProps) {
  const activeFilters: string[] = [];

  if (filters.name) {
    activeFilters.push(`Nome: ${filters.name}`);
  }
  if (filters.category && filters.category !== "all") {
    const category = categories.find((c) => c.id === filters.category);
    if (category) {
      activeFilters.push(`Categoria: ${category.name}`);
    }
  }
  if (filters.brand && filters.brand !== "all") {
    const brand = brands.find((b) => b.id === filters.brand);
    if (brand) {
      activeFilters.push(`Marca: ${brand.name}`);
    }
  }
  if (filters.minPrice) {
    activeFilters.push(`Preço min: €${filters.minPrice}`);
  }
  if (filters.maxPrice) {
    activeFilters.push(`Preço max: €${filters.maxPrice}`);
  }
  if (filters.inStock) {
    activeFilters.push("Em estoque");
  }

  if (activeFilters.length === 0) {
    return null;
  }

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
            onClick={() => {
              const field = filter.split(":")[0].toLowerCase();
              switch (field) {
                case "nome":
                  onClearFilter("name");
                  break;
                case "categoria":
                  onClearFilter("category");
                  break;
                case "marca":
                  onClearFilter("brand");
                  break;
                case "preço min":
                  onClearFilter("minPrice");
                  break;
                case "preço max":
                  onClearFilter("maxPrice");
                  break;
                case "em estoque":
                  onClearFilter("inStock");
                  break;
              }
            }}
          />
        </Badge>
      ))}
      <button
        onClick={onClearAll}
        className="text-sm text-muted-foreground hover:text-primary"
      >
        Limpar todos
      </button>
    </div>
  );
}
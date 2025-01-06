import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Brand {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

interface FilterInputsProps {
  filters: {
    name: string;
    category: string;
    brand: string;
    minPrice: string;
    maxPrice: string;
  };
  categories: Array<{ id: string; name: string }>;
  brands: Array<{ id: string; name: string }>;
  onFilterChange: (field: string, value: string) => void;
}

export function FilterInputs({ filters, categories, brands, onFilterChange }: FilterInputsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          placeholder="Buscar por nome..."
          value={filters.name}
          onChange={(e) => onFilterChange("name", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Categoria</Label>
        <Select
          value={filters.category}
          onValueChange={(value) => onFilterChange("category", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecionar categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="brand">Marca</Label>
        <Select
          value={filters.brand}
          onValueChange={(value) => onFilterChange("brand", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecionar marca" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {brands.map((brand) => (
              <SelectItem key={brand.id} value={brand.id}>
                {brand.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="minPrice">Preço Mínimo</Label>
        <Input
          id="minPrice"
          type="number"
          placeholder="€"
          value={filters.minPrice}
          onChange={(e) => onFilterChange("minPrice", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="maxPrice">Preço Máximo</Label>
        <Input
          id="maxPrice"
          type="number"
          placeholder="€"
          value={filters.maxPrice}
          onChange={(e) => onFilterChange("maxPrice", e.target.value)}
        />
      </div>
    </>
  );
}
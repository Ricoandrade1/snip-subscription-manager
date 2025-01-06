import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
        <Label htmlFor="name">Nome do produto</Label>
        <Input
          id="name"
          placeholder="Buscar produto..."
          value={filters.name}
          onChange={(e) => onFilterChange("name", e.target.value)}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Categoria</Label>
        <Select
          value={filters.category}
          onValueChange={(value) => onFilterChange("category", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Todas as categorias" />
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
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Todas as marcas" />
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
        <Label>Faixa de preço</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Min €"
            value={filters.minPrice}
            onChange={(e) => onFilterChange("minPrice", e.target.value)}
            className="w-full"
          />
          <Input
            type="number"
            placeholder="Max €"
            value={filters.maxPrice}
            onChange={(e) => onFilterChange("maxPrice", e.target.value)}
            className="w-full"
          />
        </div>
      </div>
    </>
  );
}
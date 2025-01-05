import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface FilterState {
  name: string;
  category: string;
  brand: string;
  minPrice: string;
  maxPrice: string;
  inStock: boolean;
}

interface ProductFilterProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export function ProductFilter({ filters, onFilterChange }: ProductFilterProps) {
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [brands, setBrands] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    fetchCategoriesAndBrands();
  }, []);

  const fetchCategoriesAndBrands = async () => {
    const [categoriesResponse, brandsResponse] = await Promise.all([
      supabase.from("categories").select("*"),
      supabase.from("brands").select("*"),
    ]);

    if (categoriesResponse.data) {
      setCategories(categoriesResponse.data);
    }
    if (brandsResponse.data) {
      setBrands(brandsResponse.data);
    }
  };

  const handleChange = (field: keyof FilterState, value: string | boolean) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          placeholder="Buscar por nome..."
          value={filters.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Categoria</Label>
        <Select
          value={filters.category}
          onValueChange={(value) => handleChange("category", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecionar categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas</SelectItem>
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
          onValueChange={(value) => handleChange("brand", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecionar marca" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas</SelectItem>
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
          onChange={(e) => handleChange("minPrice", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="maxPrice">Preço Máximo</Label>
        <Input
          id="maxPrice"
          type="number"
          placeholder="€"
          value={filters.maxPrice}
          onChange={(e) => handleChange("maxPrice", e.target.value)}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="inStock"
          checked={filters.inStock}
          onCheckedChange={(checked) => handleChange("inStock", checked)}
        />
        <Label htmlFor="inStock">Apenas em estoque</Label>
      </div>
    </div>
  );
}